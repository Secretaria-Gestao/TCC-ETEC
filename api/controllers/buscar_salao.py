from flask import request, jsonify
from database import supabase_admin

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
            return jsonify({"sucesso": False, "erro": "Profissional não encontrado"})
        
        salao = resultado.data[0]['saloes']

        if not salao:
            return jsonify({"sucesso": False, "erro": "Gerente não encontrado"}), 404
    
        return jsonify({"sucesso": True, "salao": salao})
        
        
    except Exception as erro:
        return jsonify({"sucesso": False,"erro": str(erro)}), 500
    
