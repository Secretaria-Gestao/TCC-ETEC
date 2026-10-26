import { useEffect } from "react"
import { useNavigate } from "react-router"
import { buscarDestinoDoUsuario } from "../pages/Login/services/login.js";

function Redirecionar() {
    const navegar = useNavigate()

    useEffect(() => {
        buscarDestinoDoUsuario().then(destino => navegar(destino, { replace: true }))
    }, [navegar])

    return <p>Entrando...</p>
}

export default Redirecionar