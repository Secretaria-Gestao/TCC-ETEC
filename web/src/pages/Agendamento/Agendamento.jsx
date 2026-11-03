import { Link } from "react-router"

import Formulario from './components/Formulario/Formulario'
import BarraLateral from "@/BarraLateral/BarraLateral"
import { menuCliente } from "@/BarraLateral/listaMenus"

import './Agendamento.css'

function Agendamento() {
    return (
        <main className="main-principal">

            <div className="w-full h-full flex">

                <BarraLateral menu={menuCliente}/>

                <div className="flex flex-1 min-w-0">

                    <Formulario />

                </div>

            </div>

        </main>
    )
}

export default Agendamento
