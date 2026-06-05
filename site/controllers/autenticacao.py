from flask import Flask, request
from database import supabase

def autenticar(tokenUser):
    try:
        resposta = supabase.auth.get_user(tokenUser)
        return resposta.user.id
        
    except Exception as e:
        return None


