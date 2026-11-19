from flask import Flask, request, jsonify
from database import supabase, supabase_auth

TIPOS_POR_NIVEL = {
    1: 'administrador',
    2: 'gerente',
    3: 'colaborador'
}

def cadastroUserCliente():
    # Depois do Supabase Auth criar o usuario, o front envia estes dados extras
    # para manter o perfil do cliente tambem na tabela "clientes".

    data = request.get_json()
    supabase.table('clientes').insert(data).execute()

    return jsonify({'sucesso': True, 'resultado': 'Cliente cadastrado com sucesso!'})

def cadastroSalao():
    # Antes do Supabase criar a conta do gerente, cria-se o salao

    data = request.get_json()

    resposta = supabase.table('saloes').insert(data).execute()

    id_salao = resposta.data[0]['id_salao']

    return jsonify({'sucesso': True, 'resultado': 'Cliente cadastrado com sucesso!', 'id_salao': id_salao})

def cadastroUserGerente():
    # Depois do Supabase Auth criar o usuario, o front envia estes dados extras
    # para manter o perfil do profissional tambem na tabela "profissionais".

    data = request.get_json()

    supabase.table('profissionais').insert(data).execute()

    return jsonify({'sucesso': True, 'resultado': 'Profissional cadastrado com sucesso!'})

def _pegar_token():
    return request.headers.get("Authorization", "").replace("Bearer ", "")


def _buscar_tipo(id_usuario):
    # Procura primeiro em profissionais, depois em clientes. Retorna None se não achar
    resposta = (
        supabase_admin.table("profissionais")
        .select("id_profissional, nivel_acesso")
        .eq("id_profissional", id_usuario)
        .execute()
    )
    if resposta.data:
        nivel = int(resposta.data[0]["nivel_acesso"])
        return TIPOS_POR_NIVEL.get(nivel, "colaborador")

    resposta = (
        supabase_admin.table("clientes")
        .select("id_cliente")
        .eq("id_cliente", id_usuario)
        .execute()
    )
    if resposta.data:
        return "cliente"

    return None


def tipoUsuario():
    # Só devolve o tipo de quem está logado
    token = _pegar_token()
    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    id_usuario = autenticar(token)
    if not id_usuario:
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

    try:
        tipo = _buscar_tipo(id_usuario)

        if not tipo:
            return jsonify({"sucesso": False, "erro": "Usuário não encontrado"}), 404

        return jsonify({"sucesso": True, "tipo": tipo})

    except Exception:
        return jsonify({"sucesso": False, "erro": "Falha ao consultar o banco de dados"}), 500


def loginGoogle():
    # Primeira vez com o Google: cadastra como cliente. Sempre devolve o tipo
    token = _pegar_token()
    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    id_usuario = autenticar(token)
    if not id_usuario:
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

    try:
        tipo = _buscar_tipo(id_usuario)

        if not tipo:
            # Nome e email vêm do próprio Supabase Auth, a partir do token
            usuario = supabase_admin.auth.get_user(token).user

            supabase_admin.table("clientes").insert({
                "id_cliente": id_usuario,
                "nome_cliente": (usuario.user_metadata or {}).get("full_name"),
                "email_cliente": usuario.email
            }).execute()

            tipo = "cliente"

        return jsonify({"sucesso": True, "tipo": tipo})

    except Exception:
        return jsonify({"sucesso": False, "erro": "Falha ao finalizar o cadastro"}), 500