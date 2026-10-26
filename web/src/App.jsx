import { Routes, Route } from 'react-router'

import Cadastro from './pages/Cadastro/Cadastro.jsx'
import Homepage from './pages/Homepage/Homepage.jsx'
import Agendamento from './pages/Agendamento/Agendamento.jsx'
import PageMeusAgendamentos from './pages/Agendamentos_Clientes/PageMeusAgendamentos.jsx'
import PageAgendaColaborador from './pages/Agenda_Colaborador/pageAgendaColaborador.jsx'
import PageAgendaAdmin from './pages/Agenda_Admin/pageAgendaAdmin.jsx'
import GerenciadorServicos from './pages/GerenciadorServicos/GerenciadorServicos.jsx'
import GerenciadorProfissionais from './pages/GerenciadorProfissionais/GerenciadorProfissionais.jsx'
import Login from './pages/Login/Login.jsx'
import Redirecionar from './auth/Redirecionar.jsx'
import RotaProtegida from './auth/RotaProtegida.jsx'

import { NotificacaoContainer } from '@/Notificacao'

function App() {
  return (
    <>
      <NotificacaoContainer />
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={ <Homepage /> } />
        <Route path="/cadastro/*" element={ <Cadastro /> } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/redirecionar" element={ <Redirecionar /> } />

        {/* Rotas do cliente */}
        <Route path="/agendamento/*" element={
          <RotaProtegida tiposPermitidos={['cliente']}>
            <Agendamento />
          </RotaProtegida>
        } />
        <Route path="/agendamento/meus-agendamentos" element={
          <RotaProtegida tiposPermitidos={['cliente']}>
            <PageMeusAgendamentos />
          </RotaProtegida>
        } />

        {/* Rota do colaborador para ver a própria agenda */}
        <Route path="/colaborador/agenda" element={
        <RotaProtegida tiposPermitidos={['colaborador', 'gerente', 'administrador']}>
            <PageAgendaColaborador />
        </RotaProtegida>
        } />

        {/* Rotas do admin/dono */}
        <Route path="/admin/agenda" element={
        <RotaProtegida tiposPermitidos={['gerente', 'administrador']}>
            <PageAgendaAdmin />
        </RotaProtegida>
        } />
        <Route path="/admin/gerenciador-servicos" element={
        <RotaProtegida tiposPermitidos={['gerente', 'administrador']}>
            <GerenciadorServicos />
        </RotaProtegida>
        } />
        <Route path="/admin/gerenciador-profissionais" element={
        <RotaProtegida tiposPermitidos={['gerente', 'administrador']}>
            <GerenciadorProfissionais />
        </RotaProtegida>
        } />
      </Routes>
    </>
  )
}

export default App