from flask import Flask, render_template, Blueprint
from controllers.login_controller import cadastroUser
from controllers.agendamento_controller import agendamentoUser

rotas_json = Blueprint('rotas_json', __name__)

@rotas_json.route('/cadastroUser', methods=['POST'])
def inicio():
    return cadastroUser()

@rotas_json.route('/agendamentoUser')
def meio():
    return agendamentoUser()