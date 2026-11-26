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

// GESTÃO DE USUÁRIOS E SESSÃO (CLIENTES E ADMINISTRADOR)

export const CHAVE_USUARIOS = "vilaos_barber_usuarios";
export const CHAVE_SESSAO = "vilaos_barber_sessao";

// Lista todos os clientes cadastrados no localStorage
export function listarUsuarios() {
  const dados = localStorage.getItem(CHAVE_USUARIOS);
  return dados ? JSON.parse(dados) : [];
}

// Salva um novo cliente na lista
export function salvarUsuario(novoUsuario) {
  const usuarios = listarUsuarios();
  usuarios.push(novoUsuario);
  localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
}

// Grava o usuário que acabou de fazer login (Admin ou Cliente)
export function definirUsuarioLogado(usuario) {
  localStorage.setItem(CHAVE_SESSAO, JSON.stringify(usuario));
}

// Retorna o objeto do usuário logado ou null se não houver ninguém
export function obterUsuarioLogado() {
  const dados = localStorage.getItem(CHAVE_SESSAO);
  return dados ? JSON.parse(dados) : null;
}

// Encerra a sessão (Logout)
export function sairUsuario() {
  localStorage.removeItem(CHAVE_SESSAO);
}