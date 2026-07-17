import { Routes, Route } from 'react-router'

import Cadastro from './pages/Cadastro/Cadastro.jsx'
import Homepage from './pages/Homepage/Homepage.jsx'
import Agendamento from './pages/Agendamento/Agendamento.jsx'
import PageMeusAgendamentos from './pages/Agendamentos_Clientes/PageMeusAgendamentos.jsx'
import PageAgendaAdmin from './pages/Agenda_Admin/pageAgendaAdmin.jsx'
import Login from './pages/Login/Login.jsx'
import Fim from './pages/Fim/Fim.jsx'


function App() {
  

  return (
    <Routes>
      <Route path="/" element={ <Homepage /> } />
      <Route path="/cadastro/*" element={ <Cadastro /> } />
      <Route path="/login/*" element={ <Login /> } />
      <Route path="/agendamento/*" element={ <Agendamento /> } />
 
  {/* Rota do cliente para ver os próprios agendamentos */}
      <Route path="/agendamento/meus-agendamentos" element={ <PageMeusAgendamentos /> } />
  {/* Rota do admin/dono para ver todos os agendamentos do salão */}
      <Route path="/admin/agenda" element={ <PageAgendaAdmin /> } />
      <Route path="/fim" element={ <Fim /> } />
  </Routes>
    )
}
 
export default App
