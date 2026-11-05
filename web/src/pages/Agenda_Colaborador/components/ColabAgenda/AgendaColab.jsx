import { useState, useEffect } from 'react'
import { pegarSessao } from '../../../../services/pegarSessao.js'
import './AgendaColab.css'

// Constantes fora do componente porque nunca mudam — evita recriá-las a cada render.
const DIAS_SEMANA = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

// Horas usadas quando o salão ainda não configurou o horário de funcionamento.
const PRIMEIRA_HORA_PADRAO = 8
const ULTIMA_HORA_PADRAO = 18

// Recebe qualquer data e devolve o domingo da semana correspondente.
// Necessário para sempre exibir a semana completa (dom → sáb) na grade.
function obterDomingoDaSemana(data) {
    const novaData = new Date(data)
    novaData.setDate(novaData.getDate() - novaData.getDay())
    novaData.setHours(0, 0, 0, 0)
    return novaData
}

// "09:30:00" → 570 (minutos desde a meia-noite)
function textoParaMinutos(texto) {
    const [horas, minutos] = String(texto).split(':').map(Number)
    return horas * 60 + (minutos || 0)
}

// Monta as linhas da grade (uma por hora) a partir do horário de funcionamento do salão.
// Se algum agendamento da semana cair fora desse horário, a grade cresce para ele aparecer.
function montarHorasDaGrade(horarioFuncionamento, agendamentosDaSemana) {
    const diasAbertos = horarioFuncionamento.filter((dia) => !dia.fechado && dia.hora_abertura && dia.hora_fechamento)

    let primeiraHora = PRIMEIRA_HORA_PADRAO
    let ultimaHora = ULTIMA_HORA_PADRAO

    if (diasAbertos.length > 0) {
        primeiraHora = Math.min(...diasAbertos.map((dia) => Math.floor(textoParaMinutos(dia.hora_abertura) / 60)))
        // Fechando às 18:00, o último atendimento começa antes das 18:00, então a última linha é a das 17:00
        ultimaHora = Math.max(...diasAbertos.map((dia) => Math.floor((textoParaMinutos(dia.hora_fechamento) - 1) / 60)))
    }

    for (const ag of agendamentosDaSemana) {
        const hora = new Date(ag.horario).getHours()
        primeiraHora = Math.min(primeiraHora, hora)
        ultimaHora = Math.max(ultimaHora, hora)
    }

    return Array.from({ length: ultimaHora - primeiraHora + 1 }, (_, i) => primeiraHora + i)
}

// Horário do cartão: "14:30 – 15:15", ou só o início quando a duração não foi gravada.
function formatarHorarioAtendimento(ag) {
    const opcoes = { hour: '2-digit', minute: '2-digit' }
    const inicio = new Date(ag.horario)
    const textoInicio = inicio.toLocaleTimeString('pt-BR', opcoes)

    if (!ag.duracao_total) return textoInicio

    const fim = new Date(inicio.getTime() + Number(ag.duracao_total) * 60000)
    return `${textoInicio} – ${fim.toLocaleTimeString('pt-BR', opcoes)}`
}

function AgendaColaborador() {
    // Lista de agendamentos do profissional logado, vinda do back-end.
    const [agendamentos, setAgendamentos] = useState([])

    // Horário de funcionamento do salão (um item por dia da semana), usado para montar as linhas da grade.
    const [horarioFuncionamento, setHorarioFuncionamento] = useState([])

    // Data que controla qual semana está sendo exibida na grade central.
    const [dataReferenciaSemana, setDataReferenciaSemana] = useState(new Date())

    // Data que controla qual mês está sendo exibido no mini-calendário lateral.
    const [dataReferenciaMes, setDataReferenciaMes] = useState(new Date())

    // Mensagem de erro ou aviso exibida abaixo da grade.
    const [mensagem, setMensagem] = useState('')

    // Controla qual cartão está com o menu de ações aberto (guarda o id_agendamento, ou null).
    const [agendamentoSelecionado, setAgendamentoSelecionado] = useState('null')

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
                setHorarioFuncionamento(resultado.horario_funcionamento || [])

            } catch (erro) {
                console.error('Erro na requisição:', erro)
                setMensagem('Erro de conexão. Tente novamente.')
            }
        }

        carregarAgendamentos()
    }, [])

    // Envia a mudança de status pro backend e, se der certo, atualiza
// só o item alterado na lista local — sem precisar recarregar tudo.
async function atualizarStatus(idAgendamento, novoStatus) {
    const sessao = await pegarSessao()
    const token = sessao.access_token

    try {
        const resposta = await fetch(`/api/agendamentos/status`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id_agendamento: idAgendamento, novo_status: novoStatus })
        })

        const resultado = await resposta.json()

        if (!resultado.sucesso) {
            setMensagem('Erro ao atualizar status: ' + resultado.erro)
            return
        }

        setAgendamentos((atuais) =>
            atuais.map((ag) =>
                ag.id_agendamento === idAgendamento ? { ...ag, status: novoStatus } : ag
            )
        )
        setAgendamentoSelecionado(null)

    } catch (erro) {
        console.error('Erro na requisição:', erro)
        setMensagem('Erro de conexão. Tente novamente.')
    }
}

    // Domingo e sábado da semana exibida — usados no título e na montagem das células.
    const domingo = obterDomingoDaSemana(dataReferenciaSemana)
    const sabado = new Date(domingo)
    sabado.setDate(sabado.getDate() + 6)

    const tituloSemana = `${domingo.getDate()} de ${MESES[domingo.getMonth()]} - ${sabado.getDate()} de ${MESES[sabado.getMonth()]}`

    // Agendamentos da semana exibida: definem se a grade precisa de horas fora do funcionamento do salão.
    const domingoSeguinte = new Date(domingo)
    domingoSeguinte.setDate(domingoSeguinte.getDate() + 7)
    const agendamentosDaSemana = agendamentos.filter((ag) => {
        const dataAg = new Date(ag.horario)
        return dataAg >= domingo && dataAg < domingoSeguinte
    })

    const horasDaGrade = montarHorasDaGrade(horarioFuncionamento, agendamentosDaSemana)

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

            {/* A navegação fica na BarraLateral, renderizada pela página */}

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
                            {horasDaGrade.map((hora) => (
                                <tr key={hora}>
                                    <td className="agenda-profissional-coluna-hora">{`${String(hora).padStart(2, '0')}:00`}</td>

                                    {/* Para cada linha de horário, gera 7 colunas (dom → sáb) */}
                                    {Array.from({ length: 7 }, (_, diaIndex) => {
                                        const dataCelula = new Date(domingo)
                                        dataCelula.setDate(dataCelula.getDate() + diaIndex)

                                        // Todos os agendamentos deste dia que começam nesta hora (ex.: 14:00 e 14:30).
                                        // A API já devolve em ordem de horário.
                                        const agendamentosDoSlot = agendamentosDaSemana.filter((ag) => {
                                            const dataAg = new Date(ag.horario)
                                            const mesmoDia = dataAg.toDateString() === dataCelula.toDateString()
                                            const mesmaHora = dataAg.getHours() === hora
                                            return mesmoDia && mesmaHora
                                        })

                            return (
                                <td key={diaIndex}>
                                    {agendamentosDoSlot.length > 0 && (
                                    <div className="agenda-profissional-slot">
                                    {agendamentosDoSlot.map((ag) => (
                                    // Cartão exibido dentro da célula para cada agendamento.
                                    // Mostra o horário, o cliente, os serviços e o status do agendamento.
                                    <div
                                        key={ag.id_agendamento}
                                        className="agenda-profissional-cartao"
                                        onClick={() => setAgendamentoSelecionado(
                                        agendamentoSelecionado === ag.id_agendamento
                                        ? null
                                        : ag.id_agendamento
                                        )}
                                    >
                                        <span className="agenda-profissional-cartao-horario">{formatarHorarioAtendimento(ag)}</span>
                                        <b>{ag.cliente || 'Cliente'}</b>
                                        {ag.servicos?.length > 0 && (
                                            <span className="agenda-profissional-cartao-servicos">{ag.servicos.join(', ')}</span>
                                        )}
                                        <span>{ag.status}</span>

                                    {agendamentoSelecionado === ag.id_agendamento && (
                                        // stopPropagation evita que o clique num botão também
                                        // dispare o onClick do cartão e feche o menu antes da hora.
                                        <div
                                            className="agenda-profissional-menu-acoes"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button onClick={() => atualizarStatus(ag.id_agendamento, 'confirmado')}>Confirmar</button>
                                            <button onClick={() => atualizarStatus(ag.id_agendamento, 'concluido')}>Concluir</button>
                                            <button onClick={() => atualizarStatus(ag.id_agendamento, 'cancelado')}>Cancelar</button>
                                            <button onClick={() => atualizarStatus(ag.id_agendamento, 'ausente')}>Registrar ausência</button>
                                        </div>
                                    )}
                                    </div>
                                    ))}
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