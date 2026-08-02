/*
|--------------------------------------------------------------------------
| Logger da aplicação
|--------------------------------------------------------------------------
| Responsável por centralizar todos os logs da aplicação.
| Nenhum outro arquivo deve utilizar console.log() diretamente.
|--------------------------------------------------------------------------
*/

/*
|--------------------------------------------------------------------------
| Retorna a data e hora atual formatada para os logs da aplicação.
|--------------------------------------------------------------------------
*/
function obterTimestamp() {

    return new Date().toLocaleString('pt-BR');

}

export const logger = {

    info(...mensagens) {

        console.log(`[INFO] [${obterTimestamp()}]`, ...mensagens);

    },

    warn(...mensagens) {

        console.warn(`[WARN] [${obterTimestamp()}]`, ...mensagens);

    },

    error(...mensagens) {

        console.error(`[ERROR] [${obterTimestamp()}]`, ...mensagens);

    }

};