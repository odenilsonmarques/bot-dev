import { enviarMensagem } from "../services/evolution.js";

import { ESTADOS } from "../constants/estados.js";
import { MENU_PRINCIPAL, MENU_FRONTEND,MENSAGEM_CONTATO } from "../constants/menus.js";

export async function tratarMenuFrontend(numero, mensagem, sessoes) {

    if (mensagem === '0') {

        await enviarMensagem(
            numero,
            MENU_PRINCIPAL
        );

        sessoes.set(
            numero,
            ESTADOS.MENU_PRINCIPAL
        );


    } else if (mensagem === '4') {

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

