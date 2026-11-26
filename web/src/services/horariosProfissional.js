import { supabase } from './SupabaseConfig.js'

// Ordem dos dias na tela (começa na segunda) e o número de cada um no banco (dia_semana: 0 = domingo)
const DIAS = { 'Segunda-feira': 1, 'Terça-feira': 2, 'Quarta-feira': 3, 'Quinta-feira': 4, 'Sexta-feira': 5, 'Sábado': 6, 'Domingo': 0 }

// Linhas do banco -> dias da tela. Dia sem nada salvo começa 08:00-18:00 com intervalo 12:00-13:00, e só o domingo de folga.
// O banco devolve "08:00:00" e o <input type="time"> quer "08:00", por isso o slice.
function doBanco(linhas) {
  const dias = {}
  for (const [nome, numero] of Object.entries(DIAS)) {
    const linha = linhas.find(l => l.dia_semana === numero)
    dias[nome] = {
      ativo: linha ? linha.ativo : numero !== 0,
      inicio: linha?.hora_inicio?.slice(0, 5) ?? '08:00',
      fim: linha?.hora_fim?.slice(0, 5) ?? '18:00',
      temIntervalo: linha ? Boolean(linha.intervalo_inicio && linha.intervalo_fim) : true,
      intervaloInicio: linha?.intervalo_inicio?.slice(0, 5) ?? '12:00',
      intervaloFim: linha?.intervalo_fim?.slice(0, 5) ?? '13:00',
    }
  }
  return dias
}

// Dias da tela -> o que a rota espera. Sem intervalo vai null nos dois campos.
const paraOBanco = (dias) => Object.entries(dias).map(([nome, horario]) => ({
  dia_semana: DIAS[nome],
  ativo: horario.ativo,
  hora_inicio: horario.inicio,
  hora_fim: horario.fim,
  intervalo_inicio: horario.temIntervalo ? horario.intervaloInicio : null,
  intervalo_fim: horario.temIntervalo ? horario.intervaloFim : null,
}))

// Compara o que seria enviado ao banco, e não a tela: um intervalo removido não conta como mudança.
export const horariosIguais = (a, b) => JSON.stringify(paraOBanco(a)) === JSON.stringify(paraOBanco(b))

// Pega o token da sessão atual
async function pegarToken() {
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token
}

// Lê os horários de trabalho de um profissional, já no formato da tela
export async function buscarHorariosProfissional(idProfissional) {
  const token = await pegarToken()
  const resposta = await fetch(`/api/profissional/${idProfissional}/horarios`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  const resultado = await resposta.json()
  if (!resultado.sucesso) throw new Error(resultado.erro)
  return doBanco(resultado.horarios)
}

// Salva os dias de uma vez
export async function salvarHorariosProfissional(dias) {
  const token = await pegarToken()
  const resposta = await fetch('/api/editar/profissional-horarios', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ horarios: paraOBanco(dias) })
  })
  return await resposta.json() // { sucesso, erro? }
}
