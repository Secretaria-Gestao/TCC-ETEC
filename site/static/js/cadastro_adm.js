const btn_continuar = document.getElementById('btn_continuar')

let etapa = 1;
const qntd_Clicks = 0;

console.log(etapa)

btn_continuar.addEventListener('click', () => {
    if (etapa <= 2) {
        etapa++
    }
    else {
        const 
    }
    console.log(etapa)

})

export async function cadastrar(event) {
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
        
        const resposta = await fetch('/cadastroUser', {
            method: 'post',

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.session?.access_token || ''}`
            },

            body: JSON.stringify({
                id_profissional: data.user.id,
                email_profissional : form.email().value,
                nome_profissional: form.nome().value,
                cpf: '',
                cargo: '',
                salao_associado: '',

            })
        })

        if (resposta.ok) {
            window.location.replace('/agendamento');
        }

        else {
            alert("Deu erro ao cadastrar")
        }
    }
}
