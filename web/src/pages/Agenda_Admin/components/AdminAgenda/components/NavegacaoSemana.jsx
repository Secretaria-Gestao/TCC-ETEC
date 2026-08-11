function NavegacaoSemana({ tituloSemana, mudarSemana }) {
    return (
        <div className="agenda-admin-navegacao-semana">
            <button onClick={() => mudarSemana(-1)}>‹</button>
            <span>{tituloSemana}</span>
            <button onClick={() => mudarSemana(1)}>›</button>
        </div>
    )
}

export default NavegacaoSemana