function validateEmail(email) {
	return /\S+@\S+\.\S+/.test(email);
}

async function login_EmailPassword(event) {
	event.preventDefault()
	const { data, error } = await supabaseClient.auth.signInWithPassword( {
		email: form.email().value,
		password: form.password().value,
	})

	const user = localStorage.getItem("acess_token");
	
	if (error) {
		alert('Erro ao tentar logar');
	}
	
	fetch('/validacaoUser', {
		method: 'POST',
		headers: 
	})
}


console.log("receba", user);


async function signUp_EmailPassword(event) {
	event.preventDefault()
	const { data, error } = await supabaseClient.auth.signUp( {
		email: form.email().value,
		password: form.password().value,
	})
	
	console.log(error);
	if (error) {
		alert('Erro ao tentar cadastrar');
	}
}
