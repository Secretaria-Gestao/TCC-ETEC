import { NavLink } from 'react-router'

import './BarraLateral.css'

function BarraLateral({menu = []}) {
    return (
        <aside className='barraLateral' >
            <div className="flex  gap-3 px-2 mt-5!">
                <img className="w-20 " src="/logo_pequena.png" />
                <p className="mt-10 font-semibold">Secretária Gestão</p>
            </div>

            <hr className='w-[94.5%] mx-2! mt-1.5!' />

            {menu.map(linha => (
                <NavLink
                    to={linha.to}
                    key={linha.to}
                    className={({ isActive }) => `flex gap-3 p-2 rounded-md my-1 flex items-center transition-colors ${isActive ? 'bg-[#2f3d50]' : 'hover:bg-[#2f3d50]'}`}
                >

                   <linha.icone />

                    <p className='text-[14px] w-max'> {linha.titulo} </p>
                </NavLink>
            ))}

           
        </aside>
    )
}

export default BarraLateral
