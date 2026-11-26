import { useEffect, useState } from 'react'
import { buscarMinhaRenda } from '../../services/buscarFinanceiro.js' 
import { calcularAcerto, moeda } from '../../utils/financeiro.js'     

function CardMinhaRenda() {
  const [mes, setMes] = useState(() => {
    const hoje = new Date()
    return new Date(hoje.getFullYear(), hoje.getMonth(), 1)
  })
  const [dados, setDados] = useState(null)
  const [erro, setErro] = useState(null)
  const [ehCliente, setEhCliente] = useState(false)

  useEffect(() => {
    let cancelado = false
    setErro(null)
    buscarMinhaRenda(mes)
      .then((r) => { if (!cancelado) setDados(r) })
      .catch((e) => {
        if (cancelado) return
        if (e.status === 404) setEhCliente(true) 
        else setErro('Não foi possível carregar a renda.')
      })
    return () => { cancelado = true }
  }, [mes.getTime()])

  if (ehCliente) return null

  const mudarMes = (delta) =>
    setMes((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1))

  const acerto = dados
    ? calcularAcerto(dados.total, dados.tipo_pagamento, dados.valor_comissao)
    : null

  return (
    <div className="card-minha-renda">
      <b>Minha renda no mês</b>

      <div className="card-minha-renda-nav">
        <button onClick={() => mudarMes(-1)} aria-label="Mês anterior">‹</button>
        <span>{mes.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</span>
        <button onClick={() => mudarMes(1)} aria-label="Próximo mês">›</button>
      </div>

      {erro ? <small>{erro}</small> : !dados ? <small>Carregando...</small> : (
        <>
          <small>{dados.qtd} atendimento(s) concluído(s)</small>
          <div>Total: <b>{moeda(dados.total)}</b></div>

          {acerto ? (
            <div>
              {acerto.quemPaga === 'salao' ? 'Você recebe do salão: ' : 'Você repassa ao salão: '}
              <b>{moeda(acerto.valor)}</b>
              <small> ({Number(dados.valor_comissao)}% do total)</small>
            </div>
          ) : (
            // Sem acordo: mostra só o total e avisa
            <small>Acordo financeiro não definido.</small>
          )}
        </>
      )}
    </div>
  )
}

export default CardMinhaRenda