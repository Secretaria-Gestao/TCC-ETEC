import { cadastrarColaborador } from '../../../../services/CadastroColaborador.js'
import { buscarSalao } from '../../../../../../services/BuscarSalao.js'
import { pegarSessao } from '../../../../../../services/pegarSessao.js'
import { useNotificacaoStore } from "@/Notificacao/notificacaoStore.js"
import { useEffect, useState } from 'react'
import './Header.css'

function Header({ dados, nomeUsuario }) {
    const [nomeSalao, setNomeSalao] = useState("carregando...")
    const mostrarNotificacao = useNotificacaoStore((state) => state.mostrarNotificacao)

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

    async function mandarFormulario() {
        const resposta = await cadastrarColaborador(dados.email, dados.senha, nomeUsuario, dados.cargo, dados.telefone, dados.nivelAcesso);

        if (resposta) {
            mostrarNotificacao({
                titulo: "Cadastro concluído!",
                texto: "Profissional cadastrado no salão com sucesso."
            });
        }
    }

    return (
        <header className='w-full h-32 items-center flex'>
            <div className='flex flex-col items-center justify-between flex-1 text-center'>
                <h1 className='text-3xl'>Novo profissional</h1>
                <p>{nomeSalao}</p>
            </div>
            <button type="button" className='absolute bg-marrom text-laranja right-15 p-4! w-29 lg:right-20 lg:w-39 xl:right-40 rounded-2xl' onClick={mandarFormulario}>
                Criar profissional
            </button>
        </header>
    )
}

export default Header
