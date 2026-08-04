import { useState, useEffect } from 'react'
import { pegarSessao } from '../../../../services/pegarSessao.js'
import './AgendaColab.css'

// Constantes fora do componente porque nunca mudam — evita recriá-las a cada render.
const HORARIOS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00']
const DIAS_SEMANA = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

// Recebe qualquer data e devolve o domingo da semana correspondente.
// Necessário para sempre exibir a semana completa (dom → sáb) na grade.
function obterDomingoDaSemana(data) {
    const novaData = new Date(data)
    novaData.setDate(novaData.getDate() - novaData.getDay())
    novaData.setHours(0, 0, 0, 0)
    return novaData
}

function AgendaColaborador() {
    // Lista de agendamentos do profissional logado, vinda do back-end.
    const [agendamentos, setAgendamentos] = useState([])

    // Data que controla qual semana está sendo exibida na grade central.
    const [dataReferenciaSemana, setDataReferenciaSemana] = useState(new Date())

    // Data que controla qual mês está sendo exibido no mini-calendário lateral.
    const [dataReferenciaMes, setDataReferenciaMes] = useState(new Date())

    // Mensagem de erro ou aviso exibida abaixo da grade.
    const [mensagem, setMensagem] = useState('')

    // useEffect com [] roda apenas uma vez, quando o componente aparece na tela.
    // É aqui que fazemos a chamada à API para buscar os agendamentos do profissional.
    useEffect(() => {
        async function carregarAgendamentos() {
            const sessao = await pegarSessao()

            if (!sessao) {
                setMensagem('Você precisa estar logado para ver sua agenda.')
                return
            }

            // Na tabela profissionais, o id_profissional é o mesmo id do usuário no Supabase Auth.
            // Então usamos diretamente o id da sessão, sem precisar fazer uma busca extra.
            const id_profissional = sessao.user.id
            const token = sessao.access_token

            try {
                const resposta = await fetch(`/api/agendamentos/profissional/${id_profissional}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                })

                const resultado = await resposta.json()

                if (!resultado.sucesso) {
                    setMensagem('Erro ao buscar agenda: ' + resultado.erro)
                    return
                }

                setAgendamentos(resultado.agendamentos || [])

            } catch (erro) {
                console.error('Erro na requisição:', erro)
                setMensagem('Erro de conexão. Tente novamente.')
            }
        }

        carregarAgendamentos()
    }, [])

    // Domingo e sábado da semana exibida — usados no título e na montagem das células.
    const domingo = obterDomingoDaSemana(dataReferenciaSemana)
    const sabado = new Date(domingo)
    sabado.setDate(sabado.getDate() + 6)

    const tituloSemana = `${domingo.getDate()} de ${MESES[domingo.getMonth()]} - ${sabado.getDate()} de ${MESES[sabado.getMonth()]}`

    // Avança ou recua a semana exibida. direcao = 1 (próxima) ou -1 (anterior).
    function mudarSemana(direcao) {
        const novaData = new Date(dataReferenciaSemana)
        novaData.setDate(novaData.getDate() + direcao * 7)
        setDataReferenciaSemana(novaData)
    }

    // Avança ou recua o mês do mini-calendário.
    function mudarMes(direcao) {
        const novaData = new Date(dataReferenciaMes)
        novaData.setMonth(novaData.getMonth() + direcao)
        setDataReferenciaMes(novaData)
    }

    const hoje = new Date()
    const primeiroDiaMes = new Date(dataReferenciaMes.getFullYear(), dataReferenciaMes.getMonth(), 1)
    const ultimoDiaMes = new Date(dataReferenciaMes.getFullYear(), dataReferenciaMes.getMonth() + 1, 0)

    // Quadradinhos vazios antes do dia 1 (ex: se o mês começa numa quarta, ficam 3 vazios antes).
    const vaziosMes = Array(primeiroDiaMes.getDay()).fill(null)
    const diasMes = Array.from({ length: ultimoDiaMes.getDate() }, (_, i) => i + 1)

    return (
        <div className="agenda-profissional-janela">

            {/* Sidebar esquerda com navegação */}
            <div className="agenda-profissional-sidebar">
                <div className="agenda-profissional-logo">SALÃO</div>
                <div className="agenda-profissional-nav-icone ativo" title="Agenda">📅</div>
                <div className="agenda-profissional-nav-icone" title="Perfil">👤</div>
            </div>

            {/* Grade semanal central */}
            <div className="agenda-profissional-conteudo">

                <div className="agenda-profissional-navegacao-semana">
                    <button onClick={() => mudarSemana(-1)}>‹</button>
                    <span>{tituloSemana}</span>
                    <button onClick={() => mudarSemana(1)}>›</button>
                </div>

                <div className="agenda-profissional-grade-wrapper">
                    <table className="agenda-profissional-grade">
                        <thead>
                            <tr>
                                <th className="agenda-profissional-coluna-hora"></th>
                                {DIAS_SEMANA.map((dia) => (
                                    <th key={dia}>{dia}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {HORARIOS.map((hora) => (
                                <tr key={hora}>
                                    <td className="agenda-profissional-coluna-hora">{hora}</td>

                                    {/* Para cada linha de horário, gera 7 colunas (dom → sáb) */}
                                    {Array.from({ length: 7 }, (_, diaIndex) => {
                                        const dataCelula = new Date(domingo)
                                        dataCelula.setDate(dataCelula.getDate() + diaIndex)

                                        // Verifica se existe algum agendamento que caia
                                        // exatamente neste dia e nesta hora.
                                        const agendamentoDoSlot = agendamentos.find((ag) => {
                                            const dataAg = new Date(ag.horario)
                                            const mesmoDia = dataAg.toDateString() === dataCelula.toDateString()
                                            const mesmaHora = dataAg.getHours() === parseInt(hora.split(':')[0])
                                            return mesmoDia && mesmaHora
                                        })

                                        return (
                                            <td key={diaIndex}>
                                                {agendamentoDoSlot && (
                                                    // Cartão exibido dentro da célula quando há agendamento.
                                                    // Mostra o nome do cliente e o status do agendamento.
                                                    <div className="agenda-profissional-cartao">
                                                        <b>{agendamentoDoSlot.cliente || 'Cliente'}</b>
                                                        <span>{agendamentoDoSlot.status}</span>
                                                    </div>
                                                )}
                                            </td>
                                        )
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {mensagem && <p className="agenda-profissional-mensagem">{mensagem}</p>}
            </div>

            {/* Sidebar direita: mini-calendário para navegar por meses */}
            <div className="agenda-profissional-painel-direito">
                <div className="agenda-profissional-mini-calendario">
                    <div className="agenda-profissional-mini-calendario-cabecalho">
                        <span>{MESES[dataReferenciaMes.getMonth()]} {dataReferenciaMes.getFullYear()}</span>
                        <div>
                            <button onClick={() => mudarMes(-1)}>‹</button>
                            <button onClick={() => mudarMes(1)}>›</button>
                        </div>
                    </div>
                    <div className="agenda-profissional-mini-grade">
                        {DIAS_SEMANA.map((dia) => (
                            <div key={dia} className="agenda-profissional-dia-semana">{dia}</div>
                        ))}
                        {vaziosMes.map((_, i) => (
                            <div key={`vazio-${i}`} className="agenda-profissional-dia agenda-profissional-vazio"></div>
                        ))}
                        {diasMes.map((dia) => {
                            const ehHoje = dia === hoje.getDate()
                                && dataReferenciaMes.getMonth() === hoje.getMonth()
                                && dataReferenciaMes.getFullYear() === hoje.getFullYear()

                            return (
                                <div
                                    key={dia}
                                    className={`agenda-profissional-dia${ehHoje ? ' agenda-profissional-hoje' : ''}`}
                                    // Clicar em um dia do mini-calendário pula a grade central
                                    // direto para a semana que contém esse dia.
                                    onClick={() => setDataReferenciaSemana(
                                        new Date(dataReferenciaMes.getFullYear(), dataReferenciaMes.getMonth(), dia)
                                    )}
                                >
                                    {dia}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AgendaColaborador