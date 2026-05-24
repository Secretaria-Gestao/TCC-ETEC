export function validateEmail(email) {
	return /\S+@\S+\.\S+/.test(email);
}

import { supabase } from './SupabaseConfig.js';
import { form } from './login.js';

export async function cadastrar(event) {
	// Primeiro cria o usuario no Supabase Auth; depois salva o perfil no backend.
	event?.preventDefault();

	const { data, error } = await supabase.auth.signUp({
		email: form.email().value,
		password: form.password().value,
	}
	);

	if (error) {
		alert('DEU RUIM CADASTRO');
	}

	else {
		// Mantem a tabela "clientes" sincronizada com o usuario criado no Auth.
		await fetch('/cadastroUser', {
			method: 'post',

			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${data.session?.access_token || ''}`
			},

			body: JSON.stringify({
				id_cliente: data.user.id,
				nome_cliente: form.nome().value,
				email_cliente: form.email().value
			})
		})
		window.location.replace('/agendamento');
	}
}

export async function logar(event) {
	// Login direto no Supabase Auth; em caso de sucesso o usuario segue para agendar.
	event?.preventDefault();

	const { data, error } = await supabase.auth.signInWithPassword({
		email: form.email().value,
		password: form.password().value
	}
	);

	if (error) {
		alert('DEU RUIM LOGIN');
		return;
		console.log('deu errado');
	}

	else {
		console.log('deu certo');
		window.location.replace('/agendamento');
	}
}

// Token reutilizavel para fluxos que precisarem saber quem esta logado.
export const tokenUser =  JSON.parse(localStorage.getItem('sb-qtgubbbrntnltrpyywqx-auth-token'))

window.cadastrar = cadastrar;
window.logar = logar;
