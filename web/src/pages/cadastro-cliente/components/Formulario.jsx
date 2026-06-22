import { useState } from "react"

function Formulario() {
    function pararSubmit(event) {
        event.preventDefault()
    }

    const [ formulario, setFormulario ] = useState( {
        'nome': '',
        'email': '',
        'senha': ''
    })

    return (
        <>
            <main>
                <form onSubmit={pararSubmit}>
                    <b>
                        <p id="logando">Entrar na conta</p>
                    </b>

                    <div className="campo">
                        <div id="lblNome" className="oculto">
                            <label htmlFor="userName">Nome</label><br />
                            <input type="text" id="userName" placeholder="Seu nome" />
                        </div>
                    </div>

                    <div className="campo">
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email" id="email" placeholder="seu@email.com" />

                        <div className="error" id="email-required-error">
                            Email é obrigatório
                        </div>

                        <div className="error" id="email-invalid-error">
                            Email é inválido
                        </div>
                    </div>

                    <div className="campo">
                        <label htmlFor="password">Senha</label>
                        <input type="password" name="password" id="password" placeholder="sua senha" />

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

                    <button type="button" id="btn_cadastrar" className="outline">
                        Cadastrar-se
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
