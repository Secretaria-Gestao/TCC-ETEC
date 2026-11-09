from flask import Flask, request, jsonify
from database import supabase, supabase_admin
from datetime import datetime, timedelta
from database import supabase
from .autenticacao import autenticar
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

FUSO_SALAO = ZoneInfo("America/Sao_Paulo")

def validar_horario_funcionamento(id_salao, data_hora_iso):
    # Devolve o texto do problema, ou None se o horário está dentro do expediente
    try:
        # "2026-11-10T13:00:00.000Z" -> datetime com fuso UTC
        dt = datetime.fromisoformat(str(data_hora_iso).replace("Z", "+00:00"))
    except ValueError:
        return "Data e hora inválidas"

    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)  # sem fuso = UTC, igual ao banco

    local = dt.astimezone(FUSO_SALAO)

    # weekday(): segunda=0 ... domingo=6. No banco: domingo=0 ... sábado=6
    dia_semana = (local.weekday() + 1) % 7

    resposta = (
        supabase_admin.table("horario_funcionamento_salao")
        .select("hora_abertura, hora_fechamento, fechado")
        .eq("id_salao", id_salao)
        .eq("dia_semana", dia_semana)
        .execute()
    )

    # Sem regra salva para o dia = sem restrição (salão que não configurou os horários)
    if not resposta.data:
        return None

    regra = resposta.data[0]
    if regra["fechado"]:
        return "O salão não funciona neste dia."

    hora = local.strftime("%H:%M")
    abertura = str(regra["hora_abertura"])[:5]
    fechamento = str(regra["hora_fechamento"])[:5]
    # Texto "HH:MM" compara certo com < e >=
    if hora < abertura or hora >= fechamento:
        return f"Neste dia o salão funciona das {abertura} às {fechamento}."

    return None

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

        problema_horario = validar_horario_funcionamento(id_salao, info["data_hora"])
        if problema_horario:
            return jsonify({"sucesso": False, "erro": problema_horario}), 400

         
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

        resposta_servicos = supabase.table("servicos").select("id_servico, nome_servico, preco_servico, duracao").in_("id_servico", ids_servicos).execute()

        servicos = resposta_servicos.data

        correlacao = (
            supabase.table("profissionais_servicos")
                .select("id_servico")
                .eq("id_profissional", id_profissional)
                .in_("id_servico", ids_servicos)
                .execute()
            )

        servicos_fornecidos = {int(item["id_servico"]) for item in correlacao.data}

        if servicos_fornecidos != {int(servico) for servico in ids_servicos}:
            return jsonify({"sucesso": False, "erro": "O profissional escolhido não realiza todos os serviços selecionados"}), 400
        
        valor_total = 0
        duracao_total = 0
        
        for servico in servicos:
            valor_total += float( servico["preco_servico"] )
            duracao_total += float( servico["duracao"] or 0 )

        inicio_novo = datetime.fromisoformat(info["data_hora"].replace("Z", "+00:00")) # "Novo" seria sobre o novo hoário que estão querendo agendar
        fim_novo = inicio_novo + timedelta(minutes=duracao_total)

        agendamentos_vizinhos = (
            supabase.table("agendamentos")
            .select("id_agendamento, horario, duracao_total")
            .eq("id_profissional", id_profissional)
            .not_.in_("status", ["cancelado", "ausente"])
            .lt("horario", fim_novo.isoformat())
            .gte("horario", (inicio_novo - timedelta(hours=12)).isoformat())
            .execute()
        )

        for existente in agendamentos_vizinhos.data:
            inicio_existente = datetime.fromisoformat(existente["horario"].replace("Z", "+00:00"))
            fim_existente = inicio_existente + timedelta(minutes=float(existente["duracao_total"] or 0))

            if inicio_novo < fim_existente and fim_novo > inicio_existente:
                return jsonify({"sucesso": False, "erro": "Profissional já possui serviço neste horário."}), 409
            
        novo_agendamento = {
            "id_cliente": id_remetente,
            "id_profissional": id_profissional,
            "salao_associado": id_salao,
            "horario": info["data_hora"],
            "endereco": endereco_salao,
            "preco": valor_total,
            "duracao_total": duracao_total,
            "status": "pendente"
        }

        resultado = supabase.table("agendamentos").insert(novo_agendamento).execute()

        id_agendamento = resultado.data[0]["id_agendamento"]

        try:
            itens = [ { "id_agendamento": id_agendamento, "id_servicos": servico } for servico in servicos_escolhidos ]
            
            supabase.table("agendamento_servicos").insert(itens).execute()
            
        except Exception:
            try:
                supabase.table("agendamentos").delete().eq("id_agendamento", id_agendamento).execute()
            except Exception:
                pass

            return jsonify({"sucesso": False, "erro": "Não foi possível concluir o agendamento, tente novamente"}), 500
        
        return jsonify(
            {"sucesso": True, "resultado": "Agendamento realizado com sucesso!"}
        )

    except Exception as e:
        return jsonify({"sucesso": False, "erro": str(e)}), 500
