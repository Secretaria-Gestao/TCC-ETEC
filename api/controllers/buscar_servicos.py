from flask import request, jsonify
from database import supabase
from controllers.autenticacao import autenticar

def buscar_servicos_agendamento():
    print("1")

    token = request.headers.get("Authorization", "").replace("Bearer ", "")

    print("2")
    if not token:
        print("sem token")
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    print("3")
    
    if not autenticar(token):
        print("token ruim")
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 400

    print("4")

    info = request.get_json()

    print("5")

    if not info or info['profissional_selecionado'] is None:
        print("nenhum profissional selecionado")
        return jsonify({"sucesso": False, "erro": "Nenhum profissional selecionado"}), 400

    print("6")

    profissional_selecionado = info["profissional_selecionado"]

    print("7")

    try:
        resposta = supabase.table("profissionais_servicos").select("id_servico, servicos(nome_servico)").eq("id_profissional", profissional_selecionado).execute()

        if resposta.data is None or len(resposta.data) == 0:
            print("Serviços não encontrados")
            return jsonify({"sucesso": False, "erro": "Serviços não encontrados"}), 500

        servicos = resposta.data

        return jsonify({"sucesso": True, "servicos": servicos})

    except Exception as erro:
        print(erro)
        return jsonify({"sucesso": False, "erro": "Deu muito ruim"}), 500