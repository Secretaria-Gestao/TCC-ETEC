function SecaoFinanceiro({ totalSemana, agendamentos }) {
    return (
        <div className="agenda-admin-secao">
            <h2>Financeiro</h2>

            <div className="agenda-admin-card-financeiro">
                <p className="agenda-admin-label">Receita desta semana</p>
                <p className="agenda-admin-valor">R$ {totalSemana.toFixed(2)}</p>
            </div>

            <div className="agenda-admin-lista-transacoes">
                <p className="agenda-admin-titulo-lista">Todos os agendamentos</p>
                {agendamentos.length === 0
                    ? <p className="agenda-admin-vazio">Nenhum agendamento encontrado.</p>
                    : agendamentos.map((ag, i) => (
                        <div key={i} className="agenda-admin-transacao">
                            <span>{new Date(ag.horario).toLocaleDateString('pt-BR')}</span>
                            <span>{ag.profissional} → {ag.cliente}</span>
                            <span>R$ {(ag.preco || 0).toFixed(2)}</span>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default SecaoFinanceiro