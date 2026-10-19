from flask import Flask, request, jsonify
from database import supabase
import re
import unicodedata
import uuid

def cadastroUserCliente():
    # Depois do Supabase Auth criar o usuario, o front envia estes dados extras
    # para manter o perfil do cliente tambem na tabela "clientes".

    data = request.get_json()
    supabase.table('clientes').insert(data).execute()

    return jsonify({'sucesso': True, 'resultado': 'Cliente cadastrado com sucesso!'})

#Nova função para gerar slug a partir do nome do salão, removendo acentos e caracteres especiais
def gerar_slug(nome):
    #Remove os acentos e caracteres especiais do nome do salão
    sem_acento = unicodedata.normalize('NFKD', nome).encode('ascii', 'ignore').decode('ascii')

    #Minusculas e sequencias de caracteres sem ser letras ou numeros são substituídas por hífen
    slug = re.sub(r'[^a-z0-9]+', '-', sem_acento.lower()).strip('-')

    return slug or 'salao' #garante que o slug não seja vazio, caso o nome do salão seja apenas caracteres especiais

def cadastroSalao():
    # Antes do Supabase criar a conta do gerente, cria-se o salao

    data = request.get_json()

    # Gera o slug do salão a partir do nome do salão
    data['slug'] = f"{gerar_slug(data['nome_salao'])}-{uuid.uuid4().hex[:4]}"  # Adiciona um sufixo único para evitar duplicatas

    resposta = supabase.table('saloes').insert(data).execute()

    id_salao = resposta.data[0]['id_salao']

    return jsonify({'sucesso': True, 'resultado': 'Cliente cadastrado com sucesso!', 'id_salao': id_salao})

def cadastroUserGerente():
    # Depois do Supabase Auth criar o usuario, o front envia estes dados extras
    # para manter o perfil do profissional tambem na tabela "profissionais".

    data = request.get_json()

    supabase.table('profissionais').insert(data).execute()

    return jsonify({'sucesso': True, 'resultado': 'Profissional cadastrado com sucesso!'})
