import estilos from "../Abas.module.css"

import Perfil from "./components/Perfil"
import Seguranca from "./components/Seguranca"

export default function Cliente({ abaAtual, setAbaAtual }) {
    return (
        <div className="py-5 px-3 flex flex-col flex-1 ">

            {/* Seguranca sem as props "profissional" e "admin" é o fluxo do cliente (ele mesmo pode excluir a conta). */}
            {abaAtual == "perfil" ?
                <Perfil
                    setAbaAtual={setAbaAtual}
                    estilos={estilos}
                />

                : <Seguranca
                    estilos={estilos}
                />
            }
        </div>
    )
}