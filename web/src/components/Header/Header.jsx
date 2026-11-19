function Header({ titulo, subtitulo, children }) {

    return (
        <header className='w-full h-32 items-center flex gap-3 px-4! lg:px-0!'>
            {/* Do lg em diante o botão da página fica absolute e o título cabe no centro; antes disso fica à esquerda, ao lado do botão. */}
            <div className='flex flex-col flex-1 min-w-0 mt-[-25px]! lg:items-center'>
                <h1 className='text-xl sm:text-3xl p-0! text-azul-profundo lg:text-center'>{titulo}</h1>
                <p className='text-ameixa text-sm'>{subtitulo ? subtitulo : "Carregando..."}</p>
            </div>

            {children}

        </header>
    )
}

export default Header
