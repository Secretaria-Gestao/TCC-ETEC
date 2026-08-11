// Ícones de navegação entre as seções do painel do admin.
function SidebarNavegacao({ secaoAtiva, setSecaoAtiva }) {
    const itens = [
        { chave: 'agenda', titulo: 'Agenda', icone: '📅' },
        { chave: 'minha-agenda', titulo: 'Minha Agenda', icone: '🗓️' },
        { chave: 'financeiro', titulo: 'Financeiro', icone: '📊' },
        { chave: 'profissionais', titulo: 'Profissionais', icone: '👥' },
    ]

    return (
        <div className="agenda-admin-sidebar">
            <div className="agenda-admin-logo">SALÃO</div>

            {itens.map((item) => (
                <div
                    key={item.chave}
                    className={`agenda-admin-nav-icone${secaoAtiva === item.chave ? ' ativo' : ''}`}
                    title={item.titulo}
                    onClick={() => setSecaoAtiva(item.chave)}
                >
                    {item.icone}
                </div>
            ))}
        </div>
    )
}

export default SidebarNavegacao