from flask import Flask, request, jsonify
from database import supabase

def agendamentoUser():
    data = request.get_json()
    if not data:
        return jsonify({ 'erro': 'Dados inválidos'}), 400
    
    try:
        supabase.auth.get_user()