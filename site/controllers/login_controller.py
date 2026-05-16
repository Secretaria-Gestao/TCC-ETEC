from flask import Flask, jsonify, request

def cadastroUser():
    dados = request.get_json()
    return dados