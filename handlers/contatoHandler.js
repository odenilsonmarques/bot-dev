import { enviarMensagem } from '../services/evolution.js';

import { ESTADOS } from '../constants/estados.js';
import { MENU_PRINCIPAL } from '../constants/menus.js';

export async function tratarMenuContato(numero, mensagem, sessoes) {

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
    // Outras mensagens são ignoradas
}