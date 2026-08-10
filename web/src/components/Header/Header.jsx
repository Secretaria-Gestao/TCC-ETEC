function Header({ titulo, subtitulo, children }) {

    return (
        <header className='w-full h-32 items-center flex'>
            <div className='flex flex-col items-center flex-1 mt-[-25px]!'>
                <h1 className='text-3xl p-0!'>{titulo}</h1>
                <p>{subtitulo ? subtitulo : "Carregando..."}</p>
            </div>

            {children}

        </header>
    )
}

export default Header
