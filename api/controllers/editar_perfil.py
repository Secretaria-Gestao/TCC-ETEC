import time
from flask import request, jsonify
from supabase_auth.errors import AuthApiError

from database import supabase_admin, novo_cliente_anonimo
from controllers.autenticacao import autenticar

def editar_email():
    info = request.get_json(silent=True) or {}
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    # autenticar() devolve o id do usuário dono do token, ou None se inválido.
    id_usuario = autenticar(token)
    if not id_usuario:
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

    email_novo = str(info.get("novoEmail") or "").strip().lower()
    if not email_novo:
        return jsonify({"sucesso": False, "erro": "Informe o novo email"}), 400

    tabela_certa = ""

    try:
        resposta_busca = supabase_admin.table("profissionais").select("email_profissional").eq("id_profissional", id_usuario).execute()

        if not resposta_busca.data:
            resposta_busca = supabase_admin.table("clientes").select("email_cliente").eq("id_cliente", id_usuario).execute()

            if not resposta_busca.data:
                return jsonify({"sucesso": False, "erro": "Falha ao encontrar o usuário"}), 404
            else:
                tabela_certa = "clientes"
                tipo_email = "email_cliente"

        else:
            tabela_certa = "profissionais"
            tipo_email = "email_profissional"

        email_antigo = resposta_busca.data[0][tipo_email]

        supabase_admin.auth.admin.update_user_by_id(
            uid=id_usuario,
            attributes={
                "email": email_novo,
                "email_confirm": True
            }
        )

        try:
            resposta_tabela = supabase_admin.table(tabela_certa).update({ tipo_email: email_novo}).eq(tipo_email, email_antigo).execute()
            atualizou = bool(resposta_tabela.data)
        except Exception as erro:
            print("Erro ao atualizar o email na tabela:", erro)
            atualizou = False

        if not atualizou:
            # Desfaz a troca no Auth para o email de login e o do perfil não ficarem diferentes.
            supabase_admin.auth.admin.update_user_by_id(
                uid=id_usuario,
                attributes={
                    "email": email_antigo,
                    "email_confirm": True
                }
            )
            return jsonify({"sucesso": False, "erro": "Falha ao atualizar o Email."}), 500

        return jsonify({"sucesso": True})

    except AuthApiError as erro:
        print("Erro do Auth ao editar email:", erro.status, erro.code, erro.message)

        if erro.code == "email_exists":
            return jsonify({"sucesso": False, "erro": "Este email já está em uso"}), 409

        return jsonify({"sucesso": False, "erro": "Falha ao atualizar o Email."}), 400

    except Exception as erro:
        print("Erro ao editar o email:", erro)
        return jsonify({"sucesso": False, "erro": "Falha ao atualizar o Email."}), 500

def editar_nome():
    info = request.get_json(silent=True) or {}
    token = request.headers.get("Authorization", "").replace("Bearer ", "")

    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    # autenticar() devolve o id do usuário dono do token, ou None se inválido.
    id_usuario = autenticar(token)
    if not id_usuario:
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

    novo_nome = str(info.get("novoNome") or "").strip()
    if not novo_nome:
        return jsonify({"sucesso": False, "erro": "O nome não pode ficar vazio"}), 400

    try:
        resposta_tabela = supabase_admin.table("profissionais").update({"nome_profissional": novo_nome}).eq("id_profissional", id_usuario).execute()

        if not resposta_tabela.data:
            resposta_tabela = supabase_admin.table("clientes").update({"nome_cliente": novo_nome}).eq("id_cliente", id_usuario).execute()

            if not resposta_tabela.data:
                return jsonify({"sucesso": False, "erro": "Erro ao encontrar o usuário"}), 404

        return jsonify({"sucesso": True})

    except Exception as erro:
        print("Erro ao editar o nome:", erro)
        return jsonify({"sucesso": False, "erro": "Tente novamente"}), 500

def editar_telefone():
    info = request.get_json(silent=True) or {}
    token = request.headers.get("Authorization", "").replace("Bearer ", "")

    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    # autenticar() devolve o id do usuário dono do token, ou None se inválido.
    id_usuario = autenticar(token)
    if not id_usuario:
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

    novo_telefone = str(info.get("novoTelefone") or "").strip()
    digitos = "".join(letra for letra in novo_telefone if letra.isdigit())

    if len(digitos) not in (10, 11):
        return jsonify({"sucesso": False, "erro": "Informe um telefone com DDD"}), 400

    try:
        resposta_tabela = supabase_admin.table("profissionais").update({"telefone_profissional": novo_telefone}).eq("id_profissional", id_usuario).execute()

        if not resposta_tabela.data:
            return jsonify({"sucesso": False, "erro": "Erro ao encontrar o usuário"}), 404

        return jsonify({"sucesso": True})

    except Exception as erro:
        print("Erro ao editar o telefone:", erro)
        return jsonify({"sucesso": False, "erro": "Tente novamente"}), 500

def editar_foto():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")

    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    # autenticar() devolve o id do usuário dono do token, ou None se inválido.
    id_usuario = autenticar(token)
    if not id_usuario:
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

    arquivo = request.files.get("foto")

    if not arquivo:
        return jsonify({"sucesso": False, "erro": "Arquivo não enviado"}), 400

    foto = arquivo.read()
    nome_arquivo = f"{int(time.time())}.jpg"
    caminho = f"{id_usuario}/{nome_arquivo}"
    bucket = supabase_admin.storage.from_("fotos-perfil")

    try:
        bucket.upload(caminho, foto, {"content-type": arquivo.mimetype })
        
        foto_url = bucket.get_public_url(caminho)
        
        if not foto_url:
            print(foto_url)
            return jsonify({"sucesso": False, "erro": "falha no servidor, tente novamente mais tarde"}),500
    
        resposta_tabela = supabase_admin.table("profissionais").update({"foto_url": foto_url}).eq("id_profissional", id_usuario).execute()
        
        if not resposta_tabela.data:
            return jsonify({"sucesso": False, "erro": "Erro ao encontrar o usuário, tente novamente mais tarde"}),500

        try:
            antigas = [f"{id_usuario}/{item['name']}" for item in bucket.list(id_usuario) if item["name"] != nome_arquivo]

            if antigas:
                bucket.remove(antigas)

        except Exception as erro:
            print("Erro ao apagar fotos antigas")

        return jsonify({"sucesso": True})

    except Exception as erro:
        print("Erro ao editar a foto:", erro)
        return jsonify({"sucesso": False, "erro": "Tente novamente"}), 500

def editar_salao():
    info = request.get_json(silent=True) or {}
    token = request.headers.get("Authorization", "").replace("Bearer ", "")

    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    # autenticar() devolve o id do usuário dono do token, ou None se inválido.
    id_usuario = autenticar(token)
    if not id_usuario:
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

    nome_salao = str(info.get("nomeSalao") or "").strip()
    endereco_salao = str(info.get("enderecoSalao") or "").strip()

    if not nome_salao:
        return jsonify({"sucesso": False, "erro": "O nome do salão não pode ficar vazio"}), 400

    try:
        # O id do salão nunca vem do front: é descoberto pelo perfil de quem está logado.
        resposta_admin = supabase_admin.table("profissionais").select("salao_associado, nivel_acesso").eq("id_profissional", id_usuario).eq("removido", False).execute()

        if not resposta_admin.data:
            return jsonify({"sucesso": False, "erro": "Usuário não encontrado"}), 404

        admin = resposta_admin.data[0]

        if int(admin["nivel_acesso"]) != 1:
            return jsonify({"sucesso": False, "erro": "Somente administradores podem editar o salão"}), 403

        resposta_salao = supabase_admin.table("saloes").update({
            "nome_salao": nome_salao,
            "endereco_salao": endereco_salao or None
        }).eq("id_salao", admin["salao_associado"]).eq("removido", False).execute()

        if not resposta_salao.data:
            return jsonify({"sucesso": False, "erro": "Salão não encontrado"}), 404

        return jsonify({"sucesso": True})

    except Exception as erro:
        print("Erro ao editar salão:", erro)
        return jsonify({"sucesso": False, "erro": "Tente novamente"}), 500

def excluir_salao():
    # A exclusão é lógica: o histórico (agendamentos, serviços) continua no banco, mas o salão e
    # todos os profissionais dele deixam de aparecer, e os logins são bloqueados.
    info = request.get_json(silent=True) or {}
    token = request.headers.get("Authorization", "").replace("Bearer ", "")

    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    # autenticar() devolve o id do usuário dono do token, ou None se inválido.
    id_usuario = autenticar(token)
    if not id_usuario:
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

    senha = str(info.get("senha") or "")
    nome_confirmacao = str(info.get("nomeSalao") or "").strip()

    bloqueados = []

    try:
        resposta_admin = supabase_admin.table("profissionais").select("salao_associado, nivel_acesso").eq("id_profissional", id_usuario).eq("removido", False).execute()

        if not resposta_admin.data:
            return jsonify({"sucesso": False, "erro": "Usuário não encontrado"}), 404

        admin = resposta_admin.data[0]
        id_salao = admin["salao_associado"]

        if int(admin["nivel_acesso"]) != 1:
            return jsonify({"sucesso": False, "erro": "Somente administradores podem excluir o salão"}), 403

        # Confirmação: quem tem senha digita a senha; quem entra só pelo Google digita o nome do salão.
        usuario_auth = supabase_admin.auth.admin.get_user_by_id(id_usuario).user
        provedores = (usuario_auth.app_metadata or {}).get("providers") or []

        if "email" in provedores:
            if not senha:
                return jsonify({"sucesso": False, "erro": "Digite sua senha"}), 400

            try:
                novo_cliente_anonimo().auth.sign_in_with_password({"email": usuario_auth.email, "password": senha})
            except AuthApiError as erro:
                if erro.code == "invalid_credentials":
                    return jsonify({"sucesso": False, "erro": "Senha incorreta"}), 401
                raise

        else:
            resposta_salao = supabase_admin.table("saloes").select("nome_salao").eq("id_salao", id_salao).eq("removido", False).execute()

            if not resposta_salao.data:
                return jsonify({"sucesso": False, "erro": "Salão não encontrado"}), 404

            if nome_confirmacao.casefold() != resposta_salao.data[0]["nome_salao"].strip().casefold():
                return jsonify({"sucesso": False, "erro": "O nome do salão não confere"}), 400

        resposta_profissionais = supabase_admin.table("profissionais").select("id_profissional").eq("salao_associado", id_salao).eq("removido", False).execute()

        # 1. Bloqueia o login de todos do salão, guardando quem já foi bloqueado para poder desfazer.
        for profissional in resposta_profissionais.data:
            supabase_admin.auth.admin.update_user_by_id(profissional["id_profissional"], {"ban_duration": "876000h"})
            bloqueados.append(profissional["id_profissional"])

        # 2. Marca tudo no banco de uma vez só (função do banco, numa transação).
        supabase_admin.rpc("excluir_salao_logico", {"p_id_salao": id_salao, "p_id_admin": id_usuario}).execute()

        return jsonify({"sucesso": True})

    except AuthApiError as erro:
        print("Erro do Auth ao excluir salão:", erro.status, erro.code, erro.message)
        desbloquear_logins(bloqueados)
        return jsonify({"sucesso": False, "erro": "Falha ao excluir o salão"}), 400

    except Exception as erro:
        print("Erro ao excluir salão:", erro)
        desbloquear_logins(bloqueados)
        return jsonify({"sucesso": False, "erro": "Falha ao excluir o salão"}), 500

def desbloquear_logins(ids):
    # Desfaz os bloqueios feitos antes de uma falha, para ninguém ficar sem acesso sem o salão ter sido removido.
    for id_bloqueado in ids:
        try:
            supabase_admin.auth.admin.update_user_by_id(id_bloqueado, {"ban_duration": "none"})
        except Exception as erro:
            print("Erro ao desbloquear", id_bloqueado, erro)

def excluir_conta():
    # A exclusão é lógica: os agendamentos continuam no banco para preservar o histórico do salão,
    # mas os dados pessoais do cliente são anonimizados e o login é bloqueado.
    token = request.headers.get("Authorization", "").replace("Bearer ", "")

    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    # autenticar() devolve o id do usuário dono do token, ou None se inválido.
    id_usuario = autenticar(token)
    if not id_usuario:
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

    try:
        resposta_busca = supabase_admin.table("clientes").select("id_cliente").eq("id_cliente", id_usuario).eq("removido", False).execute()

        if not resposta_busca.data:
            return jsonify({"sucesso": False, "erro": "Conta de cliente não encontrada"}), 404

        supabase_admin.auth.admin.update_user_by_id(
            uid=id_usuario,
            attributes={"ban_duration": "876000h"}
        )

        try:
            resposta_tabela = supabase_admin.table("clientes").update({
                "removido": True,
                "nome_cliente": "Cliente removido",
                "email_cliente": f"removido-{id_usuario}@removido.invalid"
            }).eq("id_cliente", id_usuario).execute()
            removeu = bool(resposta_tabela.data)
        except Exception as erro:
            print("Erro ao anonimizar o cliente:", erro)
            removeu = False

        if not removeu:
            # Desbloqueia o login para a conta não ficar bloqueada sem ter sido removida.
            supabase_admin.auth.admin.update_user_by_id(
                uid=id_usuario,
                attributes={"ban_duration": "none"}
            )
            return jsonify({"sucesso": False, "erro": "Falha ao excluir a conta"}), 500

        return jsonify({"sucesso": True})

    except AuthApiError as erro:
        print("Erro do Auth ao excluir conta:", erro.status, erro.code, erro.message)
        return jsonify({"sucesso": False, "erro": "Falha ao excluir a conta"}), 400

    except Exception as erro:
        print("Erro ao excluir a conta:", erro)
        return jsonify({"sucesso": False, "erro": "Falha ao excluir a conta"}), 500
