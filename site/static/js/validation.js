function validateEmail(email) {
	return /\S+@\S+\.\S+/.test(email);
}

async function mandarDados() {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: form.email().value,
		senha: form.password().value
	}
	)

	if (error) {
		alert('DEU RUIM');
		
	}
	else {
		token = data.session.access_token;
		localStorage.setItem('token', token);

		fetch('/validacaoUser', {
			method: 'post',
			
		} )
	}


}