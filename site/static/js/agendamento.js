// import { tokenUser } from './validation.js';

function add_servico() {
    let serv_add_list = document.getElementById('lista_servicos');

    const novo_servico = document.createElement('div');
    novo_servico.classList.add('servico_adicionado');

    novo_servico.innerHTML =
        `<label for="servico">Selecione outro serviço:</label>
        <select name="servico">
            <option value="Barba">Barba</option>
            <option value="Cabelo">Cabelo</option>
            <option value="Hidratação capilar">Hidratação capilar</option>
            <option value="Coloração">Coloração</option>
            <option value="Manicure">Manicure</option>
        </select>
        <button type="button" class="btn_servico" onclick="remover_servico(this)">—</button>`;

    serv_add_list.appendChild(novo_servico);
}


function remover_servico(btn_remover_serv) {
    const servico = btn_remover_serv.parentElement;
    servico.remove();
}

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
