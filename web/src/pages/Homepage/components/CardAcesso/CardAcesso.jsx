import { Link } from 'react-router'

import './CardAcesso.css'

function CardAcesso() {
	return (
		<main className="homepage-main">
			<div className="homepage-CardAcesso">
				<p>Bem-te-vi</p>

				<p>Deseja agendar um horário?</p> <br />

				<Link to={'/cadastro/cliente'} className='homepage-link'> Agendar um horário </Link>
				<Link to={'/cadastro/gerente'} className='homepage-link'> Sou profissional </Link>

			</div>
		</main>
	)
}

export default CardAcesso
