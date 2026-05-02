# Bibliotecas necessarias (se for tentar mexer no python e testar o funcionamento)
import os
from flask import Flask, render_template, request
from dotenv import load_dotenv
from supabase import create_client

load_dotenv() # Carregando o .env local 

url = os.getenv("SUPABASE_URL")  # Pegando a url do Supabase 
key = os.getenv("SUPABASE_KEY")  # Pegando a senha do Supabase

# Importante: precisa do arquivo ".env" na pasta do projeto com a key e o url do supabase para fazer funcionar o main.py (se for rodar com Flask)
# No .env fica tipo SUPABASE_URL=url.com.br (o link e senha do supabase tá no render) 
supabase = create_client(url,key)

app = Flask(__name__)

@app.route("/", methods=['GET'])
def homepage():
    return render_template('index.html')

@app.route("/login")
def login():
    return render_template('login.html')

@app.route("/agendamento", methods=['POST'])
def agendamento():
    cliente = None

    cliente = {
        'client_nome': request.form.get('nome'),
        'client_email': request.form.get('email')
    }

    checagem_client = supabase.table('clientes').select('client_email').eq('client_email', cliente['client_email'])

    print(cliente['client_nome'])

    return render_template('agendamento.html')

@app.route("/fim", methods=['POST'])
def fim():
    return render_template('fim.html')

if __name__ == '__main__':  # Faz o código rodar as rotas do Flesk
    app.run(debug=True)
