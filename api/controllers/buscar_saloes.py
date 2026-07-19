from flask import request, jsonify
from database import supabase_admin
from .autenticacao import autenticar

def buscar_saloes():
    token = request.headers.get("Authorization", "").replace("Bearer ", "")
    if not token:
        return jsonify({"sucesso": False, "erro": "Token ausente"}), 401
    
    if not autenticar(token):
        return jsonify({"sucesso": False, "erro": "Token inválido"}), 400

    resposta = supabase_admin.table("saloes").select("*").execute()

    if not resposta.data:
        return jsonify({"sucesso": False, "erro": "Falha ao encontrar salões"}), 500
        
    return jsonify({"sucesso": True, "saloes": resposta.data})
