function FiltroProfissional({ filtroProfissional, setFiltroProfissional, nomesUnicos }) {
    return (
        <div className="agenda-admin-filtro">
            <p className="agenda-admin-titulo-secao">Filtrar por profissional</p>
            <select value={filtroProfissional} onChange={(e) => setFiltroProfissional(e.target.value)}>
                <option value="">Todos</option>
                {nomesUnicos.map((nome) => (
                    <option key={nome} value={nome}>{nome}</option>
                ))}
            </select>
        </div>
    )
}

export default FiltroProfissional