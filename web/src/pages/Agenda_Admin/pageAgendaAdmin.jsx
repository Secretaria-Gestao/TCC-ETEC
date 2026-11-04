// Página principal da área do administrador/dono do salão.
// Segue o mesmo padrão das outras páginas do projeto.
import AdminAgenda from './components/AdminAgenda/AgendaAd.jsx'
import BarraLateral from '@/BarraLateral/BarraLateral.jsx'

function PageAgendaAdmin() {
    return (
        <main className="main-principal">
            <div className="w-full min-h-dvh flex">
                <BarraLateral />
                <AdminAgenda />
            </div>
        </main>
    )
}

export default PageAgendaAdmin