import { Routes, Route } from 'react-router'

import Cadastro from './pages/Cadastro/Cadastro.jsx'
import Homepage from './pages/Homepage/Homepage.jsx'
import Agendamento from './pages/Agendamento/Agendamento.jsx'
import PageMeusAgendamentos from './pages/Agendamentos_Clientes/PageMeusAgendamentos.jsx'
import PageAgendaColaborador from './pages/Agenda_Colaborador/pageAgendaColaborador.jsx'
import PageAgendaAdmin from './pages/Agenda_Admin/pageAgendaAdmin.jsx'
import GerenciadorServicos from './pages/GerenciadorServicos/GerenciadorServicos.jsx'
import Login from './pages/Login/Login.jsx'
import Fim from './pages/Fim/Fim.jsx'

import { NotificacaoContainer } from '@/Notificacao'

function App() {
  return (
 <>
      <NotificacaoContainer />
    <Routes>
      <Route path="/" element={ <Homepage /> } />
      <Route path="/cadastro/*" element={ <Cadastro /> } />
      <Route path="/login/*" element={ <Login /> } />
      <Route path="/agendamento/*" element={ <Agendamento /> } />

  {/* Rota do colaborador para ver a própria agenda */}    
      <Route path="/colaborador/agenda" element={ <PageAgendaColaborador /> } />
  {/* Rota do cliente para ver os próprios agendamentos */}
      <Route path="/agendamento/meus-agendamentos" element={ <PageMeusAgendamentos /> } />
  {/* Rota do admin/dono para ver todos os agendamentos do salão */}
  
      <Route path="/admin/agenda" element={ <PageAgendaAdmin /> } />
      <Route path="/admin/gerenciador-servicos" element={<GerenciadorServicos />} />
      <Route path="/fim" element={ <Fim /> } />
  </Routes>
     </>
  )
}
export default App
