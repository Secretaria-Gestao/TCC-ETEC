function validateEmail(email) {
	return /\S+@\S+\.\S+/.test(email);
}

async function mandarDados() {

	event.preventDefault;

	const { data, error } = await supabase.auth.signInWithPassword({
		email: form.email().value,
		password: form.password().value,
	}
	)

	console.log('tá indo');

	if (error) {
		alert('DEU RUIM');
		return;
		console.log('deu errado');
	}

	else {
		const token = data.session.access_token;
		localStorage.setItem('token', token);
		console.log('deu certo')
		window.location.replace('/agendamento');
	}

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
}