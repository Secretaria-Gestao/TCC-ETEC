import { useLocation, Link } from 'react-router';

import './Cadastro.css';

import FormularioCliente from './components/Formularios/FormularioCliente/FormularioCliente.jsx';
import FormularioAdm from './components/Formularios/FormularioAdm/FormularioAdm.jsx';

function CadastroCliente() {

    const rotaAtual = useLocation()

    return (
        <div className="cadastro-page">
            <Link className='Voltar' to={'/'}>voltar</Link>
            {rotaAtual.pathname == "/cadastro/cliente"? <FormularioCliente /> : <FormularioAdm />}
        </div>
    )

}

export default CadastroCliente
