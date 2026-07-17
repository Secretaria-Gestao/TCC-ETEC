import { useNotificacaoStore } from "@/Notificacao"

function notificarErro(texto = "Verifique os campos e tente novamente") {
    const mostrarNotificacao = useNotificacaoStore.getState().mostrarNotificacao

    mostrarNotificacao({
        titulo: "Erro ao se cadastrar!",
        texto
    })
}

export default notificarErro
