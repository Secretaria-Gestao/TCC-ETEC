import HistoricoAtendimentos from "./components/HistoricoAgendamentos/HistoricoAtendimentos.jsx";
import BarraLateral from '../../components/BarraLateral/BarraLateral.jsx';
import '../Agendamento/Agendamento.css' ;

function PageHistoricoAtendimentos() {
    return (
        <main className="main-principal">
            <div className="w-full h-full flex">
                <BarraLateral />
                <HistoricoAtendimentos />
            </div>
        </main>
    )
}

export default PageHistoricoAtendimentos