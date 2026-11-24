import { SERVICOS, formatarMoeda } from "./dados.js";
import { inicializarTema } from "./tema.js";

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

function inicializarCatalogo() {
  const catalogo = document.querySelector("#catalogo-servicos");
  const inputBusca = document.querySelector("#busca-servico");
  const selectCategoria = document.querySelector("#filtro-categoria");

  // Padrão renderizar() limpando e reconstruindo o DOM
  function renderizar() {
    const termo = inputBusca.value.trim().toLowerCase();
    const categoria = selectCategoria.value;
    let encontrados = 0;

    catalogo.replaceChildren();

    for (const servico of SERVICOS) {
      const bateCategoria = categoria === "todos" || servico.categoria === categoria;
      const bateNome = servico.nome.toLowerCase().indexOf(termo) !== -1;

      if (bateCategoria && bateNome) {
        catalogo.appendChild(criarCardServico(servico));
        encontrados++;
      }
    }

    if (encontrados === 0) {
      const aviso = document.createElement("p");
      aviso.textContent = "Nenhum serviço encontrado para este filtro.";
      catalogo.appendChild(aviso);
    }
  }

  // Escuta de eventos input (digitação) e change (seleção) em tempo real
  inputBusca.addEventListener("input", renderizar);
  selectCategoria.addEventListener("change", renderizar);
  renderizar();
}

document.addEventListener("DOMContentLoaded", function () {
  inicializarTema();
  inicializarCatalogo();
});