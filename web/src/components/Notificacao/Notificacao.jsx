import { useState } from "react"

import { useNotificacaoStore } from "./notificacaoStore.js"
import "./Notificacao.css"

function Notificacao({ id, titulo, texto, mostrarBotao, lblBotao, textoBotao, funcaoBotao }) { // O componente de fato da notificação
    const [estaFechando, setEstaFechando] = useState(false);
    const removerNotificacao = useNotificacaoStore((state) => state.removerNotificacao);

    function fecharNotificacao() {  // Serve para animar o sumiço da notificação
        setEstaFechando(true);
    }

    function finalizarNotificacao() {
        removerNotificacao(id)
    }

    function executarBotao() {
        funcaoBotao?.()
        fecharNotificacao()
    }

    return (
        <div className={`notificacao-comum ${estaFechando ? 'notificacao-comum-fechando' : ''}`} onTransitionEnd={finalizarNotificacao}>
            <button type="button" className=" absolute right-0 mr-4! top-4 text-2xl text-laranja " onClick={fecharNotificacao}>X</button>

            <div className="">
                <b> <p className="text-2xl">{titulo}</p></b>
                {texto && (<p className="text-[14px] py-0.5!">{texto}</p>)}
            </div>

            {mostrarBotao && (
                <>
                    {lblBotao && (<p className="text-[14px] "> {lblBotao} </p>)}
                    <button type="button" className="bg-marrom text-laranja p-2! mt-1! rounded-sm" onClick={executarBotao}>{textoBotao}</button>
                </>
            )}
        </div>
    )
}

export function NotificacaoContainer() {
    const notificacoes = useNotificacaoStore((state) => state.notificacoes)
    return notificacoes.map((notificacao) => <Notificacao key={notificacao.id} {...notificacao} />)
}
