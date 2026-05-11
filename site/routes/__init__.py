from .rotas_html import rotas_html
from .rotas_json import rotas_json

def register_routes(site):
    site.register_blueprint(html_routes)
    site.register_blueprint(json_routes)
    