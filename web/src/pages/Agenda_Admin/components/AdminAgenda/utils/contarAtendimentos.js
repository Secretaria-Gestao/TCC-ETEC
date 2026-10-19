export function contaNoMes(ag) {
    const hoje = new Date()
    const data = new Date(ag.horario)
    const status = (ag.status || '').toLowerCase()

    return (
        data.getMonth() === hoje.getMonth() &&
        data.getFullYear() === hoje.getFullYear() &&
        status !== 'cancelado' &&
        status !== 'ausente'
    )
}