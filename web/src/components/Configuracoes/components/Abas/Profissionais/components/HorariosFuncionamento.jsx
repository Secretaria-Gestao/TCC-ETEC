import { useEffect, useState } from 'react'
import { buscarHorarios, salvarHorarios } from '../../../../../../services/horariosSalao.js' // ajuste o caminho

const DIAS = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

// Estado inicial: 7 dias, seg a sáb abertos 09:00–18:00, domingo fechado
const padrao = DIAS.map((_, i) => ({
  dia_semana: i,
  hora_abertura: '09:00',
  hora_fechamento: '18:00',
  fechado: i === 0,
}))

function HorariosFuncionamento({ idSalao }) {
  const [horarios, setHorarios] = useState(padrao)
  const [mensagem, setMensagem] = useState('')

  useEffect(() => {
    if (!idSalao) return
    buscarHorarios(idSalao)
      .then((dados) => {
        if (dados.length === 0) return // nada salvo ainda: mantém o padrão
        // Mescla o que veio do banco por cima do padrão
        setHorarios(padrao.map((p) => {
          const salvo = dados.find((d) => d.dia_semana === p.dia_semana)
          return salvo
            ? { ...p, ...salvo,
                // O banco devolve "09:00:00"; o <input type="time"> quer "09:00"
                hora_abertura: salvo.hora_abertura?.slice(0, 5) || p.hora_abertura,
                hora_fechamento: salvo.hora_fechamento?.slice(0, 5) || p.hora_fechamento }
            : p
        }))
      })
      .catch(() => setMensagem('Não foi possível carregar os horários.'))
  }, [idSalao])

  // Altera um campo de um dia específico
  function mudar(indice, campo, valor) {
    setHorarios((atuais) => atuais.map((h, i) => (i === indice ? { ...h, [campo]: valor } : h)))
  }

  async function salvar() {
    const resultado = await salvarHorarios(horarios)
    setMensagem(resultado.sucesso ? 'Horários salvos!' : resultado.erro)
  }

  return (
    <div className="py-5 px-3 flex flex-col gap-3">
      <h3>Horário de funcionamento</h3>
      {horarios.map((h, i) => (
        <div key={h.dia_semana} className="flex items-center gap-3">
          <span>{DIAS[h.dia_semana]}</span>
          <input type="time" className="p-2 rounded-lg bg-linho" value={h.hora_abertura} disabled={h.fechado}
            onChange={(e) => mudar(i, 'hora_abertura', e.target.value)} />
          <span>às</span>
          <input type="time" className="p-2 rounded-lg bg-linho" value={h.hora_fechamento} disabled={h.fechado}
            onChange={(e) => mudar(i, 'hora_fechamento', e.target.value)} />
          <label>
            <input type="checkbox" checked={h.fechado}
              onChange={(e) => mudar(i, 'fechado', e.target.checked)} /> Fechado
          </label>
        </div>
      ))}
      <button type="button" onClick={salvar} className="p-2 rounded-lg bg-ameixa hover:bg-ameixa/90 text-white">
        Salvar horários
      </button>
      {mensagem && <p>{mensagem}</p>}
    </div>
  )
}

export default HorariosFuncionamento