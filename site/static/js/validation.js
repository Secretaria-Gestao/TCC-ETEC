function validateEmail(email) {
	return /\S+@\S+\.\S+/.test(email);
}

async function login_EmailPassword(event) {
	event.preventDefault()
	const { data, error } = await supabaseClient.auth.signInWithPassword({
		email: form.email().value,
		password: form.password().value,
	})

	const token = data.session.access_token;

	if (error) {
		alert('Erro ao tentar logar');
	}
	else {
		fetch('/validacaoUser', {
			method: 'POST',
			headers: {
				'Authorization': 'Bearer ' + token,
				'Content-Type': 'application/json'
			} 
		})
	}

}

async function signUp_EmailPassword(event) {
	event.preventDefault()
	const { data, error } = await supabaseClient.auth.signUp({
		email: form.email().value,
		password: form.password().value,
	})

	console.log(error);
	if (error) {
		alert('Erro ao tentar cadastrar');
	}
}
