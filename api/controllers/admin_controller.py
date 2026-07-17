from flask import request, jsonify
from database import supabase, supabase_admin
from controllers.autenticacao import autenticar

def cadastrar_profissional():
    info = request.get_json()

    campos_necessarios = ["email", "senha", "nome_profissional", "cargo", "nivel_acesso", "telefone_profissional"]
    for campo in campos_necessarios:
        if campo not in info:
            return jsonify({"sucesso": False, "erro": f"Campo ausente: {campo}."}), 400

    email = info["email"].lower()
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    try:
        print("1")
        resposta_auth = supabase_admin.auth.admin.create_user({    # Cria o usuário no Supabase Auth
            "email": email,
            "password": info["senha"],
            "email_confirm": True
        })
        
        id_profissional = resposta_auth.user.id
          
        supabase_admin.table("profissionais").insert({   # Insere na tabela profissionais
            "id_profissional": id_profissional,
            "email_profissional": email,
            "nome_profissional": info["nome_profissional"],
            "cargo": info["cargo"],
            "telefone_profissional": info["telefone_profissional"],
            "nivel_acesso": info["nivel_acesso"]
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


def buscar_profissionalEmail():
    email = request.headers.get("X-Email").lower()
    if not email:
        return jsonify({"sucesso": False, "erro": "Email não informado"}), 400

    print("Email recebido:", email)
    
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    try:
        resultado = (
            supabase_admin.table("profissionais")
            .select("*")
            .eq("email_profissional", email)
            .execute()
        )

        if not resultado.data:
            return jsonify({"sucesso": False, "erro": "Profissional não encontrado"}), 404

        return jsonify({"sucesso": True, "profissional": resultado.data[0]})

    except Exception as e:
        print("Erro ao buscar profissional:", e)
        return jsonify({"sucesso": False, "erro": str(e)}), 500
    
def buscar_Todosprofissionais():
    
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    try:
        resultado = (
            supabase_admin.table("profissionais").select("*").execute()
        )

        if not resultado.data:
            return jsonify({"sucesso": False, "erro": "Profissional não encontrado"}), 404

        return jsonify({"sucesso": True, "profissional": resultado.data})

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
        resposta = supabase_admin.table("profissionais").update({
            "salao_associado": info["id_salao"]
        }).eq("id_profissional", info["id_profissional"]).execute()
        
        print(resposta)

        return jsonify({"sucesso": True, "resultado": "Profissional vinculado ao salão com sucesso!"})

    except Exception as e:
        print("Erro ao vincular profissional:", e)
        return jsonify({"sucesso": False, "erro": str(e)}), 500


def meu_perfil():
    # Busca os dados do profissional/admin logado usando o token.
    # Necessário para o admin descobrir o id_salao sem precisar informar manualmente.
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    # autenticar() devolve o id do usuário dono do token, ou None se inválido.
    id_usuario = autenticar(token)
    if not id_usuario:
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

    try:
        resultado = (
            supabase_admin.table("profissionais")
            .select("*")
            .eq("id_profissional", id_usuario)
            .execute()
        )

        if not resultado.data:
            return jsonify({"sucesso": False, "erro": "Perfil não encontrado"}), 404

        return jsonify({"sucesso": True, "perfil": resultado.data[0]})

    except Exception as e:
        print("Erro ao buscar perfil:", e)
        return jsonify({"sucesso": False, "erro": str(e)}), 500    

def agendamentos_profissional(id_profissional):
    # Busca todos os agendamentos marcados para um profissional específico.
    # Usado na página do profissional para ele ver a própria agenda.
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    if not autenticar(token):
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

    try:
        # Traz os dados do cliente porque o profissional precisa saber quem vai atender.
        resultado = (
            supabase_admin.table("agendamentos")
            .select("horario, status, clientes(nome_cliente, email_cliente)")
            .eq("id_profissional", id_profissional)
            .execute()
        )

        agendamentos = []
        for ag in resultado.data:
            cliente = ag.get("clientes") or {}
            agendamentos.append({
                "horario": ag["horario"],
                "status": ag["status"],
                "cliente": cliente.get("nome_cliente"),
                "email_cliente": cliente.get("email_cliente"),
            })

        return jsonify({"sucesso": True, "agendamentos": agendamentos})
    except Exception as e:
        print("Erro ao buscar agendamentos do profissional:", e)
        return jsonify({"sucesso": False, "erro": str(e)}), 500

def agendamentos_salao(id_salao):
    # Busca todos os agendamentos de todos os profissionais do salão.
    # Usado na página do admin para enxergar a agenda inteira do salão.
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    if not autenticar(token):
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

    try:
        # Traz dados do cliente e do profissional, pois o admin precisa ver
        # "quem marcou" e "com quem marcou".
        resultado = (
            supabase_admin.table("agendamentos")
            .select("horario, status, preco, clientes(nome_cliente), profissionais(nome_profissional, cargo, salao_associado)")
            .execute()
        )

        agendamentos = []
        for ag in resultado.data:
            prof = ag.get("profissionais") or {}
            cliente = ag.get("clientes") or {}

            # Filtra apenas agendamentos do salão correto,
            # pois o Supabase não permite filtrar diretamente por coluna de tabela relacionada.
            if prof.get("salao_associado") != id_salao:
                continue

            agendamentos.append({
                "horario": ag["horario"],
                "status": ag["status"],
                "preco": ag.get("preco"),
                "cliente": cliente.get("nome_cliente"),
                "profissional": prof.get("nome_profissional"),
                "cargo": prof.get("cargo"),
            })

        return jsonify({"sucesso": True, "agendamentos": agendamentos})

    except Exception as e:
        print("Erro ao buscar agendamentos do salão:", e)
        return jsonify({"sucesso": False, "erro": str(e)}), 500