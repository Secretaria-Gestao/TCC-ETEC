from flask import Flask, request, jsonify
from database import supabase

def cadastroUserCliente():
    # Depois do Supabase Auth criar o remetente, o front envia estes dados extras
    # para manter o perfil do cliente tambem na tabela "clientes".

    data = request.get_json()
    supabase.table('clientes').insert(data).execute()

    return jsonify({'sucesso': True, 'resultado': 'Cliente cadastrado com sucesso!'})

def cadastroUserGerente():
    # Depois do Supabase Auth criar o remetente, o front envia estes dados extras
    # para manter o perfil do profissional tambem na tabela "profissionais".

    dados = request.get_json() or {}
    id_salao = None

    campos_faltando = []
    campos_necessarios = ["nome_profissional", "telefone_profissional", "nome_salao", "categoria", "endereco"]
    
    for campo in campos_necessarios:
        if not dados.get(campo):
            campos_faltando.append(campo)

    if campos_faltando:
        return jsonify({"sucesso": False, "erro": f"Campos ausentes: {' - '.join(campos_faltando)}."}), 400

    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    
    if not token:
            return jsonify({"sucesso": False, "erro": "Token ausente"}), 401
    
   
    # Cadastro do salão antes do cadastro do gerente
    
    try:
        
        resposta_auth = supabase.auth.get_user(token)
        remetente = resposta_auth.user
       
        if not remetente:
            return jsonify({
                "sucesso": False,
                "erro": "Token não autorizado"
            }), 401
            
        resposta_profissionais = supabase.table("profissionais").select("id_profissional").eq("id_profissional", remetente.id).execute()
        
        if resposta_profissionais.data:
            return jsonify({"sucesso": False, "erro": "A Conta já existe" }), 409
        
        resposta_clientes = supabase.table("clientes").select("id_cliente").eq("id_cliente", remetente.id).execute()
        
        if resposta_clientes.data:
            return jsonify({"sucesso": False, "erro": "A Conta já existe" }), 409
        
        
        resposta_salao = supabase.table("saloes").insert({
                "nome_salao": dados["nome_salao"],
                "categoria_salao": dados["categoria"],
                "endereco_salao": dados["endereco"]
            }).select("id_salao").execute()
            
        if not resposta_salao.data:
            return jsonify({"sucesso": False, "erro": "Erro em cadastrar o salão" }), 500
        
        id_salao = resposta_salao.data[0]["id_salao"]
        
        # Cadastro do gerente
        
        resposta_gerente = supabase.table("profissionais").insert({
            "id_profissional": remetente.id,
            "nome_profissional": dados["nome_profissional"],
            "telefone_profissional": dados["telefone_profissional"],
            "email_profissional": remetente.email,
            "salao_associado": id_salao,
            "cargo": "gerente",
            "nivel_acesso": 1,
            "status": True,
            "removido": False,
        }).select("id_profissional").execute()
        
        if not resposta_gerente.data:
            try:
                if id_salao is not None:
                    supabase.table("saloes").delete().eq("id_salao", id_salao).execute()
                    
            except Exception:
                return jsonify({"sucesso": False, "erro": "Os servidores estão instáveis no momento, tente novamente mais tarde"}), 500

            return jsonify({ "sucesso": False, "erro": "Erro ao cadastrar o gerente"}), 500
    
    
        return jsonify({'sucesso': True, 'resultado': 'Profissional cadastrado com sucesso!'})
        
    except Exception:
        try:
            if id_salao is not None:
                supabase.table("saloes").delete().eq("id_salao", id_salao).execute()
        except Exception:
            return jsonify({"sucesso": False, "erro": "Os servidores estão instáveis no momento, tente novamente mais tarde"}), 500
        
        return jsonify({"sucesso": False, "erro": "Deu muito ruim ao cadastrar..."}), 500
    
    
