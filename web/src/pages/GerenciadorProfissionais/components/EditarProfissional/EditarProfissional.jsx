import { useEffect } from "react"
import { useForm } from "react-hook-form"

import "./EditarProfissional.css"

const FOTO_PADRAO = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVWGYKJzBSw8qBRXBMcHBdY1XK_aywT9ZX_gMa5Wj8jA8QyX6DHP-O0Al-&s=10"

export default function EditarProfissional({
    profissional = null,
    todosCargos = {},
    estaEditando,
    setEstaEditando,
    onSalvar,
    idRemetente,
    onRemover
}) {
    // O painel recebe o profissional selecionado e devolve os dados por onSalvar.
    const nomeProfissional = profissional?.nome_profissional || "Carregando...  "
    const ehProprioPerfil = profissional?.id_profissional === idRemetente

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

    // React Hook Form mantém os campos locais e reduz atualizações manuais de estado.
    const { register, handleSubmit, reset, watch } = useForm({
        defaultValues: {
            nome_profissional: "",
            email_profissional: "",
            cargo: "",
            nivel_acesso: "",
            status: ""
        }
    })

    useEffect(() => {
        // Ao trocar a linha selecionada, os campos precisam acompanhar o novo profissional.
        reset({
            nome_profissional: profissional?.nome_profissional ?? "",
            email_profissional: profissional?.email_profissional ?? "",
            cargo: profissional?.cargo ?? "",
            nivel_acesso: profissional?.nivel_acesso ?? "",
            status: profissional?.status ?? ""
        })
    }, [profissional, reset])

    const nivelAcessoSelecionado = watch("nivel_acesso")
    const acessoSelecionado = niveisAcesso[nivelAcessoSelecionado] || niveisAcesso[3]

    function salvarDados(dadosFormulario) {
        onSalvar?.(dadosFormulario)
    }

    function removerProfissional() {
        // O próprio perfil não pode ser removido; o backend também valida essa regra.
        if (ehProprioPerfil) return

        onRemover?.(profissional?.id_profissional)
    }

    return (
        <aside className="editar-profissional w-full max-w-lg shrink-0 border border-slate-500 bg-blue-50 p-5 top-0 right-0 h-dvh fixed flex flex-col">
            <form onSubmit={handleSubmit(salvarDados)} className="flex h-full flex-col">
                {/* Identificação do profissional e botão para fechar o painel. */}
                <header className="border-b border-slate-400 pb-4 flex justify-between">
                <div>
                    <p className="text-lg">Editando</p>
                    <h2 className="text-2xl font-semibold">
                        {nomeProfissional}
                    </h2>
                </div>

                <button type="button" onClick={() => setEstaEditando(!estaEditando)}>Voltar</button>
                </header>

                {/* Foto e dados básicos editáveis. */}
                <div className="mt-5 flex gap-5">
                <div className="flex h-45 w-35 shrink-0 items-center justify-center border border-slate-400 bg-slate-200">
                    <img
                        src={profissional?.foto_url || FOTO_PADRAO}
                        alt={`Foto de ${nomeProfissional}`}
                        className="h-full w-full object-cover"
                    />
                </div>

                <div className="min-w-0 flex flex-col w-full gap-2 ">

                    <label htmlFor="nome" className="flex gap-2 justify-between items-center">
                        Nome:
                        <input type="text"
                            className="border rounded-sm flex-1 max-w-62 p-1" id="nome"
                            {...register("nome_profissional")}
                        />
                    </label>

                    <label htmlFor="email" className="flex gap-2 justify-between items-center">
                        Email:
                        <input type="email"
                            className="border rounded-sm flex-1 max-w-62 p-1" id="email"
                            {...register("email_profissional")}
                        />
                    </label>

                    <label htmlFor="cargo" className="flex gap-2 justify-between items-center">
                        Cargo:
                        <select
                            id="cargo"
                            className="border rounded-sm max-w-62 flex-1 p-1"
                            {...register("cargo")}
                        >
                            <option value="" disabled>
                                Selecione um cargo
                            </option>

                            {Object.keys(todosCargos).map((cargo) => (
                                <option value={cargo}>
                                    {cargo}
                                </option>
                            ))}
                        </select>
                    </label>

                </div>
                </div>

                {/* Nível de acesso e descrição das permissões. */}
                <section className="mt-6 min-h-24  border-slate-400 pt-4">

                <div className="flex w-full justify-between">

                    <p className="text-2xl mb-2!"> Nível de acesso </p>

                    <select
                        className="border rounded-sm max-w-62 flex-1 p-1"
                        {...register("nivel_acesso")}
                    >
                        <option value="1"> Administrador </option>
                        <option value="2"> Gerente </option>
                        <option value="3"> Profissional </option>
                    </select>
                </div>

                <p className="-mt-2 text-[14px]"> Determina os níveis de </p>
                <p className="-mt-1.5 mb-4 text-[14px]"> acesso no sistema </p>

                <p> Alguém com o acesso de <b> {acessoSelecionado.titulo} </b> {acessoSelecionado.descricao} </p>

                </section>

                {/* Status do profissional. */}
                <section className="flex flex-1 w-full items-end gap-3 border-slate-400 pt-4 self-end ">
                <div className="w-full">

                    <p className="text-[20px]">Status</p>

                    <select
                        className="border rounded-sm max-w-62 w-2/5 flex-1 p-1"
                        {...register("status", {
                            setValueAs: (valor) => valor === "true"
                        })}
                    >
                        <option value="true"> Ativado </option>
                        <option value="false"> Inativo </option>
                    </select>
                </div>

                </section>

                {/* Ações finais: remoção, cancelamento e salvamento. */}
                <footer className="flex w-full items-center justify-between gap-3 border-slate-400 pt-4 self-end ">
                <button
                    type="button"
                    disabled={ehProprioPerfil}
                    title={ehProprioPerfil ? "Você não pode remover o próprio perfil" : "Remover profissional"}
                    onClick={removerProfissional}
                    className="bg-marrom text-laranja p-2 rounded-lg "
                >
                    Remover profissional
                </button>
                <div className="flex gap-3">

                    <button type="button" className="hover:text-red-500 p-1" onClick={() => setEstaEditando(!estaEditando)}>Cancelar</button>
                    <button type="submit" className="hover:text-green-500 p-1">Salvar</button>
                </div>
                </footer>
            </form>
        </aside>
    )
}
