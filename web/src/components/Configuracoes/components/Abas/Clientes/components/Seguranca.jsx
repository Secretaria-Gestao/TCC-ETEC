import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

import { supabase } from "../../../../../../services/SupabaseConfig"
import { pegarSessao } from "../../../../../../services/pegarSessao"

import { useMeuPerfil } from "../../../../../../services/pegarMeuPerfil"
import { mudarSenha, mudarEmail, excluirConta, excluirSalao } from "../services/atualizarDados"

import estilos from "../../Abas.module.css"

export default function Seguranca({ profissional, admin }) {
  const { data: perfil, isLoading } = useMeuPerfil()

  const [mudandoSenha, setMudandoSenha] = useState(false)
  const [mudandoEmail, setMudandoEmail] = useState(false)

  // Modal de exclusão do salão (só o administrador vê o botão que o abre).
  const [confirmandoExclusao, setConfirmandoExclusao] = useState(false)
  const [confirmacao, setConfirmacao] = useState("")
  const [excluindo, setExcluindo] = useState(false)

  // Contas que entram só pelo Google não têm senha nem email próprio para editar.
  const [temSenha, setTemSenha] = useState(true)

  useEffect(() => {
    pegarSessao().then((sessao) => {
      const provedores = sessao?.user?.app_metadata?.providers ?? []
      setTemSenha(provedores.includes("email"))
    })
  }, [])

  const { register, handleSubmit, watch, reset } = useForm({ values: perfil && { email: profissional ? perfil.email_profissional : perfil.email_cliente } })

  const onSubmit = async () => {

    if (mudandoSenha) {
      if (watch("novaSenha") != watch("novaSenhaRepetida")) return

      if (!/[A-Z]/.test(watch("novaSenha"))) return
      if (!/[0-9]/.test(watch("novaSenha"))) return
      if (!/[^a-zA-Z0-9\s]/.test(watch("novaSenha"))) return

      const resposta = await mudarSenha(watch("senhaAtual"), watch("novaSenha"))

      if (resposta) {
        reset()
        setMudandoSenha(false)
      }
    }

    if (mudandoEmail) {
      const resposta = await mudarEmail(watch("email"))

      if (resposta) setMudandoEmail(false)
    }
  }

  async function sair() {
    if (!window.confirm("Tem certeza que deseja sair da sua conta?")) return
    await supabase.auth.signOut()
    window.location.replace(profissional ? '/login/colaborador' : '/login/cliente')
  }

  async function excluir() {
    if (!window.confirm("Tem certeza que deseja excluir sua conta? Essa ação não pode ser desfeita.")) return

    const resposta = await excluirConta()

    if (resposta) await sair()
  }

  function fecharExclusao() {
    setConfirmandoExclusao(false)
    setConfirmacao("")
  }

  async function excluirSalaoEConta() {
    setExcluindo(true)

    // Quem tem senha confirma com a senha; quem entra só pelo Google, com o nome do salão.
    const resposta = await excluirSalao(temSenha ? confirmacao : "", temSenha ? "" : confirmacao)

    setExcluindo(false)

    if (!resposta) return

    // Sai direto, sem o confirm do sair(): a conta já foi bloqueada.
    await supabase.auth.signOut()
    window.location.replace('/')
  }

  return (

    <form className="py-5 px-3 h-full flex-1 flex flex-col mt-auto " onSubmit={handleSubmit(onSubmit)}>

      <div className="gap-5 flex flex-col flex-1 h-full">
        <div className={estilos["cliente-perfil-grid"]}>
          <svg class="w-6 h-6 shrink-0 text-laranja" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="3" y="11" width="18" height="11" rx="2"></rect>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
          </svg>

          <p>Senha</p>

          <p> ************** </p>

          {temSenha ? (
            <button type="button" className="py-1 px-3 rounded-lg bg-amarelo text-black hover:bg-amarelo/80 transition-colors text-sm" onClick={() => setMudandoSenha(true)}>
              Editar
            </button>
          ) : (
            <p className="text-sm opacity-70">Conta Google</p>
          )}

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

          {!mudandoEmail && temSenha && (
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

      {mudandoEmail || !mudandoSenha && (
        <div className="flex gap-5 mt-auto">
          <button type="submit"
            className="p-2 rounded-lg bg-red-500 hover:bg-red-500/70 transition-colors text-white "
            onClick={() => sair()}
          >

            Sair da conta
          </button>

          {admin ? (
            <button type="button"
              className="p-2 rounded-lg bg-marrom/40 hover:bg-marrom/70 transition-colors text-white "
              onClick={() => setConfirmandoExclusao(true)}
            >

              Excluir conta
            </button>
          ) : profissional ? (
            <p className="text-sm opacity-70 self-center">
              Para encerrar seu acesso, <br /> fale com o administrador
            </p>
          ) : (
            <button type="button"
              className="p-2 rounded-lg bg-marrom/40 hover:bg-marrom/70 transition-colors text-white "
              onClick={() => excluir()}
            >

              Excluir conta
            </button>
          )}

        </div>
      )}

      {confirmandoExclusao && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70">
          <div className="w-96 p-5 rounded-2xl bg-[#4B3639] border-2 border-amarelo flex flex-col items-center gap-4 text-center">
            <p className="text-lg">Tem certeza?</p>

            <p className="text-xs">Esta ação causará a exclusão da sua conta e a do salão.</p>

            <input type={temSenha ? "password" : "text"}
              placeholder={temSenha ? "Digite sua senha" : "Digite o nome do salão"}
              value={confirmacao}
              onChange={(e) => setConfirmacao(e.target.value)}
              className="p-2 rounded-lg w-full bg-white/10"
            />

            <p className="text-xs">Não haverá reversão caso confirme.</p>

            <div className="flex gap-5">
              <button type="button" disabled={!confirmacao || excluindo}
                className="p-2 rounded-lg bg-red-500 hover:bg-red-500/70 transition-colors text-white disabled:opacity-50"
                onClick={() => excluirSalaoEConta()}
              >

                Excluir
              </button>

              <button type="button" disabled={excluindo}
                className="p-2 rounded-lg bg-laranja/80 hover:bg-laranja/70 transition-colors text-black disabled:opacity-50"
                onClick={() => fecharExclusao()}
              >

                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </form>
  )
}
