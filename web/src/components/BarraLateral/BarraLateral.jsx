import { NavLink } from 'react-router'

import './BarraLateral.css'
import Configuracoes from '@/Configuracoes/Configuracoes'
import { useState } from 'react'
import { useMeuPerfil } from '../../services/pegarMeuPerfil'
import { menuDoPerfil } from './listaMenus'

// Única barra de navegação do sistema: cada página só renderiza <BarraLateral />
// e a própria barra escolhe o menu de acordo com quem está logado.
function BarraLateral() {

    const [configAberto, setConfigAberto] = useState(false)

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

    return (
        // No celular a barra mostra só os ícones (o nome de cada item fica no title)
        <aside className='barraLateral z-40 px-2! md:px-4!' >
            <div className="flex  gap-3 px-2 mt-5!">
                <img className="w-10 md:w-20" src="/logo_pequena.png" />
                <p className="hidden md:block mt-10 font-semibold text-white">Secretária Gestão</p>
            </div>

            <hr className='w-[94.5%] mx-2! mt-1.5!' />

            {menu.map(linha => (
                <NavLink
                    to={linha.to}
                    key={linha.to}
                    title={linha.titulo}
                    end
                    className={({ isActive }) => `flex gap-3 p-2 rounded-md my-1 items-center transition-colors ${isActive ? 'bg-white/12 shadow-[inset_3px_0_0_var(--color-rosa-queimado)]' : 'hover:bg-white/8'}`}
                >

                    <linha.icone />

                    <p className='hidden md:block text-[14px] w-max'> {linha.titulo} </p>
                </NavLink>
            ))}

            <button type="button" title="Configurações" className='flex bg-white/12 mt-auto mb-5 p-3 rounded-md gap-2 items-center justify-center' onClick={() => setConfigAberto(!configAberto)}>
                <svg
                    className="w-5 h-5 shrink-0"
                    viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.75"
                    strokeLinecap="round" strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <span className="hidden md:inline">Configurações</span>
            </button>

            {/* O painel é filho da barra (por isso ele se posiciona a partir dela). O z-40 da barra é o que mantém
                tudo isso, painel incluso, por cima do conteúdo da página. */}
            {configAberto && (
                <Configuracoes perfil={tipoPerfil} setConfigAberto={setConfigAberto}/>
            )}

        </aside>
    )
}

export default BarraLateral
