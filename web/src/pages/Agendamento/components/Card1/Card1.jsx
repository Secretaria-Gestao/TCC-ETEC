
export default function Card1({
  dados, todosServicos,
  todosProfissionais, hoje,
  regra, avisoHorario,
  mudarValorDados
}) {

  function removerServico(evento) {
    const id = evento.target.value

    const novaLista = [...dados.servicos].filter(s => (console.log(s)))

  }

  function adicionarServico() {
    // Adiciona o primeiro serviço que ainda não foi escolhido
    const disponivel = todosServicos.find(s => !dados.servicos.includes(s.id_servico))
    if (!disponivel) return // todos já escolhidos (ou lista vazia)

    const novaLista = [...dados.servicos, disponivel.id_servico]
    setDados(d => ({ ...d, servicos: novaLista, preco: calcularTotal(novaLista) }))
  }


  function mudarValorServico(evento, indice) {
    const novaLista = [...dados.servicos]
    novaLista[indice] = Number(evento.target.value)
    // Uma única atualização, com o total recalculado da lista inteira
    setDados(d => ({ ...d, servicos: novaLista, preco: calcularTotal(novaLista) }))
  }


  return (
    <div className="card_1 w-full ">
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
                        className="bi bi-plus-lg " viewBox="0 0 19 19">
                        <path fillRule="evenodd"
                          d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                      </svg>
                    </button>
                  )
                }

                {
                  indice > 0 && (
                    <button type="button" className="btn_servico bg-white" id="btn_add_servico" onClick={removerServico}>
                      <svg xmlns="http://w3.org" width="20" height="20" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
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