import { AppError } from './AppError.js';

export function errorHandler(erro) {

    const dataHora = new Date().toLocaleString('pt-BR');

    console.error('========================================');
    console.error('[ERROR]');
    console.error('');

    console.error(`Data: ${dataHora}`);
    console.error('');

    console.error(`Tipo: ${erro.name}`);
    console.error('');

    console.error(`Mensagem:`);
    console.error(erro.message);
    console.error('');

    if (erro instanceof AppError) {

        console.error(`Status HTTP: ${erro.statusCode}`);

    } else {

        console.error('Categoria: Erro inesperado');
        console.error('');
        console.error('Stack Trace:');
        console.error(erro.stack);

    }

    console.error('');
    console.error('========================================');

}