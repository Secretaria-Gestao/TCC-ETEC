

export default function Card2({
  dados,
  todosSaloes,
  enviando,
  avisoHorario,
  mudarValorDados,
  enviarDados,
  resetarDados
}) {

  console.log()
  return (
    <div className="card_2 w-full h-120 2xl:min-h-125 ">
      <header className="agendamento-header sm:gap-2">
        <h1 className=" text-azul-ceu! text-4xl! sm:text-[45px]! font-bold">Agendamento</h1>
        <img className="logo rotate-y-180" src="/logo_pequena.png" alt="logo secretária gestão" />
      </header>

      <p className='text-white ml-1'>
        {Number(dados.preco || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
      </p>

      <div>
        {todosSaloes.length === 0 && <p className='text-white'>Nenhum salão disponível no momento.</p>}
        <select name="endereco" className="local" value={dados.endereco} onChange={mudarValorDados}>
          {todosSaloes.map((salao) => {
            return (
              <option key={salao.id_salao} value={salao.id_salao}> {`${salao.nome_salao}. ${salao.endereco_salao}`} </option>
            )
          })}
        </select>
      </div>

      <div className="div_btn mt-2">
        <button id="btn-enviar" type="button" className="enviar bg-ameixa/50! solid" onClick={enviarDados} disabled={enviando || todosSaloes.length === 0 || Boolean(avisoHorario)}> {enviando ? 'Enviando...' : 'Enviar'} </button>
        <button id="btn-resetar" type="reset" className="resetar bg-ameixa/50! solid" onClick={resetarDados}> Resetar </button>
      </div>

    </div>
  )
}