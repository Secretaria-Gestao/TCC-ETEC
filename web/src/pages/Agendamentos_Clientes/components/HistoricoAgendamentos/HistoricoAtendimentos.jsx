import './HistoricoAtendimentos.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { supabase } from '../../../../services/SupabaseConfig.js';
import {buscarHistorico} from '../../../../services/BuscarHistorico.js';

function HistoricoAtendimentos() {
    const [historico, setHistorico] = useState([])
    const [carregando, setCarregando] = useState(true)

    const navegar = useNavigate()

    async function sair() {
        await supabase.auth.signOut()
        window.location.replace('/login')
    }

    useEffect(() => {
        buscarHistorico().then(dados => {
            setHistorico(dados)
            setCarregando(false)
        })
    }, [])

    const formatarData = (iso) =>
        new Date(iso).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })

    const formatarPreco = (valor) =>
        valor == null ? '—' : Number(valor).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

    if (carregando) return <p className="historico-atendimentos-aviso">Carregando...</p>

    return (
    <div className="historico-atendimentos-janela">

        <div className="historico-atendimentos-sidebar">
            <div className="historico-atendimentos-logo">SALÃO</div>
            <div className="historico-atendimentos-nav-icone" title="Agenda"
                onClick={() => navegar('/agendamento/meus-agendamentos')}>📅</div>
            <div className="historico-atendimentos-nav-icone ativo" title="Histórico de atendimentos">📊</div>
            <div className="historico-atendimentos-sidebar-rodape">
                <button className="historico-atendimentos-btn-sair" onClick={sair}>Sair</button>
            </div>
        </div>

        <div className="historico-atendimentos-conteudo">
            <h2 className="historico-atendimentos-titulo">Histórico de atendimentos</h2>

            {carregando ? (
                <p className="historico-atendimentos-aviso">Carregando...</p>
            ) : historico.length === 0 ? (
                <p className="historico-atendimentos-aviso">
                    Você ainda não tem atendimentos concluídos.
                </p>
            ) : (
                <ul className="historico-atendimentos-lista">
                    {historico.map(item => (
                        <li key={item.id_agendamento} className="historico-atendimentos-card">
                            <strong>{formatarData(item.horario)}</strong>
                            <span>{item.servicos.length ? item.servicos.join(', ') : 'Serviço não informado'}</span>
                            <span>Profissional: {item.profissional ?? '—'}</span>
                            <span className="historico-atendimentos-preco">{formatarPreco(item.preco)}</span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    </div>
  )
}
export default HistoricoAtendimentos