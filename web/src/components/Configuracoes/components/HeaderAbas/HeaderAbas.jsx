export default function HeaderAbas({ abaAtual, setAbaAtual, setConfigAberto, perfil }) {
    return (
        // shrink-0: sem ele, a área de conteúdo (h-full) espreme o cabeçalho e o overflow-y-hidden corta a
        // borda laranja de baixo da aba ativa.
        <div className="relative shrink-0 flex gap-[1.5rem] border-b border-black/90  md:text-[18px] items-center overflow-x-auto overflow-y-hidden">

            <button type="button"
                className={`border-b ${abaAtual == "perfil" ? "border-laranja border-b-2" : "border-transparent"} -mb-px px-1 pb-2`}
                onClick={() => setAbaAtual("perfil")}
            >
                Perfil
            </button>

            <button type="button"
                className={`border-b ${abaAtual == "seguranca" ? "border-laranja border-b-2" : "border-transparent"} -mb-px px-1 pb-2`}
                onClick={() => setAbaAtual("seguranca")}

            >
                Segurança
            </button>

            <button type="button"
                className={`border-b ${abaAtual == "horariosProfissional" ? "border-laranja border-b-2" : "border-transparent"} -mb-px px-1 pb-2`}
                onClick={() => setAbaAtual("horariosProfissional")}

            >
                Horários
            </button>

            {perfil == "admin" && (
                <button type="button"
                    className={`border-b ${abaAtual == "salao" ? "border-laranja border-b-2" : "border-transparent"} -mb-px px-1 pb-2`}
                    onClick={() => setAbaAtual("salao")}
                >
                    Salão
                </button>
            )}

            <div className="flex-1 text-right">
                <button
                    type="button"
                    className="text-laranja text-3xl"
                    onClick={() => setConfigAberto(false)}
                >
                    X
                </button>
            </div>


        </div>
    )
}