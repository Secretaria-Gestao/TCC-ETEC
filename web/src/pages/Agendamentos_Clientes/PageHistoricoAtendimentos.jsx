import HistoricoAtendimentos from "./components/HistoricoAgendamentos/HistoricoAtendimentos.jsx";
import BarraLateral from '../../components/BarraLateral/BarraLateral.jsx';
import { menuCliente } from '../../components/BarraLateral/listaMenus.jsx';
import '../Agendamento/Agendamento.css' ;

function PageHistoricoAtendimentos() {
    return (
        <main className="main-principal">
            <div className="w-full h-full flex">
                <BarraLateral menu={menuCliente}/>
                <HistoricoAtendimentos />
            </div>
        </main>
    )
}

export default PageHistoricoAtendimentos