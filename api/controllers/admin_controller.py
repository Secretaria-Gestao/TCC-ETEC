from flask import request, jsonify
from database import supabase, supabase_admin
from controllers.autenticacao import autenticar

def cadastrar_profissional():
    info = request.get_json()

    campos_necessarios = ["email", "senha", "nome_profissional", "cargo", "telefone_profissional"]
    for campo in campos_necessarios:
        if campo not in info:
            return jsonify({"sucesso": False, "erro": f"Campo ausente: {campo}"}), 400

    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    try:
        resposta_auth = supabase_admin.auth.admin.create_user({    # Cria o usuário no Supabase Auth
            "email": info["email"],
            "password": info["senha"],
            "email_confirm": True
        })

        id_profissional = resposta_auth.user.id
        
        supabase_admin.table("profissionais").insert({   # Insere na tabela profissionais
            "id_profissional": id_profissional,
            "email_profissional": info["email"],
            "nome_profissional": info["nome_profissional"],
            "cargo": info["cargo"],
            "telefone_profissional": info["telefone_profissional"]
        }).execute()

        return jsonify({"sucesso": True, "resultado": "Profissional cadastrado com sucesso!"})

    except Exception as e:
        print("Erro ao cadastrar profissional:", e)
        return jsonify({"sucesso": False, "erro": str(e)}), 500


def agendamentos_cliente(id_cliente):
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    if not autenticar(token):
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

    try:
        resultado = (
            supabase_admin.table("agendamentos")
            .select("horario, status, profissionais(nome_profissional, salao_associado, saloes(nome_salao, endereco_salao))")
            .eq("id_cliente", id_cliente)
            .execute()
        )

        agendamentos = []
        for ag in resultado.data:
            prof = ag.get("profissionais", {})
            salao = prof.get("saloes", {}) if prof else {}
            agendamentos.append({
                "horario": ag["horario"],
                "status": ag["status"],
                "profissional": prof.get("nome_profissional"),
                "salao": salao.get("nome_salao"),
                "endereco": salao.get("endereco_salao")
            })

        return jsonify({"sucesso": True, "agendamentos": agendamentos})

    except Exception as e:
        print("Erro ao buscar agendamentos:", e)
        return jsonify({"sucesso": False, "erro": str(e)}), 500


def buscar_profissional():
    email = request.headers.get("X-Email")
    if not email:
        return jsonify({"sucesso": False, "erro": "Email não informado"}), 400

    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    try:
        resultado = (
            supabase_admin.table("profissionais")
            .select("id_profissional, nome_profissional, email_profissional, cargo, telefone_profissional, salao_associado")
            .eq("email_profissional", email)
            .execute()
        )

        if not resultado.data:
            return jsonify({"sucesso": False, "erro": "Profissional não encontrado"}), 404

        return jsonify({"sucesso": True, "profissional": resultado.data[0]})

    except Exception as e:
        print("Erro ao buscar profissional:", e)
        return jsonify({"sucesso": False, "erro": str(e)}), 500

def vincular_profissional():
    info = request.get_json()

    if "id_profissional" not in info or "id_salao" not in info:
        return jsonify({"sucesso": False, "erro": "Campos ausentes: id_profissional e id_salao são obrigatórios"}), 400

    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    try:
        supabase_admin.table("profissionais").update({
            "salao_associado": info["id_salao"]
        }).eq("id_profissional", info["id_profissional"]).execute()

        return jsonify({"sucesso": True, "resultado": "Profissional vinculado ao salão com sucesso!"})

    except Exception as e:
        print("Erro ao vincular profissional:", e)
        return jsonify({"sucesso": False, "erro": str(e)}), 500