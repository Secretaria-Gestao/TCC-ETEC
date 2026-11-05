import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { mandarAgendamento } from './services/Agendamento.js'
import { buscarHorarios } from '../../services/horariosSalao.js'

import { buscarTodosProfissionais } from "../../services/BuscarProfissionais.js"
import { buscarSaloes } from './services/buscarSaloes.js'
import { buscarServicos } from "./services/buscarServicos.js"
import { useNotificacaoStore } from "@/Notificacao"

import BarraLateral from "@/BarraLateral/BarraLateral"
import Card1 from './components/Card1/Card1'
import Card2 from "./components/Card2/Card2"
import './Agendamento.css'
import './components/Cards.css'

function Agendamento() {

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

    // Horários de funcionamento do salão escolhido ([] = salão sem horários configurados)
    const [horariosSalao, setHorariosSalao] = useState([])

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

    // Recarrega sempre que o cliente troca de salão (dados.endereco guarda o id_salao)
    useEffect(() => {
        if (!dados.endereco) { setHorariosSalao([]); return }
        buscarHorarios(dados.endereco)
            .then(setHorariosSalao)
            .catch(() => setHorariosSalao([])) // se falhar, não bloqueia o agendamento
    }, [dados.endereco])

    // Regra do dia escolhido (null = sem restrição)
    function regraDoDia(dia) {
        if (!dia || horariosSalao.length === 0) return null
        // "T00:00" faz o JS ler a data no fuso local; getDay(): 0 = domingo ... 6 = sábado
        const diaSemana = new Date(`${dia}T00:00`).getDay()
        const regra = horariosSalao.find((h) => h.dia_semana === diaSemana)
        if (!regra) return null
        return {
            fechado: regra.fechado,
            // O banco devolve "09:00:00"; o input de hora usa "09:00"
            abertura: regra.hora_abertura?.slice(0, 5),
            fechamento: regra.hora_fechamento?.slice(0, 5),
        }
    }

    const regra = regraDoDia(dados.dia)

    // Texto do problema ('' = tudo certo). "HH:MM" em texto compara certo com < e >=
    function motivoHorarioInvalido() {
        if (!regra) return ''
        if (regra.fechado) return 'O salão não funciona neste dia.'
        if (dados.horario && (dados.horario < regra.abertura || dados.horario >= regra.fechamento)) {
            return `Neste dia o salão funciona das ${regra.abertura} às ${regra.fechamento}.`
        }
        return ''
    }
    const avisoHorario = motivoHorarioInvalido()

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
            // O token agora é pego dentro do mandarAgendamento; sem sessão ele avisa e devolve undefined
            const respostaFetch = await mandarAgendamento(
                dados.servicos,
                dados.profissional,
                dados.dia,
                dados.horario,
                dados.endereco,
                dados.preco
            )

            // Bloqueia horário fora do funcionamento do salão
            if (avisoHorario) {
                mostrarNotificacao({ titulo: 'Horário indisponível', texto: avisoHorario })
                return
            }

            if (!respostaFetch) return

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
        <main className="main-principal">

            <div className="w-full h-full flex">

                <BarraLateral />

                <div className="flex flex-1 min-w-0">

                    <form className='agendamento-form md:w-full'>

                        <Card1
                            dados={dados}
                            todosServicos={todosServicos}
                            todosProfissionais={todosProfissionais}
                            hoje={hoje}
                            regra={regra}
                            avisoHorario={avisoHorario}
                            mudarValorDados={mudarValorDados}
                            mudarValorServico={mudarValorServico}
                            adicionarServico={adicionarServico}
                        />

                        <Card2
                            dados={dados}
                            todosSaloes={todosSaloes}
                            enviando={enviando}
                            avisoHorario={avisoHorario}
                            mudarValorDados={mudarValorDados}
                            enviarDados={enviarDados}
                            resetarDados={resetarDados}
                        />

                    </form>

                </div>

            </div>

        </main>
    )
}

export default Agendamento
