//importando a função enviarMensagem do arquivo evolution.js
import { enviarMensagem } from '../services/evolution.js';

import { ESTADOS } from '../constants/estados.js';
import { MENU_PRINCIPAL, MENU_FRONTEND, MENU_BACKEND, MENU_PORTFOLIO, MENSAGEM_CONTATO } from '../constants/menus.js';
import { OPCOES } from '../constants/opcoes.js';

import { tratarMenuFrontend } from './frontendHandler.js';
import { tratarMenuBackend } from './backendHandler.js';
import { tratarMenuPortfolio } from './portfolioHandler.js';
import { tratarMenuContato } from './contatoHandler.js';

export async function tratarMenu(numero, mensagem, sessoes) {

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

        await tratarMenuFrontend(numero, mensagem, sessoes);

    }
    else if (sessoes.get(numero) === ESTADOS.BACKEND) {

        await tratarMenuBackend(numero, mensagem, sessoes);
    }

    else if (sessoes.get(numero) === ESTADOS.PORTFOLIO) {

        await tratarMenuPortfolio(numero, mensagem, sessoes);

    }

    else if (sessoes.get(numero) === ESTADOS.CONTATO) {

        await tratarMenuContato(numero, mensagem, sessoes);

    }
}