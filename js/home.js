import { SERVICOS, formatarMoeda } from "./dados.js";
import { carregar, CHAVE_AGENDAMENTOS } from "./storage.js";
import { inicializarTema } from "./tema.js";

// Criação dinâmica de elementos no DOM com createElement
function criarCardServico(servico) {
  const card = document.createElement("article");
  card.classList.add("card");

  card.innerHTML = `
    <span class="badge-categoria">${servico.categoria}</span>
    <h3>${servico.nome}</h3>
    <p>${servico.descricao}</p>
    <p class="preco-card">R$ ${formatarMoeda(servico.preco)} (${servico.duracao} min)</p>
    <a href="agendar.html" class="btn-primario">Agendar</a>
  `;

  return card;
}

function inicializarHome() {
  const agendamentos = carregar(CHAVE_AGENDAMENTOS, []);
  let pendentes = 0;
  let concluidos = 0;

  // Laço for tradicional e estrutura condicional if/else
  for (let i = 0; i < agendamentos.length; i++) {
    if (agendamentos[i].status === "Pendente") {
      pendentes++;
    } else if (agendamentos[i].status === "Concluído") {
      concluidos++;
    }
  }

  // Atualização de conteúdo de texto no DOM com textContent
  document.querySelector("#total-agendamentos").textContent = agendamentos.length;
  document.querySelector("#total-pendentes").textContent = pendentes;
  document.querySelector("#total-concluidos").textContent = concluidos;

  const container = document.querySelector("#lista-destaques");
  container.replaceChildren();

  // Iteração de vetor com laço for...of e inserção com appendChild
  for (const servico of SERVICOS) {
    if (servico.destaque) {
      container.appendChild(criarCardServico(servico));
    }
  }
}

// Evento DOMContentLoaded para garantir que o HTML carregou
document.addEventListener("DOMContentLoaded", function () {
  inicializarTema();
  inicializarHome();
});