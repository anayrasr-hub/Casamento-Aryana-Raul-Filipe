const casamento = new Date("2026-10-11T09:00:00").getTime();

const countdown =
document.getElementById("countdown");

function atualizarContador(){

if(!countdown) return;

const agora = new Date().getTime();

const diferenca = casamento-agora;

const dias =
Math.floor(diferenca/(1000*60*60*24));

const horas =
Math.floor((diferenca%(1000*60*60*24))/(1000*60*60));

const minutos =
Math.floor((diferenca%(1000*60*60))/(1000*60));

const segundos =
Math.floor((diferenca%(1000*60))/1000);

countdown.innerHTML=

`${dias} dias

${horas}h

${minutos}min

${segundos}s`;

}

atualizarContador();

setInterval(atualizarContador,1000);