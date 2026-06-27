from flask import Flask, request, jsonify
from database import supabase
from .autenticacao import autenticar


def agendar():
    # Endpoint usado pela tela de agendamento para gravar o horario no Supabase.
    info = request.get_json()

    # Garante que o front mandou tudo que a tabela precisa receber.
    campos_necessarios = ["servicos", "profissional", "data_hora", "endereco"]
    for campo in campos_necessarios:
        if campo not in info:
            return jsonify({"sucesso": False, "erro": f"Campo ausente: {campo}"}), 400

    token = request.headers.get("Authorization")

    if not token:
        return jsonify({"sucesso": False, "erro": "token ausente."}), 401

    token = token.replace("Bearer ", "")

    id_cliente = autenticar(token)

    if id_cliente is None:
        return jsonify({"sucesso": False, "erro": "Token é invalido"}), 401

    try:
        # Mapeia os nomes usados no JavaScript para os nomes das colunas no banco.

        profissional_escolhido = (
            supabase.table("profissionais")
            .select("id_profissional")
            .eq("nome_profissional", info["profissional"])
            .execute()
        )

        id_profissional = profissional_escolhido.data[0]["id_profissional"]

        checagem_agendamento = (
            supabase.table("agendamentos")
            .select("id_agendamento")
            .eq("id_profissional", id_profissional)
            .eq("horario", info["data_hora"])
            .execute()
        )

        if not checagem_agendamento.data:
            novo_agendamento = {
                "id_cliente": id_cliente,
                "id_profissional": id_profissional,
                "horario": info["data_hora"],
                "endereco": info["endereco"],
                "status": "Pendente"
            }

            resultado = supabase.table("agendamentos").insert(novo_agendamento).execute()

            id_agendamento = resultado.data[0]["id_agendamento"]

            for servico in info["servicos"]:
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
                409,
            )

    except Exception as e:
        print("Erro ao agendar:", e)
        return jsonify({"sucesso": False, "erro": str(e)}), 500
