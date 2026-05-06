from flask import Flask, render_template, Blueprint
app = Flask(__name__)

json_routes = Blueprint('json_routes', __name__)