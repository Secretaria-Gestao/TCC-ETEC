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

export const form = {
    // Centraliza os seletores da tela para evitar espalhar getElementById pelo arquivo.
    nome: () => document.getElementById('userName'),
    email: () => document.getElementById("email"),
    telefone: () => document.getElementById('telefone'),
    cargo: () => document.getElementById('cargo') ,
    salao_associado: () => document.getElementById('salao_associado'),
    emailRequiredError: () => document.getElementById("email-required-error"),
    emailInvalidError: () => document.getElementById("email-invalid-error"),

    loginButton: () => document.getElementById("login-button"),

    password: () => document.getElementById("password"),
    passwordRequiredError: () => document.getElementById("password-required-error"),
    recoverPassword: () => document.getElementById("recover-password-button"),
}

const logando = {
    btn_cadastrar: () => document.getElementById('btn_cadastrar'),
    msg_logando: () => document.getElementById('logando'),
    lblNome: () => document.getElementById('lblNome')
}
