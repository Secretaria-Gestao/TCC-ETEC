import { Routes, Route } from 'react-router'

import Cadastro from './pages/Cadastro/Cadastro.jsx'
import Homepage from './pages/Homepage/Homepage.jsx'
import Agendamento from './pages/Agendamento/Agendamento.jsx'
import PageMeusAgendamentos from './pages/Agendamentos_Clientes/PageMeusAgendamentos.jsx'
import PageAgendaAdmin from './pages/Agenda_Admin/pageAgendaAdmin.jsx'
import Login from './pages/Login/Login.jsx'
import Fim from './pages/Fim/Fim.jsx'
import { NotificacaoContainer } from '@/Notificacao'


function App() {
  return (
    <>
      <NotificacaoContainer />
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/cadastro/*" element={<Cadastro />} />
        <Route path="/login/*" element={<Login />} />
        <Route path="/agendamento/*" element={<Agendamento />} />
        <Route path="/agendamento/meus-agendamentos" element={<PageMeusAgendamentos />} />
        <Route path="/admin/agenda" element={<PageAgendaAdmin />} />
        <Route path="/fim" element={<Fim />} />
      </Routes>
    </>
  )
}

export default App
