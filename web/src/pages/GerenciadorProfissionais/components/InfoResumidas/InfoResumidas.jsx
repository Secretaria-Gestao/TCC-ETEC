import { useState } from "react"

export default function InfoResumidas({ profissionais, agendamentos }) {


    const ordemRecente = [...profissionais].sort((a, b) => {
        return new Date(b.criado_em) - new Date(a.criado_em)
    })

    console.log("Olha aqui: ")
    console.log(ordemRecente)

    return (
        <div className="bg-red-950 w-8/12 flex min-w-max">
            <div className="bg-blue-800 w-5/10 flex flex-col min-w-max">
                <p>Total de funcionários: {profissionais.length}</p>
                <div className="flex w-full min-w-max">
                    <div>
                        <p>Adicionado</p>
                        <p className="-mt-1.5">recentemente</p>

                    </div>

                    <div className="min-w-max w-full h-full bg-violet-700">
                        <div className="bg-amber-800 border p-1 h-full flex items-end gap-4 min-w-max">
                            <div>
                                <p>{ordemRecente[0].nome_profissional}</p>
                                <p>{ordemRecente[0].cargo}</p>

                            </div>

                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <circle cx="12" cy="5" r="2" />
                                <circle cx="12" cy="12" r="2" />
                                <circle cx="12" cy="19" r="2" />
                            </svg>
                        </div>
                    </div>

                </div>
            </div>

            <div className="bg-amber-300 w-5/10">
                feijão
            </div>
        </div>
    )
}