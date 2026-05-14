from flask import Flask, render_template, Blueprint

rotas_html = Blueprint('rotas_html', __name__)

@rotas_html.route("/")
def homepage():
    return render_template('index.html')

@rotas_html.route("/login")
def login():
    return render_template('login.html')

@rotas_html.route("/agendamento")
def agendamento():
    return render_template('agendamento.html')

@rotas_html.route("/fim", methods=['POST'])
def fim():
    return render_template('fim.html')
