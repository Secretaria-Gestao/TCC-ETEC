const btn_continuar = document.getElementById('btn_continuar')

let etapa = 1;
const qntd_Clicks = 0;

console.log(etapa)

btn_continuar.addEventListener('click', () => {
    if (etapa <= 2) {
        etapa++
    }
    else {
        // cadastrar(event)
    }
    console.log(etapa)

})

async function cadastrar(event) {
    // Primeiro cria o usuario no Supabase Auth; depois salva o perfil no backend.
    event?.preventDefault();

    const { data, error } = await supabase.auth.signUp({
        email: form.email().value,
        password: form.password().value
    }
    );

    if (error) {
        alert('DEU RUIM CADASTRO');
    }

    else {
        
        const respostaCadastro = await fetch('profissional/cadastroUser', {
            method: 'post',

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.session?.access_token || ''}`
            },

            body: JSON.stringify({
                id_profissional: data.user.id,
                email_profissional : form.email().value,
                nome_profissional: form.nome().value,
                telefone: form.telefone().value,
                cargo: form.cargo().value,
                salao_associado: form.salao_associado().value

            })
        })

        if (respostaCadastro.ok) {
            window.location.replace('/agendamento');
        }

        else {
            alert("Deu erro ao cadastrar")
        }


        const respostaSalao = await fetch('profissional/salao', {
            method: 'post',

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.session?.access_token || ''}`
            },

            body: JSON.stringify({
                id_profissional: data.user.id,
                email_profissional : form.email().value,
                nome_profissional: form.nome().value,
                telefone: form.telefone().value,
                cargo: form.cargo().value,
                salao_associado: form.salao_associado().value

            })
        })

        if (respostaSalao.ok) {
            window.location.replace('/agendamento');
        }

        else {
            alert("Deu erro ao cadastrar")
        }
    }
}
