import { Routes, Route } from 'react-router'

import Cadastro from './pages/Cadastro/Cadastro.jsx'
import Homepage from './pages/Homepage/Homepage.jsx'
import Agendamento from './pages/Agendamento/Agendamento.jsx'

function App() {
  

  return (
    <Routes>

      <Route path="/" element={ <Homepage /> } />
      <Route path="/cadastro/*" element={ <Cadastro /> } />
      <Route path="/agendamento" element={ <Agendamento /> } />

    </Routes>
  )
}

export default App
