#Bibliotecas necessarias (se for tentar mexer no python e testar o funcionamento )
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

def comeco():   # Definindo a rota principal do site (homepage/login)
    cliente = None

    if request.method == 'POST':
        cliente = {
            'client_nome': request.form.get('nome'),
            'client_numero': request.form.get('numero')
        }

        resposta = supabase.table('clientes').insert(cliente).execute()

        print(resposta)

        client_id = resposta.data[0]['client_id']

        return render_template('agendamento.html', dados = cliente, client_id = client_id) # levando a pessoa para parte de agendamento 

    else:
        return render_template('index.html')

@app.route("/fim", methods=['GET','POST']) #Definindo rota do agendamento para o "fim"
def termino(): 
    agendamento = None

    if request.method == 'POST':
        data = request.form.get('data')
        horario = request.form.get('horario')

        profissional_escolhido = request.form.get('profissional') #pego o nome de qual profissional a pessoa escolheu

        profissional = supabase.table('profissionais').select('*').eq('profissional_nome', profissional_escolhido).execute() #se existir na tabela, vai ficar salvado na variavel 
        print(profissional)

        agendamento = {
            'servico': request.form.get('servico'),
            'horario': f"{data} {horario}:00",
            'client_id': request.form.get('client_id'),
            # 'profissional_id': profissional[0]['profissional_id']
        }

        

        supabase.table('agendamentos').insert(agendamento).execute()
        return render_template('fim.html')

    else:
        return render_template('index.html')


if __name__ == '__main__':  #Faz o código rodar as rotas do Flesk
    app.run(debug=True)

