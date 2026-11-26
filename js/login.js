import { inicializarTema } from "./tema.js";
import {
  listarUsuarios,
  salvarUsuario,
  definirUsuarioLogado,
  obterUsuarioLogado
} from "./storage.js";

inicializarTema();
const formLogin = document.getElementById("form-login");
const formCadastro = document.getElementById("form-cadastro");
const feedbackLogin = document.getElementById("feedback-login");
const feedbackCadastro = document.getElementById("feedback-cadastro");

// Se já estiver logado, avisa no topo
const usuarioAtual = obterUsuarioLogado();
if (usuarioAtual) {
  feedbackLogin.textContent = `Você já está conectado como ${usuarioAtual.nome} (${usuarioAtual.tipo}).`;
  feedbackLogin.className = "feedback sucesso";
}

// Evento de Login
formLogin.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const email = document.getElementById("login-email").value.trim().toLowerCase();
  const senha = document.getElementById("login-senha").value.trim();

  // 1. Verifica credencial fixa de Administrador
  if (email === "admin@vilaos.com" && senha === "123456") {
    definirUsuarioLogado({
      nome: "Administrador",
      email: "admin@vilaos.com",
      tipo: "admin"
    });
    window.location.href = "agendamentos.html";
    return;
  }

  // 2. Procura nos clientes cadastrados no localStorage
  const usuarios = listarUsuarios();
  const encontrado = usuarios.find(
    (u) => u.email.toLowerCase() === email && u.senha === senha
  );

  if (encontrado) {
    definirUsuarioLogado({
      nome: encontrado.nome,
      email: encontrado.email,
      tipo: "cliente"
    });
    window.location.href = "agendar.html";
  } else {
    feedbackLogin.textContent = "E-mail ou senha inválidos.";
    feedbackLogin.className = "feedback falha";
  }
});

// Evento de Cadastro de Cliente
formCadastro.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const nome = document.getElementById("cad-nome").value.trim();
  const email = document.getElementById("cad-email").value.trim().toLowerCase();
  const senha = document.getElementById("cad-senha").value.trim();

  if (nome.length < 3 || !email.includes("@") || senha.length < 4) {
    feedbackCadastro.textContent = "Preencha nome válido, e-mail e senha (mín. 4 caracteres).";
    feedbackCadastro.className = "feedback falha";
    return;
  }

  if (email === "admin@vilaos.com") {
    feedbackCadastro.textContent = "Este e-mail é reservado para a administração.";
    feedbackCadastro.className = "feedback falha";
    return;
  }

  const usuarios = listarUsuarios();
  const jaExiste = usuarios.some((u) => u.email.toLowerCase() === email);

  if (jaExiste) {
    feedbackCadastro.textContent = "Este e-mail já está cadastrado. Faça login ao lado.";
    feedbackCadastro.className = "feedback falha";
    return;
  }

  salvarUsuario({ nome, email, senha, tipo: "cliente" });
  feedbackCadastro.textContent = "Conta criada com sucesso! Já pode entrar ao lado.";
  feedbackCadastro.className = "feedback sucesso";
  formCadastro.reset();
});