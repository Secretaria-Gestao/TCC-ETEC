import { NavLink } from 'react-router'

import './BarraLateral.css'
import Configuracoes from '@/Configuracoes/Configuracoes'
import { useState } from 'react'
import { useMeuPerfil } from '../../services/pegarMeuPerfil'

function BarraLateral({ menu = [] }) {

    const [configAberto, setConfigAberto] = useState(false)

    // Só profissionais têm id_profissional; quem não tem sessão ou é cliente cai em "cliente".
    // O nível 1 é o administrador, dono do salão.
    const { data: perfilLogado } = useMeuPerfil()
    const tipoPerfil = !perfilLogado?.id_profissional
        ? "cliente"
        : Number(perfilLogado.nivel_acesso) === 1 ? "admin" : "profissional"

    return (
        <aside className='barraLateral z-40' >
            <div className="flex  gap-3 px-2 mt-5!">
                <img className="w-20 " src="/logo_pequena.png" />
                <p className="mt-10 font-semibold">Secretária Gestão</p>
            </div>

            <hr className='w-[94.5%] mx-2! mt-1.5!' />

            {menu.map(linha => (
                <NavLink
                    to={linha.to}
                    key={linha.to}
                    end
                    className={({ isActive }) => `flex gap-3 p-2 rounded-md my-1 items-center transition-colors ${isActive ? 'bg-[#33435a]' : 'hover:bg-[#2f3d50]'}`}
                >

                    <linha.icone />

                    <p className='text-[14px] w-max'> {linha.titulo} </p>
                </NavLink>
            ))}

            <button type="button" className='flex bg-[#1a2431] mt-auto mb-5 p-3 rounded-md gap-2 items-center justify-center' onClick={() => setConfigAberto(!configAberto)}>
                <svg
                    className="w-5 h-5 shrink-0"
                    viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.75"
                    strokeLinecap="round" strokeLinejoin="round"
                >
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                Configurações
            </button>

            {configAberto && (
                <Configuracoes perfil={tipoPerfil} setConfigAberto={setConfigAberto}/>
            )}

        </aside>
    )
}

export default BarraLateral
