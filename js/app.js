const casamento =
    new Date("2026-10-11T09:00:00").getTime();


const dias =
    document.getElementById("dias");

const horas =
    document.getElementById("horas");

const minutos =
    document.getElementById("minutos");

const segundos =
    document.getElementById("segundos");


function atualizarContador() {

    const agora =
        new Date().getTime();


    const diferenca =
        casamento - agora;


    if (diferenca <= 0) {

        if (dias) dias.textContent = "0";
        if (horas) horas.textContent = "0";
        if (minutos) minutos.textContent = "0";
        if (segundos) segundos.textContent = "0";

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


atualizarContador();


setInterval(
    atualizarContador,
    1000
);