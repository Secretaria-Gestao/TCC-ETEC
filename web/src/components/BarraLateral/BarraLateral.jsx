import { NavLink } from 'react-router'

import './BarraLateral.css'

function BarraLateral() {
    return (
        <aside className='barraLateral' >
            <div className="flex  gap-3 px-2 mt-5!">
                <img className="w-20 " src="/logo_pequena.png" />
                <p className="mt-10 font-semibold">Secretária Gestão</p>
            </div>

            <hr className='w-[94.5%] mx-2! mt-1.5!' />

            <NavLink
                to="/"
                className={({ isActive }) => `flex gap-3 p-2 rounded-md my-1 transition-colors ${isActive ? 'bg-[#2f3d50]' : 'hover:bg-[#2f3d50]'}`}
            >

                <svg xmlns="http://w3.org" viewBox="0 0 100 100" width="24" height="24" className='shrink-0 ml-[-2.5px]'>
                    <g fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="50,15 15,45 85,45" />
                        <rect x="23" y="45" width="54" height="40" />
                        <rect x="42" y="60" width="16" height="25" />
                    </g>
                </svg>

                <p className='text-[14px] w-max'> Página principal</p>
            </NavLink>

            <NavLink
                to="/cadastro/colaborador"
                className={({ isActive }) => `flex gap-3 p-2 rounded-md my-1 transition-colors ${isActive ? 'bg-[#2f3d50]' : 'hover:bg-[#2f3d50]'}`}
            >

                <svg
                    className="w-5 h-5 shrink-0"
                    viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="1.75"
                    strokeLinecap="round" strokeLinejoin="round"
                >

                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />

                </svg>

                <p className='text-[14px] w-max'> Cadastro de profissionais</p>
            </NavLink>

            <NavLink
                to="/admin/gerenciador-servicos"
                className={({ isActive }) => `flex gap-3 items-center p-2 rounded-md my-1 transition-colors ${isActive ? 'bg-[#2f3d50]' : 'hover:bg-[#2f3d50]'}`}
            >

                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="6" cy="6" r="3" />
                    <circle cx="6" cy="18" r="3" />
                    <line x1="20" y1="4" x2="8.12" y2="15.88" />
                    <line x1="14.47" y1="14.48" x2="20" y2="20" />
                    <line x1="8.12" y1="8.12" x2="12" y2="12" />
                </svg>

                <p className="text-[14px]">Serviços fornecidos</p>

            </NavLink>
        </aside>
    )
}

export default BarraLateral
