// import { tokenUser } from './validation.js';

function add_servico() {
    let serv_add_list = document.getElementById('lista_servicos');

    const novo_servico = document.createElement('div');
    novo_servico.classList.add('servico_adicionado');

    novo_servico.innerHTML =
        `<label for="servico">Selecione outro serviço:</label>
        <select name="servico" class="servico">
            <option value="Barba">Barba</option>
            <option value="Cabelo">Cabelo</option>
            <option value="Hidratação capilar">Hidratação capilar</option>
            <option value="Coloração">Coloração</option>
            <option value="Manicure">Manicure</option>
        </select>
        <button type="button" class="btn_servico" onclick="remover_servico(this)">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
                <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
            </svg>
        </button>`;

    serv_add_list.appendChild(novo_servico);
}


function remover_servico(btn_remover_serv) {
    const servico = btn_remover_serv.parentElement;
    servico.remove();
}

const form = {
    servico: () => document.querySelectorAll('.servico'),
    btn_enviar: () => document.getElementById('btn-enviar'),
    profissional: () => document.getElementsByName('profissional'),
    data: () => document.getElementsByName('data'),
    horario: () => document.getElementsByName('horario')
}

form.btn_enviar().addEventListener('click', () => {
   
    const tokenRaw = localStorage.getItem('sb-qtgubbbrntnltrpyywqx-auth-token');
    const token = JSON.parse(tokenRaw);
    const id_cliente = token?.user?.id;

    if (!id_cliente) {
        alert('Você precisa estar logado para agendar!');
        window.location.replace('/login');
        return;
    }

    let listaServicos = [];
    form.servico().forEach((elemento) => {
        listaServicos.push(elemento.value);
    });

    const data = form.data().value;
    const horario = form.horario().value;
    const dataHora = `${data}T${horario}:00`;

    fetch('/agendando', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id_cliente: id_cliente,
            servicos: listaServicos,
            profissional: form.profissional().value,
            data_hora: dataHora
        })
    })
    .then(resposta => resposta.json())
    .then(resultado => {
        if (resultado.sucesso) {
            window.location.replace('/fim');
        } else {
            alert('Erro ao agendar: ' + (resultado.erro || 'Tente novamente.'));
        }
    })
    .catch(erro => {
        console.error('Erro na requisição:', erro);
        alert('Erro de conexão. Tente novamente.');
    });
});
// window.add_servico = add_servico;
// window.remover_servico = remover_servico

// console.log('rodando');

// if (!tokenUser) {

//     console.log('tem token pelo visto');

//     const resposta = await fetch('/agendamentoUser', {
//         headers: {
//             'Conten-Type': 'application/json',
//             'Authorization': `Bearer ${tokenUSer}`
//         },

//         body: {
//             tokenUSer: json.stringify({ id_cliente: tokenUser.user.id})
//         }
//     })


//     const status = await resposta.json();
//     console.log(status);

// }

// else {
//     console.log('não tem token pelo visto');
// }
