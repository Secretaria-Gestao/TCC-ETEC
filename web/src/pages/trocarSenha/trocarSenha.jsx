import style from './trocarSenha.module.css'
import FormularioTrocarSenha from './components/formularioTrocarSenha.jsx'
import { Link } from 'react-router'

function TrocarSenha() {
    return (
        <div className={`${style['trocar-senha-page']} min-h-dvh px-3! py-6!`}>
            <Link className='Voltar' to='/'>voltar</Link>
            <FormularioTrocarSenha />
        </div>
    )
}
export default TrocarSenha