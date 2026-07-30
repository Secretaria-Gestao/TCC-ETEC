from flask import request, jsonify
from database import supabase
from controllers.autenticacao import autenticar

def buscar_servicos_agendamento():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")

    if not token:
        print("sem token")
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401
    
    if not autenticar(token):
        print("token ruim")
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 400

    info = request.get_json()

    if not info or info['profissional_selecionado'] is None:
        print("nenhum profissional selecionado")
        return jsonify({"sucesso": False, "erro": "Nenhum profissional selecionado"}), 400

    profissional_selecionado = info["profissional_selecionado"]

    try:
        resposta = (
            supabase.table("profissionais_servicos").select("id_servico, servicos(nome_servico).eq")
            .eq("id_profissional", profissional_selecionado).eq("servicos.em_funcionamento", True)
            .eq("servicos.removido", False)
            .execute()
        )

        if resposta.data is None or len(resposta.data) == 0:
            print("Serviços não encontrados")
            return jsonify({"sucesso": False, "erro": "Serviços não encontrados"}), 500

        servicos = resposta.data

        return jsonify({"sucesso": True, "servicos": servicos})

    except Exception as erro:
        print(erro)
        return jsonify({"sucesso": False, "erro": "Deu muito ruim"}), 500