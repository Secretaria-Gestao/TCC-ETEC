import PerfilProfissional from "./components/PerfilProfissional"
import SalaoAdmin from "./components/SalaoAdmin"
import Seguranca from "../Clientes/components/Seguranca"
import HorariosProfissional from "./components/HorariosProfissional"

export default function Profissional({ abaAtual, setAbaAtual, admin }) {
    return (
        // O min-h-0 deixa este bloco encolher até a altura da janela na aba de Horários, para a tabela rolar por dentro.
        <div className={`py-5 px-3 flex flex-col flex-1 ${abaAtual == "horariosProfissional" ? "min-h-0" : ""}`}>

            {abaAtual == "perfil" && <PerfilProfissional setAbaAtual={setAbaAtual} />}

            {/* A Seguranca é a mesma do cliente: "profissional" (atalho para profissional={true}) muda o email lido e
                a tela de login para onde sai; "admin" troca "Excluir conta" pela exclusão do salão inteiro. */}
            {abaAtual == "seguranca" && <Seguranca profissional admin={admin} />}

            {/* O "&& admin" repete a regra do HeaderAbas (que só mostra a aba para o admin) para o caso de a aba ser forçada. */}
            {abaAtual == "salao" && admin && <SalaoAdmin />}

            {abaAtual == "horariosProfissional" && <HorariosProfissional />}
        </div>
    )
}
