export const HORARIOS = ['08:00','09:00','10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00']
export const DIAS_SEMANA = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
export const MESES = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

// Recebe qualquer data e devolve o domingo da semana correspondente.
export function obterDomingoDaSemana(data) {
    const novaData = new Date(data)
    novaData.setDate(novaData.getDate() - novaData.getDay())
    novaData.setHours(0, 0, 0, 0)
    return novaData
}