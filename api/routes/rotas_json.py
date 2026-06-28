from flask import Flask, Blueprint
from controllers.login_controller import cadastroUserCliente
from controllers.login_controller import cadastroUserGerente
from controllers.login_controller import cadastroSalao
from controllers.agendamento_controller import agendar
from controllers.admin_controller import cadastrar_profissional, agendamentos_cliente, buscar_profissional, vincular_profissional

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

@rotas_json.route("/api/agendando", methods=["POST"])
def agendamento():
    return agendar()

@rotas_json.route("/api/cadastrar/profissional", methods=["POST"])
def cadastrar_prof():
    return cadastrar_profissional()

@rotas_json.route("/api/agendamentos/cliente/<id_cliente>", methods=["GET"])
def buscar_agendamentos(id_cliente):
    return agendamentos_cliente(id_cliente)

@rotas_json.route("/api/profissionais", methods=["GET"])
def buscar_prof():
    return buscar_profissional()

@rotas_json.route("/api/vincular/profissional", methods=["PATCH"])
def vincular_prof():
    return vincular_profissional()
