import InfoResumidas from "./components/InfoResumidas/InfoResumidas.jsx"
// import TabelaMembros from "./components/TabelaMembros/TabelaMembros.jsx"

import BarraLateral from "@/BarraLateral/BarraLateral"
import Header from "@/Header/Header"

import { pegarSessao } from "../../services/pegarSessao"
import { buscarSalao } from "../../services/BuscarSalao"
import { mostrarMembros } from "./services/mostrarMembros"



import { useEffect, useState } from "react"

export default function GerenciadorProfissionais() {
    const [nomeSalao, setNomeSalao] = useState("")
    const [profissionais, setProfissionais] = useState([])
    const [agendamentos, setAgendamentos] = useState([])

    useEffect(() => {
        async function carregarPagina() {
            const sessao = await pegarSessao()

            if (!sessao) {
                return
            }

            const salao = await buscarSalao(sessao.user.email)

            if (salao) {
                setNomeSalao(salao.nome_salao)
            }

            const membros = await mostrarMembros()

            setProfissionais(membros[0])
            setAgendamentos(membros[1])
        }

        carregarPagina()
    }, [])

    console.log(profissionais)
    console.log(agendamentos)

    return (
        <div className="w-full h-full flex">
            <BarraLateral />

            <main className="relative w-full min-h-dvh h-max bg-blue-200 flex flex-col flex-1 min-w-0">
                <Header titulo="Membros do salão" subtitulo={nomeSalao} />

                <hr className="w-10/12 place-self-center mt-[-36px]" />


                <section className="w-8/10 place-self-center bg-green-600 mt-15 p-5">

                    <InfoResumidas profissionais={profissionais} agendamentos={agendamentos}/>
                </section>
            </main>
        </div>
    )
}
