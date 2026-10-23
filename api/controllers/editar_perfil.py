from flask import request, jsonify
from database import supabase, supabase_admin
from controllers.autenticacao import autenticar

def editar_email():
    info = request.get_json()
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    # autenticar() devolve o id do usuário dono do token, ou None se inválido.
    id_usuario = autenticar(token)
    if not id_usuario:
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401
    
    try:
        resposta_busca = supabase_admin.table("profissionais").select("email_profissional").eq("id_profissional", id_usuario).execute()
        
        if not resposta_busca.data:
            resposta_busca = supabase_admin.table("clientes").select("email_cliente").eq("id_cliente", id_usuario).execute()
            
        if not resposta_busca.data:
            return jsonify({"sucesso": False, "erro": "Falha ao encontrar o usuário"}), 404
        
        print(info)

        print(resposta_busca.data)
        
        emailNovo = info["novoEmail"]
        
        resposta_edicao = supabase_admin.auth.admin.update_user_by_id(
            uid=id_usuario,
            attributes={
                "email": emailNovo,
                "email_confirm": True
            }
        )
        
        print("Aqui")
        
        print(resposta_edicao)
        
        return jsonify({"sucesso": True})
        
    except Exception:
        print("deu ruim")
        return jsonify({"sucesso": False, "erro": "gigante"})
        
        
def editar_senha():
    info = request.get_json()
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401

    # autenticar() devolve o id do usuário dono do token, ou None se inválido.
    id_usuario = autenticar(token)
    if not id_usuario:
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 401
    
    try:
        resultado = supabase_admin.table("profissionais").select("email_profissional").eq("id_profissional", id_usuario).execute()
        
        print(info)
    
        print(resultado.data)
        
    except Exception:
        print("deu ruim")