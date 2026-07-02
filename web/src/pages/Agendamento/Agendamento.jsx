import './Agendamento.css'
import Formulario from './components/Formulario/Formulario.jsx'
import MeusAgendamentos from './components/MeusAgendamentos/MeusAgendamentos.jsx'
import { Link, useLocation} from 'react-router'

function Agendamento() {
     const rotaAtual = useLocation()
    return (
        <div className="agendamento-page">
            <Link className='Voltar' to={'/'}>voltar</Link>
            {rotaAtual.pathname == '/agendamento/agendar'?<Formulario/> : undefined}
            {rotaAtual.pathname == '/agendamento/meus-agendamentos'?<MeusAgendamentos/> : undefined}

            <Formulario />
        </div>
    )
}

export default Agendamento
