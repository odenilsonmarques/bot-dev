import { enviarMensagem } from '../services/evolution.js';

import { salvarSessao } from '../sessions/sessionManager.js';

import { ESTADOS } from '../constants/estados.js';
import { MENU_PRINCIPAL } from '../constants/menus.js';

export async function tratarMenuContato(numero, mensagem) {

    if (mensagem === '0') {

        await enviarMensagem(
            numero,
            MENU_PRINCIPAL
        );

        salvarSessao(
            numero,
            ESTADOS.MENU_PRINCIPAL
        );

    }
    // Outras mensagens são ignoradas
}