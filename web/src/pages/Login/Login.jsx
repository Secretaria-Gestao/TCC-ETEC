import './Login.css'
import FormularioLogin from "./components/FormularioLogin/FormularioLogin.jsx";
import { Link } from 'react-router';

function Login() {
    return (
        <div className='login-page'>
            <Link className='Voltar' to={'/'}>voltar</Link>
            <FormularioLogin />
        </div>
    )
}
export default Login