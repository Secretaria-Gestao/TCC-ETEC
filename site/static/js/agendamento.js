function add_servico(){
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