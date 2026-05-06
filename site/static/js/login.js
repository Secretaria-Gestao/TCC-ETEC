const btn_cadastrar = document.getElementById('cadastrar');
const cadastrando =document.getElementById('cadastrando');
const logando =document.getElementById('logando');
const btn_entrar_conta = document.getElementById('btn_entrar_conta');

btn_cadastrar.textContent = 'Cadastrar-se';

btn_cadastrar.addEventListener('click', () => {
    cadastrando.classList.toggle('oculto');
    logando.classList.toggle('oculto');

    if (logando.classList.contains('oculto')) {
        form.loginButton().onclick = signUp_EmailPassword;
        btn_cadastrar.textContent = 'Entrar na conta';
    }
    else {
        form.loginButton().onclick = login_EmailPassword;
        btn_cadastrar.textContent = 'Cadastrar-se';
    }

} )

function onChangeEmail() {
    toggleBottonsDisable();
    toggleEmailErrors();
}

function onChangePassaword() {
    toggleBottonsDisable();
    togglePasswordErrors();
}

function isEmailValid() {
    const email = form.email().value;
    if (!email) {
        return false;
    }
    return validateEmail(email);
}

function toggleEmailErrors() {
    const email = form.email().value;
    form.emailRequiredError().style.display = email ? "none" : "block";
    form.emailInvalidError().style.display =
        email && !validateEmail(email) ? "block" : "none";
}        

function togglePasswordErrors() {
    const password = form.password().value;
    form.passwordRequiredError().style.display = password ? "none" : "block";
}

function toggleBottonsDisable() {
    const emailValid = isEmailValid();
    form.recoverPassword().disabled = !emailValid;

    const passwordValid = isPasswordValid();
    form.loginButton().disabled = !emailValid || !passwordValid;
}

function isPasswordValid() {
    const password = form.password().value;
    if (!password) {
        return false;
    }
    return true;
}

const form = {
    email: () => document.getElementById("email"),
    emailRequiredError: () => document.getElementById("email-required-error"),
    emailInvalidError: () => document.getElementById("email-invalid-error"),
    
    loginButton: () => document.getElementById("login-button"),
    
    password: () => document.getElementById("password"),
    passwordRequiredError: () => document.getElementById("password-required-error"),
    recoverPassword: () => document.getElementById("recover-password-button"),
}