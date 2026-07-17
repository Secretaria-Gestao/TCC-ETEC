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
        <form className="h-160 w-full max-w-[980px] rounded-2xl border-2 border-amber-950 bg-azulClaro p-4! sm:p-5! md:w-9/10 md:p-6! lg:w-8/10 xl:w-6/10 xl:p-8!">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

                <input name="nome" className="cadastroProfInput" type="text" placeholder="Nome" onChange={mudarValor} />
                <input name="sobrenome" className="cadastroProfInput" type="text" placeholder="Sobrenome" onChange={mudarValor} />
                <select name="cargo" className="border rounded-md p-2!" onChange={mudarValor}>
                    <option value="Cargo"> Cargo </option>
                    <option value="Barbeiro(a)"> Barbeiro(a) </option>
                    <option value="Cabeleireiro(a)"> Cabeleireiro(a) </option>
                    <option value="Manicure/Pedicure"> Manicure/Pedicure </option>
                    <option value="Maquiador(a)"> Maquiador(a) </option>
                    <option value="Recepcionista"> Recepcionista </option>
                </select>

                <div className="flex items-center gap-2!">
                    <input name="telefone" type="text" placeholder="Telefone: (xx) xxxxx-xxxx" className="cadastroProfInput my-0!" onChange={mudarValor} />
                </div>

            </div>

            <div className="mt-2! flex flex-col gap-2! md:flex-row md:items-center" >
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

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <div>
                        <p> Determina os níveis de acesso no sistema </p>
                    </div>

                    <select name="nivelAcesso" className="cadastroProfInput w-full! md:w-8/12!" onChange={mudarValor}>
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
