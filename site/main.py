from flask import Flask, render_template, request

import os
from dotenv import load_dotenv

load_dotenv()

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")


app = Flask(__name__)


@app.route("/", methods=['GET','POST'])
def index():
    dados = None
    if request.method == 'POST':
        dados = {
            'nome': request.form.get('nome'),
            'numero': request.form.get('numero')
        }
        
        
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True)

