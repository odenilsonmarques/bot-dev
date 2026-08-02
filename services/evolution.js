// Biblioteca que permite fazer requisições HTTP, utilizada para enviar mensagens para a Evolution.
import axios from 'axios';

import { logger } from '../utils/logger.js';

export async function enviarMensagem(numero, texto) {

    try {

        const response = await axios.post(

            `${process.env.EVOLUTION_URL}/message/sendText/${process.env.EVOLUTION_INSTANCE}`,

            {
                number: numero,
                text: texto
            },

            {
                headers: {
                    apikey: process.env.EVOLUTION_API_KEY,
                    'Content-Type': 'application/json'
                }
            }

        );

        logger.info('✅ Mensagem enviada');

        return response.data;

    } catch (error) {

        logger.error('❌ Erro ao enviar mensagem');

        logger.error(
            error.response?.data || error.message
        );

    }

}