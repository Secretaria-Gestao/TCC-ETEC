import MeusAgendamentosComponente from './components/MeusAgendamentos/MeusAgendamentos.jsx'

import BarraLateral from '@/BarraLateral/BarraLateral.jsx'
import { menuCliente } from '@/BarraLateral/listaMenus.jsx'

function PageMeusAgendamentos() {
    return (
        <div className="main-principal flex">
            <BarraLateral menu={menuCliente}/>
            <MeusAgendamentosComponente />
        </div>
    )
}

export default PageMeusAgendamentos