import { useState } from "react"
import { useForm } from "react-hook-form"

import { useMeuPerfil } from "../../../../../../services/pegarMeuPerfil"
import { mudarSenha, mudarEmail } from "../services/atualizarDados"

export default function Seguranca({ estilos }) {
  const { data: perfil, isLoading } = useMeuPerfil()

  const [mudandoSenha, setMudandoSenha] = useState(false)
  const [mudandoEmail, setMudandoEmail] = useState(false)

  const { register, handleSubmit, watch, reset } = useForm({ values: perfil && { email: perfil.email_cliente } })

  const onSubmit = async () => {

    if (mudandoEmail) {
      console.log("email")
    }

    if (mudandoSenha) {
      if (watch("novaSenha") != watch("novaSenhaRepetida")) return

      if (!/[A-Z]/.test(watch("novaSenha"))) return
      if (!/[0-9]/.test(watch("novaSenha"))) return
      if (!/[^a-zA-Z0-9\s]/.test(watch("novaSenha"))) return

      mudarSenha(watch("senhaAtual"), watch("novaSenha"))
    }

    if (mudandoEmail) {
      const resposta = await mudarEmail(watch("email"))

      if (resposta) setMudandoEmail(false)
    }
  }

  return (

    <form className="py-5 px-3 h-full flex-1 flex flex-col mt-auto" onSubmit={handleSubmit(onSubmit)}>

      <div className="gap-5 flex flex-col flex-1 h-full">
        <div className={estilos["cliente-perfil-grid"]}>
          <svg class="w-6 h-6 shrink-0 text-laranja" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>

          <p>Senha</p>

          <p> ************** </p>

          <button type="button" className="py-1 px-3 rounded-lg bg-amarelo text-black hover:bg-amarelo/80 transition-colors text-sm" onClick={() => setMudandoSenha(true)}>
            Editar
          </button>

        </div>

        {mudandoSenha && (
          <div className="w-[93%] flex flex-col flex-1 gap-3 p-2 self-end rounded-xl bg-[#775b5b]/35  ">
            <label htmlFor="senhaAtual" className="text-sm flex flex-col gap-1">
              Senha Atual
              <input type="password" name="senhaAtual"
                className="p-2 rounded-lg flex-1 bg-white/10 border-amarelo "
                {...register("senhaAtual")}
              />
            </label>

            <label htmlFor="novaSenha" className="text-sm flex flex-col gap-1">
              Nova senha
              <input type="password" name="novaSenha"
                className="p-2 rounded-lg flex-1 bg-white/10 border-amarelo "
                {...register("novaSenha")}
              />
            </label>

            <div>
              <p className={`text-sm ${/[A-Z]/.test(watch("novaSenha")) ? 'text-green-500' : 'text-red-500'}`}> Pelo menos uma letra maiúscula</p>
              <p className={`text-sm ${/[0-9]/.test(watch("novaSenha")) ? 'text-green-500' : 'text-red-500'}`}> Pelo menos um número </p>
              <p className={`text-sm ${/[^a-zA-Z0-9\s]/.test(watch("novaSenha")) ? 'text-green-500' : 'text-red-500'}`}> Pelo menos um caractere especial </p>
            </div>

            <label htmlFor="novaSenhaRepetida" className="text-sm flex flex-col gap-1">
              Repita a nova senha
              <input type="password" name="novaSenhaRepetida"
                className="p-2 rounded-lg flex-1 bg-white/10 border-amarelo "
                {...register("novaSenhaRepetida")}
              />
            </label>

            {watch("novaSenha") != watch("novaSenhaRepetida") && (
              <p className="text-sm text-red-500">As senhas não são iguais</p>
            )}

            <div className="flex gap-5 mt-2">
              <button type="submit"
                className="p-1 rounded-lg bg-amarelo/80 hover:bg-amarelo/70 transition-colors text-black w-2/10">

                Atualizar
              </button>

              <button type="button" className="p-1 rounded-lg bg-laranja/80 hover:bg-laranja/70 transition-colors text-black w-2/10"
                onClick={() => { reset(); setMudandoSenha(false); }}>

                Cancelar
              </button>

            </div>

          </div>
        )}

        <div className={estilos["cliente-perfil-grid"]}>
          <svg class="w-6 h-6 shrink-0 text-laranja" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="2" y="4" width="20" height="16" rx="2"></rect>
            <path d="m22 7-10 6L2 7"></path>
          </svg>

          <p>Email</p>

          <input type="text" name="email" disabled={!mudandoEmail}
            className="p-2 rounded-lg flex-1 bg-white/10 disabled:opacity-70"
            {...register("email")}
          />

          {!mudandoEmail && (
            <button type="button" className="py-1 px-3 rounded-lg bg-amarelo text-black hover:bg-amarelo/80 transition-colors text-sm" onClick={() => setMudandoEmail(true)}>
              Editar
            </button>
          )}

          {mudandoEmail && (
            <div className={estilos["cliente-perfil-email"]}>

              <button type="submit"
                className="p-1.5 flex-1 rounded-lg bg-amarelo/80 hover:bg-amarelo/70 transition-colors text-black "
                onClick={() => console.log("a")}>

                Atualizar
              </button>

              <button type="button" className="p-1.5 rounded-lg bg-laranja/80 hover:bg-laranja/70 transition-colors text-black "
                onClick={() => { reset(); setMudandoEmail(false); }}>

                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </form>
  )
}
