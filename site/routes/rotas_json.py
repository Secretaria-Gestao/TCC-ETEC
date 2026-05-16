from flask import Flask, render_template, Blueprint
from controllers.login_controller import cadastroUser
app = Flask(__name__)

rotas_json = Blueprint('rotas_json', __name__)


@rotas_json.route('/cadastroUser', methods=['POST'])
def inicio():
    return cadastroUser()