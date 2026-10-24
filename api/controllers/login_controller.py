from flask import request, jsonify
from database import supabase
import re
import unicodedata
import uuid

CATEGORIAS_SALAO = ["salaoDeCabeleireiro", "barbearia", "manicure/Pedicure", "depilacao", "estetica"]

#Nova função para gerar slug a partir do nome do salão, removendo acentos e caracteres especiais
def gerar_slug(nome):
    #Remove os acentos e caracteres especiais do nome do salão
    sem_acento = unicodedata.normalize('NFKD', nome).encode('ascii', 'ignore').decode('ascii')

    #Minusculas e sequencias de caracteres sem ser letras ou numeros são substituídas por hífen
    slug = re.sub(r'[^a-z0-9]+', '-', sem_acento.lower()).strip('-')

    return slug or 'salao' #garante que o slug não seja vazio, caso o nome do salão seja apenas caracteres especiais


def usuario_do_token():
    # O cadastro só é aceito para quem acabou de criar a conta no Supabase Auth.
    # O id e o e-mail vêm sempre do token, nunca do corpo da requisição.
    token = request.headers.get("Authorization", "").replace("Bearer ", "")

    if not token:
        return None, (jsonify({"sucesso": False, "erro": "Token ausente"}), 401)

    try:
        usuario = supabase.auth.get_user(token).user
    except Exception:
        usuario = None

    if not usuario:
        return None, (jsonify({"sucesso": False, "erro": "Token não autorizado"}), 401)

    return usuario, None


def conta_ja_cadastrada(id_usuario):
    # Um mesmo usuário do Auth não pode ser cliente e profissional ao mesmo tempo.
    como_profissional = supabase.table("profissionais").select("id_profissional").eq("id_profissional", id_usuario).execute()
    como_cliente = supabase.table("clientes").select("id_cliente").eq("id_cliente", id_usuario).execute()

    return bool(como_profissional.data or como_cliente.data)


def texto(valor):
    return valor.strip() if isinstance(valor, str) else ""


def cadastroUserCliente():
    # Depois do Supabase Auth criar o usuario, o front envia o nome para manter
    # o perfil do cliente tambem na tabela "clientes".
    usuario, erro = usuario_do_token()
    if erro:
        return erro

    dados = request.get_json(silent=True) or {}
    nome_cliente = texto(dados.get("nome_cliente"))

    if not nome_cliente:
        return jsonify({"sucesso": False, "erro": "Campos ausentes: nome_cliente."}), 400

    if len(nome_cliente) > 120:
        return jsonify({"sucesso": False, "erro": "O nome é grande demais."}), 400

    try:
        if conta_ja_cadastrada(usuario.id):
            return jsonify({"sucesso": False, "erro": "A Conta já existe"}), 409

        resposta = supabase.table("clientes").insert({
            "id_cliente": usuario.id,
            "nome_cliente": nome_cliente,
            "email_cliente": usuario.email,
        }).execute()

        if not resposta.data:
            return jsonify({"sucesso": False, "erro": "Erro ao cadastrar o cliente"}), 500

        return jsonify({'sucesso': True, 'resultado': 'Cliente cadastrado com sucesso!'})

    except Exception as erro_cadastro:
        print("Erro ao cadastrar cliente:", erro_cadastro)
        return jsonify({"sucesso": False, "erro": "Erro ao cadastrar o cliente"}), 500


def cadastroUserGerente():
    # Depois do Supabase Auth criar o usuario, o front envia os dados do gerente e do salão
    # de uma vez só. Quem se cadastra aqui sempre vira administrador (nível 1) e dono do salão;
    # nível, salão, cargo e status são definidos no servidor, nunca pelo corpo da requisição.
    usuario, erro = usuario_do_token()
    if erro:
        return erro

    dados = request.get_json(silent=True) or {}

    campos_necessarios = ["nome_profissional", "telefone_profissional", "nome_salao", "categoria", "endereco"]
    campos_faltando = [campo for campo in campos_necessarios if not texto(dados.get(campo))]

    if campos_faltando:
        return jsonify({"sucesso": False, "erro": f"Campos ausentes: {' - '.join(campos_faltando)}."}), 400

    nome_profissional = texto(dados["nome_profissional"])
    telefone_profissional = texto(dados["telefone_profissional"])
    nome_salao = texto(dados["nome_salao"])
    categoria = texto(dados["categoria"])
    endereco = texto(dados["endereco"])

    if categoria not in CATEGORIAS_SALAO:
        return jsonify({"sucesso": False, "erro": "Categoria do salão inválida."}), 400

    if max(len(nome_profissional), len(nome_salao), len(endereco)) > 200 or len(telefone_profissional) > 30:
        return jsonify({"sucesso": False, "erro": "Algum campo é grande demais."}), 400

    id_salao = None
    gerente_criado = False

    try:
        if conta_ja_cadastrada(usuario.id):
            return jsonify({"sucesso": False, "erro": "A Conta já existe"}), 409

        # O salão é criado antes do gerente, porque o profissional precisa de um salao_associado.
        resposta_salao = supabase.table("saloes").insert({
            "nome_salao": nome_salao,
            "categoria_salao": categoria,
            "endereco_salao": endereco,
            "slug": f"{gerar_slug(nome_salao)}-{uuid.uuid4().hex[:4]}",  # sufixo único para evitar duplicatas
        }).execute()

        if not resposta_salao.data:
            return jsonify({"sucesso": False, "erro": "Erro em cadastrar o salão"}), 500

        id_salao = resposta_salao.data[0]["id_salao"]

        resposta_gerente = supabase.table("profissionais").insert({
            "id_profissional": usuario.id,
            "nome_profissional": nome_profissional,
            "telefone_profissional": telefone_profissional,
            "email_profissional": usuario.email,
            "salao_associado": id_salao,
            "cargo": "Gerente",
            "nivel_acesso": 1,
            "status": True,
            "removido": False,
        }).execute()

        if not resposta_gerente.data:
            raise RuntimeError("Falha ao inserir o gerente")

        gerente_criado = True

        # O dono só pode ser gravado depois que o profissional existe (chave estrangeira).
        # A edição de profissionais usa esse campo para proteger o nível de acesso do dono.
        resposta_dono = supabase.table("saloes").update({"id_dono": usuario.id}).eq("id_salao", id_salao).execute()

        if not resposta_dono.data:
            raise RuntimeError("Falha ao gravar o dono do salão")

        return jsonify({'sucesso': True, 'resultado': 'Profissional cadastrado com sucesso!'})

    except Exception as erro_cadastro:
        print("Erro ao cadastrar gerente:", erro_cadastro)
        return desfazer_cadastro_gerente(id_salao, usuario.id if gerente_criado else None)


def desfazer_cadastro_gerente(id_salao, id_gerente):
    # Apaga o que já foi criado, na ordem das chaves estrangeiras (gerente antes do salão).
    # Se a limpeza falhar, o usuário recebe um aviso para tentar de novo mais tarde.
    try:
        if id_gerente is not None:
            supabase.table("profissionais").delete().eq("id_profissional", id_gerente).execute()

        if id_salao is not None:
            supabase.table("saloes").delete().eq("id_salao", id_salao).execute()

    except Exception as erro_limpeza:
        print("Erro ao desfazer o cadastro do gerente:", erro_limpeza)
        return jsonify({"sucesso": False, "erro": "Os servidores estão instáveis no momento, tente novamente mais tarde"}), 500

    return jsonify({"sucesso": False, "erro": "Erro ao cadastrar o gerente"}), 500
