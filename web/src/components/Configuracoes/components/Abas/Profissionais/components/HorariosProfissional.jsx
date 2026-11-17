import { useEffect, useState } from "react"
import { buscarHorariosProfissional, salvarHorariosProfissional, horariosIguais } from "../../../../../../services/horariosProfissional.js"
import { useMeuPerfil } from "../../../../../../services/pegarMeuPerfil"
import estilos from "./HorariosProfissional.module.css"

// Campo de horário. O aria-label diz a quem usa leitor de tela de que campo se trata (ex.: "Início — Terça-feira"),
// já que no desktop o título da coluna fica longe do campo.
// Fica fora do HorariosProfissional de propósito: um componente declarado dentro de outro é recriado a cada
// renderização, e o React desmonta e monta o <input> de novo, o que tira o foco do campo a cada tecla.
function CampoHora({ rotulo, dia, valor, aoMudar, className = 'w-full' }) {
  return (
    <input
      type="time"
      aria-label={`${rotulo} — ${dia}`}
      value={valor}
      onChange={(evento) => aoMudar(evento.target.value)}
      className={`${className} min-w-0 px-2 h-10 rounded-lg bg-linho`}
    />
  )
}

export default function HorariosProfissional() {

  // Cada dia guarda tudo junto: { ativo, inicio, fim, temIntervalo, intervaloInicio, intervaloFim }
  const [dias, setDias] = useState(null)
  const [original, setOriginal] = useState(null)                   // o que está salvo no banco, para comparar

  const [carregamento, setCarregamento] = useState('carregando')   // 'carregando' | 'pronto' | 'erro'
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState(null)                   // { erro: boolean, texto: string }

  // O id de quem está logado vem do perfil (a barra lateral já o carregou)
  const { data: perfil } = useMeuPerfil()

  // Ao abrir a tela, traz o que já foi salvo. Se falhar, o salvamento fica bloqueado: salvar o padrão por cima
  // de horários que existem no banco, mas não carregaram, apagaria o trabalho do profissional.
  useEffect(() => {
    if (!perfil) return

    let cancelado = false
    buscarHorariosProfissional(perfil.id_profissional)
      .then(horarios => {
        if (cancelado) return
        setDias(horarios)
        setOriginal(horarios)
        setCarregamento('pronto')
      })
      .catch(() => !cancelado && setCarregamento('erro'))
    return () => { cancelado = true }
  }, [perfil])

  // Altera só alguns campos de um dia. Ex.: mudar('Terça-feira', { inicio: '09:00' })
  // O setMensagem(null) some com o "Horários salvos!" assim que algo muda (o copiarParaTodos faz o mesmo).
  const mudar = (dia, campos) => {
    setDias(antes => ({ ...antes, [dia]: { ...antes[dia], ...campos } }))
    setMensagem(null)
  }

  // Copia o horário da segunda para todos os dias. O "ativo" fica de fora: uma folga continua folga.
  function copiarParaTodos() {
    const { inicio, fim, temIntervalo, intervaloInicio, intervaloFim } = dias['Segunda-feira']
    const horas = { inicio, fim, temIntervalo, intervaloInicio, intervaloFim }

    setDias(antes => {
      const novos = {}
      for (const dia in antes) novos[dia] = { ...antes[dia], ...horas }
      return novos
    })
    setMensagem(null)
  }

  async function salvar() {
    setSalvando(true)
    setMensagem(null)
    try {
      const resultado = await salvarHorariosProfissional(dias)
      if (resultado.sucesso) {
        setOriginal(dias)
        setMensagem({ erro: false, texto: 'Horários salvos!' })
      } else {
        setMensagem({ erro: true, texto: resultado.erro || 'Não foi possível salvar os horários.' })
      }
    } catch {
      setMensagem({ erro: true, texto: 'Não foi possível salvar os horários.' })
    } finally {
      setSalvando(false)
    }
  }

  if (carregamento === 'carregando' && perfil !== null) return <p className="font-light italic">Carregando horários...</p>
  if (carregamento === 'erro' || perfil === null) return <p className="text-vermelho">Não foi possível carregar os horários. Feche as Configurações e tente de novo.</p>

  // Só há o que salvar se o que seria enviado for diferente do que já está no banco
  const alterado = !horariosIguais(dias, original)

  return (
    // flex-1 min-h-0: ocupa a altura que sobra na janela das Configurações, para só as linhas rolarem.
    // @container: as classes "@2xl:" abaixo olham a largura DESTE card (672px ou mais), e não a da tela. Com a barra
    // lateral aberta, uma tela de 850px deixa só uns 560px aqui, e a tabela de 4 colunas não caberia: viram cartões.
    <div className="@container flex flex-col flex-1 min-h-0">
      <b>Horários de atendimento</b>

      {/* Atalho: só faz sentido se a segunda estiver aberta (numa folga o horário dela não vale) */}
      <button
        type="button"
        onClick={copiarParaTodos}
        disabled={!dias['Segunda-feira'].ativo}
        className="self-start mt-3 flex items-start gap-2 text-left text-azul-medio hover:underline disabled:no-underline"
      >
        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
          <rect x="9" y="9" width="11" height="11" rx="2" />
          <path d="M5 15V6a2 2 0 0 1 2-2h9" />
        </svg>
        <span>Copiar o horário de segunda-feira para todos os dias</span>
      </button>

      {/* Tabela feita com grid. Os "role" mantêm a semântica de tabela para leitores de tela. */}
      <div role="table" className="mt-4 flex flex-col flex-1 min-h-0">

        {/* Cabeçalho (fica parado: só o corpo abaixo rola) */}
        <div role="row" className={estilos.cabecalho}>
          <div role="columnheader" className="@2xl:px-1">Dia</div>
          <div role="columnheader" className="@2xl:px-1">Início</div>
          <div role="columnheader" className="@2xl:px-1">Fim</div>
          <div role="columnheader" className="@2xl:px-1">Intervalo</div>
        </div>

        {/* Corpo: uma linha por dia. A rolagem segue a TELA (md:): no computador esta é a área que rola, mesmo
            quando o card é estreito e mostra cartões, para o botão Salvar ficar sempre visível. No celular não
            rola por dentro: quem rola é a janela das Configurações inteira. O gap só vale entre cartões. */}
        <div
          role="rowgroup"
          className="flex flex-col gap-3
          @2xl:gap-0 md:flex-1 md:min-h-0 md:overflow-y-auto md:overflow-x-hidden
          md:scrollbar-gutter-stable md:scrollbar-thin md:[scrollbar-color:var(--color-azul-po)_transparent]"
        >
          {Object.entries(dias).map(([dia, horario]) => (

            <div key={dia} role="row" className={estilos.linha}>

              <div role="cell" className="@2xl:px-1 col-span-2 @2xl:col-span-1 font-medium">
                <label className="flex items-center gap-1">
                  <input type="checkbox" checked={horario.ativo} onChange={() => mudar(dia, { ativo: !horario.ativo })} />
                  {dia}
                </label>
              </div>

              {horario.ativo ? (
                // Dia aberto: aparecem os campos
                <>
                  <div role="cell" className="@2xl:px-1">
                    <span className="@2xl:hidden text-xs font-light">Início</span>
                    <CampoHora rotulo="Início" dia={dia} valor={horario.inicio} aoMudar={(valor) => mudar(dia, { inicio: valor })} />
                  </div>

                  <div role="cell" className="@2xl:px-1">
                    <span className="@2xl:hidden text-xs font-light">Fim</span>
                    <CampoHora rotulo="Fim" dia={dia} valor={horario.fim} aoMudar={(valor) => mudar(dia, { fim: valor })} />
                  </div>

                  <div role="cell" className="@2xl:px-1 col-span-2 @2xl:col-span-1">
                    <span className="@2xl:hidden text-xs font-light">Intervalo</span>

                    {horario.temIntervalo ? (
                      // flex-wrap: nos cartões o botão de remover cai para a linha de baixo (basis-full); na tabela fica ao lado
                      <div className="flex flex-wrap @2xl:flex-nowrap items-center gap-1">
                        <CampoHora rotulo="Início do intervalo" dia={dia} valor={horario.intervaloInicio} className="flex-1" aoMudar={(valor) => mudar(dia, { intervaloInicio: valor })} />
                        <span aria-hidden="true">-</span>
                        <CampoHora rotulo="Fim do intervalo" dia={dia} valor={horario.intervaloFim} className="flex-1" aoMudar={(valor) => mudar(dia, { intervaloFim: valor })} />

                        <button
                          type="button"
                          title="Remover intervalo"
                          aria-label={`Remover intervalo de ${dia}`}
                          onClick={() => mudar(dia, { temIntervalo: !horario.temIntervalo })}
                          className="basis-full @2xl:basis-auto flex items-center gap-0.5 pt-2 @2xl:p-1 @2xl:shrink-0 rounded-md text-vermelho @2xl:text-ardosia @2xl:hover:text-vermelho @2xl:hover:bg-black/5 transition-colors"
                        >
                          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <line x1="6" y1="6" x2="18" y2="18" />
                            <line x1="18" y1="6" x2="6" y2="18" />
                          </svg>
                          <span className="@2xl:hidden">Remover intervalo</span>
                        </button>
                      </div>
                    ) : (
                      // Sem intervalo: um botão para voltar a adicionar
                      <button
                        type="button"
                        onClick={() => mudar(dia, { temIntervalo: !horario.temIntervalo })}
                        className="w-full h-10 px-3 text-sm rounded-lg border border-dashed border-azul-ceu text-azul-medio hover:bg-azul-gelo transition-colors"
                      >
                        + Adicionar intervalo
                      </button>
                    )}
                  </div>
                </>
              ) : (
                // Folga
                <p className="absolute right-2 self-center font-light italic">Folga</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Rodapé: fica fora da área que rola, então o botão aparece sempre (no celular vai no fim da página) */}
      <div className="shrink-0 mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={salvar}
          disabled={salvando || !alterado}
          className="px-4 py-2 rounded-lg bg-ameixa text-white hover:bg-ameixa/90 transition-colors disabled:opacity-50"
        >
          {salvando ? 'Salvando...' : 'Salvar horários'}
        </button>

        <p role="status" aria-live="polite" className={mensagem?.erro ? 'text-vermelho' : alterado ? 'text-ardosia' : 'text-verde'}>
          {mensagem ? mensagem.texto : alterado ? 'Há alterações não salvas.' : ''}
        </p>
      </div>
    </div>
  )
}