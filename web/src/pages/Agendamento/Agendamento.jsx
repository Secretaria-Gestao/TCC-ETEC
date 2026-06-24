import './Agendamento.css'
import Formulario from './components/Formulario.jsx'
import { Link } from 'react-router'

function Agendamento() {
    return (
        <div className="agendamento-page">
            <Link className='Voltar' to={'/'}>voltar</Link>
            <Formulario />
        </div>
    )
}

export default Agendamento
