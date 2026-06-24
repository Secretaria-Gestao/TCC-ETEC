import { useState } from "react"
import '../Formulario.css'
import { logar, cadastrarGerente, cadastrarSalao } from "../../../../../services/cadastro-login.js"

function Formulario() {
    const [formulario, setFormulario] = useState({
        email_profissional: "",
        senha: "",

        nome_profissional: "",
        telefone_profissional: "",

        nome_salao: "",
        endereco_salao: "",
        categoria_salao: ""

    })

    console.log(formulario)

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

    async function enviarFormulario(event) {
        const resposta = await cadastrarSalao( formulario.nome_salao, formulario.categoria_salao, formulario.endereco_salao )
        await cadastrarGerente( formulario.email_profissional, formulario.senha, formulario.nome_profissional, formulario.telefone_profissional, resposta)
    }

    const [etapaAtual, setEtapaAtual] = useState(1)

    const [etapas, setEtapas] = useState({
        etapa1: "campo",
        etapa2: "oculto",
        etapa3: "oculto"
    })

    function proximaEtapa() {
        setEtapaAtual(etapaAtual + 1)
        setEtapas({
            etapa1: etapaAtual == 0 ? "campo" : "oculto",
            etapa2: etapaAtual == 1 ? "campo" : "oculto",
            etapa3: etapaAtual == 2 ? "campo" : "oculto",
        })
    }

    return (
        <>
            <main className="cadastro-main">
                <form className="cadastro-form">
                    <b>
                        <p id="logando"> {mudarForm.msgForm} </p>
                    </b>

                    {/* Etapas */}

                    <div className="etapas">

                        <div className="etapa">
                            <p>Acesso</p>
                            <hr className={etapas.etapa1} />
                        </div>

                        <div className="etapa">
                            <p>Dados pessoais</p>
                            <hr className={etapas.etapa2} />
                        </div>

                        <div className="etapa">
                            <p>Salão</p>
                            <hr className={etapas.etapa3} />
                        </div>

                    </div>

                    {/* Etapa 1 */}

                    <div className={etapas.etapa1}>
                        <label htmlFor="email">Email</label>
                        <input type="email" name="email_profissional" id="email" placeholder="seu@email.com" onChange={mudarValor} />

                        <div className="error" id="email-required-error">
                            Email é obrigatório
                        </div>

                        <div className="error" id="email-invalid-error">
                            Email é inválido
                        </div>
                    </div>

                    <div className={etapas.etapa1}>

                        <label htmlFor="senha">Senha</label>
                        <input type="password" name="senha" id="password" placeholder="sua senha" onChange={mudarValor} />

                        <div className="error" id="password-required-error">
                            Senha é obrigatória
                        </div>
                    </div>

                    {/* Etapa 2 */}

                    <div className={etapas.etapa2}>

                        <label htmlFor="userName">Nome de usuário</label>
                        <input id="userName" name="nome_profissional" placeholder="Como deseja ser chamado" onChange={mudarValor} />
                    </div>


                    <div className={etapas.etapa2}>
                        <label htmlFor="telefone">telefone</label>
                        <input id="telefone" name="telefone_profissional" placeholder="Seu telefone" onChange={mudarValor} />
                    </div>

                    {/* Etapa 3 */}

                    <div className={etapas.etapa3}>
                        <label htmlFor="nomeSalao">Nome do salão</label>
                        <input id="nomeSalao" name="nome_salao" placeholder="Nome do seu salão" onChange={mudarValor} />
                    </div>

                    <div className={etapas.etapa3}>
                        <label htmlFor="endereco">Endereço do salão</label>
                        <input id="endereco" name="endereco_salao" placeholder="Endereço do salão" onChange={mudarValor} />
                    </div>

                    <p className={etapas.etapa3}> Categoria do salão </p>

                    <div className={etapas.etapa3}>
                        <select name="categoria_salao" onChange={mudarValor}>
                            <option value="opcoes" disabled> Opções </option>
                            <option value="salaoDeCabeleireiro"> Salão de cabeleireiro </option>
                            <option value="barbearia"> Barbearia </option>
                            <option value="manicure/Pedicure"> Manícure/Pedicure </option>
                            <option value="depilacao"> Depilação </option>
                            <option value="estetica"> Estética </option>
                        </select>

                    </div>

                    {/* Botão Continuar */}

                    <button type="button" className="solid" id="login-button" onClick={etapaAtual >= 3 ? enviarFormulario : proximaEtapa}>
                        {etapaAtual >= 3 ? "Finalizar" : "Continuar"}
                    </button>

                </form>
            </main>
        </>
    )
}

export default Formulario
