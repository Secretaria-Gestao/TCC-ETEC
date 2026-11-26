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
            <div className={`${abaAtual == "horariosProfissional" ? "w-[50rem] md:h-8/10!" : "w-2xl"} min-w-0 flex flex-col p-3 md:p-5 min-h-140 h-10/10 md:h-5/10 md:rounded-2xl bg-white text-black border-cobre border-2`}>

                <HeaderAbas
                    abaAtual={abaAtual}
                    setAbaAtual={setAbaAtual}
                    setConfigAberto={setConfigAberto}
                    perfil={perfil}
                />

                {/* Na aba de Horários, no desktop, quem rola são só as linhas da tabela (o cabeçalho fica parado), então
                    aqui o conteúdo não rola e só repassa a altura para baixo. No celular, e nas outras abas, a área
                    toda rola. Nas outras abas o flex-col deixa o conteúdo ocupar a altura toda, para o mt-auto
                    levar os botões de salvar/cancelar para o fim da janela. */}
                <div className={`w-full h-full ${abaAtual == "horariosProfissional" ? "overflow-y-auto md:flex md:flex-col md:overflow-hidden" : "flex flex-col overflow-y-auto"} bg`}>

                    {perfil == "cliente" && (
                        <Cliente abaAtual={abaAtual} setAbaAtual={setAbaAtual} />
                    )}

                    {(perfil == "profissional" || perfil == "admin") && (
                        <Profissional abaAtual={abaAtual} setAbaAtual={setAbaAtual} admin={perfil == "admin"} />
                    )}
                </div>
            </div>
        </div>
    )
}
