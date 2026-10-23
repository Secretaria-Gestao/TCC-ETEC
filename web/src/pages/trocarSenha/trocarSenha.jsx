import './trocarSenha.css'
import formularioTrocarSenha from "./components/formularioTrocarSenha.jsx";
import { Link } from 'react-router';

function trocarSenha() {
    return (
        <div className='trocar-senha-page min-h-dvh px-3! py-6!'>
            <Link className='Voltar' to={'/'}>voltar</Link>
            <formularioTrocarSenha />
        </div>
    )
}
export default trocarSenha
