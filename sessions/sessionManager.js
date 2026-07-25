// Mapa responsável por armazenar as sessões em memória
const sessoes = new Map();

/*
|--------------------------------------------------------------------------
| Verifica se uma sessão existe
|--------------------------------------------------------------------------
*/
export function existeSessao(numero) {
    return sessoes.has(numero);
}

/*
|--------------------------------------------------------------------------
| Obtém o estado da sessão
|--------------------------------------------------------------------------
*/
export function obterSessao(numero) {
    return sessoes.get(numero);
}

/*
|--------------------------------------------------------------------------
| Salva ou atualiza uma sessão
|--------------------------------------------------------------------------
*/
export function salvarSessao(numero, estado) {
    sessoes.set(numero, estado);
}

/*
|--------------------------------------------------------------------------
| Remove uma sessão
|--------------------------------------------------------------------------
*/
export function removerSessao(numero) {
    sessoes.delete(numero);
}