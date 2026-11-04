// Abas que trocam a seção do painel do salão.
// A navegação entre páginas (inclusive "Minha agenda") fica na BarraLateral.
const SECOES = [
    { chave: 'agenda', titulo: 'Agenda' },
    { chave: 'financeiro', titulo: 'Financeiro' },
    { chave: 'profissionais', titulo: 'Profissionais' },
]

function AbasSecoes({ secaoAtiva, setSecaoAtiva }) {
    return (
        <div className="agenda-admin-abas" role="tablist">
            {SECOES.map((secao) => (
                <button
                    key={secao.chave}
                    type="button"
                    role="tab"
                    aria-selected={secaoAtiva === secao.chave}
                    className={`agenda-admin-aba${secaoAtiva === secao.chave ? ' ativa' : ''}`}
                    onClick={() => setSecaoAtiva(secao.chave)}
                >
                    {secao.titulo}
                </button>
            ))}
        </div>
    )
}

export default AbasSecoes
