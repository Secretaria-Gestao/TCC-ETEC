import { useState, useEffect } from 'react'
import { pegarMeuPerfil } from '../../../../services/pegarMeuPerfil.js'
import { pegarSessao } from '../../../../services/pegarSessao.js'
import { obterDomingoDaSemana, MESES } from './utils/agendaHelpers.js'

import SidebarNavegacao from './components/SidebarNavegacao'
import NavegacaoSemana from './components/NavegacaoSemana'
import GradeSemanal from './components/GradeSemanal'
import MiniCalendario from './components/MiniCalendario'
import FiltroProfissional from './components/FiltroProfissional'
import SecaoFinanceiro from './components/SecaoFinanceiro'
import SecaoProfissionais from './components/SecaoProfissionais'

import './AgendaAd.css'

function AgendaAdmin() {
    const [agendamentos, setAgendamentos] = useState([])
    const [agendamentosProprios, setAgendamentosProprios] = useState([])
    const [filtroProfissional, setFiltroProfissional] = useState('')
    const [dataReferenciaSemana, setDataReferenciaSemana] = useState(new Date())
    const [dataReferenciaMes, setDataReferenciaMes] = useState(new Date())
    const [mensagem, setMensagem] = useState('')
    const [secaoAtiva, setSecaoAtiva] = useState('agenda')

    useEffect(() => {
        async function carregarAgendamentos() {
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

                // Busca também só os agendamentos do próprio admin, usando a
                // mesma rota que o colaborador usa — passando o id do admin logado.
                const respostaPropria = await fetch(`/api/agendamentos/profissional/${perfil.id_profissional}`, {
                    method: 'GET',
                    headers: { 'Authorization': `Bearer ${token}` }
                })

                const resultadoProprio = await respostaPropria.json()

                if (resultadoProprio.sucesso) {
                    setAgendamentosProprios(resultadoProprio.agendamentos || [])
                }

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

    // Total de receita da semana atual, usado na seção Financeiro.
    const totalSemana = agendamentos
        .filter((ag) => {
            const dataAg = new Date(ag.horario)
            return dataAg >= domingo && dataAg <= sabado
        })
        .reduce((soma, ag) => soma + (ag.preco || 0), 0)

    // Aplica o filtro de profissional antes de passar pra grade da seção "Agenda".
    const agendamentosFiltrados = filtroProfissional
        ? agendamentos.filter((ag) => ag.profissional === filtroProfissional)
        : agendamentos

    return (
        <div className="agenda-admin-janela">
            <SidebarNavegacao secaoAtiva={secaoAtiva} setSecaoAtiva={setSecaoAtiva} />

            <div className="agenda-admin-conteudo">
                {secaoAtiva === 'agenda' && (
                    <>
                        <NavegacaoSemana tituloSemana={tituloSemana} mudarSemana={mudarSemana} />
                        <GradeSemanal
                            domingo={domingo}
                            agendamentos={agendamentosFiltrados}
                            campoPrincipal="profissional"
                            campoSecundario="cliente"
                        />
                        {mensagem && <p className="agenda-admin-mensagem">{mensagem}</p>}
                    </>
                )}

                {secaoAtiva === 'minha-agenda' && (
                    <>
                        <NavegacaoSemana tituloSemana={tituloSemana} mudarSemana={mudarSemana} />
                        <GradeSemanal
                            domingo={domingo}
                            agendamentos={agendamentosProprios}
                            campoPrincipal="cliente"
                            campoSecundario="status"
                        />
                    </>
                )}

                {secaoAtiva === 'financeiro' && (
                    <SecaoFinanceiro totalSemana={totalSemana} agendamentos={agendamentos} />
                )}

                {secaoAtiva === 'profissionais' && (
                    <SecaoProfissionais nomesUnicos={nomesUnicos} agendamentos={agendamentos} />
                )}
            </div>

            <div className="agenda-admin-painel-direito">
                <MiniCalendario
                    dataReferenciaMes={dataReferenciaMes}
                    mudarMes={mudarMes}
                    setDataReferenciaSemana={setDataReferenciaSemana}
                />

                {secaoAtiva === 'agenda' && (
                    <FiltroProfissional
                        filtroProfissional={filtroProfissional}
                        setFiltroProfissional={setFiltroProfissional}
                        nomesUnicos={nomesUnicos}
                    />
                )}
            </div>
        </div>
    )
}

export default AgendaAdmin