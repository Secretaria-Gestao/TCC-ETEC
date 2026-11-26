import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { Link } from "react-router"
import { moeda } from "../../../../../../utils/financeiro.js"
import './Formulario.css'

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
    descricao: "visualiza apenas a própria agenda, confirma/cancela atendimentos, vê seus clientes e pode editar algumas informações do próprio perfil."
  }
}

export default function Formulario({ servicos }) {

  const { register, watch, setValue } = useFormContext()
  const [adicionandoServico, setAdicionandoServico] = useState(false)

  const acessoSelecionado = niveisAcesso[watch("nivelAcesso")]

  const senha = watch("senha")
  const senhaRepetida = watch("senhaRepetida")
  const servicosEscolhidos = watch("servicosEscolhidos")

  // O X da lista desmarca o checkbox do serviço. Os ids chegam como texto, por isso o !=
  function removerServico(idServico) {
    setValue("servicosEscolhidos", servicosEscolhidos.filter(id => id != idServico))
  }

  return (
    <form className="h-max w-full max-w-[880px] divide-y divide-areia rounded-xl border border-areia bg-white shadow-sm px-4! sm:px-5! md:w-11/12 md:px-6! xl:px-8!">

      {/* Perfil */}
      <section className="cadastroProfSecao">
        <p className="text-lg font-bold"> Perfil </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="cadastroProfLabel">
            Nome
            <input {...register("nome")} className="cadastroProfInput" type="text" placeholder="Ex.: Clarice" />
          </label>

          <label className="cadastroProfLabel">
            Sobrenome
            <input {...register("sobrenome")} className="cadastroProfInput" type="text" placeholder="Ex.: Souza" />
          </label>

          <label className="cadastroProfLabel">
            Cargo
            <select {...register("cargo")} className="cadastroProfInput">
              <option value="" disabled> Selecione o cargo </option>
              <option value="Barbeiro(a)"> Barbeiro(a) </option>
              <option value="Cabeleireiro(a)"> Cabeleireiro(a) </option>
              <option value="Manicure/Pedicure"> Manicure/Pedicure </option>
              <option value="Maquiador(a)"> Maquiador(a) </option>
              <option value="Recepcionista"> Recepcionista </option>
            </select>
          </label>

          <label className="cadastroProfLabel">
            Telefone
            <input {...register("telefone")} type="tel" placeholder="(12) 91234-5678" className="cadastroProfInput" />
          </label>
        </div>
      </section>

      {/* Login */}
      <section className="cadastroProfSecao">
        <p className="text-lg font-bold"> Login </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="cadastroProfLabel md:col-span-2">
            Email
            <input {...register("email")} type="email" placeholder="profissional@email.com" className="cadastroProfInput" />
          </label>

          <label className="cadastroProfLabel">
            Senha
            <input {...register("senha")} type="password" placeholder="Crie uma senha" className="cadastroProfInput" autoComplete="new-password" />
          </label>

          <label className="cadastroProfLabel">
            Repita a senha
            <input {...register("senhaRepetida")} type="password" placeholder="Digite a senha de novo" className="cadastroProfInput" autoComplete="new-password" />
          </label>

          {/* Mesmas regras da troca de senha nas configurações (Seguranca.jsx), mais o mínimo de 6 caracteres */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 md:col-span-2">
            <p className="text-sm font-light"> Requisitos para senha: </p>
            <p className={`text-sm ${senha.length >= 6 ? 'text-green-500' : 'text-red-500'}`}> 6 caracteres </p>|
            <p className={`text-sm ${/[A-Z]/.test(senha) ? 'text-green-500' : 'text-red-500'}`}> letra maiúscula </p>|
            <p className={`text-sm ${/[0-9]/.test(senha) ? 'text-green-500' : 'text-red-500'}`}> número </p>|
            <p className={`text-sm ${/[^a-zA-Z0-9\s]/.test(senha) ? 'text-green-500' : 'text-red-500'}`}> caractere especial </p>

            {senhaRepetida && senha != senhaRepetida && (
              <p className="text-xs text-red-500 md:ml-auto"> As senhas não são iguais </p>
            )}
          </div>
        </div>
      </section>

      {/* Nível de acesso */}
      <section className="cadastroProfSecao ">
        <p className="text-lg font-bold"> Nível de acesso </p>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <label className="cadastroProfLabel font-light!">
            Determina os níveis de acesso no sistema
            <select {...register("nivelAcesso")} className="cadastroProfInput md:w-10/12!">
              <option value="1"> Administrador </option>
              <option value="2"> Gerente </option>
              <option value="3"> Profissional </option>
            </select>
          </label>

          <div className="flex items-center justify-center text-justify text-sm">
            <p> Alguém com o acesso de <b> {acessoSelecionado.titulo} </b> {acessoSelecionado.descricao} </p>
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="cadastroProfSecao">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[260px_1fr]">
          <div className="md:max-w-[240px]">
            <p className="text-lg mb-2! font-bold"> Serviços </p>

            <p className="font-light"> O profissional só aparece no agendamento dos serviços marcados </p>
          </div>

          <div className="flex flex-col gap-3 col-span-2 xl:col-span-1">
            <div className="relative">
              <p className="mb-1.5! text-sm font-medium text-grafite"> Serviços que realiza </p>

              <button className="cadastroProfInput flex items-center justify-between text-left"
                onClick={() => setAdicionandoServico(!adicionandoServico)}
                type="button"
              >
                {servicosEscolhidos.length} {servicosEscolhidos.length == 1 ? "serviço selecionado" : "serviços selecionados"}

                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                  viewBox="0 0 24 24" fill="none" stroke="currentColor"
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                >
                  <polyline points="6 9 12 15 18 9"></polyline>
                </svg>
              </button>

              {adicionandoServico && (
                <div className="absolute z-10 bottom-full mb-1! w-full xl:bottom-0 xl:left-full xl:mb-0! xl:ml-2! xl:w-64 max-h-42 overflow-y-auto rounded-md border bg-azul-medio flex flex-col gap-1
                                    scrollbar-thin [scrollbar-color:var(--color-azul-po)_transparent]">
                  {servicos.length > 0 ? (servicos.map(s => (
                    <label key={s.id_servico} className="p-2! flex gap-2 items-center text-white cursor-pointer">
                      <input type="checkbox" {...register("servicosEscolhidos")} value={s.id_servico} />
                      {s.nome_servico}
                      {!s.em_funcionamento && <small className="ml-auto opacity-70"> desativado </small>}
                    </label>
                  ))) : (
                    <p className="p-3! text-sm text-white">
                      Nenhum serviço cadastrado. <Link to="/admin/gerenciador-servicos" className="underline"> Cadastrar serviços </Link>
                    </p>
                  )}
                </div>
              )}
            </div>

            {servicosEscolhidos.length > 0 && (
              <div className="border border-cobre/30 rounded-sm shadow-lg divide-y divide-cobre/30 ">
                {servicosEscolhidos.map(id => {

                  const servico = servicos.find(servico => servico.id_servico == id)

                  if (!servico) return null

                  return (
                    // No celular a duração e o preço vão para a linha de baixo do nome; do sm em diante fica tudo numa linha.
                    <div key={id} className="px-3! py-2.5! flex items-center gap-3">
                      <div className="flex flex-1 min-w-0 flex-col gap-1 sm:flex-row sm:items-center sm:gap-4">
                        <p className="flex-1 min-w-0 wrap-break-word"> {servico.nome_servico} </p>

                        <div className="flex gap-4 text-sm text-ardosia whitespace-nowrap sm:gap-6">
                          <span> {servico.duracao} min </span>
                          <span> {moeda(servico.preco_servico)} </span>
                        </div>
                      </div>

                      <div className="shrink-0">
                        <button type="button" className="flex p-1! text-vinho/70 hover:text-vinho" aria-label={`Remover ${servico.nome_servico}`}
                          onClick={() => removerServico(servico.id_servico)}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                          >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </form>
  )
}
