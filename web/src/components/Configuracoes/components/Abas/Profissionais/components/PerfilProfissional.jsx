import { useState } from "react"
import { useForm } from "react-hook-form"
import { useQueryClient } from "@tanstack/react-query"

import { useNotificacaoStore } from "@/Notificacao"
import { useMeuPerfil } from "../../../../../../services/pegarMeuPerfil"
import estilos from "../../Abas.module.css"
import { mudarFoto, mudarNome, mudarTelefone } from "../../Clientes/services/atualizarDados"

export default function PerfilProfissional({ setAbaAtual }) {
  const { data: perfil } = useMeuPerfil()
  const queryClient = useQueryClient()

  const [mudandoNome, setMudandoNome] = useState(false)
  const [mudandoTelefone, setMudandoTelefone] = useState(false)

  const { register, handleSubmit, watch, reset } = useForm({
    values: perfil && {
      nome: perfil.nome_profissional,
      telefone: perfil.telefone_profissional
    }
  })

  const onSubmit = async () => {
    if (mudandoNome) {
      if (!watch("nome")?.trim()) return

      const resposta = await mudarNome(watch("nome"))
      if (!resposta) return

      setMudandoNome(false)
      queryClient.invalidateQueries({ queryKey: ["perfil"] })
    }

    if (mudandoTelefone) {
      const resposta = await mudarTelefone(watch("telefone"))
      if (!resposta) return

      setMudandoTelefone(false)
      queryClient.invalidateQueries({ queryKey: ["perfil"] })
    }
  }

  const editando = mudandoNome || mudandoTelefone

  async function trocarFoto(arquivo) {
    if (!arquivo) return

    if (arquivo.size > 8 * 1024 * 1024) {
      useNotificacaoStore.getState().mostrarNotificacao({
        titulo: "Foto grande demais",
        texto: "Escolha uma imagem de até 8 MB"
      })
      return
    }

    const resposta = await mudarFoto(arquivo)

    if (resposta) queryClient.invalidateQueries({ "queryKey": ["perfil"] })

      console.log(perfil.foto)

  }

  return (
    <form className="py-5 px-3 flex flex-1 " onSubmit={handleSubmit(onSubmit)}>

      <div className="gap-5 flex flex-1 flex-col ">
        <div className="flex gap-6">

          <div className="w-40 h-44 shrink-0 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden">
            <div className="m-0 p-0 h-full w-full group relative flex items-center justify-center">
              {perfil?.foto_url ? (
                <img src={perfil.foto_url} alt="Foto do profissional" className="w-full h-full object-cover transition-opacity opacity-100 group-hover:opacity-20" />
              ) : (
                <svg className="w-12 h-12 text-white/30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <circle cx="12" cy="8" r="4"></circle>
                  <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"></path>
                </svg>
              )}

              <p className="absolute w-full h-full inset-0 -mt-3 top-1/2 text-center opacity-0 transition-opacity group-hover:opacity-100">
                Mudar foto
              </p>

              <input className="absolute inset-0 w-full h-full opacity-0"
                type="file"
                accept="image/jpeg, image/png, image/webp"
                onChange={(e) => { trocarFoto(e.target.files[0]); e.target.value = ""; }}
              />

            </div>
          </div>

          <div className="flex flex-col flex-1 gap-5">
            <div className={estilos["cliente-perfil-grid"]}>
              <svg className="w-6 h-6 shrink-0 text-laranja" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
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
                  onClick={() => setMudandoNome(true)}>

                  Editar
                </button>
              )}
            </div>

            <div className={estilos["cliente-perfil-grid"]}>
              <svg className="w-6 h-6 shrink-0 text-laranja" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"></path>
              </svg>

              <p>Telefone</p>

              <input type="text" name="telefone" disabled={!mudandoTelefone}
                className="p-2 rounded-lg flex-1 bg-white/10"
                {...register("telefone")}
              />

              {!mudandoTelefone && (
                <button type="button" className="py-1 px-3 rounded-lg bg-amarelo text-black text-sm"
                  onClick={() => setMudandoTelefone(true)}>

                  Editar
                </button>
              )}
            </div>

            <div className={estilos["cliente-perfil-grid"]}>
              <svg className="w-6 h-6 shrink-0 text-laranja" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="7" width="20" height="14" rx="2"></rect>
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"></path>
              </svg>

              <p>Cargo:</p>

              <p> {perfil ? perfil.cargo : "Carregando..."} </p>
            </div>

            <div className={estilos["cliente-perfil-grid"]}>
              <svg className="w-6 h-6 shrink-0 text-laranja" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="m22 7-10 6L2 7"></path>
              </svg>

              <p>Email:</p>

              <p> {perfil ? perfil.email_profissional : "Carregando..."} </p>
            </div>

            <p className="flex gap-1 -mt-3.5 text-xs">
              Deseja mudar de email? Clique na aba de segurança acima, ou aperte
              <button type="button" className="text-laranja" onClick={() => setAbaAtual("seguranca")}>
                Aqui.
              </button>
            </p>
          </div>
        </div>

        <div className="flex gap-5 mt-auto">
          <button type="submit" disabled={!editando}
            className="p-2 rounded-lg bg-amarelo/80 hover:bg-amarelo/70 transition-colors text-black disabled:opacity-50">

            Salvar
          </button>

          <button type="button" disabled={!editando}
            className="p-2 rounded-lg bg-laranja/80 hover:bg-laranja/70 transition-colors text-black disabled:opacity-50"
            onClick={() => { reset(); setMudandoNome(false); setMudandoTelefone(false) }}>

            Cancelar
          </button>
        </div>

      </div>
    </form>
  )
}
