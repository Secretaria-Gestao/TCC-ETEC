from flask import Flask, request
from database import supabase

def cadastroUser():
    data = request.get_json()
    supabase.table('clientes').insert(data).execute()
