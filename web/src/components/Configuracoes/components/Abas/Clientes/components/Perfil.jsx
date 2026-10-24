import { useForm } from "react-hook-form"

import { useMeuPerfil } from "../../../../../../services/pegarMeuPerfil"
import estilos from "../../Abas.module.css"
import { useState } from "react"
import { mudarNome } from "../services/atualizarDados"

export default function Perfil({ setAbaAtual }) {
  const { data: perfil, isLoading } = useMeuPerfil()

  const [mudandoNome, setMudandoNome] = useState(false)

  const { register, handleSubmit, watch, reset } = useForm({
    values: perfil && {
      nome: perfil.nome_cliente,
      email: perfil.email_cliente
    }
  })

  const onSubmit = async () => {
    if (!watch("nome")) return

    const resposta = await mudarNome(watch("nome"))
    if (resposta) mudandoNome(false)

  }

  return (
    <form className="py-5 px-3 flex flex-1 " onSubmit={handleSubmit(onSubmit)} >

      <div className="gap-5 flex flex-1 flex-col ">
        <div className={estilos["cliente-perfil-grid"]}>
          <svg className="w-6 h-6 shrink-0 text-laranja" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="8" r="4"></circle>
            <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"></path>
          </svg>

          <p>Nome</p>

          <input type="text" name="nome" disabled={!mudandoNome}
            className="p-2 rounded-lg flex-1 bg-white/10"
            {...register("nome")}
          />

          {!mudandoNome && (
            <button type="button" className="py-1 px-3 rounded-lg bg-amarelo text-black text-sm"
              onClick={() => setMudandoNome(true)} >

              Editar
            </button>
          )}

        </div>

        <div className={estilos["cliente-perfil-grid"]}>
          <svg class="w-6 h-6 shrink-0 text-laranja" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="2" y="4" width="20" height="16" rx="2"></rect>
            <path d="m22 7-10 6L2 7"></path>
          </svg>

          <p>Email:</p>

          <p> {perfil ? watch("email") : "Carregando..."}  </p>

        </div>

        <p className="flex gap-1 -mt-3.5 text-xs">
          Deseja mudar de email? Clique na aba de segurança acima, ou aperte
          <button className="text-laranja" onClick={() => setAbaAtual("seguranca")}>
            Aqui.
          </button>
        </p>

        <div className="flex gap-5 mt-auto">
          <button type="submit" disabled={!mudandoNome}
            className="p-2 rounded-lg bg-amarelo/80 hover:bg-amarelo/70 transition-colors text-black "

          >

            Atualizar
          </button>

          <button type="button" disabled={!mudandoNome}
            className="p-2 rounded-lg bg-laranja/80 hover:bg-laranja/70 transition-colors text-black "
            onClick={() => { reset(); setMudandoNome(false); }}>

            Cancelar
          </button>

        </div>

      </div>
    </form>
  )
}