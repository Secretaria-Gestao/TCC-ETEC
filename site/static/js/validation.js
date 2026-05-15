function validateEmail(email) {
	return /\S+@\S+\.\S+/.test(email);
}

async function mandarDados() {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email().value,
		password: form.password().value
	}
	)

	if (error) {
		alert('DEU RUIM');
		return;
	}
	
	const token = data.session.access_token;
	localStorage.setItem('token', token);

	try{
		const response = await fetch('/validacaoUser', {
			method: 'post',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${token}`
			},
			body: JSON.stringify({ email: form.email().value })
    	});

		if (!response.ok) {
  			alert('Erro na validação');
			return;
		}
	}
	catch (try) {
    	alert('Erro na !@$%*&¢ da validação' + try.message);
	}
}