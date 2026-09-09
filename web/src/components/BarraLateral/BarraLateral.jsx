import { NavLink } from 'react-router'

import './BarraLateral.css'
import { menuAdmin } from './listaMenus'

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

            {menuAdmin.map(linha => (
                <NavLink
                    to={linha.to}
                    className={({ isActive }) => `flex gap-3 p-2 rounded-md my-1 transition-colors ${isActive ? 'bg-[#2f3d50]' : 'hover:bg-[#2f3d50]'}`}
                >

                   {linha.icone()}

                    <p className='text-[14px] w-max'> {linha.titulo} </p>
                </NavLink>
            ))}

           
        </aside>
    )
}

export default BarraLateral
