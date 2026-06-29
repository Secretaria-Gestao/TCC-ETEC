import { useState } from "react"
import './Formulario.css'

function Formulario({dados, setDados}) {

    const niveisAcesso = {
        1: {
            titulo: "Administrador",
            descricao: "tem acesso total ao salão. Cadastra profissionais, altera dados do salão, gerencia agenda, serviços, pagamentos e pode excluir usuários."
        },
        
        2: {
            titulo: "Gerente",
            descricao: "gerencia a agenda, cadastra clientes e profissionais, altera horários e serviços, mas não pode mexer nas configurações críticas do salão (plano, exclusão do salão, etc.)."
        },

        3: {
            titulo: "Profissional",
            descricao: "Visualiza apenas a própria agenda, confirma/cancela atendimentos, vê seus clientes e pode editar algumas informações do próprio perfil."
        }
    }

    const acessoSelecionado = niveisAcesso[dados.nivelAcesso]
    
    function mudarValor(evento) {
        const nomeCampo = evento.target.name
        const valorCampo = evento.target.value
        
        setDados({
            ...dados,
            [nomeCampo]: valorCampo
        })
    }

    return (
        <form className="border-amber-950 border-2 w-6/10 h-auto min-h-8/10 p-8! rounded-2xl bg-azulClaro">
            <div className="grid grid-cols-2 gap-3">

                <input className="cadastroProfInput" type="text" placeholder="Nome" onChange={mudarValor} />
                <input className="cadastroProfInput" type="text" placeholder="Sobrenome" onChange={mudarValor} />
                <select name="cargo" className="border-1 rounded-md p-2!" onChange={mudarValor}>
                    <option value=""> Cargo </option>
                    <option value=""> Barbeiro(a) </option>
                    <option value=""> Cabeleireiro(a) </option>
                    <option value=""> Manicure/Pedicure </option>
                    <option value=""> Maquiador(a) </option>
                    <option value=""> Recepcionista </option>
                </select>

                <div className="flex items-center gap-2!">
                    <input name="telefone" type="text" placeholder="Telefone: (xx) xxxxx-xxxx" className="cadastroProfInput my-0!" onChange={mudarValor} />
                </div>

            </div>

            <div className="flex items-center gap-2 mt-2!" >
                <label htmlFor="email"> Email: </label>
                <input name="email" type="email" placeholder="Email" className="cadastroProfInput" onChange={mudarValor} />
                <div></div>
                <label htmlFor="senha"> Senha: </label>
                <input name="senha" type="password" placeholder="Senha" className="cadastroProfInput" onChange={mudarValor} />
            </div>

            <div className="flex justify-center my-5!">
                <hr className="w-full" />
            </div>

            <h1 className="text-2xl mb-2!"> Nível de acesso </h1>

            <div className="grid grid-cols-2">
                <div>
                    <div>
                        <p> Determina os níveis de acesso no sistema </p>
                    </div>

                    <select name="nivelAcesso" className="cadastroProfInput w-8/12!" onChange={mudarValor}>
                        <option value="1"> Administrador </option>
                        <option value="2"> Gerente </option>
                        <option value="3"> Profissional </option>
                    </select>
                </div>

                <div className="flex text-center justify-center items-center">
                    <p> Alguém com o acesso de <b> {acessoSelecionado.titulo} </b> {acessoSelecionado.descricao} </p>
                </div>
            </div>
        </form>
    )
}

export default Formulario