// Página principal da área do profissional.
// Segue o mesmo padrão das outras páginas do projeto:
// a página em si é simples e só renderiza o componente principal.
import AgendaColaborador from './components/ColabAgenda/AgendaColab.jsx'

function PageAgendaColaborador() {
    return (

        <main className="main-principal">
            <div className="w-full min-h-dvh">
                <AgendaColaborador />
            </div>
        </main>
    )
}

export default PageAgendaColaborador