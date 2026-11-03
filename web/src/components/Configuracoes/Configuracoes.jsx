import { useState } from "react"

import HeaderAbas from "./components/HeaderAbas/HeaderAbas"
import Cliente from "./components/Abas/Clientes/Cliente"
import Profissional from "./components/Abas/Profissionais/Profissional"

// perfil é o tipo de quem está logado: "cliente", "profissional" ou "admin" (calculado na BarraLateral).
// Ele decide quais abas existem: Perfil e Segurança para todos, e Salão só para o admin.
export default function Configuracoes({ perfil, setConfigAberto }) {
    const [abaAtual, setAbaAtual] = useState("perfil")

    return (
        // O painel é renderizado dentro da BarraLateral. O "absolute left-full" o encosta na borda direita dela e
        // a largura calc(100dvw - 100%) ocupa o resto da tela, cobrindo a página. Quem coloca o painel acima do
        // conteúdo da página é o z-40 da barra; o z-50 só o deixa acima dos itens da própria barra.
        <div className="absolute top-0 left-full w-[calc(100dvw-100%)] p-5 bg-[#1f2a3c]/95 h-full flex items-center justify-center z-50">

            {/* Box principal */}
            <div className="w-2xl min-w-max flex flex-col p-5 rounded-2xl min-h-140 bg-[#4B3639]/80 border-amarelo border-2 ">

                <HeaderAbas
                    abaAtual={abaAtual}
                    setAbaAtual={setAbaAtual}
                    setConfigAberto={setConfigAberto}
                    perfil={perfil}
                />

                {perfil == "cliente" && (
                    <Cliente abaAtual={abaAtual} setAbaAtual={setAbaAtual}/>
                )}

                {(perfil == "profissional" || perfil == "admin") && (
                    <Profissional abaAtual={abaAtual} setAbaAtual={setAbaAtual} admin={perfil == "admin"} />
                )}

            </div>

        </div>
    )
}