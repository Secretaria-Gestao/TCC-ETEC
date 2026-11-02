import { useState } from 'react'

function SecaoFinanceiro({ totalSemana, agendamentos }) {
    const  [mesRef, setMesRef] = useState(() => {
        const hoje = new Date()
        return new Date( hoje.getFullYear(), hoje.getMonth(), 1)
    })

    function mudarMes(delta) {
        setMesRef((m) => new Date(m.getFullYear(), m.getMonth() + delta, 1))
    }

    const tituloMes = mesRef.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })


    const concluidos = agendamentos.filter((ag) => {
    const data = new Date(ag.horario)
    return (
        ag.status?.toLowerCase().startsWith('conclu') && data.getMonth() === mesRef.getMonth() && data.getFullYear() === mesRef.getFullYear()
    )
})
.sort((a, b) => new Date(b.horario) - new Date(a.horario))

const faturamentoMes = concluidos.reduce((soma, ag) => soma + Number(ag.preco || 0), 0)

const semPreco = concluidos.filter((ag) => ag.preco == null).length

const formatarReal = (v) =>
    Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    return (
        <div className="agenda-admin-secao">
            <h2>Financeiro</h2>
            {/* Navegação entre meses + total */}
        <div className="agenda-admin-financeiro-mes">
          <button onClick={() => mudarMes(-1)}>‹</button>
          <span style={{ textTransform: 'capitalize' }}>{tituloMes}</span>
          <button onClick={() => mudarMes(1)}>›</button>
        </div>
         <p className="agenda-admin-financeiro-total">
              Faturamento bruto: <b>{formatarReal(faturamentoMes)}</b>
        </p>
        {semPreco > 0 && (
         <p className="agenda-admin-vazio">
        {semPreco} atendimento(s) sem preço registrado não entraram na soma.
         </p>
)}
            <div className="agenda-admin-card-financeiro">
                <p className="agenda-admin-label">Receita desta semana</p>
                <p className="agenda-admin-valor">R$ {formatarReal(totalSemana)}</p>
            </div>

            <div className="agenda-admin-lista-transacoes">
               <p className="agenda-admin-titulo-lista">Atendimentos concluídos</p>
                {concluidos.length === 0
                    ? <p className="agenda-admin-vazio">Nenhum atendimento concluído.</p>
                    : concluidos.map((ag) => (
                        <div key={ag.id_agendamento} className="agenda-admin-transacao">
                            <span>{new Date(ag.horario).toLocaleDateString('pt-BR')}</span>
                            <span>{ag.profissional} → {ag.cliente}</span>
                            <span>{formatarReal(ag.preco)}</span>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default SecaoFinanceiro