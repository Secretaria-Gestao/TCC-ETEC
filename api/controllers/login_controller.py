from flask import Flask, request, jsonify
from database import supabase

def cadastroUserCliente():
    # Depois do Supabase Auth criar o usuario, o front envia estes dados extras
    # para manter o perfil do cliente tambem na tabela "clientes".

    data = request.get_json()
    supabase.table('clientes').insert(data).execute()

    return jsonify({'sucesso': True, 'resultado': 'Cliente cadastrado com sucesso!'})

def cadastroSalao():
    # Antes do Supabase criar a conta do gerente, cria-se o salao

    data = request.get_json()

    print(data)

    resposta = supabase.table('saloes').insert(data).execute()

    id_salao = resposta.data[0]['id_salao']

    return jsonify({'sucesso': True, 'resultado': 'Cliente cadastrado com sucesso!', 'id_salao': id_salao})

def cadastroUserGerente():
    # Depois do Supabase Auth criar o usuario, o front envia estes dados extras
    # para manter o perfil do profissional tambem na tabela "profissionais".

    data = request.get_json()

    print(data)

    supabase.table('profissionais').insert(data).execute()

    return jsonify({'sucesso': True, 'resultado': 'Profissional cadastrado com sucesso!'})

