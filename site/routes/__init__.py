from .html_routes import html_routes
from .json_routes import json_routes

def register_routes(app):
    app.register_blueprint(html_routes)
    app.register_blueprint(json_routes)
    