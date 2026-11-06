import re
from datetime import datetime, timedelta, timezone
from flask import request, jsonify
from database import supabase, supabase_admin
from controllers.autenticacao import autenticar

def cadastrar_profissional(): # Aqui cria o profissional no Auth do Supabase, e já vincula também no mesmo salão do gerente
    info = request.get_json(silent=True) or {}
    id_profissional = None

    campos_necessarios = ["email", "senha", "nome_profissional", "cargo", "nivel_acesso", "telefone_profissional"]
    for campo in campos_necessarios:
        if not info.get(campo):
            return jsonify({"sucesso": False, "erro": f"Campo ausente: {campo}."}), 400

    token = request.headers.get("Authorization", "").replace("Bearer ", "")

    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    id_remetente = autenticar(token)

    if not id_remetente:
        return jsonify({"sucesso": False, "erro": "Token não autorizado"}), 401
    
    try:

        resultado_remetente = supabase_admin.table("profissionais").select("nivel_acesso, salao_associado").eq("id_profissional", id_remetente).execute()

        if not resultado_remetente.data:
            return jsonify({"sucesso": False, "erro": "Não foi possível encontrar o profissional"}), 404

        remetente = resultado_remetente.data[0]

        if int(remetente["nivel_acesso"]) >= 3:
            return jsonify({"sucesso": False, "erro": "Somente administradores e gerentes podem cadastrar um profissional"}), 403

        email_profissional = info["email"].strip().lower()

        if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[^@\s]+", email_profissional):
            return jsonify({"sucesso": False, "erro": "E-mail inválido"}), 400

        if len(str(info["senha"])) < 6:
            return jsonify({"sucesso": False, "erro": "A senha deve conter pelo menos 6 caracteres"}), 400

        if remetente["nivel_acesso"] > int(info["nivel_acesso"]):
                    return jsonify({"sucesso": False, "erro": "Nível do profissional sendo cadastrado acima do nível do remetente"}), 403
        
        if int(info["nivel_acesso"]) < 1 or int(info["nivel_acesso"]) > 3:
            return jsonify({"sucesso": False, "erro": "Nível de acesso inexistente"}), 400

        resposta_auth = supabase_admin.auth.admin.create_user({    # Cria o usuário no Supabase Auth
            "email": email_profissional,
            "password": info["senha"],
            "email_confirm": True
        })

        id_profissional = resposta_auth.user.id

        supabase_admin.table("profissionais").insert({
            "id_profissional": id_profissional,
            "email_profissional": email_profissional,
            "nome_profissional": info["nome_profissional"],
            "cargo": info["cargo"],
            "telefone_profissional": info["telefone_profissional"],
            "nivel_acesso": int(info["nivel_acesso"]),
            "salao_associado": remetente["salao_associado"]
        }).execute()
        
        return jsonify({"sucesso": True, "resultado": "Profissional cadastrado com sucesso!"})

    except Exception as e:
        if id_profissional:
            try: # Usa um try aqui porque até esse delete pode dar erro
                supabase_admin.auth.admin.delete_user(id_profissional)

            except Exception as erro_exclusao:
                print("Erro ao excluir usuário incompleto:", erro_exclusao)

        return jsonify({"sucesso": False, "erro": str(e)}), 500

def agendamentos_cliente():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    id_cliente = autenticar(token) # Serve para verificar depois se o id que a pessoa está mandando, realmente é dela

    if not id_cliente:
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

    try:

        resultado = (
            supabase_admin.table("agendamentos")
            .select("id_agendamento, horario, status, profissionais(nome_profissional, salao_associado, saloes!salao_associado(nome_salao, endereco_salao))")
            .eq("id_cliente", id_cliente)
            .execute()
        )

        agendamentos = []
        for ag in resultado.data:
            prof = ag.get("profissionais", {})
            salao = prof.get("saloes", {}) if prof else {}
            agendamentos.append({
                "id_agendamento": ag["id_agendamento"],
                "horario": ag["horario"],
                "status": ag["status"],
                "profissional": prof.get("nome_profissional"),
                "salao": salao.get("nome_salao"),
                "endereco": salao.get("endereco_salao")
            })

        return jsonify({"sucesso": True, "agendamentos": agendamentos})

    except Exception as e:
        return jsonify({"sucesso": False, "erro": str(e)}), 500

def buscar_profissional_email():
    email_destinatario = (request.headers.get("X-Email") or "").lower() # Email do profissional que será buscado
    if not email_destinatario:
        return jsonify({"sucesso": False, "erro": "Email não informado"}), 400

    token = request.headers.get("Authorization", "").replace("Bearer ", "") # Pega o token de quem está querendo buscar o profissional pelo email

    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    id_remetente = autenticar(token) # Valida o token

    if not id_remetente:
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

    try: # Vai verificar se o remetente é gerente, se nenhuma busca retorna um "None" ou por aí
        resposta_remetente = supabase_admin.table("profissionais").select("nivel_acesso, salao_associado").eq("id_profissional", id_remetente).execute()

        if not resposta_remetente.data:
            return jsonify({"sucesso": False, "erro": "Remetente não encontrado"}), 404

        remetente = resposta_remetente.data[0]

        if int(remetente["nivel_acesso"]) >= 3:
            return jsonify({"sucesso": False, "erro": "Somente administradores e gerentes podem fazer busca"}), 403

        resposta_destinatario = (
            supabase_admin.table("profissionais")
            .select("*")
            .eq("email_profissional", email_destinatario)
            .eq("removido", False)
            .execute()
        )

        if not resposta_destinatario.data:
            return jsonify({"sucesso": False, "erro": "Profissional não encontrado"}), 404

        destinatario = resposta_destinatario.data[0]

        if remetente['salao_associado'] != destinatario['salao_associado'] and destinatario['salao_associado'] is not None:
            return jsonify({"sucesso": False, "erro": "O gerente tentou buscar um profissional de outro salão"}), 403

        return jsonify({"sucesso": True, "profissional": destinatario})

    except Exception as e:
        return jsonify({"sucesso": False, "erro": str(e)}), 500
    
def buscar_Todosprofissionais(): # Busca todos os profissionais, todos
    info = request.get_json()
    resultado = None
    
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    id_remetente = autenticar(token)

    if not id_remetente:
        return jsonify({"sucesso":False,"erro": "Token inválido"}), 401

    try:
        resultado_remetente = supabase_admin.table("profissionais").select("nivel_acesso, salao_associado").eq("id_profissional", id_remetente).execute()

        if resultado_remetente.data:
            remetente = resultado_remetente.data[0]

            if int(remetente["nivel_acesso"]) < 3:
                resultado = (
                    supabase_admin.table("profissionais")
                    .select("id_profissional, nome_profissional, email_profissional, cargo, telefone_profissional, foto_url")
                    .eq("salao_associado", remetente["salao_associado"])
                    .eq("removido", False)
                    .eq("status", True)
                    .execute()
                )

        else:
            resultado_remetente = supabase_admin.table("clientes").select("id_cliente").eq("id_cliente", id_remetente).execute()

            if resultado_remetente.data:
                remetente = resultado_remetente.data[0]

                if info['id_salao']:
                    resultado = (
                        supabase_admin.table("profissionais")
                        .select("id_profissional, nome_profissional")
                        .eq("salao_associado", int(info['id_salao']))
                        .eq("removido", False)
                        .eq("status", True)
                        .execute()
                    )

                else:
                    resultado = (
                        supabase_admin.table("profissionais")
                        .select("id_profissional, nome_profissional")
                        .eq("removido", False)
                        .eq("status", True)
                        .execute()
                    )

        if not resultado or not resultado.data:
            return jsonify({"sucesso": False, "erro": "Falha ao encontrar profissionais"}), 404

        return jsonify({"sucesso": True, "profissional": resultado.data})

    except Exception as e:
        return jsonify({"sucesso": False, "erro": "Falha ao encontrar o usuário remetente no banco de dados"}), 500

def mostrarMembros():
    # Esta rota abastece a tabela e os resumos da página de gerenciamento.
    # Busca os profissionais do mesmo salão do administrador ou gerente logado.
    # O salão vem do token, e não do front-end, para impedir a consulta de
    # profissionais pertencentes a outro estabelecimento.
    token = request.headers.get("Authorization", "").replace("Bearer ", "")

    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    id_remetente = autenticar(token)

    if not id_remetente:
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

    try:
        resposta_remetente = (
            supabase_admin.table("profissionais")
            .select("nivel_acesso, salao_associado")
            .eq("id_profissional", id_remetente)
            .execute()
        )

        if not resposta_remetente.data:
            return jsonify({"sucesso": False, "erro": "Remetente não encontrado"}), 404

        remetente = resposta_remetente.data[0]

        if int(remetente["nivel_acesso"]) >= 3:
            return jsonify({"sucesso": False, "erro": "Somente administradores e gerentes podem visualizar os membros"}), 403

        if remetente["salao_associado"] is None:
            return jsonify({"sucesso": False, "erro": "O remetente não está associado a um salão"}), 404

        resposta_membros = (
            supabase_admin.table("profissionais")
            .select(
                "id_profissional, nome_profissional, email_profissional, "
                "telefone_profissional, cargo, nivel_acesso, status, tipo_pagamento, valor_comissao, criado_em, foto_url"
            )
            .eq("salao_associado", remetente["salao_associado"])
            .eq("removido", False)
            .execute()
        )

        if resposta_membros.data is None:
            return jsonify({"sucesso": False, "erro": "Falha ao buscar os membros"}), 500

        return jsonify({"sucesso": True, "membros": resposta_membros.data})

    except Exception as erro:
        print("Erro ao buscar membros:", erro)
        return jsonify({"sucesso": False, "erro": "Falha ao buscar os membros"}), 500

def remover_profissional():
    # A remoção é lógica: o registro e o histórico continuam no banco, mas deixam de aparecer.
    # A remoção é lógica: o registro continua no banco para preservar o
    # histórico, mas deixa de aparecer nas listas do salão.
    token = request.headers.get("Authorization", "").replace("Bearer ", "")

    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    info = request.get_json(silent=True) or {}
    id_profissional = info.get("id_profissional")

    if not id_profissional:
        return jsonify({"sucesso": False, "erro": "ID do profissional ausente"}), 400

    try:
        id_remetente = autenticar(token)

        if not id_remetente:
            return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

        if id_profissional == id_remetente:
            return jsonify({"sucesso": False, "erro": "Você não pode remover o próprio perfil"}), 403

        resposta_remetente = (
            supabase_admin.table("profissionais")
            .select("nivel_acesso, salao_associado")
            .eq("id_profissional", id_remetente)
            .execute()
        )

        if not resposta_remetente.data:
            return jsonify({"sucesso": False, "erro": "Remetente não encontrado"}), 404

        remetente = resposta_remetente.data[0]

        if int(remetente["nivel_acesso"]) != 1:
            return jsonify({"sucesso": False, "erro": "Somente administradores podem remover um profissional"}), 403
        
        resposta_profissional = (
            supabase_admin.table("profissionais")
            .select("id_profissional, salao_associado, nivel_acesso")
            .eq("id_profissional", id_profissional)
            .eq("removido", False)
            .execute()
        )

        if not resposta_profissional.data:
            return jsonify({"sucesso": False, "erro": "Profissional não encontrado"}), 404

        profissional = resposta_profissional.data[0]

        if profissional["salao_associado"] != remetente["salao_associado"]:
            return jsonify({"sucesso": False, "erro": "O profissional não pertence a este salão"}), 403
        
        if int(profissional["nivel_acesso"]) == 1:
            return jsonify({"sucesso": False, "erro": "Não se pode apagar um administrador"}), 403

        resposta_remover = (
            supabase_admin.table("profissionais")
            .update({"removido": True, "status": False})
            .eq("id_profissional", id_profissional)
            .eq("removido", False)
            .execute()
        )

        if not resposta_remover.data:
            return jsonify({"sucesso": False, "erro": "Falha ao remover o profissional"}), 500

        return jsonify({"sucesso": True})

    except Exception as erro:
        print("Erro ao remover profissional:", erro)
        return jsonify({"sucesso": False, "erro": "Erro ao remover o profissional"}), 500

def editar_profissional():
    # A edição valida o nível de acesso e o salão do remetente antes de atualizar a linha.
    # Edita os dados de um profissional pertencente ao salao do administrador
    # ou gerente que estão fazendo a requisição.
    token = request.headers.get("Authorization", "").replace("Bearer ", "")

    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    info = request.get_json() or {}

    campos_necessarios = [
        "id_profissional", "nome_profissional",
        "email_profissional", "cargo",
        "nivel_acesso", "status",
    ]

    for campo in campos_necessarios:
        if campo not in info or info[campo] in [None, ""]:
            return jsonify({"sucesso": False, "erro": f"Campo ausente: {campo}."}), 400

    try:
        id_remetente = autenticar(token)

        if not id_remetente:
            return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

        resposta_remetente = (
            supabase_admin.table("profissionais")
            .select("nivel_acesso, salao_associado")
            .eq("id_profissional", id_remetente)
            .execute()
        )

        if not resposta_remetente.data:
            return jsonify({"sucesso": False, "erro": "Remetente não encontrado"}), 404

        remetente = resposta_remetente.data[0]

        if int(remetente["nivel_acesso"]) >= 3:
            return jsonify({"sucesso": False, "erro": "Somente administradores e gerentes podem editar um profissional"}), 403

        resposta_profissional = (
            supabase_admin.table("profissionais")
            .select("id_profissional, email_profissional, salao_associado, status, nivel_acesso")
            .eq("id_profissional", info["id_profissional"])
            .execute()
        )

        if not resposta_profissional.data:
            return jsonify({"sucesso": False, "erro": "Profissional não encontrado"}), 404

        profissional = resposta_profissional.data[0]

        if profissional["salao_associado"] != remetente["salao_associado"]:
            return jsonify({"sucesso": False, "erro": "O profissional não pertence a este salão"}), 403

        try:
            nivel_acesso = int(info["nivel_acesso"])
        except (TypeError, ValueError):
            return jsonify({"sucesso": False, "erro": "Nível de acesso inválido"}), 400

        if nivel_acesso not in [1, 2, 3]:
            return jsonify({"sucesso": False, "erro": "Nível de acesso inválido"}), 400

        status = info["status"]
        if not isinstance(status, bool):
            return jsonify({"sucesso": False, "erro": "Status inválido"}), 400

        nome_profissional = str(info["nome_profissional"]).strip()
        email_profissional = str(info["email_profissional"]).strip().lower()
        cargo = str(info["cargo"]).strip()
        status = bool(info['status'])
        nivel_acesso = int(info["nivel_acesso"])

        if not nome_profissional or not email_profissional or not cargo:
            return jsonify({"sucesso": False, "erro": "Nome, e-mail e cargo não podem ficar vazios"}), 400

        # O e-mail de login fica no Auth e também na tabela de perfil.
        if email_profissional != profissional["email_profissional"]:
            supabase_admin.auth.admin.update_user_by_id(
                info["id_profissional"],
                {"email": email_profissional, "email_confirm": True},
            )
            
        if status != profissional["status"]:
            if remetente["nivel_acesso"] >= profissional["nivel_acesso"]:
                return jsonify({"sucesso": False, "erro": "O remetente tentou mudar o status de um profissional do mesmo nível ou inferior."}), 403
            
        if profissional['nivel_acesso'] != nivel_acesso:
            if remetente["nivel_acesso"] != 1:
                return jsonify({"sucesso": False, "erro": "Somente administradores podem alterar o nível de acesso"}), 403
            
            resposta_salao = supabase_admin.table("saloes").select("id_dono").eq("id_dono", profissional["id_profissional"]).execute()
            
            if resposta_salao.data:
                return jsonify({"sucesso": False, "erro": "Você não pode alterar o nível de acesso do dono do salão."}), 403
                
            
        dados_atualizados = {
            "nome_profissional": nome_profissional,
            "email_profissional": email_profissional,
            "cargo": cargo,
            "nivel_acesso": nivel_acesso,
            "status": status,
        }

        resposta_edicao = (
            supabase_admin.table("profissionais")
            .update(dados_atualizados)
            .eq("id_profissional", info["id_profissional"])
            .select("id_profissional, nome_profissional, email_profissional, cargo, nivel_acesso, status")
            .execute()
        )

        if not resposta_edicao.data:
            return jsonify({"sucesso": False, "erro": "Falha ao editar o profissional"}), 500

        return jsonify({"sucesso": True, "profissional": resposta_edicao.data[0]})

    except Exception as erro:
        print("Erro ao editar profissional:", erro)
        return jsonify({"sucesso": False, "erro": "Erro ao editar o profissional"}), 500

def meu_perfil():
    # Busca os dados do cliente ou profissional logado usando o token.
    # Necessário para o admin descobrir o id_salao sem precisar informar manualmente.
    # O front sabe se quem veio é cliente ou profissional pela presença do campo id_profissional.
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    # autenticar() devolve o id do usuário dono do token, ou None se inválido.
    id_usuario = autenticar(token)
    if not id_usuario:
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

    try:
        # "saloes!salao_associado(...)" traz o salão junto, usando a coluna salao_associado como ligação.
        # Ele chega no front como perfil.saloes (usado na aba Salão das configurações).
        resultado = (
            supabase_admin.table("profissionais")
            .select("*, saloes!salao_associado(nome_salao, endereco_salao)")
            .eq("id_profissional", id_usuario)
            .execute()
        )

        # Não é profissional: tenta como cliente.
        if not resultado.data:
            resultado = (
                supabase_admin.table("clientes")
                .select("*")
                .eq("id_cliente", id_usuario)
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

    id_profissional_pelo_token = autenticar(token) # Serve para verificar depois se o id que a pessoa está mandando, realmente é dela

    if not id_profissional_pelo_token:
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

    try:
        if id_profissional_pelo_token != id_profissional: # Verificação do id_profissional
            return jsonify({"sucesso": False, "erro": "O id mandado pela URL é diferente do id vindo do token"}), 403
        
        # Traz os dados do cliente e os serviços porque o profissional precisa saber quem vai atender e o que vai fazer.
        # Ordenado por horário para a tela mostrar os atendimentos da mesma hora na ordem certa.
        resultado = (
            supabase_admin.table("agendamentos")
            .select(
                "id_agendamento, horario, duracao_total, status, "
                "clientes(nome_cliente, email_cliente), "
                "agendamento_servicos(servicos(nome_servico))"
            )
            .eq("id_profissional", id_profissional)
            .order("horario")
            .execute()
        )

        agendamentos = []
        for ag in resultado.data or []:
            cliente = ag.get("clientes") or {}
            # Cada agendamento pode ter vários serviços
            servicos = [
                (item.get("servicos") or {}).get("nome_servico")
                for item in (ag.get("agendamento_servicos") or [])
            ]
            agendamentos.append({
                "id_agendamento": ag["id_agendamento"],
                "horario": ag["horario"],
                "duracao_total": ag.get("duracao_total"),
                "status": ag["status"],
                "cliente": cliente.get("nome_cliente"),
                "email_cliente": cliente.get("email_cliente"),
                "servicos": [s for s in servicos if s],  # descarta nomes vazios
            })

        # Horário de funcionamento do salão do profissional: a grade da agenda usa para saber quais horas mostrar
        horario_funcionamento = []
        resposta_salao = (
            supabase_admin.table("profissionais")
            .select("salao_associado")
            .eq("id_profissional", id_profissional)
            .execute()
        )
        if resposta_salao.data and resposta_salao.data[0]["salao_associado"] is not None:
            resposta_horarios = (
                supabase_admin.table("horario_funcionamento_salao")
                .select("dia_semana, hora_abertura, hora_fechamento, fechado")
                .eq("id_salao", resposta_salao.data[0]["salao_associado"])
                .order("dia_semana")
                .execute()
            )
            horario_funcionamento = resposta_horarios.data or []

        return jsonify({"sucesso": True, "agendamentos": agendamentos, "horario_funcionamento": horario_funcionamento})
    
    except Exception as e:
        return jsonify({"sucesso": False, "erro": str(e)}), 500

def agendamentos_salao():
    # A página usa esta rota somente para calcular os destaques do mês atual.
    # Busca todos os agendamentos de todos os profissionais do salão.
    # Usado na página do admin para enxergar a agenda inteira do salão.
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    id_remetente = autenticar(token)

    if not id_remetente:
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

    inicio = request.args.get("inicio")
    fim = request.args.get("fim")

    try:
        # Busca o nível e o salão de quem está pedindo (o salão vem do token, não do front)
        resposta_remetente = (
            supabase_admin.table("profissionais")
            .select("nivel_acesso, salao_associado")
            .eq("id_profissional", id_remetente)
            .execute()
        )

        if not resposta_remetente.data:
            # Cliente ou usuário sem perfil de profissional não acessa esta rota
            return jsonify({"sucesso": False, "erro": "Salão do remetente não encontrado"}), 404

        remetente = resposta_remetente.data[0]

        # Só admin (1) e gerente (2) veem agenda e preços do salão inteiro;
        # profissional (3) usa a própria rota /agendamentos/profissional
        if int(remetente["nivel_acesso"]) >= 3:
            return jsonify({"sucesso": False, "erro": "Somente administradores e gerentes podem ver a agenda do salão"}), 403

        salao_associado = remetente["salao_associado"]

        if salao_associado is None:
            return jsonify({"sucesso": False, "erro": "O remetente não está associado a um salão"}), 404
        
        # Traz dados do cliente e do profissional, pois o admin ou gerente precisa ver
        # "quem marcou" e "com quem marcou". A duração serve para a grade mostrar o horário de término.

        busca = (
            supabase_admin.table("agendamentos")
            .select("id_agendamento, horario, duracao_total, status, preco, clientes(nome_cliente), profissionais(id_profissional, nome_profissional, cargo)")
            .eq("salao_associado", salao_associado)
            .order("horario")
        )

        if inicio:
            busca = busca.gte("horario", inicio)

        if fim:
            busca = busca.lt("horario", fim)

        resultado = busca.execute()

        if resultado.data is None:
            return jsonify({
                "sucesso": False,
                "erro": "Falha ao buscar os agendamentos"
            }), 500

        return jsonify({
            "sucesso": True,
            "agendamentos": resultado.data or []
        })

    except Exception as e:
        return jsonify({"sucesso": False, "erro": str(e)}), 500

def atualizar_status_agendamento():
    STATUS_PERMITIDOS = {"confirmado", "concluido", "cancelado", "ausente", "pendente"}
    # Usado pelo profissional para confirmar, concluir, cancelar ou marcar
    # ausência em um dos próprios atendimentos.
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    id_profissional = autenticar(token)
    if not id_profissional:
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

    info = request.get_json(silent=True) or {}
    id_agendamento = info.get("id_agendamento")
    novo_status = info.get("novo_status")

    if not id_agendamento or not novo_status:
        return jsonify({"sucesso": False, "erro": "Campos ausentes: id_agendamento, novo_status"}), 400

    if novo_status not in STATUS_PERMITIDOS:
        return jsonify({"sucesso": False, "erro": f"Status inválido: {novo_status}"}), 400

    try:
        # Confere se o agendamento realmente pertence a este profissional,
        # pra impedir que ele altere o atendimento de outra pessoa.
        resultado_agendamento = (
            supabase_admin.table("agendamentos")
            .select("id_agendamento, id_profissional, status, horario")
            .eq("id_agendamento", id_agendamento)
            .execute()
        )

        if not resultado_agendamento.data:
            return jsonify({"sucesso": False, "erro": "Agendamento não encontrado"}), 404

        agendamento = resultado_agendamento.data[0]

        if agendamento["id_profissional"] != id_profissional:
            return jsonify({"sucesso": False, "erro": "Este agendamento não pertence a este profissional"}), 403

        if agendamento["status"] == novo_status:
            return jsonify({"sucesso": False, "erro": "A requisição selecionou o status atual do agendamento, apenas outros status são permitidos"}), 400

        horario_atual = datetime.now()

        if horario_atual < agendamento["horario"] and novo_status in ["concluido", "ausente"]:
            return jsonify({"sucesso": False, "erro": f"O agendamento ainda não aconteceu para estar como ${novo_status}."}), 400
        
        if agendamento["status"] == "cancelado" and novo_status == "concluido":
            return jsonify({"sucesso": False, "erro": "Você não pode mudar um agendamento de cancelado para concluído"}), 400

        resposta = (
            supabase_admin.table("agendamentos")
            .update({"status": novo_status})
            .eq("id_agendamento", id_agendamento)
            .select("id_agendamento, status")
            .execute()
        )

        if not resposta.data:
            return jsonify({"sucesso": False, "erro": "Falha ao atualizar o status"}), 500

        return jsonify({"sucesso": True, "agendamento": resposta.data[0]})

    except Exception as erro:
        print("Erro ao atualizar status do agendamento:", erro)
        return jsonify({"sucesso": False, "erro": "Erro ao atualizar o status"}), 500

def cancelar_agendamento_cliente():
    STATUS_CANCELAVEIS = {"pendente", "confirmado"}
    PRAZO_CANCELAMENTO = timedelta(hours=2, minutes=30)
    # Usado pelo cliente para cancelar um dos próprios agendamentos.
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    id_cliente = autenticar(token)
    if not id_cliente:
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

    info = request.get_json(silent=True) or {}
    id_agendamento = info.get("id_agendamento")

    if not id_agendamento:
        return jsonify({"sucesso": False, "erro": "Campo ausente: id_agendamento"}), 400

    try:
        resultado_agendamento = (
            supabase_admin.table("agendamentos")
            .select("id_agendamento, id_cliente, horario, status")
            .eq("id_agendamento", id_agendamento)
            .execute()
        )

        if not resultado_agendamento.data:
            return jsonify({"sucesso": False, "erro": "Agendamento não encontrado"}), 404

        agendamento = resultado_agendamento.data[0]

        # conferindo se o agendamento realmente pertence a este cliente.
        if str(agendamento["id_cliente"]) != str(id_cliente):
            return jsonify({"sucesso": False, "erro": "Este agendamento não pertence a este cliente"}), 403

        # O status pode vir como "Pendente" ou "pendente", por isso o lower()
        if (agendamento["status"] or "") not in STATUS_CANCELAVEIS:
            return jsonify({"sucesso": False, "erro": "Só agendamentos pendentes ou confirmados podem ser cancelados"}), 400

        horario = datetime.fromisoformat(agendamento["horario"].replace("Z", "+00:00"))
        if horario.tzinfo is None:
            horario = horario.replace(tzinfo=timezone.utc)

        if horario - datetime.now(timezone.utc) < PRAZO_CANCELAMENTO:
            return jsonify({"sucesso": False, "erro": "O cancelamento só é possível até 2h30 antes do horário"}), 400

        resposta = (
            supabase_admin.table("agendamentos")
            .update({"status": "cancelado"})
            .eq("id_agendamento", id_agendamento)
            .select("id_agendamento, status")
            .execute()
        )

        if not resposta.data:
            return jsonify({"sucesso": False, "erro": "Falha ao cancelar o agendamento"}), 500

        return jsonify({"sucesso": True, "agendamento": resposta.data[0]})

    except Exception as erro:
        print("Erro ao cancelar agendamento do cliente:", erro)
        return jsonify({"sucesso": False, "erro": "Erro ao cancelar o agendamento"}), 500

def historico_cliente(id_cliente):

    # Retorna só os atendimentos CONCLUÍDOS do cliente logado, do mais recente
    # para o mais antigo. Usado na página "Histórico de atendimentos".
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    id_usuario = autenticar(token)

    if not id_usuario:
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

    # Segurança: supabase_admin ignora o RLS, então conferimos aqui que o
    # cliente só vê o PRÓPRIO histórico. Antes devolvia 200 com sucesso:false.
    if str(id_usuario) != str(id_cliente):
        return jsonify({"sucesso": False, "erro": "Acesso negado"}), 403

    try:
        resultado = (
            supabase_admin.table("agendamentos")
            # Traz o profissional e os serviços (relações via FK); o front precisa de id_agendamento e servicos
            .select(
                "id_agendamento, horario, status, preco, "
                "profissionais(nome_profissional, cargo), "
                "agendamento_servicos(servicos(nome_servico))"
            )
            .eq("id_cliente", id_cliente)
            # ilike ignora maiúscula/minúscula: pega 'Concluído' e 'concluido'
            .ilike("status", "conclu%")
            .order("horario", desc=True)
            .execute()
        )

        historico = []
        for ag in resultado.data or []:
            prof = ag.get("profissionais") or {}  # "or {}" evita erro se vier None
            # Cada agendamento pode ter vários serviços
            servicos = [
                (item.get("servicos") or {}).get("nome_servico")
                for item in (ag.get("agendamento_servicos") or [])
            ]
            historico.append({
                "id_agendamento": ag["id_agendamento"],
                "horario": ag["horario"],
                "preco": ag.get("preco"),
                "profissional": prof.get("nome_profissional"),
                "cargo": prof.get("cargo"),
                "servicos": [s for s in servicos if s],  # descarta nomes vazios
            })

        return jsonify({"sucesso": True, "historico": historico})

    except Exception as e:
        print("Erro ao buscar histórico do cliente:", e)
        return jsonify({"sucesso": False, "erro": str(e)}), 500

def buscar_horarios_salao(id_salao):
    # Qualquer usuário logado pode ler (o cliente precisa disso no formulário de agendamento)
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401
    if not autenticar(token):
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

    try:
        resposta = (
            supabase_admin.table("horario_funcionamento_salao")
            .select("dia_semana, hora_abertura, hora_fechamento, fechado")
            .eq("id_salao", id_salao)
            .order("dia_semana")
            .execute()
        )
        # Lista vazia NÃO é erro: salão que ainda não configurou os horários
        return jsonify({"sucesso": True, "horarios": resposta.data or []})
    except Exception as erro:
        print("Erro ao buscar horários do salão:", erro)
        return jsonify({"sucesso": False, "erro": "Erro ao buscar horários"}), 500

def salvar_horarios_salao():
    # Só administrador (nível 1) altera os horários do PRÓPRIO salão
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401
    id_usuario = autenticar(token)
    if not id_usuario:
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

    try:
        # O salão vem do banco (pelo token), nunca do front: evita editar salão alheio
        resp = (
            supabase_admin.table("profissionais")
            .select("nivel_acesso, salao_associado")
            .eq("id_profissional", id_usuario)
            .execute()
        )
        if not resp.data:
            return jsonify({"sucesso": False, "erro": "Perfil não encontrado"}), 404

        admin = resp.data[0]
        if int(admin["nivel_acesso"]) != 1:
            return jsonify({"sucesso": False, "erro": "Somente administradores podem editar horários"}), 403
        if admin["salao_associado"] is None:
            return jsonify({"sucesso": False, "erro": "Administrador sem salão associado"}), 404

        info = request.get_json(silent=True) or {}
        horarios = info.get("horarios")
        if not isinstance(horarios, list) or not horarios:
            return jsonify({"sucesso": False, "erro": "Campo ausente: horarios"}), 400

        linhas = []
        dias_vistos = set()
        for h in horarios:
            dia = h.get("dia_semana")
            if dia not in range(0, 7) or dia in dias_vistos:
                return jsonify({"sucesso": False, "erro": f"Dia da semana inválido ou repetido: {dia}"}), 400
            dias_vistos.add(dia)

            fechado = bool(h.get("fechado"))
            abertura = h.get("hora_abertura")
            fechamento = h.get("hora_fechamento")

            if not fechado:
                if not abertura or not fechamento:
                    return jsonify({"sucesso": False, "erro": f"Informe abertura e fechamento (dia {dia})"}), 400
                # Compara só "HH:MM" (os 5 primeiros caracteres): texto nesse formato ordena certo
                if str(abertura)[:5] >= str(fechamento)[:5]:
                    return jsonify({"sucesso": False, "erro": f"A abertura deve ser antes do fechamento (dia {dia})"}), 400

            linhas.append({
                "id_salao": admin["salao_associado"],
                "dia_semana": dia,
                # Dia fechado grava NULL nos horários
                "hora_abertura": None if fechado else abertura,
                "hora_fechamento": None if fechado else fechamento,
                "fechado": fechado,
            })

        # upsert = insere se não existe, atualiza se já existe (usa a constraint do passo 1)
        supabase_admin.table("horario_funcionamento_salao").upsert(
            linhas, on_conflict="id_salao,dia_semana"
        ).execute()

        return jsonify({"sucesso": True})

    except Exception as erro:
        print("Erro ao salvar horários do salão:", erro)
        return jsonify({"sucesso": False, "erro": "Erro ao salvar horários"}), 500

TIPOS_PAGAMENTO = {"salao_paga_profissional", "profissional_paga_salao"}

def definir_acordo_financeiro():
    # Só o administrador (nível 1) define o acordo, e só de profissionais do PRÓPRIO salão
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401
    id_usuario = autenticar(token)
    if not id_usuario:
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

    info = request.get_json(silent=True) or {}
    id_profissional = info.get("id_profissional")
    tipo = info.get("tipo_pagamento")
    valor = info.get("valor_comissao")

    if not id_profissional or not tipo or valor is None or valor == "":
        return jsonify({"sucesso": False, "erro": "Campos ausentes: id_profissional, tipo_pagamento, valor_comissao"}), 400
    if tipo not in TIPOS_PAGAMENTO:
        return jsonify({"sucesso": False, "erro": f"Tipo de pagamento inválido: {tipo}"}), 400

    # O valor chega como texto ou número; converte e valida o intervalo
    try:
        valor = float(valor)
    except (TypeError, ValueError):
        return jsonify({"sucesso": False, "erro": "valor_comissao deve ser um número"}), 400
    if not 0 <= valor <= 100:
        return jsonify({"sucesso": False, "erro": "O percentual deve estar entre 0 e 100"}), 400

    try:
        # Quem está pedindo: precisa ser nível 1
        resp_admin = (
            supabase_admin.table("profissionais")
            .select("nivel_acesso, salao_associado")
            .eq("id_profissional", id_usuario)
            .execute()
        )
        if not resp_admin.data:
            return jsonify({"sucesso": False, "erro": "Perfil não encontrado"}), 404
        admin = resp_admin.data[0]
        if int(admin["nivel_acesso"]) != 1:
            return jsonify({"sucesso": False, "erro": "Somente administradores definem o acordo financeiro"}), 403

        # O profissional alvo precisa ser do mesmo salão do admin
        resp_alvo = (
            supabase_admin.table("profissionais")
            .select("salao_associado")
            .eq("id_profissional", id_profissional)
            .execute()
        )
        if not resp_alvo.data:
            return jsonify({"sucesso": False, "erro": "Profissional não encontrado"}), 404
        # str() nos dois lados evita falso 403 por diferença de tipo
        if str(resp_alvo.data[0]["salao_associado"]) != str(admin["salao_associado"]):
            return jsonify({"sucesso": False, "erro": "Este profissional não pertence ao seu salão"}), 403

        supabase_admin.table("profissionais").update({
            "tipo_pagamento": tipo,
            "valor_comissao": valor,
        }).eq("id_profissional", id_profissional).execute()

        return jsonify({"sucesso": True})

    except Exception as erro:
        print("Erro ao definir acordo financeiro:", erro)
        return jsonify({"sucesso": False, "erro": "Erro ao salvar o acordo financeiro"}), 500   