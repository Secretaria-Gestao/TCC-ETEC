export default function HeaderAbas({abaAtual, setAbaAtual, setConfigAberto, perfil}) {
    return (
        <div className="relative flex gap-[1.5rem] border-b border-black/90 text-[18px]">

            <button type="button"
                className={`border-b ${abaAtual == "perfil" ? "border-cobre border-b-2" : "border-transparent"} -mb-px px-1 pb-2`}
                onClick={() => setAbaAtual("perfil")}
            >
                Perfil
            </button>

            <button type="button"
                className={`border-b ${abaAtual == "seguranca" ? "border-cobre border-b-2" : "border-transparent"} -mb-px px-1 pb-2`}
                onClick={() => setAbaAtual("seguranca")}

            >
                Segurança
            </button>

            {perfil == "admin" && (
                <button type="button"
                    className={`border-b ${abaAtual == "salao" ? "border-cobre border-b-2" : "border-transparent"} -mb-px px-1 pb-2`}
                    onClick={() => setAbaAtual("salao")}
                >
                    Salão
                </button>
            )}

            <button
                type="button"
                className="absolute right-2 -top-2 z-10 text-laranja text-3xl"
                onClick={() => setConfigAberto(false)}
            >
                X
            </button>


        </div>
    )
}