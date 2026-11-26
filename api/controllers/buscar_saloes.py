from flask import request, jsonify
from database import supabase_admin
from .autenticacao import autenticar

def buscar_saloes():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    if not autenticar(token):
        # 401 é o código certo para token inválido (antes era 400)
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401

    try:
        # 1) Só as colunas que a tela usa (sem id_dono, slug etc.)
        #    e só salões que NÃO foram excluídos
        resposta = (
            supabase_admin.table("saloes")
            .select("id_salao, nome_salao, endereco_salao")
            .eq("removido", False)
            .execute()
        )

        # 2) Descobre quais salões têm pelo menos um profissional ativo.
        #    Na tabela profissionais a coluna do salão é salao_associado.
        profs = (
            supabase_admin.table("profissionais")
            .select("salao_associado")
            .eq("removido", False)
            .eq("status", True)
            .execute()
        )
        ids_com_prof = {p["salao_associado"] for p in (profs.data or [])}

        # 3) Mantém só os salões com profissional
        saloes = [s for s in (resposta.data or []) if s["id_salao"] in ids_com_prof]

        # Lista vazia NÃO é erro: devolve sucesso com [] e o front
        # mostra "Nenhum salão disponível no momento."
        return jsonify({"sucesso": True, "saloes": saloes})

    except Exception as erro:
        print("Erro ao buscar salões:", erro)
        return jsonify({"sucesso": False, "erro": "Erro ao buscar salões"}), 500