import MeusAgendamentosComponente from './components/MeusAgendamentos/MeusAgendamentos.jsx'

import BarraLateral from '@/BarraLateral/BarraLateral.jsx'

function PageMeusAgendamentos() {
    return (
        <main className="main-principal">
            <div className="w-full h-full flex">
                <BarraLateral />
                <MeusAgendamentosComponente />
            </div>
        </main>
    )
}

export default PageMeusAgendamentos
