export async function mandarAgendamento(token, servicos, profissional, dia, horario, endereco) {

    const dataHora = `${dia}T${horario}`;

    const resposta = await fetch('/api/agendando', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },

        body: JSON.stringify({
            servicos: servicos,
            profissional: profissional,
            data_hora: dataHora,
            endereco: endereco
        })

    })

    return resposta
}
