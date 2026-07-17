import { useState, useEffect } from 'react'
import { pegarMeuPerfil } from '../../../../services/pegarMeuPerfil.js'
import { pegarSessao } from '../../../../services/pegarSessao.js'
import './AgendaAd.css'

const HORARIOS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00']
const DIAS_SEMANA = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

function obterDomingoDaSemana(data) {
    const novaData = new Date(data)
    novaData.setDate(novaData.getDate() - novaData.getDay())
    novaData.setHours(0, 0, 0, 0)
    return novaData
}

function AgendaAdmin() {
    // Lista de todos os agendamentos do salão.
    const [agendamentos, setAgendamentos] = useState([])

    // Controla qual profissional está sendo filtrado na grade.
    // String vazia = mostrar todos.
    const [filtroProfissional, setFiltroProfissional] = useState('')

    const [dataReferenciaSemana, setDataReferenciaSemana] = useState(new Date())
    const [dataReferenciaMes, setDataReferenciaMes] = useState(new Date())
    const [mensagem, setMensagem] = useState('')

    // secaoAtiva controla qual painel está sendo exibido na área central:
    // 'agenda' = grade de agendamentos
    // 'financeiro' = resumo financeiro (a ser implementado)
    // 'profissionais' = lista dos profissionais do salão (a ser implementado)
    const [secaoAtiva, setSecaoAtiva] = useState('agenda')

    useEffect(() => {
        async function carregarAgendamentos() {
            // pegarMeuPerfil() busca os dados do admin logado, incluindo o salao_associado.
            // Sem o id_salao, não é possível filtrar os agendamentos corretos.
            const perfil = await pegarMeuPerfil()

            if (!perfil) {
                setMensagem('Você precisa estar logado para ver os agendamentos.')
                return
            }

            const id_salao = perfil.salao_associado

            if (!id_salao) {
                setMensagem('Seu perfil não está vinculado a nenhum salão.')
                return
            }

            const sessao = await pegarSessao()
            const token = sessao.access_token

            try {
                // Busca todos os agendamentos do salão usando o id_salao do perfil do admin.
                const resposta = await fetch(`/api/agendamentos/salao/${id_salao}`, {
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

    // Lista de nomes únicos de profissionais, usada no select de filtro.
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

    const hoje = new Date()
    const primeiroDiaMes = new Date(dataReferenciaMes.getFullYear(), dataReferenciaMes.getMonth(), 1)
    const ultimoDiaMes = new Date(dataReferenciaMes.getFullYear(), dataReferenciaMes.getMonth() + 1, 0)
    const vaziosMes = Array(primeiroDiaMes.getDay()).fill(null)
    const diasMes = Array.from({ length: ultimoDiaMes.getDate() }, (_, i) => i + 1)

    // Calcula o total de receita dos agendamentos exibidos na semana atual,
    // somando o campo "preco" de cada agendamento. Usado na seção financeiro.
    const totalSemana = agendamentos
        .filter((ag) => {
            const dataAg = new Date(ag.horario)
            return dataAg >= domingo && dataAg <= sabado
        })
        .reduce((soma, ag) => soma + (ag.preco || 0), 0)

    return (
        <div className="agenda-admin-janela">

            {/* Sidebar esquerda: cada ícone troca a secaoAtiva */}
            <div className="agenda-admin-sidebar">
                <div className="agenda-admin-logo">SALÃO</div>

                {/* Clicando nos ícones, o admin alterna entre as seções */}
                <div
                    className={`agenda-admin-nav-icone${secaoAtiva === 'agenda' ? ' ativo' : ''}`}
                    title="Agenda"
                    onClick={() => setSecaoAtiva('agenda')}
                >📅</div>

                <div
                    className={`agenda-admin-nav-icone${secaoAtiva === 'financeiro' ? ' ativo' : ''}`}
                    title="Financeiro"
                    onClick={() => setSecaoAtiva('financeiro')}
                >📊</div>

                <div
                    className={`agenda-admin-nav-icone${secaoAtiva === 'profissionais' ? ' ativo' : ''}`}
                    title="Profissionais"
                    onClick={() => setSecaoAtiva('profissionais')}
                >👥</div>
            </div>

            {/* Área central: muda conforme a secaoAtiva */}
            <div className="agenda-admin-conteudo">

            {/* Seção AGENDA: grade semanal com todos os agendamentos do salão */}
            {secaoAtiva === 'agenda' && (
             <>
              <div className="agenda-admin-navegacao-semana">
                <button onClick={() => mudarSemana(-1)}>‹</button>
                <span>{tituloSemana}</span>
                <button onClick={() => mudarSemana(1)}>›</button>
              </div>

              <div className="agenda-admin-grade-wrapper">
                <table className="agenda-admin-grade">
            <thead>
              <tr>
              <th className="agenda-admin-coluna-hora"></th>
                {DIAS_SEMANA.map((dia) => (
              <th key={dia}>{dia}</th>
                                        ))}
            </tr>
         </thead>
              <tbody>
                {HORARIOS.map((hora) => (
              <tr key={hora}>
              <td className="agenda-admin-coluna-hora">{hora}</td>
              {Array.from({ length: 7 }, (_, diaIndex) => {
              const dataCelula = new Date(domingo)
                dataCelula.setDate(dataCelula.getDate() + diaIndex)

              const agendamentoDoSlot = agendamentos.find((ag) => {
              const dataAg = new Date(ag.horario)
              const mesmoDia = dataAg.toDateString() === dataCelula.toDateString()
              const mesmaHora = dataAg.getHours() === parseInt(hora.split(':')[0])
                // Aplica o filtro de profissional se houver um selecionado.
              const passaFiltro = !filtroProfissional || ag.profissional === filtroProfissional
                return mesmoDia && mesmaHora && passaFiltro
         })

            return (
              <td key={diaIndex}>
                {agendamentoDoSlot && (
    // O admin vê o nome do profissional E do cliente no cartão.
                <div className="agenda-admin-cartao">
                  <b>{agendamentoDoSlot.profissional}</b>
                   <span>{agendamentoDoSlot.cliente}</span>
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

        {mensagem && <p className="agenda-admin-mensagem">{mensagem}</p>}
            </>
        )}

        {/* Seção FINANCEIRO: resumo de receita da semana */}
        {secaoAtiva === 'financeiro' && (
            <div className="agenda-admin-secao">
                <h2>Financeiro</h2>
        {/* Total da semana atual, calculado somando o campo preco dos agendamentos */}
            <div className="agenda-admin-card-financeiro">
                <p className="agenda-admin-label">Receita desta semana</p>
                <p className="agenda-admin-valor">R$ {totalSemana.toFixed(2)}</p>
            </div>
        {/* Lista de todos os agendamentos com preço, para o admin ver as transações */}
            <div className="agenda-admin-lista-transacoes">
                <p className="agenda-admin-titulo-lista">Todos os agendamentos</p>
                    {agendamentos.length === 0
                        ?<p className="agenda-admin-vazio">Nenhum agendamento encontrado.</p>
                        :agendamentos.map((ag, i) => (
                    <div key={i} className="agenda-admin-transacao">
                        <span>{new Date(ag.horario).toLocaleDateString('pt-BR')}</span>
                        <span>{ag.profissional} → {ag.cliente}</span>
                        <span>R$ {(ag.preco || 0).toFixed(2)}</span>
                    </div>
                ))
            }
        </div>
    </div>
)}

        {/* Seção PROFISSIONAIS: lista dos profissionais com agendamentos no salão */}
        {secaoAtiva === 'profissionais' && (
            <div className="agenda-admin-secao">
                <h2>Profissionais</h2>
                {nomesUnicos.length === 0
                    ?<p className="agenda-admin-vazio">Nenhum profissional com agendamentos ainda.</p>
                    :nomesUnicos.map((nome) => (
    // Cada cartão mostra o nome do profissional e quantos agendamentos ele tem.
            <div key={nome} className="agenda-admin-cartao-profissional">
            <div className="agenda-admin-avatar">{nome.charAt(0).toUpperCase()}</div>
                <div>
                    <p className="agenda-admin-nome-prof">{nome}</p>
                    <p className="agenda-admin-qtd-agend">
                    {agendamentos.filter((ag) => ag.profissional === nome).length} agendamento(s)
                </p>
            </div>
        </div>
    ))
}
    </div>
          )}
            </div>

        {/* Sidebar direita: mini-calendário + filtro de profissional */}
        <div className="agenda-admin-painel-direito">

            <div className="agenda-admin-mini-calendario">
            <div className="agenda-admin-mini-calendario-cabecalho">
                <span>{MESES[dataReferenciaMes.getMonth()]} {dataReferenciaMes.getFullYear()}</span>
            <div>
                <button onClick={() => mudarMes(-1)}>‹</button>
                <button onClick={() => mudarMes(1)}>›</button>
            </div>
        </div>
            <div className="agenda-admin-mini-grade">
                {DIAS_SEMANA.map((dia) => (
            <div key={dia} className="agenda-admin-dia-semana">{dia}</div>
        ))}
                {vaziosMes.map((_, i) => (
            <div key={`vazio-${i}`} className="agenda-admin-dia agenda-admin-vazio"></div>
    ))}
                {diasMes.map((dia) => {
                  const ehHoje = dia === hoje.getDate()
                  && dataReferenciaMes.getMonth() === hoje.getMonth()
                  && dataReferenciaMes.getFullYear() === hoje.getFullYear()

                return (
                  <div
                    key={dia}
                    className={`agenda-admin-dia${ehHoje ? ' agenda-admin-hoje' : ''}`}
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

        {/* Filtro de profissional: só aparece na seção agenda */}
        {secaoAtiva === 'agenda' && (
          <div className="agenda-admin-filtro">
            <p className="agenda-admin-titulo-secao">Filtrar por profissional</p>
            <select value={filtroProfissional} onChange={(e) => setFiltroProfissional(e.target.value)}>
            <option value="">Todos</option>
        {nomesUnicos.map((nome) => (
          <option key={nome} value={nome}>{nome}</option>
        ))}
    </select>
</div>
        )}

        </div>

    </div>
)
}

export default AgendaAdmin