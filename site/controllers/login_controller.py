from flask import Flask, request

def validandoUser():
    dados = request.get_json()
    print(dados)
    