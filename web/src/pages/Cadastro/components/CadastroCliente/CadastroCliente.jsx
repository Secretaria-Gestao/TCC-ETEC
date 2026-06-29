import { useState } from "react"
import { useNavigate, Link } from "react-router"

import { cadastrarCliente } from "../../services/CadastroCliente.js"
import '../Formulario.css'

function CadastroCliente() {

    const navegar = useNavigate()

    const [formulario, setFormulario] = useState({
        nome: "",
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

        const resultado = await cadastrarCliente(formulario.nome, formulario.email, formulario.senha)

        if (resultado) {
            navegar('/agendamento')
        }

    }

    return (
        <>
            <main className="cadastro-main">
                <form className="cadastro-form" onSubmit={enviarFormulario}>
                    <b>
                        <p id="logando"> Cadastrar-se </p>
                    </b>

                    <div className="campo">
                        <div id="lblNome" >
                            <label htmlFor="userName">Nome</label><br />
                            <input id="userName" name="nome" placeholder="Seu nome" onChange={mudarValor} />
                        </div>
                    </div>

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

                    <button type="submit" className="solid" id="login-button">
                        Cadastrar-se
                    </button>

                    <Link to="/login/cliente" className="outline button-link">
                        Entrar na conta
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

export default CadastroCliente
