import os
from flask import Flask, render_template, request
from dotenv import load_dotenv
from supabase import create_client


load_dotenv() #Carregando o .env local

url = os.getenv("SUPABASE_URL")  #Pegando a url do Supabase
key = os.getenv("SUPABASE_KEY")  #Pegando a senha do Supabase

supabase = create_client(url,key)

app = Flask(__name__)

@app.route("/", methods=['GET','POST'])
def index():
    dados = None
    if request.method == 'POST':
        dados = {
            'client_nome': request.form.get('nome'),
            'client_numero': request.form.get('numero')
        }
        print(dados['client_nome'])
        supabase.table('clientes').insert(dados).execute()
        
    return render_template('index.html')

if __name__ == '__main__':  #Faz o código rodar as rotas do Flesk
    app.run(debug=True)

