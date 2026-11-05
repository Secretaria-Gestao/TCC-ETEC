import { HORARIOS, DIAS_SEMANA } from '../utils/AgendaHelpers.js'

// Início e fim do atendimento ("14:30" e "15:15"). O fim fica null quando a duração não foi gravada.
// Ficam em linhas separadas porque as colunas da grade são estreitas.
function horariosDoAtendimento(ag) {
    const opcoes = { hour: '2-digit', minute: '2-digit' }
    const inicio = new Date(ag.horario)
    const fim = ag.duracao_total ? new Date(inicio.getTime() + Number(ag.duracao_total) * 60000) : null

    return {
        inicio: inicio.toLocaleTimeString('pt-BR', opcoes),
        fim: fim ? fim.toLocaleTimeString('pt-BR', opcoes) : null,
    }
}

// Linhas da grade: o horário padrão (HORARIOS) mais qualquer hora em que haja agendamento na semana,
// para nenhum atendimento ficar escondido fora das 08h–18h.
function montarHoras(agendamentosDaSemana) {
    const horasPadrao = HORARIOS.map((hora) => parseInt(hora.split(':')[0]))
    let primeiraHora = Math.min(...horasPadrao)
    let ultimaHora = Math.max(...horasPadrao)

    for (const ag of agendamentosDaSemana) {
        const hora = new Date(ag.horario).getHours()
        primeiraHora = Math.min(primeiraHora, hora)
        ultimaHora = Math.max(ultimaHora, hora)
    }

    return Array.from({ length: ultimaHora - primeiraHora + 1 }, (_, i) => primeiraHora + i)
}

// Grade de horários x dias da seção "Agenda" do painel do salão (todos os profissionais).
// campoPrincipal/campoSecundario definem o que aparece em negrito e o que aparece embaixo no cartão.
function GradeSemanal({ domingo, agendamentos, campoPrincipal, campoSecundario }) {
    const domingoSeguinte = new Date(domingo)
    domingoSeguinte.setDate(domingoSeguinte.getDate() + 7)

    const agendamentosDaSemana = agendamentos
        .filter((ag) => {
            const dataAg = new Date(ag.horario)
            return dataAg >= domingo && dataAg < domingoSeguinte
        })
        .sort((a, b) => new Date(a.horario) - new Date(b.horario))

    const horasDaGrade = montarHoras(agendamentosDaSemana)

    return (
        <div className="agenda-admin-grade-wrapper">
            <table className="agenda-admin-grade">
                <thead>
                    <tr>
                        <th className="agenda-admin-coluna-hora"></th>
                        {DIAS_SEMANA.map((dia) => (
                            <th key={dia}>{dia}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {horasDaGrade.map((hora) => (
                        <tr key={hora}>
                            <td className="agenda-admin-coluna-hora">{`${String(hora).padStart(2, '0')}:00`}</td>
                            {Array.from({ length: 7 }, (_, diaIndex) => {
                                const dataCelula = new Date(domingo)
                                dataCelula.setDate(dataCelula.getDate() + diaIndex)

                                // Todos os agendamentos deste dia que começam nesta hora: no salão,
                                // vários profissionais podem atender no mesmo horário.
                                const agendamentosDoSlot = agendamentosDaSemana.filter((ag) => {
                                    const dataAg = new Date(ag.horario)
                                    const mesmoDia = dataAg.toDateString() === dataCelula.toDateString()
                                    return mesmoDia && dataAg.getHours() === hora
                                })

                                return (
                                    <td key={diaIndex}>
                                        {agendamentosDoSlot.length > 0 && (
                                            <div className="agenda-admin-slot">
                                                {agendamentosDoSlot.map((ag) => (
                                                    <div key={ag.id_agendamento} className="agenda-admin-cartao">
                                                        <div className="agenda-admin-cartao-horario">
                                                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                                                strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0">
                                                                <circle cx="12" cy="12" r="9" />
                                                                <polyline points="12 7 12 12 15.5 14" />
                                                            </svg>
                                                            <span>{horariosDoAtendimento(ag).inicio}</span>
                                                        </div>
                                                        {horariosDoAtendimento(ag).fim && (
                                                            <span className="agenda-admin-cartao-fim">até {horariosDoAtendimento(ag).fim}</span>
                                                        )}
                                                        <b>{ag[campoPrincipal]}</b>
                                                        <span>{ag[campoSecundario]}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default GradeSemanal
