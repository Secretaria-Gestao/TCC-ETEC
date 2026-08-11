function SecaoProfissionais({ nomesUnicos, agendamentos }) {
    return (
        <div className="agenda-admin-secao">
            <h2>Profissionais</h2>
            {nomesUnicos.length === 0
                ? <p className="agenda-admin-vazio">Nenhum profissional com agendamentos ainda.</p>
                : nomesUnicos.map((nome) => (
                    <div key={nome} className="agenda-admin-cartao-profissional">
                        <div className="agenda-admin-avatar">{nome.charAt(0).toUpperCase()}</div>
                        <div>
                            <p className="agenda-admin-nome-prof">{nome}</p>
                            <p className="agenda-admin-qtd-agend">
                                {agendamentos.filter((ag) => ag.profissional === nome).length} agendamento(s)
                            </p>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default SecaoProfissionais