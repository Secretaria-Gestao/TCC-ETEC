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
import PageHistoricoAtendimentos from './pages/Agendamentos_Clientes/PageHistoricoAtendimentos.jsx'
import Redirecionar from './auth/Redirecionar.jsx'
import RotaProtegida from './auth/RotaProtegida.jsx'

import { NotificacaoContainer } from '@/Notificacao'

// Tipos de usuário (os mesmos da BarraLateral): "cliente", "admin", "gerente" e "profissional"
const cliente = ['cliente']
const profissionais = ['profissional', 'gerente', 'admin']
const gestao = ['gerente', 'admin']

function App() {
  return (
    <>
      <NotificacaoContainer />
      <Routes>
        {/* Rotas públicas */}
        <Route path="/" element={ <Homepage /> } />
        <Route path="/cadastro/*" element={ <Cadastro /> } />
        <Route path="/login/*" element={ <Login /> } />
        {/* Volta do login com Google: descobre o tipo do usuário e manda para a página dele */}
        <Route path="/redirecionar" element={ <Redirecionar /> } />

        {/* Rotas do cliente */}
        <Route path="/agendamento/*" element={
          <RotaProtegida tiposPermitidos={cliente}><Agendamento /></RotaProtegida>
        } />
        <Route path="/agendamento/meus-agendamentos" element={
          <RotaProtegida tiposPermitidos={cliente}><PageMeusAgendamentos /></RotaProtegida>
        } />
        <Route path="/agendamento/historico" element={
          <RotaProtegida tiposPermitidos={cliente}><PageHistoricoAtendimentos /></RotaProtegida>
        } />

        {/* Rota do colaborador para ver a própria agenda (gerente e admin também atendem) */}
        <Route path="/colaborador/agenda" element={
          <RotaProtegida tiposPermitidos={profissionais}><PageAgendaColaborador /></RotaProtegida>
        } />

        {/* Rotas do admin/gerente */}
        <Route path="/admin/agenda" element={
          <RotaProtegida tiposPermitidos={gestao}><PageAgendaAdmin secao="agenda" /></RotaProtegida>
        } />
        <Route path="/admin/financeiro" element={
          <RotaProtegida tiposPermitidos={gestao}><PageAgendaAdmin secao="financeiro" /></RotaProtegida>
        } />
        <Route path="/admin/atendimentos-por-profissional" element={
          <RotaProtegida tiposPermitidos={gestao}><PageAgendaAdmin secao="profissionais" /></RotaProtegida>
        } />
        <Route path="/admin/gerenciador-servicos" element={
          <RotaProtegida tiposPermitidos={gestao}><GerenciadorServicos /></RotaProtegida>
        } />
        <Route path="/admin/gerenciador-profissionais" element={
          <RotaProtegida tiposPermitidos={gestao}><GerenciadorProfissionais /></RotaProtegida>
        } />
      </Routes>
    </>
  )
}

export default App
