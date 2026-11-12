export function calcularAcerto(total, tipo, percentual) {
  if (!tipo || percentual == null || percentual === '') return null

  const valor = Number(total || 0) * Number(percentual) / 100

  // salao_paga_profissional: o salão paga X% do total ao colaborador
  if (tipo === 'salao_paga_profissional') return { quemPaga: 'salao', valor }
  // profissional_paga_salao: o colaborador repassa X% ao salão
  if (tipo === 'profissional_paga_salao') return { quemPaga: 'profissional', valor }

  return null // valor desconhecido no banco: trata como não definido
}

export const moeda = (v) =>
  Number(v || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })