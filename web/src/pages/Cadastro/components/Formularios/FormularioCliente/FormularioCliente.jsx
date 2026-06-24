import { useState } from "react"
import '../Formulario.css'
import { logar, cadastrar } from "../../../../../services/acessar-conta.js"

function Formulario() {
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

    const [mudarForm, setMudarForm] = useState({
        msgForm: "Cadastrar-se",
        btnEnviar: "Entrar",
        classeOculto: "oculto",
    })

    function mudarMsgForm() {
        setMudarForm({
            msgForm: mudarForm.msgForm == "Cadastrar-se" ? "Entrar na conta" : "Cadastrar-se",
            btnEnviar: mudarForm.btnEnviar == "Entrar" ? "Cadastrar-se" : "Entrar",
            classeOculto: mudarForm.classeOculto == "oculto" ? "" : "oculto",
        })
    }

    function enviarFormulario(event) {
        event.preventDefault()

        if (mudarForm.btnEnviar == "Entrar") {
            logar(formulario.email, formulario.senha)
        }
        else {
            cadastrar(formulario.nome, formulario.email, formulario.senha)
        }
    }

    
    return (
        <>
            <main>
                <form onSubmit={enviarFormulario}>
                    <b>
                        <p id="logando"> {mudarForm.msgForm} </p>
                    </b>

                    <div className="campo">
                        <div id="lblNome" className={mudarForm.classeOculto}>
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

                    <button type="button" className="clear" id="recover-password-button">
                        Recuperar senha
                    </button>

                    <button type="submit" className="solid" id="login-button">
                        {mudarForm.btnEnviar}
                    </button>

                    <button type="button" id="btn_cadastrar" className="outline" onClick={mudarMsgForm}>
                        {mudarForm.msgForm}
                    </button>

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

export default Formulario
