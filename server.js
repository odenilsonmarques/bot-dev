//importando variáveis de ambiente do arquivo .env
import 'dotenv/config';

//importando o framework Express
import express from 'express';

//importando a função enviarMensagem do arquivo evolution.js
import { enviarMensagem } from './services/evolution.js';

// Tempo máximo de idade da mensagem em segundos
const tempoMaximo = process.env.MESSAGE_MAX_AGE || 60;

// Mapa para armazenar o estado da conversa de cada usuário
const sessoes = new Map();

//Menu principal do bot
const MENU_PRINCIPAL = `Olá, eu sou Ode 👨🏽‍💻,
assistente virtual do Odenilson Marques.

Como posso ajudar você hoje?

1️⃣ Desenvolvimento Front-end

2️⃣ Desenvolvimento Back-end

3️⃣ Ver Portfólio

4️⃣ Falar diretamente comigo. `;


//  Estados da conversa do bot
const ESTADOS = {

    MENU_PRINCIPAL: 'MENU_PRINCIPAL',

    FRONTEND: 'FRONTEND',

    BACKEND: 'BACKEND',

    PORTFOLIO: 'PORTFOLIO',

    CONTATO: 'CONTATO'

};

// Estados das opções do menu principal
const OPCOES = {
    VOLTAR: '0',
    FRONTEND: '1',
    BACKEND: '2',
    PORTFOLIO: '3',
    CONTATO: '4'
};


// Mensagem de rodapé para os menus
const MENSAGEM_RODAPE_MENU = `
💼 Precisa de um desenvolvedor para o seu projeto?

4️⃣ Falar diretamente comigo.

0️⃣ Voltar ao menu principal.`;


// Links do portfólio, GitHub e LinkedIn
const LINKS = {
    PORTFOLIO: 'https://odenilsonmarques.github.io/portfolio/#start',
    GITHUB: 'https://github.com/odenilsonmarques',
    LINKEDIN: 'https://linkedin.com/in/odenilsonmarques'
};


// Menu de desenvolvimento front-end
const MENU_FRONTEND = `🚀 Desenvolvimento Front-end

Tenho experiência com as seguintes tecnologias:

✅ HTML
✅ CSS
✅ JavaScript
✅ Bootstrap

${MENSAGEM_RODAPE_MENU}`;


// Menu de desenvolvimento back-end
const MENU_BACKEND = `⚙️ Desenvolvimento Back-end

Tenho experiência com as seguintes tecnologias:

✅ PHP
✅ MySQL
✅ Laravel
✅ WordPress
✅ APIs REST
✅ Docker

${MENSAGEM_RODAPE_MENU}`;


// Menu de portfólio
const MENU_PORTFOLIO = `💻 Portfólio

🌐 Portfólio
${LINKS.PORTFOLIO}

🐙 GitHub
${LINKS.GITHUB}

💼 LinkedIn
${LINKS.LINKEDIN}

${MENSAGEM_RODAPE_MENU}`;


// Mensagem de contato
const MENSAGEM_CONTATO = `Perfeito! 😊

Recebi seu pedido de atendimento.

O Odenilson falará com você em breve.

0️⃣ Voltar ao menu principal.`;



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
    // const mensagem =
    //     req.body?.data?.message?.conversation ||
    //     req.body?.data?.message?.extendedTextMessage?.text;

    const mensagem =
        (
            req.body?.data?.message?.conversation ||
            req.body?.data?.message?.extendedTextMessage?.text
        )?.trim().toLowerCase();

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
    // if (mensagem.toLowerCase() === 'oi' || mensagem.toLowerCase() === 'menu') {

    //     await enviarMensagem(
    //         numero,
    //         MENU_PRINCIPAL
    //     );

    // }

    // await enviarMensagem(
    //     numero,
    //     MENU_PRINCIPAL
    // );

    // sessoes.set(numero, ESTADOS.MENU_PRINCIPAL);


    if (!sessoes.has(numero)) {

        await enviarMensagem(
            numero,
            MENU_PRINCIPAL
        );

        sessoes.set(
            numero,
            ESTADOS.MENU_PRINCIPAL
        );

        return res.sendStatus(200);

    }


    if (sessoes.get(numero) === ESTADOS.MENU_PRINCIPAL) {

        if (mensagem === OPCOES.FRONTEND) {

            await enviarMensagem(
                numero,
                MENU_FRONTEND
            );

            sessoes.set(
                numero,
                ESTADOS.FRONTEND
            );

        }
        else if (mensagem === OPCOES.BACKEND) {

            await enviarMensagem(
                numero,
                MENU_BACKEND
            );

            sessoes.set(
                numero,
                ESTADOS.BACKEND
            );

        }
        else if (mensagem === OPCOES.PORTFOLIO) {

            await enviarMensagem(
                numero,
                MENU_PORTFOLIO
            );

            sessoes.set(
                numero,
                ESTADOS.PORTFOLIO
            );

        }
        else if (mensagem === OPCOES.CONTATO) {

            await enviarMensagem(
                numero,
                MENSAGEM_CONTATO
            );

            sessoes.set(
                numero,
                ESTADOS.CONTATO
            );

        }
        else {

            await enviarMensagem(
                numero,
                MENU_PRINCIPAL
            );

        }

    }

    else if (sessoes.get(numero) === ESTADOS.FRONTEND) {

        if (mensagem === '0') {

            await enviarMensagem(
                numero,
                MENU_PRINCIPAL
            );

            sessoes.set(
                numero,
                ESTADOS.MENU_PRINCIPAL
            );

        }
        else if (mensagem === OPCOES.CONTATO) {

            await enviarMensagem(
                numero,
                MENSAGEM_CONTATO
            );

            sessoes.set(
                numero,
                ESTADOS.CONTATO
            );

        }
        else {

            await enviarMensagem(
                numero,
                MENU_FRONTEND
            );

        }

    }

    else if (sessoes.get(numero) === ESTADOS.BACKEND) {

        if (mensagem === '0') {

            await enviarMensagem(
                numero,
                MENU_PRINCIPAL
            );

            sessoes.set(
                numero,
                ESTADOS.MENU_PRINCIPAL
            );

        }

        else if (mensagem === '4') {

            await enviarMensagem(
                numero,
                MENSAGEM_CONTATO
            );

            sessoes.set(
                numero,
                ESTADOS.CONTATO
            );

        }

        else {

            await enviarMensagem(
                numero,
                MENU_BACKEND
            );

        }

    }

    else if (sessoes.get(numero) === ESTADOS.PORTFOLIO) {

        if (mensagem === '0') {

            await enviarMensagem(
                numero,
                MENU_PRINCIPAL
            );

            sessoes.set(
                numero,
                ESTADOS.MENU_PRINCIPAL
            );

        }
        else if (mensagem === '4') {

            await enviarMensagem(
                numero,
                MENSAGEM_CONTATO
            );

            sessoes.set(
                numero,
                ESTADOS.CONTATO
            );

        }
        else {

            await enviarMensagem(
                numero,
                MENU_PORTFOLIO
            );

        }

    }

    else if (sessoes.get(numero) === ESTADOS.CONTATO) {

        if (mensagem === '0') {

            await enviarMensagem(
                numero,
                MENU_PRINCIPAL
            );

            sessoes.set(
                numero,
                ESTADOS.MENU_PRINCIPAL
            );

        }

        // Ignora qualquer outra mensagem

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