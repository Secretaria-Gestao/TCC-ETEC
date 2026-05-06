function validateEmail(email) {
	return /\S+@\S+\.\S+/.test(email);
}

async function login_EmailPassword(event) {
	event.preventDefault()
	const { data, error } = await supabaseClient.auth.signInWithPassword( {
		email: form.email().value,
		password: form.password().value,
	})

	if (error) {
		alert('Erro ao tentar logar');
	}
	
	else {
		window.location.href ='/agendamento';
	}

}

async function signUp_EmailPassword(event) {
	event.preventDefault()
	const { data, error } = await supabaseClient.auth.signUp( {
		email: form.email().value,
		password: form.password().value,
	})

	if (error) {
		alert('Erro ao tentar logar');
	}
	else {
		await login_EmailPassword();
	}

}
