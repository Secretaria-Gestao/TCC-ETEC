import { Link } from 'react-router'

import './CardAcesso.css'
import { useState } from 'react'

function CardAcesso() {

	const [modalProf, setModalProf] = useState(false)

	return (
		<div className='h-dvh overflow-x-hidden'>
			<div className='h-full w-dvw bg-white'>

				<header className='bg-ameixa flex p-5 gap-2 justify-between'>
					<div className='flex items-center gap-2'>
						<img className="shrink-0 w-20" src="/logo_SVG.svg" alt="" />

						<div>
							<p className=' font-bold text-xl text-white'>Secretaria gestão</p>
							<hr className='w-full text-white' />

						</div>

					</div>

					<div className='text-white px-5 self-center overflow-visible '>
						<ul className='flex gap-5 overflow-visible items-center z-50'>
							<li className='relative overflow-visible z-50'>
								<button className={`w-full bg-black/4 p-2 ${modalProf ? 'rounded-b-none rounded-t-md border border-black/20' : 'rounded-md'}`} onClick={() => setModalProf(!modalProf)}>
									Sou um profissional
								</button>

								{modalProf && (
									<div className='absolute top-full w-full z-50 bg-[#704356] border-[0px_1px_1px_1px] rounded-b-md border-black/20 p-2 flex flex-col gap-2'>
										<Link>
											- Criar o meu salão
										</Link>

										<Link>
											- Entrar no sistema
										</Link>
									</div>

								)}

							</li>
							<li>
								<Link to="/login">
									Agendar um horário
								</Link>
							</li>
						</ul>
					</div>

				</header>

			</div>

			<div className='h-full w-dvw bg-red-200'>
				a
			</div>

		</div>
	)
}

export default CardAcesso
