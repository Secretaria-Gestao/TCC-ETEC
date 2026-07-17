import './Header.css'
import { cadastrarColaborador } from '../../../../services/CadastroColaborador.js'
import { buscarProfissionalPorEmail } from '../../../../../../services/BuscarProfissionais.js'
import { buscarSalao } from '../../../../../../services/BuscarSalao.js'
import { supabase } from '../../../../../../services/SupabaseConfig.js'
import { useEffect, useState } from 'react'

function Header({ dados, nomeUsuario }) {

    const [nomeSalao, setNomeSalao] = useState("carregando...")

    useEffect(() => {
        async function pegarNomeSalao() {
            const { data: { user }, error } = await supabase.auth.getUser()

            if (error) {
                return
            }

            const salao = await buscarSalao(user.email)
            setNomeSalao(salao.nome_salao)
        }

        pegarNomeSalao()
    }, []) // [] = roda só uma vez quando o componente aparecer na tela

    async function mandarFormulario() {
        const resposta = await cadastrarColaborador(dados.email, dados.senha, nomeUsuario, dados.cargo, dados.telefone, dados.nivelAcesso)

        if (resposta) {
            alert("Deu certo o cadastro do profissional")
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
