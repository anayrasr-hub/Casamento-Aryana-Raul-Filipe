/* ==================================================
   CASAMENTO ARYANA & RAUL FILIPE
   PÁGINA PRINCIPAL
================================================== */


/* ==================================================
   DATA DO CASAMENTO
================================================== */

const dataCasamento =
    new Date(
        "2026-10-11T09:00:00-03:00"
    ).getTime();


/* ==================================================
   PRAZO DE CONFIRMAÇÃO
   DISPONÍVEL ATÉ 11/09/2026
================================================== */

const prazoConfirmacao =
    new Date(
        "2026-09-11T23:59:59-03:00"
    ).getTime();


/* ==================================================
   ELEMENTOS DO CONTADOR
================================================== */

const dias =
    document.getElementById(
        "dias"
    );


const horas =
    document.getElementById(
        "horas"
    );


const minutos =
    document.getElementById(
        "minutos"
    );


const segundos =
    document.getElementById(
        "segundos"
    );


/* ==================================================
   CONTADOR REGRESSIVO
================================================== */

function atualizarContador() {

    const agora =
        Date.now();


    const diferenca =
        dataCasamento - agora;


    if (
        diferenca <= 0
    ) {

        if (dias) {
            dias.textContent = "0";
        }

        if (horas) {
            horas.textContent = "0";
        }

        if (minutos) {
            minutos.textContent = "0";
        }

        if (segundos) {
            segundos.textContent = "0";
        }

        return;

    }


    const totalSegundos =
        Math.floor(
            diferenca / 1000
        );


    const totalMinutos =
        Math.floor(
            totalSegundos / 60
        );


    const totalHoras =
        Math.floor(
            totalMinutos / 60
        );


    const totalDias =
        Math.floor(
            totalHoras / 24
        );


    const horasRestantes =
        totalHoras % 24;


    const minutosRestantes =
        totalMinutos % 60;


    const segundosRestantes =
        totalSegundos % 60;


    if (dias) {

        dias.textContent =
            totalDias;

    }


    if (horas) {

        horas.textContent =
            horasRestantes;

    }


    if (minutos) {

        minutos.textContent =
            minutosRestantes;

    }


    if (segundos) {

        segundos.textContent =
            segundosRestantes;

    }

}


/* ==================================================
   INICIAR CONTADOR
================================================== */

atualizarContador();


setInterval(
    atualizarContador,
    1000
);


/* ==================================================
   CONFIRMAÇÃO DE PRESENÇA
================================================== */

function configurarPrazoConfirmacao() {

    const botaoHeader =
        document.getElementById(
            "botaoConfirmacaoHeader"
        );


    const botaoFinal =
        document.getElementById(
            "botaoConfirmacaoFinal"
        );


    const menuConfirmacao =
        document.getElementById(
            "menuConfirmacao"
        );


    const expirado =
        Date.now() >
        prazoConfirmacao;


    if (!expirado) {

        return;

    }


    const bloquearLink =
        elemento => {

            if (!elemento) {

                return;

            }


            elemento.removeAttribute(
                "href"
            );


            elemento.classList.add(
                "confirmacao-expirada"
            );


            elemento.setAttribute(
                "aria-disabled",
                "true"
            );


            elemento.addEventListener(
                "click",
                evento => {

                    evento.preventDefault();

                    mostrarMensagemExpirada();

                }
            );

        };


    bloquearLink(
        botaoHeader
    );


    bloquearLink(
        botaoFinal
    );


    bloquearLink(
        menuConfirmacao
    );


    if (botaoHeader) {

        botaoHeader.textContent =
            "❤️ Confirmação encerrada";

    }


    if (botaoFinal) {

        botaoFinal.textContent =
            "❤️ Confirmação encerrada";

    }


    if (menuConfirmacao) {

        menuConfirmacao.textContent =
            "❤️ Confirmação encerrada";

    }


    criarMensagemExpirada();

}


/* ==================================================
   MENSAGEM DE CONFIRMAÇÃO ENCERRADA
================================================== */

function criarMensagemExpirada() {

    if (
        document.getElementById(
            "mensagemExpirada"
        )
    ) {

        return;

    }


    const elemento =
        document.createElement(
            "div"
        );


    elemento.id =
        "mensagemExpirada";


    elemento.className =
        "mensagem-expirada";


    elemento.innerHTML = `

        <div
            class="mensagem-expirada-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="tituloMensagemExpirada"
        >

            <h3
                id="tituloMensagemExpirada"
            >
                Confirmação encerrada
            </h3>


            <p>
                O prazo de confirmação expirou.
                Para qualquer pedido excepcional,
                entrar em contato com os noivos.
            </p>

        </div>

    `;


    document.body.appendChild(
        elemento
    );


    elemento.addEventListener(
        "click",
        evento => {

            if (
                evento.target ===
                elemento
            ) {

                esconderMensagemExpirada();

            }

        }
    );

}


/* ==================================================
   MOSTRAR MENSAGEM
================================================== */

function mostrarMensagemExpirada() {

    criarMensagemExpirada();


    const elemento =
        document.getElementById(
            "mensagemExpirada"
        );


    if (elemento) {

        elemento.classList.add(
            "ativa"
        );

    }

}


/* ==================================================
   ESCONDER MENSAGEM
================================================== */

function esconderMensagemExpirada() {

    const elemento =
        document.getElementById(
            "mensagemExpirada"
        );


    if (elemento) {

        elemento.classList.remove(
            "ativa"
        );

    }

}


/* ==================================================
   MÚSICA
================================================== */

const musica =
    document.getElementById(
        "musicaCasamento"
    );


function iniciarMusica() {

    if (!musica) {

        return;

    }


    musica.volume =
        0.55;


    const promessa =
        musica.play();


    if (
        promessa &&
        typeof promessa.catch ===
            "function"
    ) {

        promessa.catch(
            () => {

                /*
                Alguns navegadores bloqueiam
                autoplay com som.

                O primeiro clique/toque do
                convidado libera a reprodução.
                */

            }
        );

    }

}


/* ==================================================
   TENTATIVA DE AUTOPLAY
================================================== */

iniciarMusica();


/* ==================================================
   LIBERAR MÚSICA NO PRIMEIRO CLIQUE
================================================== */

document.addEventListener(
    "click",
    () => {

        iniciarMusica();

    },
    {
        once: true
    }
);


/* ==================================================
   LIBERAR MÚSICA NO PRIMEIRO TOQUE
================================================== */

document.addEventListener(
    "touchstart",
    () => {

        iniciarMusica();

    },
    {
        once: true,
        passive: true
    }
);


/* ==================================================
   FECHAR MENU AO CLICAR EM UM ITEM
================================================== */

const menu =
    document.querySelector(
        ".menu-principal"
    );


const linksMenu =
    document.querySelectorAll(
        ".menu-dropdown a"
    );


linksMenu.forEach(
    link => {

        link.addEventListener(
            "click",
            () => {

                if (menu) {

                    menu.removeAttribute(
                        "open"
                    );

                }

            }
        );

    }
);


/* ==================================================
   INICIALIZAÇÃO
================================================== */

configurarPrazoConfirmacao();