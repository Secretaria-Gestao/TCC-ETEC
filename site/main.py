# Bibliotecas necessarias (se for tentar mexer no python e testar o funcionamento)
import os
from flask import Flask
from dotenv import load_dotenv
from supabase import create_client
from routes import register_routes

load_dotenv() # Carregando o .env local 

url = os.getenv("SUPABASE_URL")  # Pegando a url do Supabase 
key = os.getenv("SUPABASE_KEY")  # Pegando a senha do Supabase

# Importante: precisa do arquivo ".env" na pasta do projeto com a key e o url do supabase para fazer funcionar o main.py (se for rodar com Flask)
# No .env fica tipo SUPABASE_URL=url.com.br (o link e senha do supabase tá no render) 
supabase = create_client(url,key)

app = Flask(__name__)

register_routes(app)

if __name__ == '__main__':  # Faz o código rodar as rotas do Flesk
    app.run(debug=True)
