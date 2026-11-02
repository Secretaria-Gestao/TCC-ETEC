import HistoricoAtendimentos from "./components/HistoricoAgendamentos/HistoricoAtendimentos.jsx";
import BarraLateral from '../../components/BarraLateral/BarraLateral.jsx';
import { menuCliente } from '../../components/BarraLateral/listaMenus.jsx';
import '../Agendamento/Agendamento.css' ;

function PageHistoricoAtendimentos() {
    return (
        <div className="main-principal flex">
            <BarraLateral menu={menuCliente}/>
            <HistoricoAtendimentos />
        </div>
    )
}

export default PageHistoricoAtendimentos