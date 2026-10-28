from flask import request, jsonify
from database import supabase
from controllers.autenticacao import autenticar

def buscar_servicos_agendamento():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")

    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    if not autenticar(token):
        # 401 é o código de token inválido (antes era 400)
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

    # .get() evita KeyError quando o campo não vem no JSON
    info = request.get_json(silent=True) or {}
    profissional_selecionado = info.get("profissional_selecionado")

    if not profissional_selecionado:
        return jsonify({"sucesso": False, "erro": "Nenhum profissional selecionado"}), 400

    try:
        resposta = (
            supabase.table("profissionais_servicos")
            .select("id_servico, servicos(nome_servico, preco_servico)")
            .eq("id_profissional", profissional_selecionado)
            .eq("servicos.em_funcionamento", True)
            .eq("servicos.removido", False)
            .execute()
        )

        # None = erro real. Lista vazia (profissional sem serviços) é SUCESSO com [],
        # antes virava erro 500 e quebrava o formulário.
        if resposta.data is None:
            return jsonify({"sucesso": False, "erro": "Falha ao buscar os serviços"}), 500

        return jsonify({"sucesso": True, "servicos": resposta.data})

    except Exception as erro:
        print("Erro ao buscar serviços do agendamento:", erro)
        return jsonify({"sucesso": False, "erro": "Erro ao buscar os serviços"}), 500