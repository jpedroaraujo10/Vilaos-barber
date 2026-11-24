// Importação de Módulo ES6
import { CHAVE_TEMA } from "./storage.js";

export function inicializarTema() {
  // Seleção de elemento do DOM com querySelector
  const botao = document.querySelector("#btn-tema");
  const temaSalvo = localStorage.getItem(CHAVE_TEMA);

  if (temaSalvo === "escuro") {
    document.body.classList.add("escuro");
    if (botao) {
      botao.textContent = "Tema Claro";
    }
  }

  if (botao) {
    // Escuta de evento click e alternância de classe CSS com classList.toggle
    botao.addEventListener("click", function () {
      document.body.classList.toggle("escuro");
      const ativo = document.body.classList.contains("escuro");
      localStorage.setItem(CHAVE_TEMA, ativo ? "escuro" : "claro");
      botao.textContent = ativo ? "Tema Claro" : "Tema Escuro";
    });
  }
}