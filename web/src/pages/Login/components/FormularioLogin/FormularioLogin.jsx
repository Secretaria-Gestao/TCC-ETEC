import { useState } from "react"
import { useNavigate, useLocation, Link } from "react-router"

import { logar } from "../../services/login.js"
import './FormularioLogin.css'

function FormularioLogin() {

    const navegar = useNavigate()
    const rotaAtual = useLocation()

    const [formulario, setFormulario] = useState({
        email: "",
        senha: ""
    })

    function mudarValor(evento) {
        const nomeCampo = evento.target.name
        const valorCampo = evento.target.value

        setFormulario({
            ...formulario,
            [nomeCampo]: valorCampo
        })
    }

    async function enviarFormulario(event) {
        event.preventDefault()

        const resultado = await logar(formulario.email, formulario.senha)

        if (resultado) {
            rotaAtual.pathname == "/login/cliente" ? navegar('/agendamento') : undefined
            rotaAtual.pathname == "/login/colaborador" ? navegar('/agendamento') : undefined
            rotaAtual.pathname == "/login/gerente" ? navegar('/cadastro/colaborador') : undefined
        }
    }

    return (
        <>
            <main className="login-main w-[94vw] max-w-[720px] p-5! max-[728px]:p-5! sm:p-7! md:w-[68vw] md:p-10! lg:w-[52vw] lg:p-14! xl:w-[39vw] xl:p-[60px]!">
                <form className="login-form" onSubmit={enviarFormulario}>
                    <b>
                        <p id="logando"> Entrar na conta </p>
                    </b>

                    <div className="campo">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" placeholder="seu@email.com" onChange={mudarValor} />

                        <div className="error" id="email-required-error">
                            Email é obrigatório
                        </div>

                        <div className="error" id="email-invalid-error">
                            Email é inválido
                        </div>
                    </div>

                    <div className="campo">
                        <label htmlFor="senha">Senha</label>
                        <input type="password" name="senha" id="password" placeholder="sua senha" onChange={mudarValor} />

                        <div className="error" id="password-required-error">
                            Senha é obrigatória
                        </div>
                    </div>

                    <button type="button" className="clear" id="recover-password-button">
                        Recuperar senha
                    </button>

                    <button type="submit" className="solid" id="login-button">
                        Entrar
                    </button>

                    <Link to="/cadastro/cliente" id="btn_cadastrar" className="outline button-link">
                        Cadastrar-se
                    </Link>

                    <p className="ou"> Ou </p>

                    <p className="txtgoogle">Sem tempo para perder? Entre com o Google</p>

                    <button type="button" name="google" className="solid google">
                        <img
                            src="https://cdn-icons-png.flaticon.com/256/2504/2504739.png"
                            alt="Imagem Google"
                            className="img_google"
                        />
                        Entrar com o google
                    </button>
                </form>
            </main>
        </>
    )
}

export default FormularioLogin
