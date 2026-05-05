function validateEmail(email) {
	return /\S+@\S+\.\S+/.test(email);
}

async function linkMagico() {
	const { data, error } = await supabaseClient.auth.signInWithOtp( {
		email: form.email().value,
		options: {
			emailRedirectTo: '/agendamento',
		},
	})

	if (error) {
		alert('Erro ao tentar logar');
	}
	else {
		alert('Email valido! Cheque sua caixa de email.')
	}

}