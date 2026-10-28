function SecaoFinanceiro({ totalSemana, agendamentos }) {
    const concluidos = agendamentos.filter((ag) => ag.status?.toLowerCase().startsWith("conclu"))

    return (
        <div className="agenda-admin-secao">
            <h2>Financeiro</h2>

            <div className="agenda-admin-card-financeiro">
                <p className="agenda-admin-label">Receita desta semana</p>
                <p className="agenda-admin-valor">R$ {totalSemana.toFixed(2)}</p>
            </div>

            <div className="agenda-admin-lista-transacoes">
               <p className="agenda-admin-titulo-lista">Atendimentos concluídos</p>
                {concluidos.length === 0
                    ? <p className="agenda-admin-vazio">Nenhum atendimento concluído.</p>
                    : concluidos.map((ag) => (
                        <div key={ag.id_agendamento} className="agenda-admin-transacao">
                            <span>{new Date(ag.horario).toLocaleDateString('pt-BR')}</span>
                            <span>{ag.profissional} → {ag.cliente}</span>
                            <span>R$ {Number (ag.preco || 0).toFixed(2)}</span>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default SecaoFinanceiro