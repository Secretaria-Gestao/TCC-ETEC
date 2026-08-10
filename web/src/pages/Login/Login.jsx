import './Login.css'
import FormularioLogin from "./components/FormularioLogin/FormularioLogin.jsx";
import { Link } from 'react-router';

function Login() {
    return (
        <div className='login-page min-h-dvh px-3! py-6!'>
            <Link className='Voltar' to={'/'}>voltar</Link>
            <FormularioLogin />
        </div>
    )
}
export default Login
