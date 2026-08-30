import InfoResumidas from "./components/InfoResumidas/InfoResumidas.jsx"
import TabelaMembros from "./components/TabelaMembros/TabelaMembros.jsx"
import EditarProfissional from "./components/EditarProfissional/EditarProfissional.jsx"

import BarraLateral from "@/BarraLateral/BarraLateral"
import Header from "@/Header/Header"

import { pegarSessao } from "../../services/pegarSessao"
import { buscarSalao } from "../../services/BuscarSalao"
import { mostrarMembros } from "./services/mostrarMembros"
import { editarProfissional, removerProfissional as removerProfissionalApi } from "./services/gerenciarProfissionais"



import { useEffect, useState } from "react"

export default function GerenciadorProfissionais() {
    // Estes estados representam a página inteira: membros, agenda do mês e o painel de edição.
    const [nomeSalao, setNomeSalao] = useState("")
    const [profissionais, setProfissionais] = useState([])
    const [agendamentos, setAgendamentos] = useState([])
    const [estaEditando, setEstaEditando] = useState(false)
    const [atualizacaoProfissionais, setAtualizacaoProfissionais] = useState(0)
    const [idRemetente, setIdRemetente] = useState(null)

    const [profissionalEscolhido, setProfissionalEscolhido] = useState({})

    useEffect(() => {
        // O salão é descoberto pela sessão; o front-end não escolhe o salão pela URL.
        async function carregarPagina() {
            const sessao = await pegarSessao()

            if (!sessao) {
                return
            }

            setIdRemetente(sessao.user.id)

            const salao = await buscarSalao(sessao.user.email)

            if (salao) {
                setNomeSalao(salao.nome_salao)
            }

            // A função retorna [membros, agendamentosDoMes] para alimentar os dois resumos.
            const membros = await mostrarMembros()

            if (membros.length > 0) {
                setProfissionais(membros[0])
                setAgendamentos(membros[1])

            }

        }

        carregarPagina()
    }, [atualizacaoProfissionais])

    // Transforma a lista de profissionais em { cargo: quantidade } para o resumo e o filtro.
    const todosCargos = profissionais.reduce((contagem, profissional) => {
        const cargo = profissional.cargo
        contagem[cargo] = (contagem[cargo] ?? 0) + 1

        return contagem
    }, {})

    function abrirEdicaoProfissional(profissional) {
        // O profissional escolhido é enviado ao painel lateral quando o botão "Editar" é clicado.
        setEstaEditando(!estaEditando)
        setProfissionalEscolhido(profissional)
    }

    async function salvarEdicaoProfissional(dados) {
        // O ID vem do profissional selecionado; os demais valores vêm do formulário lateral.
        const respostaEdicao = await editarProfissional({
            id_profissional: profissionalEscolhido.id_profissional,
            nome_profissional: dados.nome_profissional,
            email_profissional: dados.email_profissional,
            cargo: dados.cargo,
            nivel_acesso: dados.nivel_acesso,
            status: dados.status
        })

        if (respostaEdicao) {
            setEstaEditando(false)
            setAtualizacaoProfissionais((valorAtual) => valorAtual + 1)
        }
    }

    async function removerProfissional(idProfissional) {
        // A mesma proteção existe no backend, mas este bloqueio evita uma chamada desnecessária.
        if (idProfissional === idRemetente) {
            return false
        }

        const respostaRemocao = await removerProfissionalApi(idProfissional)

        if (respostaRemocao) {
            setEstaEditando(false)
            setAtualizacaoProfissionais((valorAtual) => valorAtual + 1)
        }

        return Boolean(respostaRemocao)
    }

    return (
        <div className="w-full h-full flex">
            <BarraLateral />

            <main className="relative w-full min-h-dvh h-max bg-blue-600/40 flex flex-col flex-1 min-w-0">
                <Header titulo="Membros do salão" subtitulo={nomeSalao} />

                {/* Cabeçalho com o salão associado ao usuário logado. */}
                <hr className="w-10/12 place-self-center mt-[-36px]" />

                {/* Bloco de resumos da equipe. */}
                <section className="w-8/10 place-self-center border-b border-t mt-25 p-5 relative">
                    <p className="absolute -top-8 left-0">
                        Gerencie seus
                        <strong> profissionais</strong>,
                        <strong> funções </strong>
                        e
                        <strong> permissões</strong>
                    </p>

                    {/* Resumos calculados a partir dos dados carregados para o salão atual. */}
                    <InfoResumidas
                        profissionais={profissionais}
                        agendamentos={agendamentos}
                        todosCargos={todosCargos}
                        abrirEdicaoProfissional={abrirEdicaoProfissional}
                    />

                </section>

                <section className="w-8/10 place-self-center p-5">
                    <div className="flex items-start gap-5">
                        <div className="min-w-0 flex-1">
                            {/* A tabela concentra busca, filtros, seleção e abertura da edição. */}
                            <TabelaMembros profissionais={profissionais} todosCargos={todosCargos}
                                abrirEdicaoProfissional={abrirEdicaoProfissional}
                                onRemover={removerProfissional}
                                estaEditando={estaEditando} setEstaEditando={setEstaEditando}
                            />
                        </div>

                        {/* O painel só é montado quando uma linha é escolhida para edição. */}
                        {estaEditando && (
                            <EditarProfissional
                                setEstaEditando={setEstaEditando}
                                estaEditando={estaEditando}
                                profissional={profissionalEscolhido}
                                todosCargos={todosCargos}
                                onSalvar={salvarEdicaoProfissional}
                                idRemetente={idRemetente}
                                onRemover={removerProfissional}
                            />
                        )}
                    </div>

                </section>

            </main>
        </div>
    )
}
