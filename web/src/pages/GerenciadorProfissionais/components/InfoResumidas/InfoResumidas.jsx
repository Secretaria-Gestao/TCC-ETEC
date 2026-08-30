import estilos from "./InfoResumidas.module.css"

const FOTO_PADRAO = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVWGYKJzBSw8qBRXBMcHBdY1XK_aywT9ZX_gMa5Wj8jA8QyX6DHP-O0Al-&s=10"

export default function InfoResumidas({ profissionais, agendamentos, todosCargos, abrirEdicaoProfissional }) {

    // A lista original não é alterada: as cópias permitem ordenar sem mudar o estado do React.
    const ordemRecente = [...profissionais].sort((a, b) => {
        return new Date(b.criado_em) - new Date(a.criado_em)
    })

    // Cada profissional recebe uma contagem calculada somente com os agendamentos do mês.
    const profissionaisQntd = profissionais.map(profissional => {
        const totalAgendamentos = agendamentos.filter((agendamento) => {
            return (
                agendamento.profissionais.id_profissional == profissional.id_profissional
            )

        }).length

        return {
            ...profissional,
            totalAgendamentos
        }
    })

    // O destaque é o profissional com mais atendimentos; em empate, mantém a ordem recebida.
    const profissionalDestacado = [...profissionaisQntd].sort((a, b) => {
        return (b.totalAgendamentos - a.totalAgendamentos)
    })[0]



    console.log(todosCargos)

    return (
        <div className=" w-8/12 flex min-w-max gap-10 ">

            {/* Resumo da quantidade de profissionais e do último cadastro. */}
            <div className=" flex flex-col min-w-max pr-15 border-r">
                {
                    profissionais.length > 0 && (
                        <>
                            <p>Equipe cadastrada: <b className="ml-1">{profissionais.length} Profissionais</b>  </p>

                            <div className="flex w-full min-w-max gap-1 ">
                                <div className="self-center mt-6">
                                    <p className="ml-2 text-[17px]">Adicionado</p>
                                    <p className="-mt-1.5 ml-2 text-[17px]">recentemente: </p>

                                </div>

                                {/* Profissional adicionado recentemente. */}
                                <div className="min-w-max w-full h-full  p-2">
                                    <div className=" border p-4 h-9/10 flex items-end justify-between min-w-max gap-2">
                                        <img
                                            src={ordemRecente[0]?.foto_url || FOTO_PADRAO}
                                            alt={`Foto de ${ordemRecente[0]?.nome_profissional || "profissional"}`}
                                            className="h-15 w-15 self-center object-cover"
                                        />
                                        <div>
                                            {
                                                ordemRecente.length > 0 ? (
                                                    <>
                                                        <p>{ordemRecente[0].nome_profissional}</p>
                                                        <p>{ordemRecente[0].cargo}</p>
                                                    </>
                                                ) : <p>Carregando...</p>
                                            }

                                        </div>

                                        {ordemRecente.length > 0 && (
                                            <button
                                                className="self-stretch flex items-center"
                                                type="button"
                                                aria-label="Editar profissional adicionado recentemente"
                                                onClick={() => abrirEdicaoProfissional?.(ordemRecente[0])}
                                            >
                                                <svg className="h-4/5 w-auto shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                                                    <circle cx="12" cy="5" r="2" />
                                                    <circle cx="12" cy="12" r="2" />
                                                    <circle cx="12" cy="19" r="2" />
                                                </svg>
                                            </button>
                                        )}
                                    </div>
                                </div>

                            </div>
                        </>
                    )
                }

            </div>

            {/* Profissional com maior número de agendamentos no mês atual. */}
            <div className=" flex flex-col pr-15 border-r">
                {
                    profissionalDestacado && (
                        <div className={estilos.destaqueProfissional}>
                            {/* Destaque do mês. */}
                            <p className="text-[14px] mb-0.5 ">Destaque do mês</p>

                            <div className="flex gap-2">
                                <b>
                                    <p className="text-[18px]"> {profissionalDestacado.nome_profissional} </p>
                                </b>
                                <p className="text-[18px]">|</p>
                                <b>
                                    <p className="text-[18px]"> {profissionalDestacado.cargo} </p>

                                </b>

                            </div>


                            <p className="text-[14px] mt-2"> <b>{profissionalDestacado.totalAgendamentos}</b> de agendamentos no mês</p>
                            <p className="text-[14px]"> por enquanto </p>
                        </div>
                    )
                }
            </div>

            {/* Quantidade de profissionais agrupada por cargo. */}
            <div className=" flex flex-col">
                {
                    profissionais.length > 0 && (
                        <div>
                            {/* Distribuição por cargo. */}
                            <p className="mb-2">Distribuição por cargo:</p>
                            <ul className="grid grid-cols-2">
                                {todosCargos && (
                                    Object.entries(todosCargos).map(([cargo, quantidade]) => (
                                        <li key={cargo}>
                                            <b>{quantidade}</b> {cargo}
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    )
                }
            </div>

        </div>
    )
}
