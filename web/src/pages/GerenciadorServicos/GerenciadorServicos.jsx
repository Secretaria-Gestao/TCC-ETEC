import BarraLateral from "@/BarraLateral/BarraLateral"
import Header from "@/Header/Header"
import TabelaServicos from "./components/TabelaServicos/TabelaServicos"

import { pegarSessao } from "../../services/pegarSessao"
import { buscarSalao } from "../../services/BuscarSalao"
import { editarServico } from "./services/gerenciarServicos"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"

import "./GerenciadorServicos.css"

export default function GerenciadorServicos() {

    const [nomeSalao, setNomeSalao] = useState("")
    const [quantidadeServicos, setQuantidadeServicos] = useState(0)

    // Esses estados controlam a janela de edição e guardam qual serviço e quais
    // profissionais devem aparecer preenchidos no formulário.
    const [estaEditando, setEstaEditando] = useState(false)
    const [servicoEditando, setServicoEditando] = useState(null)
    const [profissionaisEdicao, setProfissionaisEdicao] = useState([])

    // Sempre que esse número muda, a tabela executa novamente a busca dos serviços.
    const [atualizacaoServicos, setAtualizacaoServicos] = useState(0)
    const { register, handleSubmit, reset } = useForm()

    // Busca o nome uma única vez quando a página é aberta.
    useEffect(() => {
        async function pegarNomeSalao() {
            const sessao = await pegarSessao()

            if (!sessao) {
                return
            }

            const salao = await buscarSalao(sessao.user.email)
            setNomeSalao(salao.nome_salao)
        }

        pegarNomeSalao()

    }, [])

    function abrirEdicao(servico, profissionais, profissionaisAssociados) {
        setServicoEditando(servico)
        setProfissionaisEdicao(profissionais)

        // reset() preenche o formulário com os dados atuais do serviço e já
        // marca os profissionais que estavam associados a ele.
        reset({
            nome_servico: servico.nome_servico,
            preco_servico: servico.preco_servico,
            duracao: servico.duracao,
            em_funcionamento: servico.em_funcionamento,
            profissionais_associados: profissionaisAssociados
        })
        setEstaEditando(true)
    }

    function fecharEdicao() {
        setEstaEditando(false)
        setServicoEditando(null)
    }

    async function salvarEdicao(data) {
        const respostaEdicao = await editarServico({
            id_servico: servicoEditando.id_servico,
            nome_servico: data.nome_servico,
            preco_servico: data.preco_servico,
            duracao: data.duracao,
            em_funcionamento: data.em_funcionamento,
            profissionais_associados: data.profissionais_associados || []
        })

        if (respostaEdicao) {
            fecharEdicao()

            // Força a tabela a consultar novamente o back-end e mostrar os dados salvos.
            setAtualizacaoServicos(valorAtual => valorAtual + 1)
        }
    }

    return (
        <div className="w-full h-full flex ">
            <BarraLateral />

            <main className="relative w-full min-h-dvh h-max bg-amber-300 flex flex-col flex-1 min-w-0">
                {estaEditando && servicoEditando && (
                    <div className="absolute inset-0 backdrop-blur-md text-white z-10 flex justify-center items-center">
                        <form
                            className="GerenciadorServicos-editar"
                            onSubmit={handleSubmit(salvarEdicao)}
                        >
                            <p className="text-amarelo bold">Editar {servicoEditando.nome_servico}</p>

                            <label>
                                Nome
                                <input type="text" {...register("nome_servico")} required />
                            </label>

                            <label>
                                Preço
                                <input type="number" step="0.01" {...register("preco_servico")} required />
                            </label>

                            <label>
                                Duração
                                <input type="number" {...register("duracao")} required />
                            </label>

                            <label className="flex gap-2">
                                <input type="checkbox" {...register("em_funcionamento")} />
                                Serviço ativo (desmarque para desativar)
                            </label>

                            <div>
                                <p>Profissionais associados</p>

                                <div className="max-h-40 overflow-y-auto">
                                    {profissionaisEdicao.map((profissional) => (
                                        <label className="flex gap-2" key={profissional.id_profissional}>
                                            <input
                                                type="checkbox"
                                                value={profissional.id_profissional}
                                                {...register("profissionais_associados")}
                                            />
                                            {profissional.nome_profissional}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-end gap-3">
                                <button type="button" className="hover:text-red-500" onClick={fecharEdicao}>Cancelar</button>
                                <button type="submit" className="hover:text-green-500">Salvar</button>
                            </div>
                        </form>
                    </div>
                )}

                <Header titulo="Serviços do salão" subtitulo={nomeSalao} />

                <hr className=' w-10/12 place-self-center mt-[-36px]' />

                <div className="flex w-11/12 md:w-10/12 xl:w-8/12 flex-col justify-center my-9 mx-auto md:items-center">
                    <div>
                        Total de serviços: <b>{quantidadeServicos}</b>
                    </div>

                    <div className="w-full overflow-y-auto min-h-150">
                            <TabelaServicos
                                setQuantidadeServicos={setQuantidadeServicos}
                                onEditar={abrirEdicao}
                                atualizacaoServicos={atualizacaoServicos}
                            />
                    </div>
                </div>
            </main>
        </div>
    )
}
