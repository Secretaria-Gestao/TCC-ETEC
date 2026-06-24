import { Link } from 'react-router'

import './Box.css'

function Box() {
	return (
		<main className="homepage-main">
			<div className="homepage-box">
				<p>Bem-te-vi</p>

				<p>Deseja agendar um horário?</p> <br />

				<Link to={'/cadastro/cliente'} className='homepage-link'> Agendar um horário </Link>
				<Link to={'/cadastro/profissional'} className='homepage-link'> Sou profissional </Link>

			</div>
		</main>
	)
}

export default Box
