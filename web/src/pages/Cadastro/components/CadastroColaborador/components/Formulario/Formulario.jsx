import { useState } from "react"
import { useFormContext } from "react-hook-form"
import './Formulario.css'

function Formulario({ valores, servicos, setServicos }) {

    const { register, watch } = useFormContext()
    const [adicionandoServico, setAdicionandoServico] = useState(false)

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


    const acessoSelecionado = watch("nivelAcesso")

    function mudarValor(evento) {
        const nomeCampo = evento.target.name
        const valorCampo = evento.target.value

        setDados({
            ...dados,
            [nomeCampo]: valorCampo
        })
    }

    const algo = Object.entries(watch("servicosEscolhidos")).map(s => {

        // console.log(s[1])

        const coisa = servicos.filter(servico => servico.id_servico == s[1])

        // console.log("Olha: ")
        console.log((servicos.filter(servico => servico.id_servico == s[1]))[0].nome_servico)

        return coisa
    })

    // console.log(algo)

    return (
        <form className="min-h-max h-160 w-full max-w-[880px] rounded-2xl border-2 border-vinho bg-linho p-4! sm:p-5! md:w-9/10 md:p-6! lg:w-8/10 xl:w-6/10 xl:p-8!">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">

                <input {...register("nome")} className="cadastroProfInput" type="text" placeholder="Nome" onChange={mudarValor} />
                <input {...register("sobrenome")} className="cadastroProfInput" type="text" placeholder="Sobrenome" onChange={mudarValor} />
                <select {...register("cargo")} className="border rounded-md p-2!" onChange={mudarValor}>
                    <option value="Cargo"> Cargo </option>
                    <option value="Barbeiro(a)"> Barbeiro(a) </option>
                    <option value="Cabeleireiro(a)"> Cabeleireiro(a) </option>
                    <option value="Manicure/Pedicure"> Manicure/Pedicure </option>
                    <option value="Maquiador(a)"> Maquiador(a) </option>
                    <option value="Recepcionista"> Recepcionista </option>
                </select>

                <div className="flex items-center gap-2!">
                    <input {...register("telefone")} type="text" placeholder="Telefone: (xx) xxxxx-xxxx" className="cadastroProfInput my-0!" onChange={mudarValor} />
                </div>

            </div>

            <div className="mt-2! flex flex-col gap-2! md:flex-row md:items-center" >
                <label htmlFor="email"> Email: </label>
                <input name="email" {...register("email")} type="email" placeholder="Email" className="cadastroProfInput" onChange={mudarValor} />
                <div></div>
                <label htmlFor="senha"> Senha: </label>
                <input name="senha" {...register("senha")} type="password" placeholder="Senha" className="cadastroProfInput" autoComplete="new-password" onChange={mudarValor} />
            </div>

            <div className="flex justify-center my-5!">
                <hr className="w-full" />
            </div>

            <p className="text-lg mb-2! font-bold"> Nível de acesso </p>

            <div className="grid grid-cols-1  md:grid-cols-2">
                <div>
                    <div>
                        <p className="font-light"> Determina os níveis de acesso no sistema </p>
                    </div>

                    <select {...register("nivelAcesso")} className="cadastroProfInput w-full! md:w-8/12!" onChange={mudarValor}>
                        <option value="1"> Administrador </option>
                        <option value="2"> Gerente </option>
                        <option value="3"> Profissional </option>
                    </select>
                </div>

                <div className="flex text-center justify-center items-center">
                    <p> Alguém com o acesso de <b> {acessoSelecionado.titulo} </b> {acessoSelecionado.descricao} </p>
                </div>
            </div>

            <div className="flex justify-center my-5!">
                <hr className="w-full" />
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                    <div>
                        <p className="text-lg mb-2! font-bold"> Serviços </p>

                        <p className="font-light"> O profissional só aparece no <br /> agendamento dos serviços marcados </p>
                    </div>

                </div>

                <div className="relative h-max">

                    <p>Serviços que realiza</p>

                    <button className="border w-full text-left p-2 rounded-md flex justify-between"
                        onClick={() => setAdicionandoServico(!adicionandoServico)}
                        type="button"
                    >
                        {watch("servicosEscolhidos").length} Serviços selecionados
                        <svg xmlns="http://w3.org" width="24" height="24"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        >
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>

                    </button>

                    {adicionandoServico && (
                        <div className="absolute rounded-md top-full w-full max-h-42 overflow-y-auto border bg-azul-medio flex flex-col gap-1
                            scrollbar-thin [scrollbar-color:var(--color-azul-po)_transparent]">
                            {
                                servicos?.map(s => (
                                    <label className="p-2 flex  gap-1 text-white">
                                        <input type="checkbox" {...register("servicosEscolhidos")} value={s.id_servico} key={s.id_servico} />
                                        {s.nome_servico}
                                    </label>
                                ))
                            }
                        </div>
                    )}

                    

                </div>

                <div className="border rounded-md -mt-6 md:col-start-2">
                        {
                            Object.entries(watch("servicosEscolhidos"))?.map(s => {

                                const servico = (servicos.filter(servico => servico.id_servico == s[1]))[0]

                                return (
                                    <div className="p-2! flex justify-between border-b ">
                                        <p className="flex-2"> {servico.nome_servico} </p>

                                        <div className="flex flex-1 justify-between">
                                            {servico.duracao} min
                                            <p> R$ {servico.preco_servico} </p>

                                            <button type="button" className="text-red-500">
                                                X
                                            </button>
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>

            </div>

        </form>
    )
}

export default Formulario
