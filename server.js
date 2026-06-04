import 'dotenv/config';
import express from 'express';

import { enviarMensagem } from './services/evolution.js';

const app = express();

/*
|--------------------------------------------------------------------------
| Middleware
|--------------------------------------------------------------------------
| Permite que o Express receba JSON enviado pela Evolution API.
*/
app.use(express.json());

/*
|--------------------------------------------------------------------------
| Webhook da Evolution API
|--------------------------------------------------------------------------
| Toda mensagem recebida pela instância do WhatsApp chegará aqui.
*/
app.post('/webhook', async (req, res) => {

    console.log('📩 Evento recebido');

    /*
    |--------------------------------------------------------------------------
    | Ignora mensagens enviadas pelo próprio bot
    |--------------------------------------------------------------------------
    | Evita loops infinitos:
    | Bot envia mensagem -> webhook recebe -> bot responde novamente.
    */
    const fromMe = req.body?.data?.key?.fromMe;

    if (fromMe) {

        console.log('🚫 Mensagem enviada pelo próprio bot');

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

    /*
    |--------------------------------------------------------------------------
    | Ignora grupos
    |--------------------------------------------------------------------------
    | Neste laboratório vamos trabalhar apenas com mensagens privadas.
    */
    if (!jid?.includes('@s.whatsapp.net')) {

        console.log('🚫 Grupo ignorado');

        return res.sendStatus(200);

    }

    /*
    |--------------------------------------------------------------------------
    | Extrai somente o número do WhatsApp
    |--------------------------------------------------------------------------
    | Remove o sufixo @s.whatsapp.net.
    */
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
        req.body?.data?.message?.conversation ||
        req.body?.data?.message?.extendedTextMessage?.text;

    console.log('Número:', numero);
    console.log('Mensagem:', mensagem);

    /*
    |--------------------------------------------------------------------------
    | Se não existir texto, encerra processamento
    |--------------------------------------------------------------------------
    */
    if (!mensagem) {

        console.log('⚠️ Evento sem texto');

        return res.sendStatus(200);

    }

    /*
    |--------------------------------------------------------------------------
    | Primeira regra do bot
    |--------------------------------------------------------------------------
    | Quando o usuário enviar "oi",
    | o bot responderá automaticamente.
    */
    if (mensagem.toLowerCase() === 'oi') {

        await enviarMensagem(
            numero,
            'Olá! Seja bem-vindo.'
        );

    }

    /*
    |--------------------------------------------------------------------------
    | Retorna sucesso para a Evolution API
    |--------------------------------------------------------------------------
    */
    res.sendStatus(200);

});

/*
|--------------------------------------------------------------------------
| Inicialização do servidor
|--------------------------------------------------------------------------
*/
app.listen(process.env.PORT, () => {

    console.log(
        `🚀 Bot rodando na porta ${process.env.PORT}`
    );

});