import { useState } from "react"

export default function InfoResumidas({ profissionais, agendamentos }) {
    return (
        <div className="bg-red-950 w-8/12 flex">
            <div className="bg-blue-800 w-5/10 ">
                <p>Total de funcionários: {profissionais.length}</p>
                <div className="flex">
                    <div>
                        <p>Adicionado</p>
                        <p className="-mt-1.5">recentemente</p>

                    </div>

                    <div>
                        <div className="bg-amber-800 border p-1">
        <p> </p>
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