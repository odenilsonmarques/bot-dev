import 'dotenv/config';
import express from 'express';


import { enviarMensagem } from './services/evolution.js';

const tempoMaximo = process.env.MESSAGE_MAX_AGE || 60;

//Menu principal do bot
const MENU_PRINCIPAL = `Olá, eu sou Ode 👨🏽‍💻,
assistente virtual do Odenilson Marques.

Como posso ajudar você hoje?

1️⃣ Desenvolvimento Front-end
2️⃣ Desenvolvimento Back-end
3️⃣ Desenvolvimento Full Stack
4️⃣ Ver Portfólio
5️⃣ Falar diretamente comigo`;

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

    console.log(
        JSON.stringify(req.body, null, 2)
    );

    console.log('📩 Evento recebido');

    /*
|--------------------------------------------------------------------------
| Ignora mensagens antigas
|--------------------------------------------------------------------------
| A Evolution pode reenviar mensagens antigas quando reinicia.
| Se a mensagem tiver mais de 60 segundos, ela será ignorada.
*/
    const timestamp = req.body?.data?.messageTimestamp;

    const agora = Math.floor(Date.now() / 1000);

    const idadeMensagem = agora - timestamp;

    console.log('Idade da mensagem:', idadeMensagem, 'segundos');

    if (idadeMensagem > tempoMaximo) {

        console.log(
            '🚫 Mensagem antiga ignorada'
        );

        return res.sendStatus(200);

    }

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
    if (mensagem.toLowerCase() === 'oi' || mensagem.toLowerCase() === 'menu') {

        await enviarMensagem(
            numero,
            MENU_PRINCIPAL
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
app.listen(process.env.PORT, '0.0.0.0', () => {

    console.log(
        `🚀 Bot rodando na porta ${process.env.PORT}`
    );

});