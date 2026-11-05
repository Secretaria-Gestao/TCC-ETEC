import { useState, useEffect } from 'react'
import { buscarAgendamentosCliente, cancelarAgendamento } from '../../services/agendamentosCliente.js'
import './MeusAgendamentos.css'

const HORARIOS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00']
const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

// O cliente só pode cancelar até 2h30 antes do horário marcado
const PRAZO_CANCELAMENTO_MS = (2 * 60 + 30) * 60 * 1000
const STATUS_CANCELAVEIS = ['pendente', 'confirmado']

// Devolve o motivo pelo qual o agendamento não pode ser cancelado, ou null se pode
function motivoBloqueioCancelamento(ag) {
  if (!STATUS_CANCELAVEIS.includes(ag.status?.toLowerCase())) {
    return 'Só agendamentos pendentes ou confirmados podem ser cancelados.'
  }

  const faltam = new Date(ag.horario) - Date.now()

  if (faltam <= 0) return 'Esse horário já passou.'
  if (faltam < PRAZO_CANCELAMENTO_MS) return 'O cancelamento só é possível até 2h30 antes do horário.'

  return null
}

function obterDomingoDaSemana(data) {
  const novaData = new Date(data)
  novaData.setDate(novaData.getDate() - novaData.getDay())
  novaData.setHours(0, 0, 0, 0)
  return novaData
}

function MeusAgendamentos() {
  const [agendamentos, setAgendamentos] = useState([])
  const [dataReferenciaSemana, setDataReferenciaSemana] = useState(new Date())
  const [dataReferenciaMes, setDataReferenciaMes] = useState(new Date())
  const [filtroProfissional, setFiltroProfissional] = useState('')
  const [agendamentoSelecionado, setAgendamentoSelecionado] = useState(null)
  const [confirmandoCancelamento, setConfirmandoCancelamento] = useState(false)


  // Esc fecha o modal de detalhes
  useEffect(() => {
    if (!agendamentoSelecionado) return

    function aoApertarTecla(evento) {
      if (evento.key === 'Escape') fecharDetalhes()
    }

    window.addEventListener('keydown', aoApertarTecla)
    return () => window.removeEventListener('keydown', aoApertarTecla)
  }, [agendamentoSelecionado])

  useEffect(() => {
    async function carregarAgendamentos() {
      const agendamentosCliente = await buscarAgendamentosCliente()

      setAgendamentos(agendamentosCliente)
    }

    carregarAgendamentos()
  }, [])

  // Cancelados não aparecem na grade
  const agendamentosVisiveis = agendamentos.filter((ag) => ag.status?.toLowerCase() !== 'cancelado')

  const nomesUnicos = [...new Set(agendamentosVisiveis.map((ag) => ag.profissional).filter(Boolean))]

  const domingo = obterDomingoDaSemana(dataReferenciaSemana)
  const sabado = new Date(domingo)
  sabado.setDate(sabado.getDate() + 6)

  const tituloSemana = `${domingo.getDate()} de ${MESES[domingo.getMonth()]} - ${sabado.getDate()} de ${MESES[sabado.getMonth()]}`

  function mudarSemana(direcao) {
    const novaData = new Date(dataReferenciaSemana)
    novaData.setDate(novaData.getDate() + direcao * 7)
    setDataReferenciaSemana(novaData)
  }

  function mudarMes(direcao) {
    const novaData = new Date(dataReferenciaMes)
    novaData.setMonth(novaData.getMonth() + direcao)
    setDataReferenciaMes(novaData)
  }

  const hoje = new Date()
  const primeiroDiaMes = new Date(dataReferenciaMes.getFullYear(), dataReferenciaMes.getMonth(), 1)
  const ultimoDiaMes = new Date(dataReferenciaMes.getFullYear(), dataReferenciaMes.getMonth() + 1, 0)
  const vaziosMes = Array(primeiroDiaMes.getDay()).fill(null)
  const diasMes = Array.from({ length: ultimoDiaMes.getDate() }, (_, i) => i + 1)

  function formatarHorario(dataBruta) {
    const data = new Date(dataBruta)
    const horario = data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })

    return horario
  }

  function abrirDetalhes(ag) {
    setConfirmandoCancelamento(false)
    setAgendamentoSelecionado(ag)
  }

  function fecharDetalhes() {
    setAgendamentoSelecionado(null)
    setConfirmandoCancelamento(false)
  }

  async function confirmarCancelamento() {
    // Confere de novo na hora de confirmar: o modal pode ter ficado aberto até passar do prazo
    if (motivoBloqueioCancelamento(agendamentoSelecionado)) return

    const id_agendamento = agendamentoSelecionado.id_agendamento
    const cancelou = await cancelarAgendamento(id_agendamento)

    fecharDetalhes()

    if (!cancelou) return

    setAgendamentos((atuais) =>
      atuais.map((ag) => (ag.id_agendamento === id_agendamento ? { ...ag, status: 'cancelado' } : ag))
    )
  }

  const motivoBloqueio = agendamentoSelecionado
    ? motivoBloqueioCancelamento(agendamentoSelecionado)
    : null

  return (
    <div className="meus-agendamentos-agenda-janela ">

      <div className="meus-agendamentos-conteudo">

        <div className="meus-agendamentos-navegacao-semana">
          <button onClick={() => mudarSemana(-1)}>‹</button>
          <span id="meus-agendamentos-titulo-semana">{tituloSemana}</span>
          <button onClick={() => mudarSemana(1)}>›</button>
        </div>

        <div className="meus-agendamentos-grade-wrapper rounded-2xl overflow-hidden">
          <table className="meus-agendamentos-grade ">
            <thead>
              <tr>
                <th className="meus-agendamentos-coluna-hora"></th>
                {DIAS_SEMANA.map((dia) => (
                  <th key={dia}>{dia}</th>
                ))}
              </tr>
            </thead>
            <tbody className=''>

              {HORARIOS.map((hora) => (
                <tr key={hora}>
                  <td className="meus-agendamentos-coluna-hora">{hora}</td>

                  {Array.from({ length: 7 }, (_, diaIndex) => {
                    const dataCelula = new Date(domingo)
                    dataCelula.setDate(dataCelula.getDate() + diaIndex)

                    const agendamentoDoSlot = agendamentosVisiveis.filter((ag) => {
                      const dataAg = new Date(ag.horario)
                      const mesmoDia = dataAg.toDateString() === dataCelula.toDateString()
                      const mesmaHora = dataAg.getHours() === parseInt(hora.split(':')[0])
                      const passaFiltro = !filtroProfissional || ag.profissional === filtroProfissional
                      return mesmoDia && mesmaHora && passaFiltro
                    })

                    return (
                      <td key={diaIndex} >
                        <div className='flex flex-col gap-2 p-1'>

                          {agendamentoDoSlot?.map(ag => (
                            <div
                              key={ag.id_agendamento}
                              className="meus-agendamentos-cartao-agendamento relative min-h-15 w-full gap-1 flex flex-col"
                              onClick={() => abrirDetalhes(ag)}
                            >
                              <b title={ag.endereco} className='font-bold text-ellipsis overflow-hidden whitespace-nowrap'>
                                {ag.profissional} | {ag.endereco}
                              </b>
                              <div className='flex items-center font-bold'>
                                <svg
                                  width="19"
                                  height="19"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  aria-hidden="true"
                                >
                                  <circle cx="12" cy="12" r="9" />
                                  <polyline points="12 7 12 12 15.5 14" />
                                </svg>
                                
                                {formatarHorario(ag.horario)}

                                <div className='w-full h-full flex flex-col '>

                                  <button type="button" className='w-6 self-end text-(--texto-negrito)' aria-label="Ver detalhes do agendamento">
                                    <svg className="h-4/5 w-auto shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                      <circle cx="12" cy="5" r="2" />
                                      <circle cx="12" cy="12" r="2" />
                                      <circle cx="12" cy="19" r="2" />
                                    </svg>
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="meus-agendamentos-painel-direito">

        <div className="meus-agendamentos-mini-calendario">
          <div className="meus-agendamentos-mini-calendario-cabecalho">
            <span>{MESES[dataReferenciaMes.getMonth()]} {dataReferenciaMes.getFullYear()}</span>
            <div>
              <button onClick={() => mudarMes(-1)}>‹</button>
              <button onClick={() => mudarMes(1)}>›</button>
            </div>
          </div>
          <div className="meus-agendamentos-mini-grade">
            {DIAS_SEMANA.map((dia) => (
              <div key={dia} className="meus-agendamentos-dia-semana">{dia}</div>
            ))}
            {vaziosMes.map((_, i) => (
              <div key={`vazio-${i}`} className="meus-agendamentos-dia meus-agendamentos-vazio"></div>
            ))}
            {diasMes.map((dia) => {
              const ehHoje = dia === hoje.getDate()
                && dataReferenciaMes.getMonth() === hoje.getMonth()
                && dataReferenciaMes.getFullYear() === hoje.getFullYear()

              return (
                <div
                  key={dia}
                  className={`meus-agendamentos-dia${ehHoje ? ' meus-agendamentos-hoje' : ''}`}
                  onClick={() => {
                    setDataReferenciaSemana(new Date(dataReferenciaMes.getFullYear(), dataReferenciaMes.getMonth(), dia))
                  }}
                >
                  {dia}
                </div>
              )
            })}
          </div>
        </div>

        <div className="meus-agendamentos-selecao-equipe">
          <div className="meus-agendamentos-titulo-secao">Equipe</div>
          <select value={filtroProfissional} onChange={(e) => setFiltroProfissional(e.target.value)}>
            <option value="">Todos os profissionais</option>
            {nomesUnicos.map((nome) => (
              <option key={nome} value={nome}>{nome}</option>
            ))}
          </select>
        </div>

        <div className="meus-agendamentos-titulo-secao">Profissionais dos seus agendamentos</div>
        <div id="meus-agendamentos-lista-profissionais">
          {nomesUnicos.length === 0
            ? <p className="meus-agendamentos-sem-profissionais">Nenhum profissional ainda.</p>
            : nomesUnicos.map((nome) => (
              <div key={nome} className="meus-agendamentos-cartao-profissional">
                <div className="meus-agendamentos-avatar-placeholder">{nome.charAt(0).toUpperCase()}</div>
                <div>
                  <div className="meus-agendamentos-nome">{nome}</div>
                  <div className="meus-agendamentos-funcao">Profissional</div>
                </div>
              </div>
            ))
          }
        </div>

      </div>

      {agendamentoSelecionado && (
        <div className="meus-agendamentos-modal-fundo" onClick={fecharDetalhes}>
          <div
            className="meus-agendamentos-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="meus-agendamentos-modal-titulo"
            onClick={(evento) => evento.stopPropagation()}
          >
            <h2 id="meus-agendamentos-modal-titulo" className="meus-agendamentos-modal-titulo">
              {confirmandoCancelamento ? 'Cancelar agendamento?' : 'Detalhes do agendamento'}
            </h2>

            {confirmandoCancelamento ? (
              <p className="meus-agendamentos-modal-texto">
                Seu horário com <b>{agendamentoSelecionado.profissional}</b> às{' '}
                <b>{formatarHorario(agendamentoSelecionado.horario)}</b> será cancelado.
                Essa ação não pode ser desfeita.
              </p>
            ) : (
              <dl className="meus-agendamentos-modal-lista">
                <dt>Data</dt>
                <dd>
                  {new Date(agendamentoSelecionado.horario).toLocaleDateString('pt-BR', {
                    day: '2-digit', month: 'numeric', year: 'numeric', hour: '2-digit', minute: "2-digit"
                  })}
                </dd>
                <dt>Profissional</dt>
                <dd>{agendamentoSelecionado.profissional}</dd>
                <dt>Endereço</dt>
                <dd>{agendamentoSelecionado.endereco}</dd>
                <dt>Status</dt>
                <dd className="capitalize">{agendamentoSelecionado.status}</dd>
              </dl>
            )}

            {!confirmandoCancelamento && motivoBloqueio && (
              <p className="meus-agendamentos-modal-aviso">{motivoBloqueio}</p>
            )}

            <div className="meus-agendamentos-modal-acoes">
              {confirmandoCancelamento ? (
                <>
                  <button type="button" className="meus-agendamentos-btn-secundario" onClick={() => setConfirmandoCancelamento(false)}>
                    Voltar
                  </button>
                  <button type="button" className="meus-agendamentos-btn-perigo" onClick={confirmarCancelamento}>
                    Sim, cancelar
                  </button>
                </>
              ) : (
                <>
                  <button type="button" className="meus-agendamentos-btn-secundario" onClick={fecharDetalhes}>
                    Fechar
                  </button>
                  <button
                    type="button"
                    className="meus-agendamentos-btn-perigo"
                    disabled={Boolean(motivoBloqueio)}
                    onClick={() => setConfirmandoCancelamento(true)}
                  >
                    Cancelar agendamento
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default MeusAgendamentos
