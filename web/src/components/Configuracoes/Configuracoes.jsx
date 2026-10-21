import { useState } from "react"

import HeaderAbas from "./components/HeaderAbas/HeaderAbas"
import Cliente from "./components/Abas/Clientes/Cliente"

export default function Configuracoes({ perfil, setConfigAberto }) {

    const [abaAtual, setAbaAtual] = useState("perfil")

    return (
        <div className="absolute top-0 left-full w-[calc(100dvw-100%)] p-5 bg-[#1f2a3c]/95 h-full flex items-center justify-center z-50">

            {/* Box principal */}
            <div className="w-2xl flex flex-col p-5 rounded-2xl min-h-120 bg-[#4B3639]/96 border-amarelo border-2 ">

                <HeaderAbas
                    abaAtual={abaAtual}
                    setAbaAtual={setAbaAtual}
                    setConfigAberto={setConfigAberto}
                    perfil={perfil}
                />

                {perfil == "cliente" && (
                    <Cliente abaAtual={abaAtual} setAbaAtual={setAbaAtual}/>
                )}

                {perfil == "profissional" && (
                    <Cliente />
                )}

            </div>

        </div>
    )
}