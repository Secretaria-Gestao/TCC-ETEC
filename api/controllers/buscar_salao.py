from flask import request, jsonify
from database import supabase_admin
from .autenticacao import autenticar


def buscar_salao():
    info = request.json

    if "email_profissional" not in info:
        return jsonify({"sucesso": False, "erro": "falta o email do gerente"})

    try:
        email = info["email_profissional"]

        resultado = (
            supabase_admin.table("profissionais")
            .select("salao_associado, saloes(*)")
            .eq("email_profissional", email)
            .execute()
        )

        if not resultado.data[0]:
            return jsonify({"sucesso": False, "erro": "Profissional não encontrado"}), 500

        salao = resultado.data[0]["saloes"]

        if not salao:
            return jsonify({"sucesso": False, "erro": "Gerente não encontrado"}), 404

        return jsonify({"sucesso": True, "salao": salao})

    except Exception as erro:
        print(str(erro))
        return jsonify({"sucesso": False, "erro": "erro ao encontrar o salão, erro grande mesmo"}), 500


def buscar_servicos_fornecidos():
    # O token identifica quem está acessando. O id do salão nunca vem do front,
    # pois ele será descoberto pelo perfil de quem está logado.
    token = request.headers.get("Authorization", "").replace("Bearer ", "")

    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    try:

        id_administrador = autenticar(token)

        if not id_administrador:
            return jsonify({"sucesso": False, "erro": "Token inválido"}), 403

        # Além de confirmar o nível de acesso, essa busca informa qual salão
        # poderá ser consultado pelo administrador ou gerente.
        resposta_profissionais = supabase_admin.table("profissionais").select("nivel_acesso, salao_associado").eq("id_profissional", id_administrador).execute()

        if resposta_profissionais.data is None or len(resposta_profissionais.data) == 0:
            return jsonify({"sucesso": False, "erro": "Falha ao encontrar o remetente na tabela"}), 500

        remetente = resposta_profissionais.data[0]

        if int(remetente["nivel_acesso"]) >= 3:
            return jsonify({"sucesso": False, "erro": "Somente administradores e gerentes podem acessar essas informações"}), 403

        # Serviços removidos não aparecem mais. Os desativados continuam na
        # tabela para que possam ser editados ou reativados depois.
        resposta_servicos = (
            supabase_admin.table("servicos")
            .select("*")
            .eq("salao_associado", remetente['salao_associado'])
            .eq("removido", False)
            .execute()
        )

        if resposta_servicos.data is None:
            return jsonify({"sucesso": False, "erro": "Erro ao tentar buscar os serviços (culpa provável do Supabase)"}), 500

        resultado_servicos = resposta_servicos.data

        try:
            # Primeiro são buscados os profissionais do salão. Com os ids deles,
            # a tabela de associações informa quem realiza cada serviço.
            resposta_profissionais_salao = supabase_admin.table("profissionais").select("id_profissional").eq("salao_associado", remetente["salao_associado"]).execute()

            ids_profissionais = [
                profissional["id_profissional"]
                for profissional in (resposta_profissionais_salao.data or [])
            ]

            resultado_associacoes = []

            if ids_profissionais:
                resposta_associados = (
                    supabase_admin.table("profissionais_servicos")
                    .select("id_servico, id_profissional, profissionais(nome_profissional)")
                    .in_("id_profissional", ids_profissionais)
                    .execute()
                )
                resultado_associacoes = resposta_associados.data or []

        except Exception:
            return jsonify({"sucesso": False, "erro": "Falha ao se comunicar com o supabase"}), 500

        return jsonify({"sucesso": True, "servicos": resultado_servicos, "associacoes": resultado_associacoes})

    except Exception as erro:
        print(str(erro))
        return jsonify({"sucesso": False, "erro": "Erro ao buscar os serviços, erro gigante"}), 500


def criar_servicos_fornecidos():
    # Cria o serviço no salão de quem está logado. A lista de profissionais é
    # opcional, então o serviço também pode ser criado sem nenhuma associação.
    token = request.headers.get("Authorization", "").replace("Bearer ", "")

    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    info = request.get_json()

    if not info:
        return jsonify({"sucesso": False, "erro": "Informações do serviço ausentes"}), 400

    campos_necessarios = ["nome_servico", "preco_servico", "duracao"]

    for campo in campos_necessarios:
        if campo not in info or info[campo] in [None, ""]:
            return jsonify({"sucesso": False, "erro": f"Campo ausente: {campo}."}), 400

    profissionais_associados = info.get("profissionais_associados", [])

    try:
        id_administrador = autenticar(token)

        if not id_administrador:
            return jsonify({"sucesso": False, "erro": "Token inválido"}), 403

        resposta_profissionais = supabase_admin.table("profissionais").select("nivel_acesso, salao_associado").eq("id_profissional", id_administrador).execute()

        if resposta_profissionais.data is None or len(resposta_profissionais.data) == 0:
            return jsonify({"sucesso": False, "erro": "Falha ao encontrar o remetente na tabela"}), 500

        remetente = resposta_profissionais.data[0]

        if int(remetente["nivel_acesso"]) >= 3:
            return jsonify({"sucesso": False, "erro": "Somente administradores e gerentes podem criar um serviço"}), 403

        if profissionais_associados:
            # Impede que alguém associe ao serviço um profissional pertencente
            # a outro salão apenas alterando o id enviado pela requisição.
            resposta_profissionais_salao = (
                supabase_admin.table("profissionais")
                .select("id_profissional")
                .eq("salao_associado", remetente["salao_associado"])
                .in_("id_profissional", profissionais_associados)
                .execute()
            )

            if len(resposta_profissionais_salao.data) != len(profissionais_associados):
                return jsonify({"sucesso": False, "erro": "Há profissionais que não pertencem a este salão"}), 400

        # Os inputs numéricos chegam do formulário como texto. A conversão deixa
        # preço e duração no formato esperado pelas colunas do banco.
        servico_novo = {
            "nome_servico": info["nome_servico"],
            "preco_servico": float(info["preco_servico"]),
            "salao_associado": remetente["salao_associado"],
            "duracao": int(info["duracao"]),
            "em_funcionamento": True,
            "removido": False,
        }

        resposta_criar_servico = supabase_admin.table("servicos").insert(servico_novo).execute()

        if resposta_criar_servico.data is None or len(resposta_criar_servico.data) == 0:
            return jsonify({"sucesso": False, "erro": "Falha ao criar o serviço novo"}), 500

        if profissionais_associados:
            id_servico = resposta_criar_servico.data[0]["id_servico"]

            # A tabela profissionais_servicos liga cada profissional ao serviço
            # que acabou de ser criado.
            for id_profissional in profissionais_associados:
                supabase_admin.table("profissionais_servicos").insert({
                    "id_profissional": id_profissional,
                    "id_servico": id_servico,
                }).execute()

        return jsonify({"sucesso": True})

    except Exception as erro:
        print(erro)
        return jsonify({"sucesso": False, "erro": "Erro ao criar o serviço"}), 500


def editar_servicos_fornecidos():
    # Edita os dados, o status ativo/desativado e as associações do serviço.
    token = request.headers.get("Authorization", "").replace("Bearer ", "")

    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    info = request.get_json()

    if not info:
        return jsonify({"sucesso": False, "erro": "Informações do serviço ausentes"}), 400

    campos_necessarios = ["id_servico", "nome_servico", "preco_servico", "duracao", "em_funcionamento"]

    for campo in campos_necessarios:
        if campo not in info or info[campo] in [None, ""]:
            return jsonify({"sucesso": False, "erro": f"Campo ausente: {campo}."}), 400

    profissionais_associados = info.get("profissionais_associados", [])

    try:
        id_administrador = autenticar(token)

        if not id_administrador:
            return jsonify({"sucesso": False, "erro": "Token inválido"}), 403

        resposta_profissionais = supabase_admin.table("profissionais").select("nivel_acesso, salao_associado").eq("id_profissional", id_administrador).execute()

        if not resposta_profissionais.data:
            return jsonify({"sucesso": False, "erro": "Falha ao encontrar o remetente na tabela"}), 500

        remetente = resposta_profissionais.data[0]

        if int(remetente["nivel_acesso"]) >= 3:
            return jsonify({"sucesso": False, "erro": "Somente administradores e gerentes podem editar um serviço"}), 403

        # O filtro pelo id do salão evita que um administrador edite um serviço
        # de outro estabelecimento.
        resposta_servico = (
            supabase_admin.table("servicos")
            .select("id_servico")
            .eq("id_servico", info["id_servico"])
            .eq("salao_associado", remetente["salao_associado"])
            .eq("removido", False)
            .execute()
        )

        if not resposta_servico.data:
            return jsonify({"sucesso": False, "erro": "Serviço não encontrado neste salão"}), 404

        if profissionais_associados:
            # A mesma proteção da criação é repetida porque as associações podem
            # ser alteradas durante a edição.
            resposta_profissionais_salao = (
                supabase_admin.table("profissionais")
                .select("id_profissional")
                .eq("salao_associado", remetente["salao_associado"])
                .in_("id_profissional", profissionais_associados)
                .execute()
            )

            if len(resposta_profissionais_salao.data) != len(profissionais_associados):
                return jsonify({"sucesso": False, "erro": "Há profissionais que não pertencem a este salão"}), 400

        servico_atualizado = {
            "nome_servico": info["nome_servico"],
            "preco_servico": float(info["preco_servico"]),
            "duracao": int(info["duracao"]),
            "em_funcionamento": info["em_funcionamento"],
        }

        # em_funcionamento recebe True ou False. False desativa o serviço sem
        # removê-lo, permitindo que seja reativado futuramente.
        resposta_editar = (
            supabase_admin.table("servicos")
            .update(servico_atualizado)
            .eq("id_servico", info["id_servico"])
            .eq("salao_associado", remetente["salao_associado"])
            .eq("removido", False)
            .execute()
        )

        if not resposta_editar.data:
            return jsonify({"sucesso": False, "erro": "Falha ao editar o serviço"}), 500

        # As associações antigas são apagadas e a seleção atual do formulário é
        # cadastrada novamente. Uma lista vazia deixa o serviço sem profissional.
        supabase_admin.table("profissionais_servicos").delete().eq("id_servico", info["id_servico"]).execute()

        for id_profissional in profissionais_associados:
            supabase_admin.table("profissionais_servicos").insert({
                "id_profissional": id_profissional,
                "id_servico": info["id_servico"],
            }).execute()

        return jsonify({
            "sucesso": True,
            "em_funcionamento": info["em_funcionamento"],
        })

    except Exception as erro:
        print(erro)
        return jsonify({"sucesso": False, "erro": "Erro ao editar o serviço"}), 500


def deletar_servicos_fornecidos():
    # A remoção é lógica: o registro permanece no banco com removido=True,
    # mas deixa de aparecer na tela de gerenciamento.
    token = request.headers.get("Authorization", "").replace("Bearer ", "")

    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    info = request.get_json()

    if not info or "ids_servicos" not in info or not info["ids_servicos"]:
        return jsonify({"sucesso": False, "erro": "Faltou os ids dos serviços selecionados, ou nem foram selecionados"}), 400

    ids_servicos = info["ids_servicos"]

    try:
        id_administrador = autenticar(token)

        if not id_administrador:
            return jsonify({"sucesso": False, "erro": "Token inválido"}), 403

        resposta_profissionais = supabase_admin.table("profissionais").select("nivel_acesso, salao_associado").eq("id_profissional", id_administrador).execute()

        if not resposta_profissionais.data:
            return jsonify({"sucesso": False, "erro": "Falha ao encontrar o remetente na tabela"}), 500

        remetente = resposta_profissionais.data[0]

        if int(remetente["nivel_acesso"]) >= 3:
            return jsonify({"sucesso": False, "erro": "Somente administradores e gerentes podem remover um serviço"}), 403

        # Todos os ids são conferidos antes da alteração para impedir que um
        # usuário remova serviços pertencentes a outro salão.
        for id_servico in ids_servicos:
            resposta_servico = (
                supabase_admin.table("servicos")
                .select("salao_associado")
                .eq("id_servico", id_servico)
                .execute()
            )

            if not resposta_servico.data:
                return jsonify({"sucesso": False, "erro": "Serviço não encontrado"}), 404

            if resposta_servico.data[0]["salao_associado"] != remetente["salao_associado"]:
                return jsonify({"sucesso": False, "erro": "Há serviços que não pertencem a este salão"}), 403

        resposta_remover = (
            supabase_admin.table("servicos")
            .update({"removido": True})
            .in_("id_servico", ids_servicos)
            .eq("salao_associado", remetente["salao_associado"])
            .eq("removido", False)
            .execute()
        )

        if resposta_remover.data is None or len(resposta_remover.data) == 0:
            return jsonify({"sucesso": False, "erro": "Falha em remover algum serviço..."}), 500

        return jsonify({"sucesso": True})

    except Exception as erro:
        print(erro)
        return jsonify({"sucesso": False, "erro": "Erro ao remover os serviços"}), 500
