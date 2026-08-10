import { Link } from "react-router"

import Formulario from './components/Formulario/Formulario.jsx'
import './Agendamento.css'

function Agendamento() {
    return (
        <div className="agendamento-page">
            <Link className='Voltar' to={'/'}>voltar</Link>
            <Formulario />
        </div>
    )
}

export default Agendamento
