import { NavLink, useLocation } from 'react-router'

import './BarraLateral.css'
import Configuracoes from '@/Configuracoes/Configuracoes'
import { useState } from 'react'
import { useMeuPerfil } from '../../services/pegarMeuPerfil'
import { menuDoPerfil } from './listaMenus'

// Ícone da engrenagem, usado no botão de Configurações do desktop e no menu do celular.
const IconeEngrenagem = () => (
    <svg
        className="w-5 h-5 shrink-0"
        viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="1.75"
        strokeLinecap="round" strokeLinejoin="round"
    >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
)

// Visual de cada item do menu (igual no desktop e no menu do celular).
const classeDoLink = (isActive) =>
    `flex gap-3 p-2 rounded-md my-1 items-center transition-colors ${isActive ? 'bg-white/12 shadow-[inset_3px_0_0_var(--color-rosa-queimado)]' : 'hover:bg-white/8'}`

// Única barra de navegação do sistema: cada página só renderiza <BarraLateral />
// e a própria barra escolhe o menu de acordo com quem está logado.
function BarraLateral() {

    const [configAberto, setConfigAberto] = useState(false)

    // No celular o menu fica escondido atrás do botão de hambúrguer; este estado abre e fecha a lista.
    const [menuAberto, setMenuAberto] = useState(false)

    const { pathname } = useLocation()

    // Só profissionais têm id_profissional; quem não tem sessão ou é cliente cai em "cliente".
    // Nível 1 é o administrador (dono do salão), 2 o gerente e 3 o profissional.
    const { data: perfilLogado, isPending } = useMeuPerfil()
    const nivelAcesso = Number(perfilLogado?.nivel_acesso)
    const tipoUsuario = !perfilLogado?.id_profissional
        ? "cliente"
        : nivelAcesso === 1 ? "admin" : nivelAcesso === 2 ? "gerente" : "profissional"

    // As Configurações só separam o administrador; gerente e profissional veem as mesmas abas
    const tipoPerfil = tipoUsuario === "gerente" ? "profissional" : tipoUsuario

    // Enquanto o perfil carrega, a barra fica sem itens para não mostrar o menu de outro tipo de usuário
    const menu = isPending ? [] : menuDoPerfil(tipoUsuario)

    // Nome da tela atual, mostrado embaixo de "Secretária Gestão" no celular. Testa os caminhos mais longos
    // primeiro para que "/agendamento/historico" não seja confundido com "/agendamento".
    const paginaAtual = [...menu]
        .sort((a, b) => b.to.length - a.to.length)
        .find(linha => linha.to === "/" ? pathname === "/" : pathname.startsWith(linha.to))
        ?.titulo
    const subtitulo = configAberto ? "Configurações" : paginaAtual

    function abrirConfiguracoes() {
        setMenuAberto(false)
        setConfigAberto(!configAberto)
    }

    return (
        // No celular a barra vira um topo com logo, nome e botão de menu. No desktop continua a coluna lateral.
        <aside className='barraLateral z-40 md:px-4! max-md:px-4 max-md:items-center' >

            <div className="flex flex-1 md:flex-0 gap-3 p-2 max-md:pl-0 items-center min-w-0">

                {/* Celular: a logo em SVG e o nome do sistema com a tela atual embaixo */}
                <img className="md:hidden shrink-0 w-16" src="/logo_SVG.svg" alt="" />
                <div className="md:hidden flex flex-col leading-tight min-w-0">
                    <span className="font-semibold text-white truncate">Secretária Gestão</span>
                    {subtitulo && <span className="text-sm text-white/80 truncate">{subtitulo}</span>}
                </div>

                {/* Desktop: logo e nome como sempre */}
                <img className="hidden md:block w-20" src="/logo_pequena.png" alt="" />
                <p className="hidden md:block md:mt-10 font-semibold text-white">Secretária Gestão</p>
            </div>

            {/* Celular: botão de hambúrguer (vira um X quando o menu está aberto) */}
            <button
                type="button"
                title="Menu"
                aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
                aria-expanded={menuAberto}
                className="md:hidden shrink-0 bg-white/12 p-3 rounded-md"
                onClick={() => setMenuAberto(!menuAberto)}
            >
                <svg className="w-6 h-6 text-white!" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    {menuAberto ? (
                        <>
                            <line x1="6" y1="6" x2="18" y2="18" />
                            <line x1="18" y1="6" x2="6" y2="18" />
                        </>
                    ) : (
                        <>
                            <line x1="4" y1="7" x2="20" y2="7" />
                            <line x1="4" y1="12" x2="20" y2="12" />
                            <line x1="4" y1="17" x2="20" y2="17" />
                        </>
                    )}
                </svg>
            </button>

            <hr className='hidden md:block  w-[94.5%] mx-2! mt-1.5!' />

            {/* Desktop: itens da coluna lateral */}
            {menu.map(linha => (
                <NavLink
                    to={linha.to}
                    key={linha.to}
                    title={linha.titulo}
                    end
                    className={({ isActive }) => `max-md:hidden ${classeDoLink(isActive)}`}
                >

                    <linha.icone />

                    <p className='hidden md:block text-[14px] w-max'> {linha.titulo} </p>
                </NavLink>
            ))}

            <button type="button" title="Configurações" className='max-md:hidden flex bg-white/12 mt-auto mb-5 p-3 rounded-md gap-2 items-center justify-center' onClick={() => setConfigAberto(!configAberto)}>
                <IconeEngrenagem />
                <span className="hidden md:inline">Configurações</span>
            </button>

            {/* Celular: lista que abre embaixo da barra com os mesmos itens e as Configurações */}
            {menuAberto && (
                // z-[60]: o painel de Configurações é z-50, então o menu precisa de um z-index maior para ficar por cima dele.
                <nav className="md:hidden absolute top-full left-0 z-[60] w-full max-h-[calc(100dvh-5rem)] overflow-y-auto flex flex-col p-3 bg-vinho shadow-lg">
                    {menu.map(linha => (
                        <NavLink
                            to={linha.to}
                            key={linha.to}
                            end
                            onClick={() => setMenuAberto(false)}
                            className={({ isActive }) => classeDoLink(isActive)}
                        >
                            <linha.icone />
                            <span className="text-[15px]">{linha.titulo}</span>
                        </NavLink>
                    ))}

                    <button type="button" className={`${classeDoLink(false)} mt-2 border-t border-white/15 pt-3`} onClick={abrirConfiguracoes}>
                        <IconeEngrenagem />
                        <span className="text-[15px]">Configurações</span>
                    </button>
                </nav>
            )}

            {/* O painel é filho da barra (por isso ele se posiciona a partir dela). O z-40 da barra é o que mantém
                tudo isso, painel incluso, por cima do conteúdo da página. */}
            {configAberto && (
                <Configuracoes perfil={tipoPerfil} setConfigAberto={setConfigAberto}/>
            )}

        </aside>
    )
}

export default BarraLateral
