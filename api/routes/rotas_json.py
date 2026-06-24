from flask import Flask, Blueprint
from controllers.login_controller import cadastroUserCliente
from controllers.login_controller import cadastroUserGerente
from controllers.login_controller import cadastroSalao
from controllers.agendamento_controller import agendar


rotas_json = Blueprint("rotas_json", __name__)


# Rotas de API chamadas pelo JavaScript. A regra principal fica nos controllers.
@rotas_json.route("/api/cadastro/cliente", methods=["POST"])
def validandoCliente():
    return cadastroUserCliente()

@rotas_json.route("/api/cadastro/gerente", methods=["POST"])
def validandoGerente():
    return cadastroUserGerente()

@rotas_json.route("/api/cadastro/salao", methods=["POST"])
def validandoSalao():
    return cadastroSalao()

@rotas_json.route("/agendando", methods=["POST"])
def agendamento():
    return agendar()
