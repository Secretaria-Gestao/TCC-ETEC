export default function HeaderAbas({abaAtual, setAbaAtual, setConfigAberto, perfil}) {
    return (
        <div className="relative flex gap-[1.5rem] border-b border-white/20 text-[18px]">

            <button type="button"
                className={`border-b ${abaAtual == "perfil" ? "border-amarelo" : "border-transparent"} -mb-px px-1 pb-2`}
                onClick={() => setAbaAtual("perfil")}
            >
                Perfil
            </button>

            <button type="button"
                className={`border-b ${abaAtual == "seguranca" ? "border-amarelo" : "border-transparent"} -mb-px px-1 pb-2`}
                onClick={() => setAbaAtual("seguranca")}

            >
                Segurança
            </button>

            {perfil == "admin" && (
                <button type="button"
                    className={`border-b ${abaAtual == "salao" ? "border-amarelo" : "border-transparent"} -mb-px px-1 pb-2`}
                    onClick={() => setAbaAtual("salao")}
                >
                    Salão
                </button>
            )}

            <button className="absolute right-2 -top-2 text-laranja text-3xl" onClick={() => setConfigAberto(false)}> X </button>


        </div>
    )
}