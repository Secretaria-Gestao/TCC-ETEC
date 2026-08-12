import { DIAS_SEMANA, MESES } from '../utils/AgendaHelpers.js'

function MiniCalendario({ dataReferenciaMes, mudarMes, setDataReferenciaSemana }) {
    const hoje = new Date()
    const primeiroDiaMes = new Date(dataReferenciaMes.getFullYear(), dataReferenciaMes.getMonth(), 1)
    const ultimoDiaMes = new Date(dataReferenciaMes.getFullYear(), dataReferenciaMes.getMonth() + 1, 0)
    const vaziosMes = Array(primeiroDiaMes.getDay()).fill(null)
    const diasMes = Array.from({ length: ultimoDiaMes.getDate() }, (_, i) => i + 1)

    return (
        <div className="agenda-admin-mini-calendario">
            <div className="agenda-admin-mini-calendario-cabecalho">
                <span>{MESES[dataReferenciaMes.getMonth()]} {dataReferenciaMes.getFullYear()}</span>
                <div>
                    <button onClick={() => mudarMes(-1)}>‹</button>
                    <button onClick={() => mudarMes(1)}>›</button>
                </div>
            </div>
            <div className="agenda-admin-mini-grade">
                {DIAS_SEMANA.map((dia) => (
                    <div key={dia} className="agenda-admin-dia-semana">{dia}</div>
                ))}
                {vaziosMes.map((_, i) => (
                    <div key={`vazio-${i}`} className="agenda-admin-dia agenda-admin-vazio"></div>
                ))}
                {diasMes.map((dia) => {
                    const ehHoje = dia === hoje.getDate()
                        && dataReferenciaMes.getMonth() === hoje.getMonth()
                        && dataReferenciaMes.getFullYear() === hoje.getFullYear()

                    return (
                        <div
                            key={dia}
                            className={`agenda-admin-dia${ehHoje ? ' agenda-admin-hoje' : ''}`}
                            onClick={() => setDataReferenciaSemana(
                                new Date(dataReferenciaMes.getFullYear(), dataReferenciaMes.getMonth(), dia)
                            )}
                        >
                            {dia}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default MiniCalendario
