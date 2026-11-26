import { useEffect } from "react"
import { useNavigate } from "react-router"
import { buscarDestinoDoUsuario } from "../pages/Login/services/login.js";

export default function Redirecionar() {
    const navegar = useNavigate()

    useEffect(() => {
        buscarDestinoDoUsuario()
            .then(({ destino }) => navegar(destino, { replace: true }))
            .catch(() => navegar('/login', { replace: true }))
    }, [])

    return <p>Entrando...</p>
}