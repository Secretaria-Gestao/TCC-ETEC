import { create } from "zustand"

export const useNotificacaoStore = create((set) => ({
    notificacoes: [],

    mostrarNotificacao: (dados) => {
        const novaNotificacao = {
            id: crypto.randomUUID(),
            ...dados
        }

        set((state) => ({
            notificacoes: [...state.notificacoes, novaNotificacao]
        }))
    },

    removerNotificacao: (id) => {
        set((state) => ({
            notificacoes: state.notificacoes.filter(
                (notificacao) => notificacao.id !== id
            )
        }))
    }
}))
