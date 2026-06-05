import os
from dotenv import load_dotenv
from supabase import create_client

# Carrega as credenciais locais antes de criar o client do Supabase.
load_dotenv()  # Carregando o .env local

url = os.getenv("SUPABASE_URL")  # Pegando a url do Supabase
key = os.getenv("SUPABASE_KEY")  # Pegando a senha do Supabase

# Importante: precisa do arquivo ".env" na pasta do projeto com a key e o url do supabase para fazer funcionar o main.py (se for rodar com Flask)
# No .env fica tipo SUPABASE_URL=url.com.br (o link e senha do supabase tá no render)
# Esse client e importado pelos controllers sempre que precisam ler/gravar dados.
supabase = create_client(url, key)
