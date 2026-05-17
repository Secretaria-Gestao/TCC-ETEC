# Bibliotecas necessarias (se for tentar mexer no python e testar o funcionamento)
from flask import Flask
from routes import register_routes

app = Flask(__name__)

register_routes(app)

if __name__ == '__main__':  # Faz o código rodar as rotas do Flesk
    app.run(debug=True)
