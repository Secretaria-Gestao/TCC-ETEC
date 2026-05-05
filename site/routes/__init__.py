from .html_routes import html_routes
from .json_routes import json_routes

def register_routes(rota):
    rota.register_blueprint(html_routes)
    rota.register_blueprint(json_routes)
    