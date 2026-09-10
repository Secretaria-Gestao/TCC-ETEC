export const menuAdmin = [
    {
        "to": "/",
        "titulo": "Página principal",
        "icone": () => (
            <svg xmlns="http://w3.org" viewBox="0 0 100 100" width="24" height="24" className='shrink-0 ml-[-2.5px]'>
                <g fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="50,15 15,45 85,45" />
                    <rect x="23" y="45" width="54" height="40" />
                    <rect x="42" y="60" width="16" height="25" />
                </g>
            </svg>
        )
    },
    {
        "to": "/cadastro/colaborador",
        "titulo": "Cadastro de profissionais",
        "icone": () => (
            <svg
                className="w-5 h-5 shrink-0"
                viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.75"
                strokeLinecap="round" strokeLinejoin="round"
            >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <line x1="19" y1="8" x2="19" y2="14" />
                <line x1="16" y1="11" x2="22" y2="11" />
            </svg>
        )
    },
    {
        "to": "/admin/gerenciador-servicos",
        "titulo": "Serviços fornecidos",
        "icone": () => (
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <line x1="20" y1="4" x2="8.12" y2="15.88" />
                <line x1="14.47" y1="14.48" x2="20" y2="20" />
                <line x1="8.12" y1="8.12" x2="12" y2="12" />
            </svg>

        )
    },
    {
        "to": "/admin/gerenciador-profissionais",
        "titulo": "Profissionais cadastrados",
        "icone": () => (
            <svg
                className="w-5 h-5 shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        )
    },
]

export const menuCliente = [
    {
        "to": "/agendamento",
        "titulo": "Novo horário",
        "icone": () => (
            <svg
                className="w-[23px] h-[23px] ml-0.5 -mr-0.5 shrink-0"
                viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.75"
                strokeLinecap="round" strokeLinejoin="round"
            >
                <rect x="2" y="4" width="17" height="17" rx="2" />
                <line x1="14.5" y1="2" x2="14.5" y2="6" />
                <line x1="6.5" y1="2" x2="6.5" y2="6" />
                <line x1="2" y1="9.5" x2="19" y2="9.5" />
                <circle cx="18" cy="18" r="4.5" fill="#1e293b" stroke="currentColor" strokeWidth="1.5" />
                <line x1="18" y1="16.3" x2="18" y2="19.7" />
                <line x1="16.3" y1="18" x2="19.7" y2="18" />
            </svg>
        )
    },
    {
        "to": "/agendamento/meus-agendamentos",
        "titulo": "Agenda",
        "icone": () => (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-calendar-event ml-0.5" viewBox="0 0 16 16">
                <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
            </svg>
        )
    },
    {
        "to": "/historico",
        "titulo": "Histórico",
        "icone": () => (
            <svg
                className="w-5.5 h-5.5 shrink-0"
                viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.75"
                strokeLinecap="round" strokeLinejoin="round"
            >
                <path d="M3 12a9 9 0 1 0 3-6.7" />
                <polyline points="3 3 3 8 8 8" />
                <line x1="12" y1="7" x2="12" y2="12" />
                <line x1="12" y1="12" x2="15.5" y2="14" />
            </svg>
        )
    },
]