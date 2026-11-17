import { useEffect, useState } from 'react'
import { buscarAcertos } from '../../../../../services/buscarFinanceiro.js' 
import { calcularAcerto, moeda } from '../../../../../utils/financeiro.js'           

function SecaoAcertos({ mes }) {
  const [linhas, setLinhas] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState(null)
  const [semPermissao, setSemPermissao] = useState(false)

  useEffect(() => {
    let cancelado = false // ignora resposta antiga se o usuário trocar de mês rápido
    setCarregando(true)
    setErro(null)

    buscarAcertos(mes)
      .then((r) => { if (!cancelado) setLinhas(r.relatorio) })
      .catch((e) => {
        if (cancelado) return
        // 403 = gerente/profissional: o relatório simplesmente não aparece
        if (e.status === 403) setSemPermissao(true)
        else setErro('Não foi possível carregar o relatório.')
      })
      .finally(() => { if (!cancelado) setCarregando(false) })

    return () => { cancelado = true }
  }, [mes.getTime()]) 
  if (semPermissao) return null 
  if (carregando) return <p className="agenda-admin-vazio">Carregando acertos...</p>
  if (erro) return <p className="agenda-admin-vazio">{erro}</p>

  const calculadas = linhas.map((l) => ({
    ...l,
    acerto: calcularAcerto(l.total, l.tipo_pagamento, l.valor_comissao),
  }))


  const totalSalaoPaga = calculadas
    .filter((l) => l.acerto?.quemPaga === 'salao')
    .reduce((soma, l) => soma + l.acerto.valor, 0)
  const totalSalaoRecebe = calculadas
    .filter((l) => l.acerto?.quemPaga === 'profissional')
    .reduce((soma, l) => soma + l.acerto.valor, 0)

  return (
    <div className="agenda-admin-acertos">
      <p className="agenda-admin-titulo-lista">Acerto com colaboradores</p>

      <div className="agenda-admin-acertos-totais">
        <span>O salão paga: <b>{moeda(totalSalaoPaga)}</b></span>
        <span>O salão recebe: <b>{moeda(totalSalaoRecebe)}</b></span>
      </div>

      {calculadas.length === 0 ? (
        <p className="agenda-admin-vazio">Nenhum colaborador encontrado.</p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table className="agenda-admin-tabela-acertos">
            <thead>
              <tr>
                <th>Colaborador</th><th>Concluídos</th><th>Faturado</th>
                <th>Acordo</th><th>Acerto</th>
              </tr>
            </thead>
            <tbody>
              {calculadas.map((l) => (
                <tr key={l.id_profissional}>
                  <td>{l.nome}</td>
                  <td>{l.qtd}</td>
                  <td>{moeda(l.total)}</td>
                  {l.acerto ? (
                    <>
                      <td>
                        {l.acerto.quemPaga === 'salao' ? 'Salão paga' : 'Colaborador repassa'}{' '}
                        {Number(l.valor_comissao)}%
                      </td>
                      <td>
                        {l.acerto.quemPaga === 'salao' ? 'Pagar ' : 'Receber '}
                        <b>{moeda(l.acerto.valor)}</b>
                      </td>
                    </>
                  ) : (
                    <td colSpan={2}>acordo não definido</td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default SecaoAcertos