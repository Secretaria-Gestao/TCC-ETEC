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

let numero = 1;
// console.log(logarCadastrar);

logando.btn_cadastrar().addEventListener('click', () => {
    // console.log(logarCadastrar);

    // Alterna entre os modos "Entrar" e "Cadastrar" usando o mesmo formulario.
    logando.lblNome().classList.toggle('oculto');
    form.recoverPassword().classList.toggle('oculto');

    if (numero % 2 == 0) {
        console.log("par")
        logando.btn_cadastrar().textContent = "Cadastrar-se";
        logando.msg_logando().textContent = "Entrar na conta";
        form.loginButton().onclick = logar;
        form.loginButton().textContent = "Entrar";
    }
    else {
        console.log("impar")
        logando.btn_cadastrar().textContent = "Já tenho uma conta";
        logando.msg_logando().textContent = "Cadastrar-se";
        form.loginButton().onclick = cadastrar;
        form.loginButton().textContent = "  Criar conta";
    }

    numero += 1

})
