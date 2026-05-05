from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def homepage():
    return render_template('index.html')

@app.route("/login")
def login():
    return render_template('login.html')

@app.route("/agendamento", methods=['POST'])
def agendamento():
    return render_template('agendamento.html')

@app.route("/fim", methods=['POST'])
def fim():
    return render_template('fim.html')
