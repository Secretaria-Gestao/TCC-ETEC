function validateEmail(email) {
	return /\S+@\S+\.\S+/.test(email);
}

import { supabase } from './SupabaseConfig.js';
import { form } from './login.js';

export async function cadastrar() {
	event.preventDefault();

	const { data, error } = await supabase.auth.signUp({
		email: form.email().value,
		password: form.password().value,
	}
	);

	if (error) {
		alert('DEU RUIM CADASTRO');
	}

	else {
		await fetch('/cadastroUser', {
			method: 'post',

			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${data.access_token}`
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

export async function logar() {
	event.preventDefault;

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

export const tokenUser =  JSON.parse(localStorage.getItem('sb-qtgubbbrntnltrpyywqx-auth-token'))

window.cadastrar = cadastrar;
window.logar = logar;


// try {
// 	const response = await fetch('/validacaoUser', {
// 		method: 'post',
// 		headers: {
// 			'Content-Type': 'application/json',
// 			'Authorization': `Bearer ${token}`
// 		},
// 		body: JSON.stringify({ email: form.email().value })
// 	});

// 	if (!response.ok) {
// 		alert('Erro na validação');
// 		return;
// 	}
// }
// catch (try) {
// 	alert('Erro na !@$%*&¢ da validação' + try.message);
// }
// }