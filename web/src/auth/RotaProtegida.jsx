import { useEffect, useState } from "react"
import { Navigate } from "react-router"
import { buscarDestinoDoUsuario } from "../pages/Login/services/login.js";

// Só mostra a página se quem está logado for de um dos tiposPermitidos
// ("cliente", "admin", "gerente" ou "profissional").
// Sem login vai para /login; logado sem permissão vai para a página inicial do próprio tipo.
function RotaProtegida({ tiposPermitidos, children }) {
    // Transforma ['profissional', 'gerente'] em "profissional,gerente"
    const chavePermitidos = tiposPermitidos.join(",")

    const [verificacao, setVerificacao] = useState({ chave: null, tipo: null, destino: null })

    useEffect(() => {
        let cancelado = false

        async function verificar() {
            let usuario = { tipo: null, destino: "/login" }
            try {
                usuario = await buscarDestinoDoUsuario()
            } catch (erro) {
                console.error("Erro ao verificar o usuário:", erro) // manda para o /login em vez de travar
            }
            if (!cancelado) setVerificacao({ chave: chavePermitidos, ...usuario })
        }
        verificar()

        return () => { cancelado = true }
    }, [chavePermitidos])

    // Se o resultado guardado é de outra página, ainda está verificando
    if (verificacao.chave !== chavePermitidos) return <p>Carregando...</p>

    if (!verificacao.tipo) return <Navigate to="/login" replace />
    if (!chavePermitidos.split(",").includes(verificacao.tipo)) return <Navigate to={verificacao.destino} replace />

    return children
}

export default RotaProtegida
