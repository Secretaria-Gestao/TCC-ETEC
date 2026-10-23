from flask import request, jsonify
from supabase import create_client
from dotenv import load_dotenv
import os


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

    tabela_certa = ""
    email_novo = info["novoEmail"].strip().lower()
    
    try:
        resposta_busca = supabase_admin.table("profissionais").select("email_profissional").eq("id_profissional", id_usuario).execute()
        
        if not resposta_busca.data:
            resposta_busca = supabase_admin.table("clientes").select("email_cliente").eq("id_cliente", id_usuario).execute()

            if not resposta_busca.data:
                return jsonify({"sucesso": False, "erro": "Falha ao encontrar o usuário"}), 404
            else:
                tabela_certa = "clientes"
                tipo_email = "email_cliente"

        else:
            tabela_certa = "profissionais"
            tipo_email = "email_profissional"

        email_antigo = resposta_busca.data[0][tipo_email]
            
        
        resposta_auth = supabase_admin.auth.admin.update_user_by_id(
            uid=id_usuario,
            attributes={
                "email": email_novo,
                "email_confirm": True
            }
        )
        
        resposta_tabela = supabase_admin.table(tabela_certa).update({ tipo_email: email_novo}).eq(tipo_email, email_antigo).execute()

        if not resposta_tabela.data:
            resposta_auth = supabase_admin.auth.admin.update_user_by_id(
                uid=id_usuario,
                attributes={
                    "email": email_antigo,
                    "email_confirm": True
                }
            )
            return jsonify({"sucesso": False, "erro": "Falha ao atualizar o Email."}), 404
        
        return jsonify({"sucesso": True})
        
    except Exception:
        print("deu ruim")
        return jsonify({"sucesso": False, "erro": "Falha ao atualizar o Email."}), 404
        
