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
        servicos: [],
        profissional: "",
        dia: "",
        horario: "",
        endereco: "",
        preco: 0
    })
    const mostrarNotificacao = useNotificacaoStore((state) => state.mostrarNotificacao)

    const [enviando, setEnviando] = useState(false)
    const hoje = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10)

   // Soma o preço de uma lista de ids de serviço (única fonte do total)
function calcularTotal(listaIds) {
    return listaIds.reduce((soma, id) => {
        // Procura o serviço pelo id; Number() evita falha entre "31" e 31
        const s = todosServicos.find(item => Number(item.id_servico) === Number(id))

        // Se não achar o serviço, soma 0 em vez de quebrar
        return soma + Number(s?.servicos?.preco_servico || 0)
    }, 0)
}

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
            setDados((d) => ({ ...d, profissional: "" }))
            return
        }

        async function buscarProfissionais(idSalao) {
            const resposta = await buscarTodosProfissionais(idSalao)

            if (!resposta || !resposta.sucesso || !resposta.profissional) {
                setTodosProfissionais([])
                setDados((d) => ({ ...d, profissional: "" }))
                return
            }

            setTodosProfissionais(resposta.profissional)

            setDados((dadosAntigos) => ({
                ...dadosAntigos,
                profissional: resposta.profissional[0]?.id_profissional ?? ""
            }))
        }

        buscarProfissionais(dados.endereco)
    }, [dados.endereco])

   useEffect(() => { // Pega os serviços do profissional selecionado
    let cancelado = false // evita que uma resposta antiga sobrescreva a do profissional atual

    async function buscarServicoS() {
        // Limpa já, para nunca mostrar serviços do profissional anterior
        setTodosServicos([])
        setDados(d => ({ ...d, servicos: [], preco: 0 }))
        if (!dados.profissional) return

        const resposta = await buscarServicos(dados.profissional)
        if (cancelado) return

        // buscarServicos devolve false sem sessão: só aceitamos array
        const validos = Array.isArray(resposta) ? resposta.filter(s => s.servicos) : []

        // Atualiza SEMPRE, mesmo vazio (antes a lista antiga ficava)
        setTodosServicos(validos)
        if (validos.length > 0) {
            setDados(d => ({
                ...d,
                servicos: [validos[0].id_servico],
                preco: Number(validos[0].servicos?.preco_servico || 0)
            }))
        }
    }

    buscarServicoS()
    return () => { cancelado = true }
}, [dados.profissional])

    function resetarDados() {
    setDados({
        // volta ao primeiro serviço do profissional atual
        servicos: todosServicos[0] ? [todosServicos[0].id_servico] : [],
        preco: Number(todosServicos[0]?.servicos?.preco_servico || 0),
        profissional: dados.profissional,
        dia: "",
        horario: "",
        endereco: dados.endereco
    })
}

    async function enviarDados() {
    if (enviando) return // evita clique duplo

    // Só aceita serviços que pertencem ao profissional selecionado
    const idsPermitidos = todosServicos.map(s => Number(s.id_servico))
    const servicosOk = dados.servicos.length > 0 &&
        dados.servicos.every(id => idsPermitidos.includes(Number(id)))

    if (!dados.profissional || !servicosOk || !dados.dia || !dados.horario || dados.dia < hoje) {
        mostrarNotificacao({
            titulo: "Dados inválidos",
            texto: "Escolha profissional, serviços, uma data a partir de hoje e um horário."
        })
        return
    }

    setEnviando(true)
    try {
        const resultadoToken = await pegarSessao()

        if (!resultadoToken) {
            alert("Você precisa estar logado!")
            navegar('/')
            return
        }

        const respostaFetch = await mandarAgendamento(
            resultadoToken.access_token,
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
            // Mostra a mensagem do servidor (ex.: 409 "Profissional já possui serviço neste horário")
            texto: respostaFetch.erro || "Confira novamente os dados e tente novamente"
        })
    } finally {
        setEnviando(false) // libera o botão mesmo se der erro
    }
}

    function adicionarServico() {
    // Adiciona o primeiro serviço que ainda não foi escolhido
    const disponivel = todosServicos.find(s => !dados.servicos.includes(s.id_servico))
    if (!disponivel) return // todos já escolhidos (ou lista vazia)

    const novaLista = [...dados.servicos, disponivel.id_servico]
    setDados(d => ({ ...d, servicos: novaLista, preco: calcularTotal(novaLista) }))
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
    // Uma única atualização, com o total recalculado da lista inteira
    setDados(d => ({ ...d, servicos: novaLista, preco: calcularTotal(novaLista) }))
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
                    <input type="date" name="dia" min={hoje} value={dados.dia} onChange={mudarValorDados} />
                </div>

                <div>
                    <label>Horario da sessão:</label>
                    <input type="time" name="horario" value={dados.horario} onChange={mudarValorDados} />
                </div>
            </div>

            <div className="card_2">
                <header className="agendamento-header">
                    <h1 className="agendamento-title bold">Agendamento</h1>
                    <img className="logo" src="/logo_pequena.png" alt="logo secretária gestão" />
                </header>


                <p className='text-white ml-1'> 
                   {Number(dados.preco || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                   </p>


                <div>
                    {todosSaloes.length === 0 && <p className='text-white'>Nenhum salão disponível no momento.</p>}
                    <select name="endereco" className="local" value={dados.endereco} onChange={mudarValorDados}>
                        {todosSaloes.map((salao) => {
                            return (
                                <option key={salao.id_salao} value={salao.id_salao}> {`${salao.nome_salao}. ${salao.endereco_salao}`} </option>
                            )
                        })}
                    </select>
                </div>

                <div className="div_btn">
                    <button id="btn-enviar" type="button" className="enviar solid" onClick={enviarDados} disabled={enviando || todosSaloes.length === 0}> {enviando ? 'Enviando...' : 'Enviar'} </button>
                    <button id="btn-resetar" type="reset" className="resetar solid" onClick={resetarDados}> Resetar </button>
                </div>

            </div>
        </form>
    )
  }
  
export default Formulario
