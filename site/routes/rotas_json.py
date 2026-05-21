from flask import Flask, render_template, Blueprint
from controllers.login_controller import cadastroUser
from controllers.agendamento_controller import agendamentoUser
from controllers.agendamento_controller import agendar

rotas_json = Blueprint('rotas_json', __name__)

@rotas_json.route('/cadastroUser', methods=['POST'])
def validando():
    return cadastroUser()

@rotas_json.route('/agendando', methods=['POST'])
def agendamento():
    return agendar()

# @rotas_json.route('/agendamentoUser')
# def meio():
#     return agendamentoUser()

