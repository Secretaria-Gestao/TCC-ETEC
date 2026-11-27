import { useEffect, useRef } from "react"
import { useNavigate } from "react-router"
import { buscarDestinoDoUsuario } from "../pages/Login/services/login.js";

// Página para onde o Google devolve o usuário depois do login.
// Descobre o tipo dele (e cadastra como cliente se for a primeira vez) e manda para a página certa.
export default function Redirecionar() {
    const navegar = useNavigate()

    // No modo de desenvolvimento o StrictMode roda o efeito duas vezes; isso evitaria cadastrar o cliente em dobro
    const jaRodou = useRef(false)

    useEffect(() => {
        if (jaRodou.current) return
        jaRodou.current = true

        buscarDestinoDoUsuario()
            .then(({ destino }) => navegar(destino, { replace: true }))
            .catch(() => navegar('/login', { replace: true }))
    }, [navegar])

    return <p>Entrando...</p>
}
