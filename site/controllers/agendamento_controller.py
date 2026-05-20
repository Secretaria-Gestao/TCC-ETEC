from flask import Flask, request, jsonify
from database import supabase

def agendamentoUser():
    info = request.get_json()
    if not info:
        return jsonify({ 'Erro': 'Dados inválidos.'}), 400
    
    try:
        user = supabase.table('clientes').select('id_cliente').eq('id_cliente', info.user.id).execute()

        if user:
            return jsonify({ 'resultado': 'Token valido.'})
            print('Deu certo o token')
        else:
            return jsonify({ 'resultado': 'Token invalido.'})
            print('Deu errado o token')
        
    except:
        print('Deu erro galera')
        
        
def agendar():
    info = request.get_json()
    
    print(info)