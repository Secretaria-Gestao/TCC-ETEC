import './CadastroColaborador.css'

import BarraLateral from '../../../../components/BarraLateral/BarraLateral.jsx'
import Header from '../../../../components/Header/Header.jsx'
import Formulario from './components/Formulario/Formulario.jsx'

import { useState, useEffect } from 'react'
import { useNotificacaoStore } from "@/Notificacao/notificacaoStore.js"
import { buscarSalao } from '../../../../services/BuscarSalao.js'
import { pegarSessao } from '../../../../services/pegarSessao.js'
import { cadastrarColaborador } from '../../services/CadastroColaborador'


function CadastroColaborador() {
    const mostrarNotificacao = useNotificacaoStore((state) => state.mostrarNotificacao)

    const [dados, setDados] = useState({
        nome: "",
        sobrenome: "",

        cargo: "",
        telefone: "",

        email: "",
        senha: "",
        nivelAcesso: "1"
    })

    const nomeUsuario = `${dados.nome} ${dados.sobrenome}`;

    const [nomeSalao, setNomeSalao] = useState("")

    async function mandarFormulario() {
        const resposta = await cadastrarColaborador(dados.email, dados.senha, nomeUsuario, dados.cargo, dados.telefone, dados.nivelAcesso);

        if (resposta) {
            mostrarNotificacao({
                titulo: "Cadastro concluído!",
                texto: "Profissional cadastrado no salão com sucesso."
            });
        }
    }

    useEffect(() => { // Precisa disso para fazer a busca do nome do salão usando o React
        async function pegarNomeSalao() {
            const sessao = await pegarSessao()

            if (!sessao) {
                return
            }

            const salao = await buscarSalao(sessao.user.email)
            setNomeSalao(salao.nome_salao)
        }

        pegarNomeSalao()

    }, []) // [] = roda só uma vez quando o componente aparecer na tela, para não re-renderizar a tela várias vezes causando lentidão

    return (
        <main className='main-principal flex'>
            <div className='w-full h-full flex backdrop-blur-md'>
                <div className='flex'>
                    <BarraLateral />
                </div>
                <div className='w-full'>
                    <Header titulo="Novo profissional" subtitulo={nomeSalao}>
                        <button type="button" className='absolute bg-marrom text-laranja right-0 p-4! mt-[-36px] w-29 lg:right-20 lg:w-39 xl:right-40 rounded-2xl' onClick={mandarFormulario}>
                            Criar profissional
                        </button>
                    </Header>
                    <hr className='w-10/12 place-self-center mt-[-36px]' />
                    <div className='flex justify-center h-160 my-[2%]!'>
                        <Formulario dados={dados} setDados={setDados} />
                    </div>
                </div>
            </div>
        </main>
    )
}

export default CadastroColaborador
