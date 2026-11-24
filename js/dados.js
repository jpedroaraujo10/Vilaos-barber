// Exportação de Módulo ES6 + Vetor de Objetos
export const SERVICOS = [
  {
    id: "corte-social",
    nome: "Corte Clássico / Social",
    categoria: "Cabelo",
    duracao: 30,
    preco: 45.0,
    destaque: true,
    descricao: "Corte tradicional na tesoura ou máquina com acabamento na navalha."
  },
  {
    id: "corte-degrade",
    nome: "Corte Degradê (Fade)",
    categoria: "Cabelo",
    duracao: 45,
    preco: 55.0,
    destaque: true,
    descricao: "Disfarce preciso (low, mid ou high fade) com finalização modeladora."
  },
  {
    id: "barba-terapia",
    nome: "Barboterapia com Toalha Quente",
    categoria: "Barba",
    duracao: 35,
    preco: 40.0,
    destaque: true,
    descricao: "Modelagem completa com toalha quente, óleos essenciais e pós-barba."
  },
  {
    id: "combo-completo",
    nome: "Combo Rei (Cabelo + Barba)",
    categoria: "Combo",
    duracao: 75,
    preco: 85.0,
    destaque: false,
    descricao: "Pacote completo com corte de sua preferência e barboterapia."
  },
  {
    id: "sobrancelha-limpeza",
    nome: "Design de Sobrancelha & Limpeza",
    categoria: "Estética",
    duracao: 20,
    preco: 25.0,
    destaque: false,
    descricao: "Alinhamento natural na navalha/pinça e limpeza facial rápida."
  }
];

// Declaração de função e laço for tradicional
export function buscarServicoPorId(id) {
  for (let i = 0; i < SERVICOS.length; i++) {
    if (SERVICOS[i].id === id) {
      return SERVICOS[i];
    }
  }
  return null;
}

// Operador ternário e retorno de objeto
export function calcularValores(precoBase, ehFidelidade) {
  const taxaDesconto = ehFidelidade ? 0.15 : 0;
  const valorDesconto = precoBase * taxaDesconto;
  const valorFinal = precoBase - valorDesconto;

  return {
    subtotal: precoBase,
    desconto: valorDesconto,
    total: valorFinal
  };
}

export function formatarMoeda(valor) {
  return valor.toFixed(2).replace(".", ",");
}