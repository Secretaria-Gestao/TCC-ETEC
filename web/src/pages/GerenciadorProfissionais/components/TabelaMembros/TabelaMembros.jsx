import { useEffect, useState } from "react"
import estilos from "./TabelaMembros.module.css"
import { buscarServicos } from "../../../GerenciadorServicos/services/buscarServicos"

const FOTO_PADRAO = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVWGYKJzBSw8qBRXBMcHBdY1XK_aywT9ZX_gMa5Wj8jA8QyX6DHP-O0Al-&s=10"

export default function TabelaMembros({ profissionais, todosCargos, abrirEdicaoProfissional, onRemover }) {

    // Estados locais controlam apenas a interação da tabela; a lista original vem do componente pai.
    const [busca, setBusca] = useState("")
    const [filtros, setFiltros] = useState({

        cargoSelecionado: "all",
        statusSelecionado: "all",
    })

    const [profissionaisSelecionados, setProfissionaisSelecionados] = useState([])
    const [estaRemovendo, setEstaRemovendo] = useState(false)
    const [confirmacaoRemocaoAberta, setConfirmacaoRemocaoAberta] = useState(false)
    const [servicosFornecidos, setServicosFornecidos] = useState([])
    const [associacoesServicos, setAssociacoesServicos] = useState([])

    useEffect(() => {
        // Serviços e associações são carregados uma vez para mostrar o que cada profissional oferece.
        let ignorarResposta = false

        async function carregarServicos() {
            const resposta = await buscarServicos()

            if (ignorarResposta) return

            if (!resposta?.sucesso) {
                setServicosFornecidos([])
                setAssociacoesServicos([])
                return
            }

            setServicosFornecidos(resposta.servicos ?? [])
            setAssociacoesServicos(resposta.associacoes ?? [])
        }

        carregarServicos()

        return () => {
            ignorarResposta = true
        }
    }, [])

    function nomesServicosDoProfissional(idProfissional) {
        return associacoesServicos
            .filter((associacao) => associacao.id_profissional === idProfissional)
            .map((associacao) => (
                servicosFornecidos.find(
                    (servico) => servico.id_servico === associacao.id_servico
                )?.nome_servico
            ))
            .filter(Boolean)
    }

    // Todos os filtros são combinados antes da renderização, por isso a seleção usa somente linhas visíveis.
    const profissionaisFiltrados = profissionais.filter((profissional) => {
        const nome = profissional.nome_profissional
            ?.toLowerCase()
            .includes(busca.toLowerCase());

        const cargo = filtros.cargoSelecionado == "all" || profissional.cargo == filtros.cargoSelecionado

        const status = filtros.statusSelecionado == "all" || profissional.status == filtros.statusSelecionado

        return nome && cargo && status

    })

    // O checkbox do cabeçalho representa apenas o resultado atual da busca e dos filtros.
    const selecionouTudo = profissionaisFiltrados.length > 0 && profissionaisFiltrados.every((profissional) => (
        profissionaisSelecionados.includes(profissional.id_profissional)
    ))

    async function removerProfissionaisSelecionados() {
        setEstaRemovendo(true)

        try {
            const resultados = await Promise.all(
                profissionaisSelecionados.map(async (idProfissional) => ({
                    idProfissional,
                    removeu: await onRemover(idProfissional)
                }))
            )

            const idsRemovidos = resultados
                .filter((resultado) => resultado.removeu)
                .map((resultado) => resultado.idProfissional)

            setProfissionaisSelecionados((atuais) => (
                atuais.filter((idProfissional) => !idsRemovidos.includes(idProfissional))
            ))
        } finally {
            setEstaRemovendo(false)
            setConfirmacaoRemocaoAberta(false)
        }
    }

    console.log("profissionais filtrados: ", profissionaisFiltrados)
    console.log("filtros: ", filtros)

    return (
        <div className="bg-blue-100/50 w-full min-h-170 mt-15 flex flex-col border border-collapse">
            <div className="flex justify-between w-full items-end p-5">

                <div className="">
                    <p className="text-[16px] text-laranja font-bold"> Profissionais</p>
                    <p className="text-[18px] font-semibold"> Pessoas e permissões    </p>

                </div>

                {profissionais.length > 0 && (
                    <p className="text-[14px]"> Mostrando: <b>{profissionaisFiltrados.length}</b> </p>
                )}
            </div>

            <hr className="mt-1" />

            {/* Filtros da lista: busca por nome, cargo e status. */}
            <div className="bg-blue-600/25 p-5 flex gap-2">
                <label htmlFor="pesquisa" className="relative flex p-2 border border-black text-laranja bg-amber-50 flex-2 rounded-md items-center">

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2"
                        aria-hidden="true"
                    >
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-4-4" />
                    </svg>

                    <input className={`${estilos.campoPesquisa} absolute w-11/12`} id="pesquisa" type="text" placeholder="Pesquisar profissional..."
                        value={busca}
                        onChange={(evento) => setBusca(evento.target.value)}
                    />
                </label>

                <div className="relative flex-1 ">
                    <select name="" id="" className="px-3 py-2 w-full h-full border"
                        value={filtros.cargoSelecionado}
                        onChange={(evento) => setFiltros(filtrosAntigos => ({
                            ...filtrosAntigos,
                            cargoSelecionado: evento.target.value
                        }))}
                    >
                        <option value="all">Todos os cargos</option>

                        {Object.entries(todosCargos).map(([cargo]) => (
                            <option value={cargo} key={cargo}>
                                {cargo}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="relative flex-1 border">
                    <select
                        value={filtros.statusSelecionado}
                        onChange={(evento) => setFiltros(filtrosAntigos => ({
                            ...filtrosAntigos,
                            statusSelecionado: evento.target.value
                        }))}
                        className="h-full w-full px-3 py-2"
                    >
                        <option value="all">Todos os status</option>
                        <option value="true">Ativo</option>
                        <option value="false">Inativo</option>
                    </select>
                </div>
            </div>

            {/* Tabela principal de profissionais e permissões. */}
            <table className="tabela-padrao border-collapse w-full bg-blue-600/20">
                <thead>
                    {/* Cabeçalho com seleção geral e nomes das colunas. */}
                    <tr>
                        <th className="text-center!">
                            <input
                                type="checkbox"
                                checked={selecionouTudo}
                                aria-label="Selecionar todos os profissionais"
                                onChange={() => {
                                    const idsVisiveis = profissionaisFiltrados.map((profissional) => profissional.id_profissional)
                                    const deveSelecionarTudo = !selecionouTudo

                                    setProfissionaisSelecionados((atuais) => {
                                        if (deveSelecionarTudo) {
                                            return [...new Set([...atuais, ...idsVisiveis])]
                                        }

                                        return atuais.filter((id) => !idsVisiveis.includes(id))
                                    })
                                }}
                            />
                        </th>
                        <th>Perfil</th>
                        <th>Cargo</th>
                        <th>Serviços</th>
                        <th>Nível de acesso</th>
                        <th>Status</th>
                        <th className="p-0! relative">
                            {confirmacaoRemocaoAberta && (
                                <div className="absolute top-full left-0 z-10 w-full bg-marrom text-white p-2 border-t border-black">
                                    <p className="text-center text-sm  border-black">Certeza?</p>
                                    <div className="flex justify-center gap-5 pb-1">
                                        <button
                                            type="button"
                                            disabled={estaRemovendo}
                                            className="hover:text-green-500 disabled:cursor-wait disabled:opacity-60"
                                            onClick={removerProfissionaisSelecionados}
                                        >
                                            {estaRemovendo ? "..." : "Sim"}
                                        </button>
                                        <button
                                            type="button"
                                            disabled={estaRemovendo}
                                            className="hover:text-red-500 disabled:cursor-wait disabled:opacity-60"
                                            onClick={() => {
                                                setConfirmacaoRemocaoAberta(false)
                                                setProfissionaisSelecionados([])
                                            }}
                                        >
                                            Não
                                        </button>
                                    </div>
                                </div>
                            )}

                            {profissionaisSelecionados.length > 0 ? (
                                <button
                                    type="button"
                                    disabled={estaRemovendo}
                                    className="h-full w-full bg-marrom px-2 py-3 text-laranja transition-colors hover:bg-red-900 hover:text-white disabled:cursor-wait disabled:opacity-60"
                                    onClick={() => setConfirmacaoRemocaoAberta(true)}
                                >
                                    {estaRemovendo ? "Removendo..." : "Remover"}
                                </button>
                            ) : "Ações"}
                        </th>
                    </tr>
                </thead>
                <tbody>

                    {
                        profissionaisFiltrados.map(profissional => {
                            return (
                                <tr key={profissional.id_profissional}>
                                    {/* Cada linha representa um profissional visível após os filtros. */}

                                    {/* A seleção guarda somente os IDs, evitando duplicar os objetos completos. */}
                                    <td className="text-center!">
                                        <input
                                            type="checkbox"
                                            checked={profissionaisSelecionados.includes(profissional.id_profissional)}
                                            onChange={() => setProfissionaisSelecionados((atuais) => (
                                                atuais.includes(profissional.id_profissional)
                                                    ? atuais.filter((id) => id !== profissional.id_profissional)
                                                    : [...atuais, profissional.id_profissional]
                                            ))}
                                        />
                                    </td>

                                    {/* PERFIL: foto_url pode ser nulo para novos cadastros, então há uma imagem padrão. */}

                                    <td>
                                        <div className="flex gap-2 items-center">

                                            <img
                                                src={profissional.foto_url || FOTO_PADRAO}
                                                alt={`Foto de ${profissional.nome_profissional}`}
                                                className="h-10 w-10 self-center object-cover"
                                            />

                                            <div className="min-w-0">

                                                <p className="text-[14px]"> <b>{profissional.nome_profissional}</b></p>
                                                <p className="text-[14px] truncate" title={profissional.email_profissionalx}>{profissional.email_profissional}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* CARGO */}

                                    <td>
                                        {profissional.cargo}
                                    </td>

                                    <td>
                                        {
                                            nomesServicosDoProfissional(profissional.id_profissional)
                                                .join(" - ") ||
                                            "Sem serviços associados"
                                        }
                                    </td>

                                    <td>{profissional.nivel_acesso}</td>
                                    <td>{profissional.status ? "Ativo" : "Inativo"}</td>
                                    <td>
                                        <button type="button" className="flex items-center justify-center -ml-2" onClick={() => abrirEdicaoProfissional(profissional)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                <circle cx="12" cy="5" r="2" />
                                                <circle cx="12" cy="12" r="2" />
                                                <circle cx="12" cy="19" r="2" />
                                            </svg>
                                            Editar
                                        </button>
                                    </td>

                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}
