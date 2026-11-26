// Importação de Módulo ES6
import { CHAVE_TEMA, obterUsuarioLogado, sairUsuario } from "./storage.js";

export function inicializarTema() {
  // Seleção de elemento do DOM com querySelector
  const botao = document.querySelector("#btn-tema");
  const linkAuth = document.getElementById("link-auth");
  const usuario = obterUsuarioLogado();

  // Atualiza o link Entrar / Sair no menu lateral
  if (linkAuth && usuario) {
    linkAuth.textContent = `Sair (${usuario.nome.split(" ")[0]})`;
    linkAuth.href = "#";
    linkAuth.addEventListener("click", function (evento) {
      evento.preventDefault();
      sairUsuario();
      window.location.href = "login.html";
    });
  }

  function atualizarTextoBotao(escuroAtivo) {
    if (!botao) return;
    botao.textContent = escuroAtivo ? "☀️ Claro" : "🌙 Escuro";
  }

  const temaSalvo = localStorage.getItem(CHAVE_TEMA);
  const comecaEscuro = temaSalvo === "escuro";

  if (comecaEscuro) {
    document.body.classList.add("escuro");
  }
  atualizarTextoBotao(comecaEscuro);

  if (botao) {
    // Escuta de evento click e alternância de classe CSS com classList.toggle
    botao.addEventListener("click", function () {
      document.body.classList.toggle("escuro");
      const ativo = document.body.classList.contains("escuro");
      localStorage.setItem(CHAVE_TEMA, ativo ? "escuro" : "claro");
      atualizarTextoBotao(ativo);
    });
  }
}