import { pegarSessao } from '../../../services/pegarSessao.js';
import { supabase } from '../../../services/SupabaseConfig.js';
import notificarErro from './NotificacaoCadastro.js';

// comGoogle: a conta já foi criada no Supabase Auth pelo login com Google,
// então só falta salvar o perfil na tabela "clientes" (nome vem da conta do Google).
export async function cadastrarCliente(nome, email, senha, comGoogle = false) {
    try {
        // Primeiro cria o usuario no Supabase Auth; depois salva o perfil no backend.
        if (!comGoogle) {
            const { error } = await supabase.auth.signUp({
                email: email,
                password: senha
            });

            if (error) {
                notificarErro()
                return false
            }
        }

        const sessao = await pegarSessao()

        if (comGoogle) {
            if (!sessao) return false
            const usuario = sessao.user
            nome = usuario.user_metadata?.full_name || usuario.email.split("@")[0]
        }

        // Mantem a tabela "clientes" sincronizada com o usuario criado no Auth.
        const resposta = await fetch('/api/cadastro/cliente', {
            method: 'post',

            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessao?.access_token || ''}`
            },

            // O id e o e-mail do cliente vêm do token no back-end; aqui só vai o nome.
            body: JSON.stringify({
                nome_cliente: nome
            })
        })

        // Pelo Google, "conta já existe" (409) quer dizer que o perfil já foi criado: segue normalmente
        if (comGoogle && resposta.status === 409) return true

        if (!resposta.ok) {
            const resultado = await resposta.json().catch(() => ({}))
            notificarErro(resultado.erro)
            return false
        }

        return true
    } catch (erro) {
        console.error("Erro ao cadastrar cliente:", erro)
        notificarErro("Não foi possível concluir o cadastro. Tente novamente mais tarde")
        return false
    }
}
