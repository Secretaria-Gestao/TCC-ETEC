// Página principal da área do administrador/dono do salão.
// Segue o mesmo padrão das outras páginas do projeto.
import AdminAgenda from './components/AdminAgenda/AgendaAd.jsx'
import BarraLateral from '@/BarraLateral/BarraLateral.jsx'

// A mesma página serve a agenda, o financeiro e os atendimentos por profissional; a rota escolhe a seção.
function PageAgendaAdmin({ secao }) {
    return (
        <main className="main-principal">
            <div className="w-full min-h-dvh flex">
                <BarraLateral />
                <AdminAgenda secaoAtiva={secao} />
            </div>
        </main>
    )
}

export default PageAgendaAdmin