import { useState, useEffect } from 'react'
import { supabase } from '../../../../services/SupabaseConfig.js'
import './MeusAgendamentos.css'

const API_URL = 'http://127.0.0.1:5000'

const HORARIOS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00']
const DIAS_SEMANA = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

function obterDomingoDaSemana(data) {
    const novaData = new Date(data)
    novaData.setDate(novaData.getDate() - novaData.getDay())
    novaData.setHours(0,0,0,0)
    return novaData
}

function MeusAgendamentos() {
    const [agendamentos, setAgendamentos] = useState([])
    const [dataReferenciaSemana, setDataReferenciaSemana] = useState(new Date())
    const [dataReferenciaMes, setDataReferenciaMes] = useState(new Date())
    const [filtroProfissional, setFiltroProfissional] = useState('')
    const [mensagem, setMensagem] = useState('')

    useEffect(() => {
        async function carregarAgendamentos() {
            const { data: sessao } = await supabase.auth.getSession()

            if (!sessao.session) {
                setMensagem('Você precisa estar logado para ver seus agendamentos.')
                return
            }

            const id_cliente = sessao.session.user.id
            const token = sessao.session.access_token

            try {
                const resposta = await fetch(`${API_URL}/api/agendamentos/cliente/${id_cliente}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                })

                const resultado = await resposta.json()

                if (!resultado.sucesso) {
                    setMensagem('Erro ao buscar agendamentos: ' + resultado.erro)
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

    const nomesUnicos = [...new Set(agendamentos.map((ag) => ag.profissional).filter(Boolean))]

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

    async function sair() {
        await supabase.auth.signOut()
        window.location.replace('/login')
    }

    const hoje = new Date()
    const primeiroDiaMes = new Date(dataReferenciaMes.getFullYear(), dataReferenciaMes.getMonth(), 1)
    const ultimoDiaMes = new Date(dataReferenciaMes.getFullYear(), dataReferenciaMes.getMonth() + 1, 0)
    const vaziosMes = Array(primeiroDiaMes.getDay()).fill(null)
    const diasMes = Array.from({ length: ultimoDiaMes.getDate() }, (_, i) => i + 1)

    return (
        <div className="agenda-janela">

            <div className="sidebar">
                <div className="logo">SALÃO</div>

                <div className="nav-icone ativo" title="Agenda">📅</div>
                <div className="nav-icone" title="Equipe">👥</div>
                <div className="nav-icone" title="Galeria">🖼️</div>
                <div className="nav-icone" title="Relatórios">📊</div>

                <div className="sidebar-rodape">
                    <button className="btn-sair" onClick={sair}>Sair</button>
                </div>
            </div>

            <div className="conteudo">

                <div className="navegacao-semana">
                    <button onClick={() => mudarSemana(-1)}>‹</button>
                    <span id="titulo-semana">{tituloSemana}</span>
                    <button onClick={() => mudarSemana(1)}>›</button>
                </div>

                <div className="grade-wrapper">
                    <table className="grade">
                        <thead>
                            <tr>
                                <th className="coluna-hora"></th>
                                {DIAS_SEMANA.map((dia) => (
                                    <th key={dia}>{dia}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {HORARIOS.map((hora) => (
                                <tr key={hora}>
                                    <td className="coluna-hora">{hora}</td>
                                    {Array.from({ length: 7 }, (_, diaIndex) => {
                                        const dataCelula = new Date(domingo)
                                        dataCelula.setDate(dataCelula.getDate() + diaIndex)

                                        const agendamentoDoSlot = agendamentos.find((ag) => {
                                            const dataAg = new Date(ag.horario)
                                            const mesmoDia = dataAg.toDateString() === dataCelula.toDateString()
                                            const mesmaHora = dataAg.getHours() === parseInt(hora.split(':')[0])
                                            const passaFiltro = !filtroProfissional || ag.profissional === filtroProfissional
                                            return mesmoDia && mesmaHora && passaFiltro
                                        })

                                        return (
                                            <td key={diaIndex}>
                                                {agendamentoDoSlot && (
                                                    <div className="cartao-agendamento">
                                                        <b>{agendamentoDoSlot.profissional || 'Profissional'}</b>
                                                        {agendamentoDoSlot.salao}
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

                {mensagem && <p className="mensagem-vazio">{mensagem}</p>}
            </div>

            <div className="painel-direito">

                <div className="mini-calendario">
                    <div className="mini-calendario-cabecalho">
                        <span>{MESES[dataReferenciaMes.getMonth()]} {dataReferenciaMes.getFullYear()}</span>
                        <div>
                            <button onClick={() => mudarMes(-1)}>‹</button>
                            <button onClick={() => mudarMes(1)}>›</button>
                        </div>
                    </div>
                    <div className="mini-grade">
                        {DIAS_SEMANA.map((dia) => (
                            <div key={dia} className="dia-semana">{dia}</div>
                        ))}
                        {vaziosMes.map((_, i) => (
                            <div key={`vazio-${i}`} className="dia vazio"></div>
                        ))}
                        {diasMes.map((dia) => {
                            const ehHoje = dia === hoje.getDate()
                                && dataReferenciaMes.getMonth() === hoje.getMonth()
                                && dataReferenciaMes.getFullYear() === hoje.getFullYear()

                            return (
                                <div
                                    key={dia}
                                    className={`dia${ehHoje ? ' hoje' : ''}`}
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

                <div className="selecao-equipe">
                    <div className="titulo-secao">Equipe</div>
                    <select value={filtroProfissional} onChange={(e) => setFiltroProfissional(e.target.value)}>
                        <option value="">Todos os profissionais</option>
                        {nomesUnicos.map((nome) => (
                            <option key={nome} value={nome}>{nome}</option>
                        ))}
                    </select>
                </div>

                <div className="titulo-secao">Profissionais dos seus agendamentos</div>
                <div id="lista-profissionais">
                    {nomesUnicos.length === 0
                        ? <p className="sem-profissionais">Nenhum profissional ainda.</p>
                        : nomesUnicos.map((nome) => (
                            <div key={nome} className="cartao-profissional">
                                <div className="avatar-placeholder">{nome.charAt(0).toUpperCase()}</div>
                                <div>
                                    <div className="nome">{nome}</div>
                                    <div className="funcao">Profissional</div>
                                </div>
                            </div>
                        ))
                    }
                </div>

            </div>

        </div>
    )
}

export default MeusAgendamentos