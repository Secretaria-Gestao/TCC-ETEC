import './CadastroColaborador.css'

import BarraLateral from '../../../../components/BarraLateral/BarraLateral.jsx'
import Header from '../../../../components/Header/Header.jsx'
import Formulario from './components/Formulario/Formulario.jsx'

import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useForm, FormProvider } from 'react-hook-form'

import { useNotificacaoStore } from "@/Notificacao/notificacaoStore.js"
import { buscarSalao } from '../../../../services/BuscarSalao.js'
import { buscarServicos } from '../../../GerenciadorServicos/services/buscarServicos'
import { cadastrarColaborador } from '../../services/CadastroColaborador'


function CadastroColaborador() {
    const mostrarNotificacao = useNotificacaoStore((state) => state.mostrarNotificacao)
    const navigate = useNavigate()

    const [nomeSalao, setNomeSalao] = useState("")
    const [servicos, setServicos] = useState([])

    const metodos = useForm({
        defaultValues: {
            nome: "", sobrenome: "",
            cargo: "", telefone: "",

            email: "", senha: "", senhaRepetida: "",
            // Começa no nível mais baixo para ninguém virar administrador sem querer.
            nivelAcesso: "3", servicosEscolhidos: []
        }
    })

    const { getValues, watch } = metodos

    const nomeUsuario = `${watch("nome")} ${watch("sobrenome")}`;

    async function mandarFormulario() {

        var camposFaltando = false

        const valores = getValues()

        Object.entries(valores).forEach((valor) => {
            if (camposFaltando == true) return

            // Serviços são opcionais (uma recepcionista não realiza nenhum), e [] == "" daria true.
            if (valor[0] == "servicosEscolhidos") return

            if (valor[1] == "") {
                mostrarNotificacao({ titulo: "Preencha todos os campos" })
                camposFaltando = true

                return
            }
        })

        if (camposFaltando == true) return

        if (!/\S+@\S+\.\S+/.test(valores.email)) {
            mostrarNotificacao({ titulo: "Email incorreto" })

            return
        }

        if (valores.senha.length < 6) {
            mostrarNotificacao({ titulo: "Erro ao cadastrar", texto: "A senha deve conter pelo menos 6 caracteres" })

            return
        }

        // Mesmas regras da troca de senha nas configurações; a lista vermelha/verde do formulário mostra o que falta.
        if (!/[A-Z]/.test(valores.senha) || !/[0-9]/.test(valores.senha) || !/[^a-zA-Z0-9\s]/.test(valores.senha)) {
            mostrarNotificacao({ titulo: "Erro ao cadastrar", texto: "A senha precisa de uma letra maiúscula, um número e um caractere especial" })

            return
        }

        if (valores.senha != valores.senhaRepetida) {
            mostrarNotificacao({ titulo: "Erro ao cadastrar", texto: "As senhas não são iguais" })

            return
        }

        const resposta = await cadastrarColaborador(valores.email, valores.senha, nomeUsuario, valores.cargo, valores.telefone, valores.nivelAcesso, valores.servicosEscolhidos);

        if (resposta) {
            mostrarNotificacao({
                titulo: "Cadastro concluído!",
                texto: "Profissional cadastrado no salão com sucesso."
            });

            navigate("/admin/gerenciador-profissionais")
        }
    }

    useEffect(() => { // Precisa disso para fazer a busca do nome do salão usando o React
        async function pegarDados() {
            const respostaSalao = await buscarSalao()
            const respostaServicos = await buscarServicos()

            // Em caso de erro o buscarServicos devolve uma lista de textos, sem .servicos
            setServicos(respostaServicos?.servicos ?? [])
            if (respostaSalao) setNomeSalao(respostaSalao.nome_salao)

        }

        pegarDados()

    }, []) // [] = roda só uma vez quando o componente aparecer na tela, para não re-renderizar a tela várias vezes causando lentidão

    return (
        <main className='main-principal flex'>
            <div className='w-full h-full flex flex-col md:flex-row'>
                <div className='flex'>
                    <BarraLateral />
                </div>
                <div className='w-full'>
                    <Header titulo="Novo profissional" subtitulo={nomeSalao}>
                        <button type="button" className='shrink-0 bg-vinho text-laranja rounded-md lg:rounded-2xl p-3 text-sm mt-[-25px] sm:text-base lg:absolute lg:right-20 lg:w-39 lg:mt-[-36px] xl:right-40' onClick={mandarFormulario}>
                            Criar profissional
                        </button>
                    </Header>
                    <hr className='w-10/12 place-self-center mt-[-36px] border-azul-ceu' />
                    <div className='flex justify-center mt-[2%]! pb-10! px-3! sm:px-0!'>
                        <FormProvider {...metodos}>
                            <Formulario servicos={servicos} setServicos={setServicos} />
                        </FormProvider>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default CadastroColaborador
