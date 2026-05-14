from flask import Flask, render_template, Blueprint
from controllers.login_controller import validandoUser
app = Flask(__name__)

rotas_json = Blueprint('rotas_json', __name__)

@rotas_json.route('/validacaoUser', methods=['POST'])
def inicio():
    return validandoUser()