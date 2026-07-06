import { use, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { mandarAgendamento } from '../../services/Agendamento.js'

import './Formulario.css'
import { pegarSessao } from '../../../../services/pegarSessao.js'
import { buscarTodosProfissionais } from "../../../../services/BuscarProfissionais.js"


function Formulario() {
    const navegar = useNavigate()

    const [todosProfissionais, setTodosProfissionais] = useState([])

    useEffect(() => {
        async function buscarDados() {
            const resposta = await buscarTodosProfissionais()

            setTodosProfissionais(resposta.profissional)

            if (resposta.profissional.length > 0) {
                setDados((dadosAntigos) => ({
                    ...dadosAntigos,
                    profissional: resposta.profissional[0].nome_profissional
                }))
            }

        }

        buscarDados()

    }, [])

    const [dados, setDados] = useState({
        servicos: [1],
        profissional: "",
        dia: "",
        horario: "",
        endereco: ""
    })

    function resetarDados() {
        setDados({
            servicos: [1],
            profissional: "",
            dia: "",
            horario: "",
            endereco: "",
        })
    }

    async function enviarDados() {
        const resultadoToken = await pegarSessao()
        console.log(resultadoToken)

        if (resultadoToken) {
            const token = resultadoToken.access_token
            const respostaFetch = await mandarAgendamento(
                token,
                dados.servicos,
                dados.profissional,
                dados.dia,
                dados.horario,
                dados.endereco
            )

            respostaFetch.ok ? navegar("/agendamento/meus-agendamentos") : alert("Deu ruim no agendamento")
        }

        else {
            alert("Você precisa estar logado!")
            navegar('/')
        }

    }

    function adicionarServico() {
        const quantidadeServicos = dados.servicos

        setDados({
            ...dados,
            servicos: [...dados.servicos, 1]
        })
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

        setDados({
            ...dados,
            servicos: novaLista
        })
    }

    console.log(dados)

    return (
        <form className='agendamento-form tudo'>

            <main className="agendamento-main">
                <div className="card_1">

                    <div className="lista_servicos" id="lista_servicos">


                        {
                            dados.servicos.map((servico, indice) => {
                                return (
                                    <div className="servico_adicionado" key={indice}>
                                        <label htmlFor="servico">Selecione o serviço:</label>
                                        <select name='servico' className="servico" value={servico} onChange={(evento) => mudarValorServico(evento, indice)} key={indice}>
                                            <option value="1">Barba</option>
                                            <option value="2">Cabelo</option>
                                            <option value="3">Hidratação capilar</option>
                                            <option value="4">Coloração</option>
                                            <option value="5">Manicure</option>
                                        </select>

                                        {
                                            indice == 0 ?
                                                <button type="button" className="btn_servico bg-white" id="btn_add_servico" onClick={adicionarServico}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"
                                                        className="bi bi-plus-lg " viewBox="0 0 16 16">
                                                        <path fillRule="evenodd"
                                                            d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2" />
                                                    </svg>
                                                </button>

                                                : undefined
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
                                    <option key={profissional.id_profissional} value={profissional.nome_profissional}>{profissional.nome_profissional}</option>
                                )
                            }
                            )
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
                    <div>
                        <select name="endereco" className="local" onChange={mudarValorDados}>
                            <option value="">Local</option>
                            <option value="Seu Jorge">Seu Jorge</option>
                            <option value="Unhas Cleide">Unhas Cleide</option>
                            <option value="Rua dos Bobos">Rua dos Bobos</option>
                            <option value="Casa Engraçada">Casa Engraçada</option>
                        </select>
                    </div>

                    <div className="div_btn">
                        <button id="btn-enviar" type="button" className="enviar solid" onClick={enviarDados}> Enviar </button>
                        <button id="btn-resetar" type="reset" className="resetar solid" onClick={resetarDados}> Resetar </button>
                    </div>

                </div>
            </main>
        </form>
    )
}

export default Formulario
