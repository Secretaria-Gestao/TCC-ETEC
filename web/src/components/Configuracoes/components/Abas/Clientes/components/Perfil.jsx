export default function Perfil({ setAbaAtual, estilos }) {
    return (

        <div className="py-5 px-3">

            <div className="gap-5 flex flex-col">
                <div className={estilos["cliente-perfil-grid"]}>
                    <svg className="w-6 h-6 shrink-0 text-laranja" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <circle cx="12" cy="8" r="4"></circle>
                        <path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"></path>
                    </svg>

                    <p>Nome</p>

                    <input type="text" name="nome" defaultValue="joao" className="p-2 rounded-lg flex-1 bg-white/10" />

                    <button type="button" className="py-1 px-3 rounded-lg bg-amarelo text-black text-sm">
                        Editar
                    </button>

                </div>

                <div className={estilos["cliente-perfil-grid"]}>
                    <svg className="w-6 h-6 shrink-0 text-laranja" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z">
                        </path>
                    </svg>

                    <p>Telefone</p>

                    <input type="text" name="telefone" defaultValue="(12) 99213-4812" className="p-2 rounded-lg flex-1 bg-white/10" />

                    <button type="button" className="py-1 px-3 rounded-lg bg-amarelo text-black text-sm">
                        Editar
                    </button>

                </div>

                <div className={estilos["cliente-perfil-grid"]}>
                    <svg class="w-6 h-6 shrink-0 text-laranja" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                        <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                        <path d="m22 7-10 6L2 7"></path>
                    </svg>

                    <p>Email:</p>

                    <p> Ronaldo@gmail.com</p>

                </div>

                <p className="flex gap-1 -mt-3.5 text-xs">
                    Deseja mudar de email? Clique na aba de segurança acima, ou aperte
                    <button className="text-laranja" onClick={() => setAbaAtual("seguranca")}>
                        Aqui.
                    </button>
                </p>

            </div>
        </div>
    )
}