import { AppError } from './AppError.js';
import { logger } from '../utils/logger.js';

export function errorHandler(erro) {

    const dataHora = new Date().toLocaleString('pt-BR');

    logger.error('========================================');
    logger.error('[ERROR]');
    logger.error('');

    logger.error(`Data: ${dataHora}`);
    logger.error('');

    logger.error(`Tipo: ${erro.name}`);
    logger.error('');

    logger.error(`Mensagem:`);
    logger.error(erro.message);
    logger.error('');

    if (erro instanceof AppError) {

        logger.error(`Status HTTP: ${erro.statusCode}`);

    } else {

        logger.error('Categoria: Erro inesperado');
        logger.error('');
        logger.error('Stack Trace:');
        logger.error(erro.stack);

    }

    logger.error('');
    logger.error('========================================');

}