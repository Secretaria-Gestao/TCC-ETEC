# Bibliotecas necessarias (se for tentar mexer no python e testar o funcionamento)
from flask import Flask
from routes import register_routes

# Ponto de entrada do Flask: aqui o app nasce e recebe as rotas do projeto.
app = Flask(__name__)

# As rotas ficam separadas na pasta routes para manter o main.py simples.
register_routes(app)

if __name__ == "__main__":  # Faz o código rodar as rotas do Flesk
    app.run(debug=True)
