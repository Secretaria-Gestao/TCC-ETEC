from flask import Flask, request, jsonify
from database import supabase

def cadastroUser():
    # Depois do Supabase Auth criar o usuario, o front envia estes dados extras
    # para manter o perfil do cliente tambem na tabela "clientes".
    data = request.get_json()
    supabase.table('clientes').insert(data).execute()
    return jsonify({'sucesso': True, 'resultado': 'Cliente cadastrado com sucesso!'})
