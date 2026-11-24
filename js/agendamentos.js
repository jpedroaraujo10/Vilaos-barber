import { formatarMoeda } from "./dados.js";
import { carregar, salvar, CHAVE_AGENDAMENTOS } from "./storage.js";
import { inicializarTema } from "./tema.js";

function formatarDataBR(dataISO) {
  const partes = dataISO.split("-");
  if (partes.length !== 3) {
    return dataISO;
  }
  return partes[2] + "/" + partes[1] + "/" + partes[0];
}

function inicializarTabelaAgendamentos() {
  const tbody = document.querySelector("#corpo-tabela-agendamentos");
  const filtroStatus = document.querySelector("#filtro-status");
  const btnLimparCancelados = document.querySelector("#btn-limpar-cancelados");
  const msgVazia = document.querySelector("#mensagem-vazia");

  // Ciclo carregar -> modificar -> salvar -> renderizar
  function alterarStatus(id, novoStatus) {
    const lista = carregar(CHAVE_AGENDAMENTOS, []);
    for (let i = 0; i < lista.length; i++) {
      if (lista[i].id === id) {
        lista[i].status = novoStatus;
        break;
      }
    }
    salvar(CHAVE_AGENDAMENTOS, lista);
    renderizarTabela();
  }

  function renderizarTabela() {
    const lista = carregar(CHAVE_AGENDAMENTOS, []);
    const statusSelecionado = filtroStatus.value;
    let exibidos = 0;

    tbody.replaceChildren();

    for (let i = 0; i < lista.length; i++) {
      const ag = lista[i];

      if (statusSelecionado !== "todos" && ag.status !== statusSelecionado) {
        continue;
      }

      exibidos++;
      const tr = document.createElement("tr");

      // Estrutura condicional switch para definir a cor do status
      let classeStatus = "";
      switch (ag.status) {
        case "Concluído":
          classeStatus = "status-concluido";
          break;
        case "Cancelado":
          classeStatus = "status-cancelado";
          break;
        default:
          classeStatus = "status-pendente";
      }

      tr.innerHTML = `
        <td><strong>${ag.cliente}</strong><br><small>${ag.telefone}</small></td>
        <td>${ag.servicoNome}</td>
        <td>${ag.profissional}</td>
        <td>${formatarDataBR(ag.data)} às ${ag.hora}</td>
        <td>R$ ${formatarMoeda(ag.valorTotal)}</td>
        <td><span class="status-badge ${classeStatus}">${ag.status}</span></td>
        <td class="celula-acoes"></td>
      `;

      const celulaAcoes = tr.querySelector(".celula-acoes");

      // Criação dinâmica de botões e escuta de eventos click no DOM
      if (ag.status === "Pendente") {
        const btnConcluir = document.createElement("button");
        btnConcluir.type = "button";
        btnConcluir.textContent = "Concluir";
        btnConcluir.classList.add("btn-acao", "btn-concluir");
        btnConcluir.addEventListener("click", function () {
          alterarStatus(ag.id, "Concluído");
        });

        const btnCancelar = document.createElement("button");
        btnCancelar.type = "button";
        btnCancelar.textContent = "Cancelar";
        btnCancelar.classList.add("btn-acao", "btn-cancelar");
        btnCancelar.addEventListener("click", function () {
          alterarStatus(ag.id, "Cancelado");
        });

        celulaAcoes.appendChild(btnConcluir);
        celulaAcoes.appendChild(btnCancelar);
      } else {
        celulaAcoes.textContent = "Finalizado";
      }

      tbody.appendChild(tr);
    }

    if (exibidos === 0) {
      msgVazia.classList.remove("oculto");
    } else {
      msgVazia.classList.add("oculto");
    }
  }

  filtroStatus.addEventListener("change", renderizarTabela);

  btnLimparCancelados.addEventListener("click", function () {
    const lista = carregar(CHAVE_AGENDAMENTOS, []);
    const ativos = [];

    for (let i = 0; i < lista.length; i++) {
      if (lista[i].status !== "Cancelado") {
        ativos.push(lista[i]);
      }
    }

    salvar(CHAVE_AGENDAMENTOS, ativos);
    renderizarTabela();
  });

  renderizarTabela();
}

document.addEventListener("DOMContentLoaded", function () {
  inicializarTema();
  inicializarTabelaAgendamentos();
});