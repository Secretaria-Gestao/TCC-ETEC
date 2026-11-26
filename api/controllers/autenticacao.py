from flask import Flask, request
from database import supabase

def autenticar(tokenUser):
    # Pergunta ao Supabase Auth de quem é o token (access_token da sessão do front).
    # Devolve o id do usuário, ou None se o token for inválido ou estiver expirado.
    try:
        resposta = supabase.auth.get_user(tokenUser)
        return resposta.user.id

    except Exception as e:
        return None
