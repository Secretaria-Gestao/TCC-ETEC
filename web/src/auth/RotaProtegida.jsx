import { useEffect, useState } from "react"
import { Navigate } from "react-router"
import { buscarDestinoDoUsuario } from "../pages/Login/services/login.js";

function RotaProtegida({ tiposPermitidos, children }) {
    // Transforma ['colaborador', 'gerente'] em "colaborador,gerente"
    const chavePermitidos = tiposPermitidos.join(",")

    const [verificacao, setVerificacao] = useState({ chave: null, status: "carregando" })

    useEffect(() => {
        async function verificar() {
            let tipo = null
            try {
                tipo = (await buscarDestinoDoUsuario()).tipo
            } catch (erro) {
                console.error("Erro ao verificar o usuário:", erro) // manda para o /login em vez de travar
            }
            const permitidos = chavePermitidos.split(",")

            let status
            if (!tipo) status = "deslogado"
            else if (permitidos.includes(tipo)) status = "liberado"
            else status = "sem-permissao"

            setVerificacao({ chave: chavePermitidos, status })
        }
        verificar()
    }, [chavePermitidos])

    // Se o resultado guardado é de outra página, ainda está verificando
    const status = verificacao?.chave === chavePermitidos ? verificacao.status : "carregando"

    if (status === "carregando") return <p>Carregando...</p>
    if (status === "deslogado") return <Navigate to="/login" replace />
    if (status === "sem-permissao") return <Navigate to="/login" replace />

    return children
}

export default RotaProtegida