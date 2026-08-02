//importando variáveis de ambiente do arquivo .env
import 'dotenv/config';

//importando o framework Express
import express from 'express';

//importando o gerenciador de sessões. Aqui importamos apenas as funções que vamos utilizar, mas você pode importar todas se quiser. Isso pq o server nao consulta estados, ele apenas verifica se existe uma sessão e cria uma quando necessário
import { existeSessao, salvarSessao } from './sessions/sessionManager.js';

//importando as funções e constantes necessárias para o funcionamento do bot
import { enviarMensagem } from './services/evolution.js';
import { ESTADOS } from './constants/estados.js';
import { MENU_PRINCIPAL } from './constants/menus.js';
import { tratarMenu } from './handlers/menuHandler.js';

import { errorHandler } from './errors/errorHandler.js';

import { logger } from './utils/logger.js';

// Tempo máximo de idade da mensagem em segundos
const tempoMaximo = process.env.MESSAGE_MAX_AGE || 60;

const app = express();

// Permite que o Express receba JSON enviado pela Evolution API.
app.use(express.json());

// Webhook da Evolution API.  Toda mensagem recebida pela instância do WhatsApp chegará aqui.
app.post('/webhook', async (req, res) => {

    logger.info(
        JSON.stringify(req.body, null, 2)
    );

    logger.info('📩 Evento recebido');

    //  Ignora mensagens antigas. A Evolution pode reenviar mensagens antigas quando reinicia. Se a mensagem tiver mais de 60 segundos, ela será ignorada.
    const timestamp = req.body?.data?.messageTimestamp;
    const agora = Math.floor(Date.now() / 1000);
    const idadeMensagem = agora - timestamp;
    logger.info('Idade da mensagem:', idadeMensagem, 'segundos');

    if (idadeMensagem > tempoMaximo) {

        logger.warn(
            '🚫 Mensagem antiga ignorada'
        );

        return res.sendStatus(200);
    }

    // Ignora mensagens enviadas pelo próprio bot. Evitar loops infinitos.Bot envia mensagem -> webhook recebe -> bot responde novamente.
    const fromMe = req.body?.data?.key?.fromMe;

    if (fromMe) {

        logger.warn('🚫 Mensagem enviada pelo próprio bot');

        return res.sendStatus(200);
    }

    /*
    |--------------------------------------------------------------------------
    | Obtém o identificador da conversa
    |--------------------------------------------------------------------------
    | Exemplo privado:
    | 559881234567@s.whatsapp.net
    |
    | Exemplo grupo:
    | 120363277353184107@g.us
    */
    const jid = req.body?.data?.key?.remoteJid;

    //  Ignora grupos.
    if (!jid?.includes('@s.whatsapp.net')) {

        logger.warn('🚫 Grupo ignorado');

        return res.sendStatus(200);
    }

    //  Extrai somente o número do WhatsApp. Remove o sufixo @s.whatsapp.net.
    const numero = jid.replace(
        '@s.whatsapp.net',
        ''
    );

    /*
    |--------------------------------------------------------------------------
    | Captura o texto da mensagem
    |--------------------------------------------------------------------------
    | conversation:
    | Mensagem simples.
    |
    | extendedTextMessage:
    | Respostas, encaminhamentos e outros formatos.
    */
    const mensagem =
        (
            req.body?.data?.message?.conversation ||
            req.body?.data?.message?.extendedTextMessage?.text
        )?.trim().toLowerCase();
    logger.info('Número:', numero);
    logger.info('Mensagem:', mensagem);

    // Se não existir texto, encerra processamento
    if (!mensagem) {
        logger.warn('⚠️ Evento sem texto');
        return res.sendStatus(200);
    }

    // Se não existir sessão para o número, cria uma nova sessão e envia o menu principal
    if (!existeSessao(numero)) {

        await enviarMensagem(
            numero,
            MENU_PRINCIPAL
        );

        salvarSessao(
            numero,
            ESTADOS.MENU_PRINCIPAL
        );

        return res.sendStatus(200);
    }

    try {

        // Chama a função tratarMenu para processar a mensagem recebida
        await tratarMenu(
            numero,
            mensagem
        );

    } catch (erro) {

        // Chama o errorHandler para tratar o erro
        errorHandler(erro);

    }

    // Retorna sucesso para a Evolution API
    res.sendStatus(200);
});

// Inicialização do servidor
app.listen(process.env.PORT, '0.0.0.0', () => {

    logger.info(
        `🚀 Bot rodando na porta ${process.env.PORT}`
    );
});