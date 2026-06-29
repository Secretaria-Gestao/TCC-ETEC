import './Header.css'
import { cadastrarColaborador } from '../../../../services/CadastroColaborador.js'

function Header({dados}) {
    async function mandarFormulario() {
        const resposta = await cadastrarColaborador(dados)
    }

    return (
        <header className='w-full h-32 items-center flex'>
            <div className='w-82 invisible sm:block'></div>
            <div className='flex flex-col items-center justify-between flex-1 text-center'>
                <h1 className='text-3xl'>Novo profissional</h1>
                <p> Nome do salão</p>
            </div>
            <button type="button" className='bg-marrom text-laranja p-4! mr-45! w-39 rounded-2xl'> Criar profissional </button>
        </header>
    )
}

export default Header