import { supabase } from "../../../../../../services/SupabaseConfig";

import { useNotificacaoStore } from "@/Notificacao";
import { pegarSessao } from "../../../../../../services/pegarSessao";

export async function mudarSenha(novaSenha) {
    const mostrarNotificacao = useNotificacaoStore.getState().mostrarNotificacao

    const { error } = await supabase.auth.updateUser({ password: novaSenha })

    const resposta = await fetch("/api/editar/senha-atual", {
        headers: {
            "Content-Type": "application/json",
            "Bearer": ``
        }
    })

    if (error) {
        mostrarNotificacao({
            titulo: "Falha na atualização da senha",
            texto: "Cheque os campos e tente novamente"
        })
        return 
    }

    mostrarNotificacao({
        titulo: "Senha Atualizada"
    })

}
