from flask import Flask, render_template, Blueprint
from controllers.login_controller import cadastroUser
from controllers.login_controller import cadastroUserProfissional
from controllers.agendamento_controller import agendar


rotas_json = Blueprint("rotas_json", __name__)


# Rotas de API chamadas pelo JavaScript. A regra principal fica nos controllers.
@rotas_json.route("/cadastroUser", methods=["POST"])
def validando():
    return cadastroUser()

@rotas_json.route("/profissional/cadastroUser", methods=["POST"])
def validando():
    return cadastroUserProfissional()


@rotas_json.route("/agendando", methods=["POST"])
def agendamento():
    return agendar()
