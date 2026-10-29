from flask import Flask, request, jsonify
from database import supabase
from .autenticacao import autenticar


def agendar():
    # Endpoint usado pela tela de agendamento para gravar o horario no Supabase.
    info = request.get_json()

    token = request.headers.get("Authorization", "").replace("Bearer ", "")

    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    id_remetente = autenticar(token)
   
    if id_remetente is None:
        return jsonify({"sucesso": False, "erro": "Token é invalido"}), 401

    # Garante que o front mandou tudo que a tabela precisa receber.
    campos_necessarios = ["servicos", "id_salao", "data_hora", "id_profissional"]
    for campo in campos_necessarios:
        if campo not in info:
            return jsonify({"sucesso": False, "erro": f"Campo ausente: {campo}"}), 400
    
    try:

        resposta_cliente = supabase.table("clientes").select("id_cliente").eq("id_cliente", id_remetente).execute()

        if not resposta_cliente.data:
            return jsonify({"sucesso": False, "erro": "Somente clientes podem agendar um horário"}), 403

        id_salao = int(info["id_salao"])

        if not isinstance(info["servicos"], list) or not info["servicos"]:
            return jsonify({"sucesso": False, "erro": "Escolha pelo menos um serviço"}), 400

        # Remove ids repetidos mantendo a ordem, assim o preço e o vínculo contam cada serviço uma vez só.
        servicos_escolhidos = list(dict.fromkeys(info["servicos"]))

        profissional_escolhido = (
            supabase.table("profissionais")
            .select("id_profissional, salao_associado")
            .eq("id_profissional", info["id_profissional"])
            .eq("salao_associado", id_salao)
            .eq("status", True)
            .eq("removido", False)
            .execute()
        )

        if not profissional_escolhido.data:
            return jsonify({"sucesso": False, "erro": "Profissional não encontrado"}), 404

        id_profissional = profissional_escolhido.data[0]["id_profissional"]
        
        if profissional_escolhido.data[0]["salao_associado"] != id_salao:
            return jsonify({"sucesso": False, "erro": "O profissional escolhido não pertence ao salão escolhido"}), 403

        salao_escolhido = (
            supabase.table("saloes")
            .select("endereco_salao")
            .eq("id_salao", id_salao)
            .execute()
        )

        if not salao_escolhido.data:
            return jsonify({"sucesso": False, "erro": "Salão não encontrado"}), 404

        endereco_salao = salao_escolhido.data[0]["endereco_salao"]
        
        checagem_agendamento = (
            supabase.table("agendamentos")
            .select("id_agendamento")
            .eq("id_profissional", id_profissional)
            .eq("horario", info["data_hora"])
            .execute()
        )

        if not checagem_agendamento.data:
            
            ids_servicos = []

            for servico in servicos_escolhidos:
                resposta_servico =supabase.table("servicos").select("nome_servico, removido, em_funcionamento, salao_associado").eq("id_servico", servico).execute()

                if not resposta_servico.data:
                    return jsonify({"sucesso": False, "erro": "Algum serviço não foi localizado no sistema, tente novamente"}), 404
                
                servico_atual = resposta_servico.data[0]
                
                if int(servico_atual["salao_associado"]) != id_salao:
                    return jsonify({"sucesso": False, "erro": f"O serviço {servico_atual['nome_servico']} não é do mesmo salão escolhido"}),  403
                
                if servico_atual["removido"] == True or servico_atual["em_funcionamento"] == False:
                    return jsonify({"sucesso": False, "erro": f"O serviço {servico_atual['nome_servico']} não está em funcionamento no momento"}), 409

                ids_servicos.append(servico)

            resposta_servicos = supabase.table("servicos").select("preco_servico").in_("id_servico", ids_servicos).execute()

            servicos = resposta_servicos.data
            
            valor_total = 0
            
            for servico in servicos:
                valor_total += float(servico["preco_servico"])
                
            novo_agendamento = {
                "id_cliente": id_remetente,
                "id_profissional": id_profissional,
                "salao_associado": id_salao,
                "horario": info["data_hora"],
                "endereco": endereco_salao,
                "preco": valor_total,
                "status": "Pendente"
            }

            resultado = supabase.table("agendamentos").insert(novo_agendamento).execute()

            id_agendamento = resultado.data[0]["id_agendamento"]
            

            for servico in servicos_escolhidos:
                agendamento_servicos = {
                    "id_agendamento": id_agendamento,
                    "id_servicos": servico,
                }

                supabase.table("agendamento_servicos").insert(
                    agendamento_servicos
                ).execute()

            return jsonify(
                {"sucesso": True, "resultado": "Agendamento realizado com sucesso!"}
            )

        else:
            return (
                jsonify(
                    {
                        "sucesso": False,
                        "erro": "Profissional já possui serviço neste horário.",
                    },
                ),
                409
            )

    except Exception as e:
        return jsonify({"sucesso": False, "erro": str(e)}), 500
