import { useLocation, Link } from 'react-router';

import './Cadastro.css';

import CadastroCliente from "./components/CadastroCliente/CadastroCliente.jsx"
import CadastroGerente from "./components/CadastroGerente/CadastroGerente.jsx"
import CadastroColaborador from "./components/CadastroColaborador/CadastroColaborador.jsx"

function Cadastro() {

    const rotaAtual = useLocation()

    return (
        <div className="cadastro-page">
            <Link className='Voltar' to={'/'}>voltar</Link>

            {rotaAtual.pathname == "/cadastro/cliente"? <CadastroCliente /> : undefined}
            {rotaAtual.pathname == "/cadastro/gerente"? <CadastroGerente /> : undefined}
            {rotaAtual.pathname == "/cadastro/colaborador"? <CadastroColaborador /> : undefined}
            
        </div>
    )

}

export default Cadastro
