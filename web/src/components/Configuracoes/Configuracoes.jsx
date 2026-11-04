import { useState } from "react"

import HeaderAbas from "./components/HeaderAbas/HeaderAbas"
import Cliente from "./components/Abas/Clientes/Cliente"
import Profissional from "./components/Abas/Profissionais/Profissional"
import estilos from "./Configuracoes.module.css"

// perfil é o tipo de quem está logado: "cliente", "profissional" ou "admin" (calculado na BarraLateral).
// Ele decide quais abas existem: Perfil e Segurança para todos, e Salão só para o admin.
export default function Configuracoes({ perfil, setConfigAberto }) {
    const [abaAtual, setAbaAtual] = useState("perfil")

    return (
        // O painel é renderizado dentro da BarraLateral. O "absolute left-full" o encosta na borda direita dela e
        // a largura calc(100dvw - 100%) ocupa o resto da tela, cobrindo a página. Quem coloca o painel acima do
        // conteúdo da página é o z-40 da barra; o z-50 só o deixa acima dos itens da própria barra.
        <div className={estilos["main-config"]}>

            {/* Box principal */}
            <div className="w-2xl min-w-max flex flex-col p-5 min-h-140 rounded-2xl bg-white text-black border-cobre border-2 overflow-y-auto">

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