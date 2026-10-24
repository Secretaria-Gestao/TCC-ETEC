import PerfilProfissional from "./components/PerfilProfissional"
import Seguranca from "../Clientes/components/Seguranca"

export default function Profissional({ abaAtual, setAbaAtual }) {
    return (
        <div className="py-5 px-3 flex flex-col flex-1 ">

            {abaAtual == "perfil" ?
                <PerfilProfissional setAbaAtual={setAbaAtual} />

                : <Seguranca profissional />
            }
        </div>
    )
}
