import { contaNoMes } from "../utils/contarAtendimentos.js"

function SecaoProfissionais({ nomesUnicos, agendamentos }) {
    const ranking = nomesUnicos.map((nome) => ({
        nome,
        total: agendamentos.filter((ag) => ag.profissional === nome && contaNoMes(ag)).length
    }))
    .sort((a, b) => b.total - a.total)
    return (
        <div className="agenda-admin-secao">
            <h2>Profissionais (mês atual)</h2>
            {nomesUnicos.length === 0
                ? <p className="agenda-admin-vazio">Nenhum profissional com agendamentos ainda.</p>
                : ranking.map(({ nome, total }) => (
                    <div key={nome} className="agenda-admin-cartao-profissional">
                        <div className="agenda-admin-avatar">{nome.charAt(0).toUpperCase()}</div>
                        <div>
                            <p className="agenda-admin-nome-prof">{nome}</p>
                            <p className="agenda-admin-qtd-agend">
                                {total} agendamento{total !== 1 && 's'} no mês
                            </p>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}

export default SecaoProfissionais