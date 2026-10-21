import { useState } from "react"

export default function Seguranca({ estilos }) {

    const [mudandoSenha, setMudandoSenha] = useState(false)

    const [form, setForm] = useState({
        email: "joao@gmail.com",
        senha: "*******",
    })

    return (

        <div className="py-5 px-3 h-full flex-1 flex flex-col mt-auto">

            <div className="gap-5 flex flex-col flex-1 h-full">
                <div className={estilos["cliente-perfil-grid"]}>
                    <svg class="w-6 h-6 shrink-0 text-laranja" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <rect x="3" y="11" width="18" height="11" rx="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>

                    <p>Senha</p>

                    <p> ************** </p>

                    <button type="button" className="py-1 px-3 rounded-lg bg-amarelo text-black text-sm" onClick={() => setMudandoSenha(true)}>
                        Editar
                    </button>


                </div>

                {mudandoSenha && (
                    <div className="w-[93%] flex flex-col flex-1 gap-3 p-2 self-end rounded-xl bg-[#775b5b]/35  ">
                        <label htmlFor="senhaAtual" className="text-sm flex flex-col gap-1">
                            Senha Atual
                            <input type="password" name="senhaAtual" className="p-2 rounded-lg flex-1 bg-white/10 border-amarelo " />
                        </label>

                        <label htmlFor="novaSenha" className="text-sm flex flex-col gap-1">
                            Nova senha
                            <input type="password" name="novaSenha" className="p-2 rounded-lg flex-1 bg-white/10 border-amarelo " />
                        </label>

                    </div>
                )}

                <div className={estilos["cliente-perfil-grid"]}>
                    <svg class="w-6 h-6 shrink-0 text-laranja" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                        <path d="m22 7-10 6L2 7"></path>
                    </svg>

                    <p>Email</p>

                    <input type="text" name="telefone" defaultValue="joao@gmail.com" className="p-2 rounded-lg flex-1 bg-white/10" />

                    <button type="button" className="py-1 px-3 rounded-lg bg-amarelo text-black text-sm">
                        Editar
                    </button>

                </div>



            </div>
        </div>
    )
}