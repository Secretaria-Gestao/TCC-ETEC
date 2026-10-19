import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { mandarAgendamento } from '../../services/Agendamento.js'

import { pegarSessao } from '../../../../services/pegarSessao.js'
import { buscarTodosProfissionais } from "../../../../services/BuscarProfissionais.js"
import { buscarSaloes } from '../../services/buscarSaloes.js'
import { buscarServicos } from "../../services/buscarServicos.js"
import { useNotificacaoStore } from "@/Notificacao"
import './Formulario.css'

function Formulario() {
    const navegar = useNavigate()
    const [todosProfissionais, setTodosProfissionais] = useState([])
    const [todosServicos, setTodosServicos] = useState([])
    const [todosSaloes, setTodosSaloes] = useState([])
    const [dados, setDados] = useState({
        servicos: [1],
        profissional: "",
        dia: "",
        horario: "",
        endereco: "",
        preco: 0
    })
    const mostrarNotificacao = useNotificacaoStore((state) => state.mostrarNotificacao)

    useEffect(() => {
        async function buscarDados() {
            const respostaSaloes = await buscarSaloes()

            if (!respostaSaloes || respostaSaloes.length === 0) {
                setTodosSaloes([])
                return
            }

            setTodosSaloes(respostaSaloes)
            setDados((dadosAntigos) => ({
                ...dadosAntigos,
                endereco: respostaSaloes[0].id_salao
            }))
        }

        buscarDados()
    }, [])


    useEffect(() => {
        if (!dados.endereco) {
            setTodosProfissionais([])
            return
        }

        async function buscarProfissionais(idSalao) {
            const resposta = await buscarTodosProfissionais(idSalao)

            if (!resposta || !resposta.sucesso || !resposta.profissional) {
                setTodosProfissionais([])
                return
            }

            setTodosProfissionais(resposta.profissional)

            if (resposta.profissional.length > 0) {
                setDados((dadosAntigos) => ({
                    ...dadosAntigos,
                    profissional: resposta.profissional[0].id_profissional
                }))
            }
        }

        buscarProfissionais(dados.endereco)
    }, [dados.endereco])

    useEffect(() => { // Serve somente para pegar os serviços do profissional selecionado
        async function buscarServicoS() {
            setDados(dadosAntigos => ({
                ...dadosAntigos,
                servicos: [],
                preco: 0
            }))
            const respostaServicos = await buscarServicos(dados.profissional)

            const servicosValidos = respostaServicos.filter(s => s.servicos)

            if (servicosValidos.length > 0) {
                setTodosServicos(servicosValidos)

                setDados(dadosAntigos => ({
                    ...dadosAntigos,
                    servicos: [servicosValidos[0].id_servico],
                    preco: servicosValidos[0].servicos?.preco_servico
                }))
            }
        }

        buscarServicoS()

    }, [dados.profissional])

    function resetarDados() {
        setDados({
            servicos: [1],
            profissional: dados.profissional,
            dia: "",
            horario: "",
            endereco: dados.endereco
        })
    }

    async function enviarDados() {
        const resultadoToken = await pegarSessao()

        if (resultadoToken) {
            const token = resultadoToken.access_token
            const respostaFetch = await mandarAgendamento(
                token,
                dados.servicos,
                dados.profissional,
                dados.dia,
                dados.horario,
                dados.endereco,
                dados.preco
            )

            if (respostaFetch.ok) {
                mostrarNotificacao({
                    titulo: "Agendamento Concluído!",
                    mostrarBotao: true,
                    lblBotao: "Clique aqui para conferir seus agendamentos",
                    textoBotao: "Meus agendamentos",
                    funcaoBotao: () => {
                        navegar("/agendamento/meus-agendamentos")
                    }
                })
                return
            }

            mostrarNotificacao({
                titulo: "Erro no agendamento!",
                texto: "Confira novamente os dados e tente novamente"
            })
        }

        else {
            alert("Você precisa estar logado!")
            navegar('/')
        }
    }

    function adicionarServico() {

        let valorTotal = todosServicos[0].servicos?.preco_servico

        dados.servicos.forEach(servico => {
            const servicoSelecionado = todosServicos.find(s => s.id_servico == servico)

            valorTotal += Number(servicoSelecionado.servicos?.preco_servico)
        })

        if (todosServicos[0].servicos != undefined) {

            setDados(dadosAntigos => ({
                ...dadosAntigos,
                servicos: [...dadosAntigos.servicos, todosServicos[0].id_servico],
                preco: valorTotal
            }))
        }

    }

    function mudarValorDados(evento) {
        const nomeCampo = evento.target.name
        const valorCampo = evento.target.value

        setDados({
            ...dados,
            [nomeCampo]: valorCampo
        })
    }

    function mudarValorServico(evento, indice) {
        const novaLista = [...dados.servicos]
        novaLista[indice] = Number(evento.target.value)

        setDados(dadosAntigos => ({
            ...dadosAntigos,
            servicos: novaLista,
        }))

        let valorTotal = 0

        novaLista.forEach(servico => {
            const servicoSelecionado = todosServicos.find(s => s.id_servico == servico)

            valorTotal += Number(servicoSelecionado.servicos?.preco_servico)
        })

        setDados(dadosAntigos => ({
            ...dadosAntigos,
            preco: valorTotal
        }))

    }

    return (
        <form className='agendamento-form md:w-full'>
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
                    <input type="date" name="dia" onChange={mudarValorDados} />
                </div>

                <div>
                    <label>Horario da sessão:</label>
                    <input type="time" name="horario" onChange={mudarValorDados} />
                </div>
            </div>

            <div className="card_2">
                <header className="agendamento-header">
                    <h1 className="agendamento-title bold">Agendamento</h1>
                    <img className="logo" src="/logo_pequena.png" alt="logo secretária gestão" />
                </header>


                <p className='text-white ml-1'> R$ {dados.preco || 0},00</p>


                <div>
                    <select name="endereco" className="local" value={dados.endereco} onChange={mudarValorDados}>
                        {todosSaloes.map((salao) => {
                            return (
                                <option key={salao.id_salao} value={salao.id_salao}> {`${salao.nome_salao}. ${salao.endereco_salao}`} </option>
                            )
                        })}
                    </select>
                </div>

                <div className="div_btn">
                    <button id="btn-enviar" type="button" className="enviar solid" onClick={enviarDados}> Enviar </button>
                    <button id="btn-resetar" type="reset" className="resetar solid" onClick={resetarDados}> Resetar </button>
                </div>

            </div>
        </form>
    )
}

export default Formulario
