
// Menu principal
export const MENU_PRINCIPAL = `Olá, eu sou Ode 👨🏽‍💻,
assistente virtual do Odenilson Marques.

Como posso ajudar você hoje?

1️⃣ Desenvolvimento Front-end

2️⃣ Desenvolvimento Back-end

3️⃣ Ver Portfólio

4️⃣ Falar diretamente comigo. `;


// Menu Mensagem de rodapé. Aqui nao precisamos exporá-lo, pois ele é usado apenas dentro dos outros menus.
const MENU_MENSAGEM_RODAPE = `
💼 Precisa de um desenvolvedor para o seu projeto?

4️⃣ Falar diretamente comigo.

0️⃣ Voltar ao menu principal.`;


// Menu de contato. Aqui também não precisamos exporá-lo, pois ele é usado apenas dentro dos outros menus.
const LINKS = {
    PORTFOLIO: 'https://odenilsonmarques.github.io/portfolio/#start',
    GITHUB: 'https://github.com/odenilsonmarques',
    LINKEDIN: 'https://linkedin.com/in/odenilsonmarques'
};


// Menu Front-end
export const MENU_FRONTEND = `🚀 Desenvolvimento Front-end

Tenho experiência com as seguintes tecnologias:

✅ HTML
✅ CSS
✅ JavaScript
✅ Bootstrap

${MENU_MENSAGEM_RODAPE}`;


//Menu Back-end
export const MENU_BACKEND = `⚙️ Desenvolvimento Back-end

Tenho experiência com as seguintes tecnologias:

✅ PHP
✅ MySQL
✅ Laravel
✅ WordPress
✅ APIs REST
✅ Docker

${MENU_MENSAGEM_RODAPE}`;


// Menu Portfólio
export const MENU_PORTFOLIO = `💻 Portfólio

🌐 Portfólio
${LINKS.PORTFOLIO}

🐙 GitHub
${LINKS.GITHUB}

💼 LinkedIn
${LINKS.LINKEDIN}

${MENU_MENSAGEM_RODAPE}`;


// Mensagem de contato
export const MENSAGEM_CONTATO = `Perfeito! 😊

Recebi seu pedido de atendimento.

O Odenilson falará com você em breve.

0️⃣ Voltar ao menu principal.`;