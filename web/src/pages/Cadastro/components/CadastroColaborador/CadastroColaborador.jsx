import './CadastroColaborador.css'

import BarraLateral from './components/BarraLateral/BarraLateral.jsx'
import Header from './components/Header/Header.jsx'
import Formulario from './components/Formulario/Formulario.jsx'
import { useState } from 'react'

function CadastroColaborador() {
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

    return (
        <>
            <main className='main-principal flex'>
                <div className='w-full h-full flex backdrop-blur-md'>
                    <div className='flex'>
                        <BarraLateral />
                    </div>
                    <div className='w-full'>
                        <Header dados={dados} nomeUsuario={nomeUsuario}/>
                        <hr className='w-10/12 place-self-center' />
                        <div className='flex justify-center h-8/10 items-center'>
                            <Formulario dados={dados} setDados={setDados} />
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default CadastroColaborador
