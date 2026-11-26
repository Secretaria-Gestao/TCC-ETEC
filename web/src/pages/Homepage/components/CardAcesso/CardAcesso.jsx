import { Link } from 'react-router'

import './CardAcesso.css'
import { useState } from 'react'

function CardAcesso() {

  const [modalProf, setModalProf] = useState(false)

  return (
    <div className='h-dvh overflow-x-hidden'>
      <div className='h-full w-dvw'>

        <header className='bg-ameixa flex p-5 gap-2 justify-between'>
          <div className='flex items-center gap-2 p-2'>
            <img className="shrink-0 w-20" src="/logo_SVG.svg" alt="" />

            <div>
              <p className=' font-bold text-xl text-white'>Secretária gestão</p>
              <hr className='w-full text-white' />

            </div>

          </div>

          <div className='text-white px-5 self-center overflow-visible'>
            <ul className='flex gap-5 overflow-visible items-center z-50'>
              <li className='relative overflow-visible z-50'>
                <button className={`w-full bg-black/4 p-2 shadow-md ${modalProf ? 'rounded-b-none rounded-t-md border border-black/20 ' : 'rounded-md'}`} onClick={() => setModalProf(!modalProf)}>
                  Sou um profissional
                </button>

                {modalProf && (
                  <div className='absolute top-full w-full z-50 bg-[#704356] shadow-md border-[0px_1px_1px_1px] rounded-b-md border-black/20 flex flex-col divide-y divide-black/20'>
                    <Link className='text-center p-2'>
                      Criar o meu salão
                    </Link>

                    <Link className='text-center p-2'>
                      Entrar no sistema
                    </Link>
                  </div>

                )}

              </li>
              <li>
                <Link to="/login" className='bg-black/4 shadow-md p-2 rounded-md'>
                  Agendar um horário
                </Link>
              </li>
            </ul>
          </div>

        </header>

        <main className='h-full flex items-center justify-center w-1/1 place-self-center homepage-main'>
          <div className='p-5 justify-center items-center place-self-center flex gap-20 '>

            <img src="/imagem_homepage1.png" alt="" className='w-7/12 shadow-xl/20 rounded-2xl' />

            <div className='place-self-center h-max flex flex-col gap-2'>
              <b className='text-4xl'>Organização, <br /> agilidade e beleza, <br /> tudo em um só lugar!</b>
              <p>
                Agende seu horário no salão em poucos cliques, ou <br /> gerencie agenda, profissionais e serviços do seu salão <br /> em um painel só.
              </p>
              <div className='secao-card-comentarios'>
                <div className='bg-azul-profundo text-white card-comentarios'>
                  <div className='text-sm gap-4 flex justify-between'> Clarice Souza <div>★★★★☆</div></div>
                  <p className='font-extralight text-sm -mt-4'>— Cliente </p>
                  <p >"Achei fácil de usar, porém a tela de meus agendamentos é confusa."</p>
                </div>              
                <div className='bg-azul-profundo text-white card-comentarios'>
                  <div className='text-sm gap-4 flex justify-between'> Clarice Souza <div>★★★★☆</div></div>
                  <p className='font-extralight text-sm -mt-4'>— Cliente </p>
                  <p >"Achei fácil de usar, porém a tela de meus agendamentos é confusa."</p>
                </div>              
                <div className='bg-azul-profundo text-white card-comentarios'>
                  <div className='text-sm gap-4 flex justify-between'> Clarice Souza <div>★★★★☆</div></div>
                  <p className='font-extralight text-sm -mt-4'>— Cliente </p>
                  <p >"Achei fácil de usar, porém a tela de meus agendamentos é confusa."</p>
                </div>              
                <div className='bg-azul-profundo text-white card-comentarios'>
                  <div className='text-sm gap-4 flex justify-between'> Clarice Souza <div>★★★★☆</div></div>
                  <p className='font-extralight text-sm -mt-4'>— Cliente </p>
                  <p >"Achei fácil de usar, porém a tela de meus agendamentos é confusa."</p>
                </div>              
                <div className='bg-azul-profundo text-white card-comentarios'>
                  <div className='text-sm gap-4 flex justify-between'> Clarice Souza <div>★★★★☆</div></div>
                  <p className='font-extralight text-sm -mt-4'>— Cliente </p>
                  <p >"Achei fácil de usar, porém a tela de meus agendamentos é confusa."</p>
                </div>              
              </div>
            </div>
          </div>
        </main>

      </div>

      <div className='mt-10 h-full w-dvw bg-azul-profundo text-white'>
        <main className='h-full flex items-center justify-center w-1/1 place-self-center'>
          <div className='p-5 justify-center items-center place-self-center flex gap-20'>

            <img src="/imagem_homepage2.png" alt="" className='w-7/12 shadow-xl/20 rounded-2xl'/>

            <div>
              <div className='place-self-start h-max w-110'>
                <div className='flex flex-col gap-15'>
                  <p className='text-3xl text-justify'>
                    Deseja agendar um horário, ou fazer parte de um salão como um profissional?
                  </p>

                  <p className='text-xl mb-1'>
                    Clique logo abaixo e utilize o sistema!
                  </p>
                </div>
              </div>

              <ul className='flex gap-5 overflow-visible items-center z-50'>
                <li className='relative overflow-visible z-50'>
                  <button className={`w-full bg-[#704356] p-3 shadow-lg ${modalProf ? 'rounded-b-none rounded-t-md border border-black/20 ' : 'rounded-md'}`} onClick={() => setModalProf(!modalProf)}>
                    Sou um profissional
                  </button>

                  {modalProf && (
                    <div className='absolute top-full w-full z-50 bg-[#704356] shadow-lg border-[0px_1px_1px_1px] rounded-b-md border-black/20 flex flex-col divide-y divide-black/20'>
                      <Link className='text-center p-3'>
                        Criar o meu salão
                      </Link>

                      <Link className='text-center p-3'>
                        Entrar no sistema
                      </Link>
                    </div>
                  )}
                </li>

                <li>
                  <Link to="/login" className='bg-[#704356] shadow-lg p-3 rounded-md'>
                    Agendar um horário
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default CardAcesso
