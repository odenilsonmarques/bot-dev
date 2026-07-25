import { enviarMensagem } from "../services/evolution.js";

import { salvarSessao } from '../sessions/sessionManager.js';

import { ESTADOS } from "../constants/estados.js";
import { MENU_PRINCIPAL, MENU_FRONTEND,MENSAGEM_CONTATO } from "../constants/menus.js";

export async function tratarMenuFrontend(numero, mensagem) {

    if (mensagem === '0') {

        await enviarMensagem(
            numero,
            MENU_PRINCIPAL
        );

        salvarSessao(
            numero,
            ESTADOS.MENU_PRINCIPAL
        );


    } else if (mensagem === '4') {

        await enviarMensagem(
            numero,
            MENSAGEM_CONTATO
        );

        salvarSessao(
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

