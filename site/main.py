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

@app.route("/", methods=['GET','POST'])
def comeco():   # Definindo a rota principal do site (homepage/login)
    cliente = None

    if request.method == 'POST':
        
        cliente = { # Captura os dados digitados no formulário do index.html
            'client_nome': request.form.get('nome'), 
            'client_numero': request.form.get('numero')
        }

        # Insere o novo cliente na tabela 'clientes' e recebe a resposta com os dados
        resposta = supabase.table('clientes').insert(cliente).execute()

        print(resposta) # Mostra o retorno do banco no terminal para testes

        client_id = resposta.data[0]['client_id'] # Extrai o ID do cliente que o banco acabou de gerar
        
        return render_template('agendamento.html', dados = cliente, client_id = client_id) # Fazendo a pessoa ir pro site agendamento.html
        
    else:
        return render_template('index.html')

@app.route("/fim", methods=['GET','POST']) # Definindo rota do agendamento para o fim do agendamento
def termino(): 
    agendamento = None

    if request.method == 'POST':
        # Resgata os dados de data e hora digitados
        data = request.form.get('data')
        horario = request.form.get('horario')

        profissional_escolhido = request.form.get('profissional') 

        # Se o profissional existir na tabela, vai ficar salvado na variavel 
        profissional = (
            supabase.table('profissionais')
            .select('*')
            .eq('profissional_nome', profissional_escolhido)
            .execute()
        )

        
        agendamento = { 
            'servico': request.form.get('servico'),
            'horario': f"{data} {horario}:00", # Adiciona :00 para o banco aceitar o formato de tempo
            'client_id': request.form.get('client_id'), #
            'profissional_id': profissional.data[0]['profissional_id']
        }

        checagem_agendamento = (
            supabase.table('agendamentos')
            .select('horario')
            .eq('horario', agendamento['horario'])
            .eq('profissional_id', agendamento['profissional_id'])
            .execute()
        )

        print(checagem_agendamento)

        conclusao = ""

        if not checagem_agendamento.data:
            supabase.table('agendamentos').insert(agendamento).execute() # Salva o agendamento no supabase
            conclusao = "O seu agendamento foi concluido!"
            return render_template('fim.html', conclusao = conclusao)

        else:
            conclusao = "Não foi possível continuar com o seu agendamento. Este horário já foi selecionado para esse profissional."
            return render_template('agendamento.html', conclusao = conclusao)

    else:   
        return render_template('index.html')

if __name__ == '__main__':  # Faz o código rodar as rotas do Flesk
    app.run(debug=True)
