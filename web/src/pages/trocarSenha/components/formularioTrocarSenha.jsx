import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { supabase } from '../../../services/SupabaseConfig.js';
import style from './formularioTrocarSenha.module.css'

function FormularioTrocarSenha() {
    const [novaSenha, setNovaSenha] = useState('')
    const [confirmar, setConfirmar] = useState('')
    const [sessaoValida, setSessaoValida] = useState(false)
    const [erro, setErro] = useState('')
    const [carregando, setCarregando] = useState(false)
    const navigate = useNavigate()

    // useEffect(() => {
    //     // O link do e-mail dispara PASSWORD_RECOVERY e cria uma sessão temporária
    //     const { data: { subscription } } = supabase.auth.onAuthStateChange((evento) => {
    //         if (evento === 'PASSWORD_RECOVERY') setSessaoValida(true)
    //     })
    //     // Cobre também o usuário já logado (ex.: vindo das Configurações)
    //     supabase.auth.getSession().then(({ data }) => {
    //         if (data.session) setSessaoValida(true)
    //     })
    //     return () => subscription.unsubscribe()
    // }, [])

    // async function handleSubmit(e) {
    //     e.preventDefault()
    //     setErro('')

    //     if (novaSenha.length < 6) return setErro('A senha deve ter pelo menos 6 caracteres.')
    //     if (novaSenha !== confirmar) return setErro('As senhas não coincidem.')

    //     setCarregando(true)
    //     const { error } = await supabase.auth.updateUser({ password: novaSenha })
    //     setCarregando(false)

    //     if (error) return setErro(error.message)
    //     navigate('/')
    // }

    // if (!sessaoValida) {
    //     return <p>Link inválido ou expirado. Solicite a recuperação de senha novamente.</p>
    // }

    return (
        // <form className='formulario-trocar-senha' onSubmit={handleSubmit}>
        <form className=''>
            <h1>Alterar senha</h1>

            <label htmlFor='novaSenha'>Nova senha:</label>
            <input id='novaSenha' type='password' value={novaSenha}
                   onChange={(e) => setNovaSenha(e.target.value)} required />

            <label htmlFor='confirmar'>Confirmar nova senha:</label>
            <input id='confirmar' type='password' value={confirmar}
                   onChange={(e) => setConfirmar(e.target.value)} required />

            {erro && <p className='erro'>{erro}</p>}

            <button type='submit' disabled={carregando}>
                {carregando ? 'Salvando...' : 'Salvar'}
            </button>
        </form>
    )
}
export default FormularioTrocarSenha