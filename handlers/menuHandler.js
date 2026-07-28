//importando a função enviarMensagem do arquivo evolution.js
import { enviarMensagem } from '../services/evolution.js';

import { ESTADOS } from '../constants/estados.js';
import { MENU_PRINCIPAL, MENU_FRONTEND, MENU_BACKEND, MENU_PORTFOLIO, MENSAGEM_CONTATO } from '../constants/menus.js';
import { OPCOES } from '../constants/opcoes.js';

import { obterSessao, salvarSessao } from '../sessions/sessionManager.js';

import { tratarMenuFrontend } from './frontendHandler.js';
import { tratarMenuBackend } from './backendHandler.js';
import { tratarMenuPortfolio } from './portfolioHandler.js';
import { tratarMenuContato } from './contatoHandler.js';

import { AppError } from '../errors/AppError.js';
// import { errorHandler } from '../errors/errorHandler.js';

export async function tratarMenu(numero, mensagem) {

    if (obterSessao(numero) === ESTADOS.MENU_PRINCIPAL) {

        if (mensagem === OPCOES.FRONTEND) {

            await enviarMensagem(
                numero,
                MENU_FRONTEND
            );

            salvarSessao(
                numero,
                ESTADOS.FRONTEND
            );

        }
        else if (mensagem === OPCOES.BACKEND) {

            await enviarMensagem(
                numero,
                MENU_BACKEND
            );

            salvarSessao(
                numero,
                ESTADOS.BACKEND
            );

        }
        else if (mensagem === OPCOES.PORTFOLIO) {

            await enviarMensagem(
                numero,
                MENU_PORTFOLIO
            );

            salvarSessao(
                numero,
                ESTADOS.PORTFOLIO
            );

        }
        else if (mensagem === OPCOES.CONTATO) {

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
                MENU_PRINCIPAL
            );

        }

    }

    else if (obterSessao(numero) === ESTADOS.FRONTEND) {

        await tratarMenuFrontend(numero, mensagem);
    }

    else if (obterSessao(numero) === ESTADOS.BACKEND) {

        await tratarMenuBackend(numero, mensagem);
    }

    else if (obterSessao(numero) === ESTADOS.PORTFOLIO) {

        await tratarMenuPortfolio(numero, mensagem);

    }

    else if (obterSessao(numero) === ESTADOS.CONTATO) {

        await tratarMenuContato(numero, mensagem);

    }
}