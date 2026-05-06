from flask import Flask, render_template, Blueprint
from ..controllers.login_controller import validandoUser
app = Flask(__name__)

json_routes = Blueprint('json_routes', __name__)

json_routes.route('/validacaoUser', methods=['POST'])
def validacaoUser():
    return validandoUser()