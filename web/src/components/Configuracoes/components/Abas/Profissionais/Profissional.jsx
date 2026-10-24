import PerfilProfissional from "./components/PerfilProfissional"
import SalaoAdmin from "./components/SalaoAdmin"
import Seguranca from "../Clientes/components/Seguranca"

export default function Profissional({ abaAtual, setAbaAtual, admin }) {
    return (
        <div className="py-5 px-3 flex flex-col flex-1 ">

            {abaAtual == "perfil" && <PerfilProfissional setAbaAtual={setAbaAtual} />}

            {abaAtual == "seguranca" && <Seguranca profissional admin={admin} />}

            {abaAtual == "salao" && admin && <SalaoAdmin />}
        </div>
    )
}
