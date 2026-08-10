import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { buscarServicos } from "../../services/buscarServicos"
import { criarServico, deletarServicos } from "../../services/gerenciarServicos"
import { pegarMeuPerfil } from "../../../../services/pegarMeuPerfil"

import "./TabelaServicos.css"
import { buscarTodosProfissionais } from "../../../../services/BuscarProfissionais"

export default function TabelaServicos({ setQuantidadeServicos, onEditar, atualizacaoServicos }) {

    const [servicos, setServicos] = useState([])
    const [profissionais, setProfissionais] = useState([])
    const [associacoes, setAssociacoes] = useState([])
    const [servicosSelecionados, setServicosSelecionados] = useState([])

    const [estaAdicionando, setEstaAdicionando] = useState(false)
    const estaSelecionando = servicosSelecionados.length > 0
    const [dropDownAberto, setDropDownAberto] = useState(false)
    const [dropUpAberto, setDropUpAberto] = useState(false)

    const [selecionouTudo, setSelecionouTudo] = useState(false)

    // Esse valor inicial garante que o campo seja sempre uma lista, mesmo quando
    // existir somente um profissional disponível nos checkboxes.
    const { register, handleSubmit, reset } = useForm({
        defaultValues: {
            profissionais_associados: []
        }
    })

    const onSubmit = (data) => mandarDadosCriacao(data)

    useEffect(() => {
        async function buscarDados() {
            // O perfil informa o id do salão. Depois dele são buscados os serviços
            // e os profissionais que podem ser associados.
            const perfil = await pegarMeuPerfil()
            const respostaServicos = await buscarServicos()

            if (!perfil || !perfil.salao_associado) {
                setServicos([])
                setAssociacoes([])
                setProfissionais([])
                return
            }

            const respostaProfissionais = await buscarTodosProfissionais(perfil.salao_associado)

            if (respostaServicos?.sucesso) {
                setServicos(respostaServicos.servicos ?? [])
                setAssociacoes(respostaServicos.associacoes ?? [])
            }
            setProfissionais(respostaProfissionais?.profissional ?? [])

        }

        buscarDados()

        // Depois de uma edição, o componente pai altera esse valor para refazer a busca.
    }, [atualizacaoServicos])

    // Mantém o contador exibido acima da tabela sincronizado com a lista atual.
    useEffect(() => {
        setQuantidadeServicos(servicos.length)
    }, [servicos, setQuantidadeServicos])

    async function mandarDadosCriacao(data) {
        const respostaCriacao = await criarServico(data)

        if (respostaCriacao) {
            // Após criar, busca a lista atualizada e fecha a linha de cadastro.
            const respostaServicos = await buscarServicos()

            if (respostaServicos?.sucesso) {
                setServicos(respostaServicos.servicos ?? [])
                setAssociacoes(respostaServicos.associacoes ?? [])
                reset()
                setEstaAdicionando(false)
                setDropDownAberto(false)
            }
        }
    }

    async function mandarDadosDeletar() {
        // Envia somente os ids marcados pelos checkboxes da primeira coluna.
        const respostaDeletar = await deletarServicos(servicosSelecionados)

        if (respostaDeletar) {
            setServicosSelecionados([])
            setSelecionouTudo(false)
            setDropUpAberto(false)
            reset()

            const respostaServicos = await buscarServicos()

            if (respostaServicos?.sucesso) {
                setServicos(respostaServicos.servicos ?? [])
                setAssociacoes(respostaServicos.associacoes ?? [])
            }
        }
    }

    function abrirEdicaoServico(servico) {
        // A resposta do back-end contém todas as associações. Aqui ficam somente
        // os ids que pertencem ao serviço escolhido.
        const profissionaisAssociados = associacoes
            .filter(associacao => associacao.id_servico === servico.id_servico)
            .map(associacao => associacao.id_profissional)

        onEditar(servico, profissionais, profissionaisAssociados)
    }

    return (

        <>

            <table className="GerenciadorServicos-TabelaServicos border-collapse w-full">


                <thead>
                    <tr className="">
                        <th >
                            {/* Marca ou desmarca todos os serviços de uma vez. */}
                            <input type="checkbox" checked={selecionouTudo} onChange={() => {
                                const deveSelecionarTudo = servicosSelecionados.length !== servicos.length
                                setSelecionouTudo(deveSelecionarTudo)
                                setServicosSelecionados(
                                    deveSelecionarTudo
                                        ? servicos.map((servico) => servico.id_servico)
                                        : []
                                )
                            }} />
                        </th>
                        <th> Nome </th>
                        <th> Preço </th>
                        <th> Duração </th>
                        <th> Pessoas Associadas </th>
                        <th className="p-0! relative">
                            {dropUpAberto && (
                                <div className="absolute top-full w-full h-10/12 bg-marrom text-white left-0">
                                    <p className="-mt-0.5">certeza?</p>
                                    <div className="flex h-max! -m-1 place-self-center gap-5">
                                        <button type="button" className="hover:text-green-500" onClick={() => mandarDadosDeletar()}> Sim </button>
                                        <button type="button" className="hover:text-red-500" onClick={() => {
                                            setDropUpAberto(false)
                                            setSelecionouTudo(false)
                                            setServicosSelecionados([])
                                        }}> Não </button>
                                    </div>
                                </div>
                            )}
                            <button type="button"
                                className={`${estaSelecionando ? "hover:bg-red-600 text-white bg-red-700/75" : estaAdicionando
                                    ? "hover:bg-red-600 text-white bg-red-700/75"
                                    : "bg-marrom text-green-400 hover:bg-green-900 hover:text-white"} transition-colors py-3 w-full flex}`}
                                onClick={() => estaSelecionando ? setDropUpAberto(true) : setEstaAdicionando(!estaAdicionando)}
                            >
                                {estaSelecionando ? <p className="ml-3">- Remover</p> : <p className="ml-3">{estaAdicionando ? "X Cancelar" : "+ Adicionar"}</p>}
                            </button>
                        </th>
                    </tr>
                </thead>

                <tbody>

                    {estaAdicionando && (
                        //  Essa classe pega todos os TD e INPUT's dentro dela para aplicar o TailWind usando @apply para economizar linha
                        <tr className="GerenciadorServicos-adicionar">
                            <td />
                            <td> <input type="text" placeholder="ex: Barba" {...register("nome_servico")} required /> </td>
                            <td> <input type="number" min="0" step="0.01" placeholder='ex: "47" = R$ 47,00' {...register("preco_servico")} required />  </td>
                            <td> <input type="number" min="1" placeholder='ex: "60" = 60 minutos' {...register("duracao")} required /> </td>
                            <td className="relative">
                                <div className="w-full h-full p-1.5">
                                    <button type="button" className="w-full h-full text-amarelo text-left" onClick={() => setDropDownAberto(!dropDownAberto)}>
                                        Selecionar...
                                    </button>

                                    {dropDownAberto && (

                                        <div className="border-laranja border text-amarelo absolute overflow-y-auto top-full bg-marrom w-full h-max py-0 left-0">
                                            {profissionais && (
                                                profissionais.map((profissional) => (
                                                    <label className="flex  gap-2 text-md py-1" key={profissional.id_profissional} >
                                                        <input type="checkbox" className="ml-1.5" value={profissional.id_profissional} {...register("profissionais_associados")} />
                                                        {profissional.nome_profissional}
                                                    </label>
                                                ))
                                            )}
                                        </div>

                                    )}

                                </div>
                            </td>

                            <td className="p-0!">
                                <button type="button"
                                    className="text-white bg-green-500 hover:bg-green-600 transition-colors w-full py-3 flex"
                                    onClick={handleSubmit(onSubmit)}
                                >
                                    <div className="flex items-center ml-2.5 gap-1">

                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
                                            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                                            strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12" />
                                        </svg>
                                        <strong>Confirmar</strong>
                                    </div>
                                </button>
                            </td>
                        </tr>
                    )}

                    {servicos && (
                        servicos.map((servico) => (
                            <tr key={servico.id_servico}>
                                <td>
                                    <input type="checkbox"
                                        className="flex place-self-center"
                                        checked={servicosSelecionados.includes(servico.id_servico)}
                                        onChange={() => {
                                            setSelecionouTudo(false)
                                            setServicosSelecionados((atuais) => (
                                                atuais.includes(servico.id_servico) ? atuais.filter(id => id !== servico.id_servico)
                                                    : [...atuais, servico.id_servico]
                                            ))
                                        }}
                                    />
                                </td>
                                <td>
                                    <p>{servico.nome_servico}</p>
                                    {/* Desativar mantém o serviço cadastrado, por isso ele continua visível. */}
                                    <small className={servico.em_funcionamento ? "text-green-700" : "text-red-700"}>
                                        {servico.em_funcionamento ? "Ativo" : "Desativado"}
                                    </small>
                                </td>
                                <td>{servico.preco_servico}</td>
                                <td>{servico.duracao}</td>
                                <td className="py-1.5!">
                                    <div className="max-w-full overflow-x-auto">

                                        <p className="shrink-0 whitespace-nowrap">
                                            {associacoes.filter(associacao => associacao.id_servico === servico.id_servico)
                                                .map(associacao => associacao.profissionais.nome_profissional)
                                                .join(" - ")
                                            }
                                        </p>

                                    </div>
                                </td>
                                <td>
                                    {!estaSelecionando && (

                                        <button type="button" className="flex place-self-center ml-[-18px]!" onClick={() => abrirEdicaoServico(servico)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                                <circle cx="12" cy="5" r="2" />
                                                <circle cx="12" cy="12" r="2" />
                                                <circle cx="12" cy="19" r="2" />
                                            </svg>
                                            Editar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table >
        </>

    )
}
