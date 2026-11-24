import { SERVICOS, buscarServicoPorId, calcularValores, formatarMoeda } from "./dados.js";
import { carregar, salvar, CHAVE_AGENDAMENTOS } from "./storage.js";
import { inicializarTema } from "./tema.js";

// Classe de erro personalizada herdando de Error
class ErroDeValidacao extends Error {
  constructor(campo, mensagem) {
    super(mensagem);
    this.name = "ErroDeValidacao";
    this.campo = campo;
  }
}

// Funções puras de validação retornando "" ou mensagem de erro
function validarNome(valor) {
  return valor.trim().length >= 3 ? "" : "Mínimo de 3 letras.";
}

function validarTelefone(valor) {
  const regexTelefone = /^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/;
  return regexTelefone.test(valor.trim()) ? "" : "Telefone inválido. Ex: (62) 99999-9999";
}

function validarObrigatorio(valor) {
  return valor !== "" ? "" : "Selecione uma opção.";
}

function validarData(valor, hojeISO) {
  if (valor === "") {
    return "Escolha uma data.";
  }
  if (valor < hojeISO) {
    return "A data não pode ser anterior a hoje.";
  }
  return "";
}

// Manipulação de classes CSS (.valido / .invalido) via classList.toggle
function mostrarErro(campo, mensagem) {
  document.querySelector("#erro-" + campo.id).textContent = mensagem;
  campo.classList.toggle("invalido", mensagem !== "");
  campo.classList.toggle("valido", mensagem === "");
  return mensagem;
}

function inicializarFormulario() {
  const form = document.querySelector("#form-agendamento");
  const inputNome = document.querySelector("#cliente-nome");
  const inputTelefone = document.querySelector("#cliente-telefone");
  const selectServico = document.querySelector("#select-servico");
  const selectProfissional = document.querySelector("#select-profissional");
  const inputData = document.querySelector("#data-agendamento");
  const selectHora = document.querySelector("#hora-agendamento");
  const checkFidelidade = document.querySelector("#cliente-fidelidade");
  const feedback = document.querySelector("#feedback-formulario");

  // Criação dinâmica de elementos <option> no DOM
  const opcaoInicial = document.createElement("option");
  opcaoInicial.value = "";
  opcaoInicial.textContent = "Selecione um serviço";
  selectServico.appendChild(opcaoInicial);

  for (const s of SERVICOS) {
    const opt = document.createElement("option");
    opt.value = s.id;
    opt.textContent = s.nome + " - R$ " + formatarMoeda(s.preco);
    selectServico.appendChild(opt);
  }

  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = String(hoje.getMonth() + 1).padStart(2, "0");
  const dia = String(hoje.getDate()).padStart(2, "0");
  const hojeISO = ano + "-" + mes + "-" + dia;
  inputData.min = hojeISO;

  function atualizarResumo() {
    const servico = buscarServicoPorId(selectServico.value);
    const elNome = document.querySelector("#resumo-nome-servico");
    const elDuracao = document.querySelector("#resumo-duracao");
    const elSub = document.querySelector("#resumo-subtotal");
    const elDesc = document.querySelector("#resumo-desconto");
    const elTotal = document.querySelector("#resumo-total");

    if (servico === null) {
      elNome.textContent = "Selecione um serviço";
      elDuracao.textContent = "-";
      elSub.textContent = "0,00";
      elDesc.textContent = "0,00";
      elTotal.textContent = "0,00";
      return;
    }

    const valores = calcularValores(servico.preco, checkFidelidade.checked);
    elNome.textContent = servico.nome;
    elDuracao.textContent = servico.duracao + " minutos";
    elSub.textContent = formatarMoeda(valores.subtotal);
    elDesc.textContent = formatarMoeda(valores.desconto);
    elTotal.textContent = formatarMoeda(valores.total);
  }

  selectServico.addEventListener("change", atualizarResumo);
  checkFidelidade.addEventListener("change", atualizarResumo);

  // Validação em tempo real com eventos blur, input e change
  inputNome.addEventListener("blur", function () {
    mostrarErro(inputNome, validarNome(inputNome.value));
  });
  inputNome.addEventListener("input", function () {
    mostrarErro(inputNome, validarNome(inputNome.value));
  });
  inputTelefone.addEventListener("blur", function () {
    mostrarErro(inputTelefone, validarTelefone(inputTelefone.value));
  });
  selectServico.addEventListener("change", function () {
    mostrarErro(selectServico, validarObrigatorio(selectServico.value));
  });
  selectProfissional.addEventListener("change", function () {
    mostrarErro(selectProfissional, validarObrigatorio(selectProfissional.value));
  });
  inputData.addEventListener("change", function () {
    mostrarErro(inputData, validarData(inputData.value, hojeISO));
  });
  selectHora.addEventListener("change", function () {
    mostrarErro(selectHora, validarObrigatorio(selectHora.value));
  });

  // Interceptação de submit com preventDefault() e tratamento de erro com try/catch/throw
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    feedback.textContent = "";
    feedback.className = "feedback";

    try {
      const campos = [inputNome, inputTelefone, selectServico, selectProfissional, inputData, selectHora];
      const erros = [
        mostrarErro(inputNome, validarNome(inputNome.value)),
        mostrarErro(inputTelefone, validarTelefone(inputTelefone.value)),
        mostrarErro(selectServico, validarObrigatorio(selectServico.value)),
        mostrarErro(selectProfissional, validarObrigatorio(selectProfissional.value)),
        mostrarErro(inputData, validarData(inputData.value, hojeISO)),
        mostrarErro(selectHora, validarObrigatorio(selectHora.value))
      ];

      for (let i = 0; i < erros.length; i++) {
        if (erros[i] !== "") {
          throw new ErroDeValidacao(campos[i], "Corrija os campos destacados.");
        }
      }

      const listaAtual = carregar(CHAVE_AGENDAMENTOS, []);

      // Laço for tradicional para impedir conflito de horário do mesmo barbeiro
      for (let i = 0; i < listaAtual.length; i++) {
        const item = listaAtual[i];
        if (
          item.status !== "Cancelado" &&
          item.profissional === selectProfissional.value &&
          item.data === inputData.value &&
          item.hora === selectHora.value
        ) {
          throw new ErroDeValidacao(
            selectHora,
            "Este barbeiro já possui agendamento neste dia e horário."
          );
        }
      }

      const servicoEscolhido = buscarServicoPorId(selectServico.value);
      const valores = calcularValores(servicoEscolhido.preco, checkFidelidade.checked);

      // Criação de objeto literal e persistência no localStorage
      const novoAgendamento = {
        id: Date.now(),
        cliente: inputNome.value.trim(),
        telefone: inputTelefone.value.trim(),
        servicoNome: servicoEscolhido.nome,
        profissional: selectProfissional.value,
        data: inputData.value,
        hora: selectHora.value,
        valorTotal: valores.total,
        status: "Pendente"
      };

      listaAtual.push(novoAgendamento);
      salvar(CHAVE_AGENDAMENTOS, listaAtual);

      feedback.textContent = "Agendamento confirmado com sucesso!";
      feedback.classList.add("sucesso");
      form.reset();

      for (let i = 0; i < campos.length; i++) {
        campos[i].classList.remove("valido", "invalido");
      }
      atualizarResumo();
    } catch (err) {
      feedback.textContent = err.message;
      feedback.classList.add("falha");
      if (err instanceof ErroDeValidacao) {
        err.campo.focus();
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", function () {
  inicializarTema();
  inicializarFormulario();
});