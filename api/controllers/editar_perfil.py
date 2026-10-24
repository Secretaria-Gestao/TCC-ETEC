from flask import request, jsonify
from supabase_auth.errors import AuthApiError

from database import supabase_admin
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
        print("Erro ao editar email:", erro)
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
        print("Erro ao editar nome:", erro)
        return jsonify({"sucesso": False, "erro": "Tente novamente"}), 500

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
        print("Erro ao excluir conta:", erro)
        return jsonify({"sucesso": False, "erro": "Falha ao excluir a conta"}), 500
