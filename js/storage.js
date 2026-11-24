export const CHAVE_AGENDAMENTOS = "vilaos_barber_agendamentos";
export const CHAVE_TEMA = "vilaos_barber_tema";

// Persistência com localStorage, JSON.parse e tratamento de exceções try/catch
export function carregar(chave, padrao) {
  try {
    const texto = localStorage.getItem(chave);
    return texto === null ? padrao : JSON.parse(texto);
  } catch (e) {
    console.log("Dados corrompidos em", chave);
    return padrao;
  }
}

// Serialização com JSON.stringify e gravação no localStorage
export function salvar(chave, valor) {
  try {
    const texto = JSON.stringify(valor);
    localStorage.setItem(chave, texto);
  } catch (e) {
    console.log("Erro ao salvar em", chave, e.message);
  }
}