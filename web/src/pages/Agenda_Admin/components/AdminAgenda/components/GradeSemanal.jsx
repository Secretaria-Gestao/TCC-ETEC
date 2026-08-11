import { HORARIOS, DIAS_SEMANA } from '../utils/agendaHelpers'

// Grade genérica de horários x dias. Reaproveitada tanto na seção "Agenda"
// (todos os profissionais) quanto na "Minha Agenda" (só o admin logado).
// campoPrincipal/campoSecundario definem o que aparece em negrito e o que
// aparece embaixo no cartão, já que cada seção mostra dados diferentes.
function GradeSemanal({ domingo, agendamentos, campoPrincipal, campoSecundario }) {
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
                    {HORARIOS.map((hora) => (
                        <tr key={hora}>
                            <td className="agenda-admin-coluna-hora">{hora}</td>
                            {Array.from({ length: 7 }, (_, diaIndex) => {
                                const dataCelula = new Date(domingo)
                                dataCelula.setDate(dataCelula.getDate() + diaIndex)

                                const agendamentoDoSlot = agendamentos.find((ag) => {
                                    const dataAg = new Date(ag.horario)
                                    const mesmoDia = dataAg.toDateString() === dataCelula.toDateString()
                                    const mesmaHora = dataAg.getHours() === parseInt(hora.split(':')[0])
                                    return mesmoDia && mesmaHora
                                })

                                return (
                                    <td key={diaIndex}>
                                        {agendamentoDoSlot && (
                                            <div className="agenda-admin-cartao">
                                                <b>{agendamentoDoSlot[campoPrincipal]}</b>
                                                <span>{agendamentoDoSlot[campoSecundario]}</span>
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