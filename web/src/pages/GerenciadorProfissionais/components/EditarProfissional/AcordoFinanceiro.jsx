import { useState } from 'react'
import { salvarAcordo } from '../../../../services/acordoFinanceiro.js' // ajuste os ../

// profissional: { id_profissional, tipo_pagamento, valor_comissao }
function AcordoFinanceiro({ profissional, aoSalvar }) {
  // "" = acordo ainda não definido (as colunas estão NULL)
  const [tipo, setTipo] = useState(profissional.tipo_pagamento ?? '')
  const [valor, setValor] = useState(profissional.valor_comissao ?? '')
  const [mensagem, setMensagem] = useState('')

  async function salvar() {
    if (!tipo || valor === '') {
      setMensagem('Escolha o tipo de acordo e o percentual.')
      return
    }
    const resultado = await salvarAcordo(profissional.id_profissional, tipo, Number(valor))
    setMensagem(resultado.sucesso ? 'Acordo salvo!' : resultado.erro)
    if (resultado.sucesso && aoSalvar) aoSalvar() // ex.: recarregar a tabela de membros
  }

  // Texto que explica o acordo escolhido
  const ajuda =
    tipo === 'salao_paga_profissional' ? `O salão paga ${valor || 0}% de cada atendimento ao colaborador.`
    : tipo === 'profissional_paga_salao' ? `O colaborador repassa ${valor || 0}% de cada atendimento ao salão.`
    : ''

  return (
    <div className="flex flex-col gap-2">
      <h4>Acordo financeiro</h4>

      <select value={tipo} onChange={(e) => setTipo(e.target.value)}
        className="border rounded-sm p-1">
        <option value="" disabled>Selecione o acordo</option>
        <option value="salao_paga_profissional">O salão paga ao colaborador</option>
        <option value="profissional_paga_salao">O colaborador paga ao salão</option>
      </select>

      <label className="flex items-center gap-2">
        Percentual
        <input type="number" min="0" max="100" step="0.5" value={valor}
        onChange={(e) => setValor(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
          className="border rounded-sm p-1" /> %
      </label>

      {ajuda && <p className="text-sm opacity-70">{ajuda}</p>}

      <button type="button" onClick={salvar}
        className="bg-amarelo/80 hover:bg-amarelo/70 text-black p-2 rounded-lg self-start">
        Salvar acordo
      </button>
      {mensagem && <p className="text-sm">{mensagem}</p>}
    </div>
  )
}

export default AcordoFinanceiro