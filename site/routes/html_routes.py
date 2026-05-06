from flask import Flask, render_template, Blueprint

html_routes = Blueprint('html_routes', __name__)

@html_routes.route("/")
def homepage():
    return render_template('index.html')

@html_routes.route("/login")
def login():
    return render_template('login.html')

@html_routes.route("/agendamento", methods=['POST'])
def agendamento():
    return render_template('agendamento.html')

@html_routes.route("/fim", methods=['POST'])
def fim():
    return render_template('fim.html')
