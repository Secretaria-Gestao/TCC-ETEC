import { Link } from 'react-router'

import './BarraLateral.css'

function BarraLateral() {
    return (
        <div className='barraLateral' >
            <img className='h-18 w-20' src='/logo_pequena.png'/>
            <hr className='w-7/10'/>
            <Link to={"/"}> Página principal</Link>
        </div>
    )
}

export default BarraLateral