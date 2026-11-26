
export default function Card1({
  dados, todosServicos,
  todosProfissionais, hoje,
  regra, avisoHorario,
  mudarValorDados, mudarValorServico,
  adicionarServico
}) {
  return (
    <div className="card_1">
      <div className="lista_servicos" id="lista_servicos">
        {
          dados.servicos.map((servico, indice) => {
            return (
              <div className="servico_adicionado" key={indice}>
                <label htmlFor="servico">Selecione o serviço:</label>

                <select name='servico' className="servico" value={servico} onChange={(evento) => mudarValorServico(evento, indice)} key={indice}>
                  { // Pega todos os serviços em "todosServicos" e coloca um <option> para cada um
                    todosServicos.map((servico) => (
                      servico.servicos && (
                        <option key={servico.id_servico} value={servico.id_servico}>
                          {servico.servicos?.nome_servico}
                        </option>
                      )
                    ))
                  }
                </select>

                {
                  indice == 0 && (
                    <button type="button" className="btn_servico bg-white" id="btn_add_servico" onClick={adicionarServico}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                        className="bi bi-plus-lg " viewBox="0 0 16 16">
                        <path fillRule="evenodd"
                          d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                      </svg>
                    </button>
                  )
                }
              </div>
            )
          })
        }
      </div>

      <div className="profissional_selecionado">
        <label htmlFor="profissional">Selecione o(a) profissional: </label>

        <select name="profissional" onChange={mudarValorDados} value={dados.profissional}>
          {
            todosProfissionais.map((profissional) => {
              return (
                <option key={profissional.id_profissional} value={profissional.id_profissional}>{profissional.nome_profissional}</option>
              )
            })
          }
        </select>
      </div>

      <div>
        <label>Dia marcado:</label>
        <input type="date" name="dia" min={hoje} value={dados.dia} onChange={mudarValorDados} />
      </div>

      <div>
        <label>Horario da sessão:</label>
        <input type="time" name="horario" value={dados.horario} onChange={mudarValorDados}
          min={regra?.abertura} max={regra?.fechamento} />
        {/* Aviso na hora, antes de enviar */}
        {avisoHorario && <p className='text-red-300 text-sm'>{avisoHorario}</p>}
      </div>
    </div>
  )
}