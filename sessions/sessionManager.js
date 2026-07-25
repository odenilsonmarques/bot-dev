import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CAMINHO_SESSOES = path.join(
    __dirname,
    '..',
    'data',
    'sessoes.json'
);

// Mapa responsável por armazenar as sessões em memória
const sessoes = new Map();

// Carrega as sessões salvas do arquivo JSON
carregarSessoes();


function persistirSessoes() {

    console.log('Persistindo sessões em arquivo JSON...');

    // Converte o mapa de sessões em um objeto JSON
    const sessoesJson = Object.fromEntries(sessoes);

    // Salva o mapa de sessões em um arquivo JSON
    fs.writeFileSync(
        CAMINHO_SESSOES,
        JSON.stringify(
            sessoesJson,
            null,
            4
        )
    );

} 


function carregarSessoes() {

    //verifica se o arqquivo existe, se nao existir, nao faz nada
    if (!fs.existsSync(CAMINHO_SESSOES)) {
        return;
    }

    //le o conteudo do arquivo
    const dados = fs.readFileSync(
        CAMINHO_SESSOES,
        'utf-8'
    );

    //converte o conteudo do arquivo em um objeto JSON
    const sessoesJson = JSON.parse(dados);

    //adiciona cada sessão ao mapa
    for (const numero in sessoesJson) {

        sessoes.set(
            numero,
            sessoesJson[numero]
        );

    }

}


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

    // Atualiza a sessão em memória
    sessoes.set(
        numero,
        estado
    );

    // Persiste a alteração no arquivo JSON
    persistirSessoes();

}

/*
|--------------------------------------------------------------------------
| Remove uma sessão
|--------------------------------------------------------------------------
*/
export function removerSessao(numero) {

    // Remove a sessão da memória
    sessoes.delete(numero);

    // Atualiza o arquivo JSON
    persistirSessoes();

}