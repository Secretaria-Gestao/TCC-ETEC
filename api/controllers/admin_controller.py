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

    id_gerente = autenticar(token)

    if not id_gerente:
        return jsonify({"sucesso": False, "erro": "Token não autorizado"}), 401

    try:

        resultado_gerente = supabase_admin.table("profissionais").select("nivel_acesso, salao_associado").eq("id_profissional", id_gerente).execute()

        if not resultado_gerente.data:
            return jsonify({"sucesso": False, "erro": "Não foi possível encontrar o gerente na tabela de profissionais"}), 404

        gerente = resultado_gerente.data[0]

        if int(gerente["nivel_acesso"]) >= 3:
            return jsonify({"sucesso": False, "erro": "Somente administradores e gerentes podem cadastrar um profissional"}), 403

        email_profissional = info["email"].strip().lower()

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
            "nivel_acesso": info["nivel_acesso"],
            "salao_associado": gerente["salao_associado"]
        }).execute()
        
        return jsonify({"sucesso": True, "resultado": "Profissional cadastrado com sucesso!"})

    except Exception as e:
        if id_profissional:
            try: # Usa um try aqui porque até esse delete pode dar erro
                supabase_admin.auth.admin.delete_user(id_profissional)

            except Exception as erro_exclusao:
                print("Erro ao excluir usuário incompleto:", erro_exclusao)

        return jsonify({"sucesso": False, "erro": str(e)}), 500

def agendamentos_cliente(id_cliente):
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    id_cliente_pelo_token = autenticar(token) # Serve para verificar depois se o id que a pessoa está mandando, realmente é dela

    if not id_cliente_pelo_token:
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

    try:
        if id_cliente_pelo_token != id_cliente: # Verificação do id_cliente
            return jsonify({"sucesso": False, "erro": "O id mandado pela URL é diferente do id vindo do token"})

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
                "telefone_profissional, cargo, nivel_acesso, status, criado_em, foto_url"
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

        if int(remetente["nivel_acesso"]) >= 3:
            return jsonify({"sucesso": False, "erro": "Somente administradores e gerentes podem remover um profissional"}), 403

        resposta_profissional = (
            supabase_admin.table("profissionais")
            .select("id_profissional, salao_associado")
            .eq("id_profissional", id_profissional)
            .eq("removido", False)
            .execute()
        )

        if not resposta_profissional.data:
            return jsonify({"sucesso": False, "erro": "Profissional não encontrado"}), 404

        profissional = resposta_profissional.data[0]

        if profissional["salao_associado"] != remetente["salao_associado"]:
            return jsonify({"sucesso": False, "erro": "O profissional não pertence a este salão"}), 403

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
            .select("id_profissional, email_profissional, salao_associado")
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

        if not nome_profissional or not email_profissional or not cargo:
            return jsonify({"sucesso": False, "erro": "Nome, e-mail e cargo não podem ficar vazios"}), 400

        # O e-mail de login fica no Auth e também na tabela de perfil.
        if email_profissional != profissional["email_profissional"]:
            supabase_admin.auth.admin.update_user_by_id(
                info["id_profissional"],
                {"email": email_profissional, "email_confirm": True},
            )

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

    id_profissional_pelo_token = autenticar(token) # Serve para verificar depois se o id que a pessoa está mandando, realmente é dela

    if not id_profissional_pelo_token:
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

    try:
        if id_profissional_pelo_token != id_profissional: # Verificação do id_profissional
            return jsonify({"sucesso": False, "erro": "O id mandado pela URL é diferente do id vindo do token"})
        
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
        # Usado só para para pegar o salao do admin, confiando apenas no supabase
        resposta_remetente = supabase_admin.table("profissionais").select("salao_associado").eq("id_profissional", id_remetente).execute()

        if not resposta_remetente.data:
            return jsonify({"sucesso": False, "erro": "Salão do remetente não encontrado"}), 404

        salao_associado = resposta_remetente.data[0]["salao_associado"]

        # Traz dados do cliente e do profissional, pois o admin precisa ver
        # "quem marcou" e "com quem marcou".

        busca = (
            supabase_admin.table("agendamentos")
            .select("id_agendamento, horario, status, preco, clientes(nome_cliente), profissionais(id_profissional, nome_profissional, cargo)")
            .eq("salao_associado", salao_associado)
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
