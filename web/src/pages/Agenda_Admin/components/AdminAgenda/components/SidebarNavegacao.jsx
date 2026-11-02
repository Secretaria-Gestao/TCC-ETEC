import { useState } from 'react'
import Configuracoes from "@/Configuracoes/Configuracoes.jsx"

// Ícones de navegação entre as seções do painel do admin.
function SidebarNavegacao({ secaoAtiva, setSecaoAtiva }) {
    const [configAberto, setConfigAberto] = useState(false)
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
                    <span className="agenda-admin-nav-emoji">{item.icone}</span>
                    <span className="agenda-admin-nav-nome">{item.titulo}</span>
                </div>
            ))}

            <div
                className="agenda-admin-nav-icone"
                title="Configurações"
                onClick={() => setConfigAberto((aberto) => !aberto)}
            >
                <span className="agenda-admin-nav-emoji">⚙️</span>
                <span className="agenda-admin-nav-nome">Configurações</span>
            </div>

            {configAberto && (
                <Configuracoes perfil="admin" setConfigAberto={setConfigAberto} />
            )}
        </div>
    )
}

export default SidebarNavegacao