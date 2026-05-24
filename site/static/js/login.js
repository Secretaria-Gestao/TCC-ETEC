import { logar, cadastrar, validateEmail } from "./validation.js";

// Validacoes acionadas pelos inputs para liberar/desabilitar botoes em tempo real.
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

form.loginButton().onclick = logar;
// Expondo funcoes usadas pelos atributos onchange/onclick do HTML.
window.onChangeEmail = onChangeEmail;
window.onChangePassaword = onChangePassaword;
window.logar = logar;
window.cadastrar = cadastrar;

logando.btn_cadastrar().addEventListener('click', () => {
    // Alterna entre os modos "Entrar" e "Cadastrar" usando o mesmo formulario.
    logando.lblNome().classList.toggle('oculto')
    if (logando.btn_cadastrar().textContent == "Entrar na conta") {
        logando.btn_cadastrar().textContent = "Cadastrar-se";
        logando.msg_logando().textContent = "Entrar na conta";
        form.loginButton().onclick = logar;

    }
    else {
        logando.btn_cadastrar().textContent = "Entrar na conta";
        logando.msg_logando().textContent = "Cadastrar";
        form.loginButton().onclick = cadastrar;
    }
    window.logar = logar;
    window.cadastrar = cadastrar;
})
