import { useState } from "react"
import { useForm } from "react-hook-form"
import { useQueryClient } from "@tanstack/react-query"

import { useMeuPerfil } from "../../../../../../services/pegarMeuPerfil"
import estilos from "../../Abas.module.css"
import { mudarSalao } from "../../Clientes/services/atualizarDados"

export default function SalaoAdmin() {
  const { data: perfil } = useMeuPerfil()
  const queryClient = useQueryClient()

  const [mudandoNome, setMudandoNome] = useState(false)
  const [mudandoEndereco, setMudandoEndereco] = useState(false)

  const { register, handleSubmit, watch, reset } = useForm({
    values: perfil?.saloes && {
      nomeSalao: perfil.saloes.nome_salao,
      enderecoSalao: perfil.saloes.endereco_salao ?? ""
    }
  })

  const onSubmit = async () => {
    if (!watch("nomeSalao")?.trim()) return

    const resposta = await mudarSalao(watch("nomeSalao"), watch("enderecoSalao"))
    if (!resposta) return

    setMudandoNome(false)
    setMudandoEndereco(false)
    queryClient.invalidateQueries({ queryKey: ["perfil"] })
  }

  const editando = mudandoNome || mudandoEndereco

  return (
    <form className="py-5 px-3 flex flex-1 " onSubmit={handleSubmit(onSubmit)}>

      <div className="gap-5 flex flex-1 flex-col ">
        <div className={estilos["cliente-perfil-grid"]}>
          <svg className="w-6 h-6 shrink-0 text-laranja" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 7V5h16v2"></path>
            <path d="M12 5v14"></path>
            <path d="M9 19h6"></path>
          </svg>

          <p>Nome do salão</p>

          <input type="text" name="nomeSalao" disabled={!mudandoNome}
            className="p-2 rounded-lg flex-1 bg-white/10"
            {...register("nomeSalao")}
          />

          {!mudandoNome && (
            <button type="button" className="py-1 px-3 rounded-lg bg-amarelo text-black text-sm"
              onClick={() => setMudandoNome(true)}>

              Editar
            </button>
          )}
        </div>

        <div className={estilos["cliente-perfil-grid"]}>
          <svg className="w-6 h-6 shrink-0 text-laranja" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>

          <p>Endereço do salão</p>

          <input type="text" name="enderecoSalao" disabled={!mudandoEndereco}
            className="p-2 rounded-lg flex-1 bg-white/10"
            {...register("enderecoSalao")}
          />

          {!mudandoEndereco && (
            <button type="button" className="py-1 px-3 rounded-lg bg-amarelo text-black text-sm"
              onClick={() => setMudandoEndereco(true)}>

              Editar
            </button>
          )}
        </div>

        <div className="flex gap-5 mt-auto">
          <button type="submit" disabled={!editando}
            className="p-2 rounded-lg bg-amarelo/80 hover:bg-amarelo/70 transition-colors text-black disabled:opacity-50">

            Salvar
          </button>

          <button type="button" disabled={!editando}
            className="p-2 rounded-lg bg-laranja/80 hover:bg-laranja/70 transition-colors text-black disabled:opacity-50"
            onClick={() => { reset(); setMudandoNome(false); setMudandoEndereco(false) }}>

            Cancelar
          </button>
        </div>

      </div>
    </form>
  )
}
