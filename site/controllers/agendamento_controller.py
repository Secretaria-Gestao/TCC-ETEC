from flask import Flask, request, jsonify
from database import supabase

def agendamentoUser():
    # Fluxo de validacao do usuario pelo token/id recebido do front.
    # Hoje esta separado do agendamento principal para poder evoluir depois.
    info = request.get_json()
    if not info:
        return jsonify({ 'Erro': 'Dados inválidos.'}), 400
    
    try:
        user = supabase.table('clientes').select('id_cliente').eq('id_cliente', info['user']['id']).execute()

        if user:
            print('Deu certo o token')
            return jsonify({ 'resultado': 'Token valido.'})
            
        else:
            print('Deu errado o token')
            return jsonify({ 'resultado': 'Token invalido.'})
            
        
    except:
        print('Deu erro galera')
        
        
def agendar():
    # Endpoint usado pela tela de agendamento para gravar o horario no Supabase.
    info = request.get_json()
    print('Dados recebidos:', info)

    # Garante que o front mandou tudo que a tabela precisa receber.
    campos_necessarios = ['id_cliente', 'servicos', 'profissional', 'data_hora']
    for campo in campos_necessarios:
        if campo not in info:
            return jsonify({'sucesso': False, 'erro': f'Campo ausente: {campo}'}), 400

    try:
        # Mapeia os nomes usados no JavaScript para os nomes das colunas no banco.
        novo_agendamento = {
            'id_cliente':   info['id_cliente'],
            'servico':     info['servicos'],
            'profissional': info['profissional'],
            'horario':    info['data_hora']
        }

        resultado = supabase.table('agendamentos').insert(novo_agendamento).execute()
        print('Agendamento inserido:', resultado)

        return jsonify({'sucesso': True, 'resultado': 'Agendamento realizado com sucesso!'})

    except Exception as e:
        print('Erro ao agendar:', e)
        return jsonify({'sucesso': False, 'erro': str(e)}), 500
