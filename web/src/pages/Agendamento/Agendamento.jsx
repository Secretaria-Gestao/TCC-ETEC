import { Link } from "react-router"

import Formulario from './components/Formulario/Formulario'
import BarraLateral from "@/BarraLateral/BarraLateral"
import { menuCliente } from "@/BarraLateral/listaMenus"

import './Agendamento.css'

function Agendamento() {
    return (
        <div className="flex">

            <BarraLateral menu={menuCliente}/>

            <div className="agendamento-page ">

                <Formulario />

            </div>

        </div>
    )
}

export default Agendamento
