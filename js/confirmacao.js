/*
==================================================
CASAMENTO ARYANA & RAUL FILIPE
CONFIRMAÇÃO DE PRESENÇA
==================================================

Integrações:
- Google Sheets
- Firebase
- Geração de código
- Adulto / Criança
- Idade
- Sexo opcional
- Calçado para mulher adulta
- WhatsApp
- Convite
- Botão voltar
==================================================
*/


/*
==================================================
GOOGLE SHEETS
==================================================
*/

const GOOGLE_SHEETS_URL =
    "https://script.google.com/macros/s/AKfycbwxoY3KVrIxOjRvZ8nWJOhwA3dWoK_OVnR3Wj893rZLONMIhIpE_TrOFaRLsmm41q1Q/exec";


const formPresenca =
    document.getElementById("formPresenca");


/*
==================================================
FUNÇÃO PARA LOCALIZAR CAMPOS
==================================================
*/

function localizarCampo(ids, seletorAlternativo = "") {

    for (const id of ids) {

        const elemento =
            document.getElementById(id);

        if (elemento) {
            return elemento;
        }

    }

    if (seletorAlternativo) {

        const elemento =
            document.querySelector(
                seletorAlternativo
            );

        if (elemento) {
            return elemento;
        }

    }

    return null;

}


/*
==================================================
CAMPOS DA CONFIRMAÇÃO
==================================================
*/

const nome =
    localizarCampo(
        [
            "nome",
            "nomeCompleto",
            "nomeConvidado"
        ],
        '#formPresenca input[name="nome"]'
    );


const tipo =
    localizarCampo(
        [
            "tipo",
            "tipoConvidado"
        ],
        '#formPresenca select[name="tipo"]'
    );


const sexo =
    localizarCampo(
        [
            "sexo"
        ],
        '#formPresenca select[name="sexo"]'
    );


const campoIdade =
    document.getElementById(
        "campoIdade"
    );


const idade =
    localizarCampo(
        [
            "idade"
        ],
        '#formPresenca input[name="idade"]'
    );


const campoCalcado =
    document.getElementById(
        "campoCalcado"
    );


const calcado =
    localizarCampo(
        [
            "calcado",
            "calçado"
        ],
        '#formPresenca input[name="calcado"]'
    );


const whatsapp =
    localizarCampo(
        [
            "whatsapp",
            "telefone"
        ],
        '#formPresenca input[name="whatsapp"]'
    );


const listaConvidados =
    document.getElementById(
        "listaConvidados"
    );


const btnVoltar =
    document.getElementById(
        "btnVoltarConfirmacao"
    );


/*
==================================================
INICIALIZAÇÃO
==================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    function () {

        configurarCampos();

        configurarFormulario();

        configurarBotaoVoltar();

        atualizarCamposVisiveis();

    }
);


/*
==================================================
CONFIGURAR CAMPOS
==================================================
*/

function configurarCampos() {

    if (tipo) {

        tipo.addEventListener(
            "change",
            atualizarCamposVisiveis
        );

    }


    if (sexo) {

        sexo.addEventListener(
            "change",
            atualizarCamposVisiveis
        );

    }

}


/*
==================================================
MOSTRAR / OCULTAR CAMPOS
==================================================
*/

function atualizarCamposVisiveis() {

    const tipoValor =
        tipo
            ? String(tipo.value || "").trim()
            : "";

    const sexoValor =
        sexo
            ? String(sexo.value || "").trim()
            : "";

    /*
    ==========================================
    CRIANÇA → MOSTRAR IDADE
    ==========================================
    */

    const ehCrianca =
        tipoValor === "Crianca" ||
        tipoValor === "Criança";

    if (campoIdade) {

        campoIdade.style.display =
            ehCrianca
                ? "block"
                : "none";

        if (idade) {

            idade.required =
                ehCrianca;

            if (!ehCrianca) {
                idade.value = "";
            }

        }

    }


    /*
    ==========================================
    ADULTO + FEMININO → MOSTRAR CALÇADO
    ==========================================
    */

    const ehAdulto =
        tipoValor === "Adulto" ||
        tipoValor === "adulto";

    const ehFeminino =
        sexoValor === "Feminino" ||
        sexoValor === "feminino";

    const mostrarCalcado =
        ehAdulto &&
        ehFeminino;


    if (campoCalcado) {

        campoCalcado.style.display =
            mostrarCalcado
                ? "block"
                : "none";


        if (calcado) {

            /*
            Calçado NÃO é obrigatório.
            */

            calcado.required =
                false;


            if (!mostrarCalcado) {

                calcado.value = "";

            }

        }

    }

}

/*
==================================================
CONFIGURAR FORMULÁRIO
==================================================
*/

function configurarFormulario() {

    if (!formPresenca) {

        console.warn(
            "Formulário #formPresenca não encontrado."
        );

        return;

    }


    formPresenca.addEventListener(
        "submit",
        enviarConfirmacao
    );

}


/*
==================================================
GERAR CÓDIGO DE RESERVA
==================================================

Usado somente como segurança.

O código oficial deve ser o código
retornado pelo Google Sheets.

==================================================
*/

function gerarCodigoReserva() {

    const numero =
        Math.floor(
            100000 +
            Math.random() * 900000
        );

    return "CONV-" + numero;

}


/*
==================================================
OBTER VALOR
==================================================
*/

function obterValor(elemento) {

    if (!elemento) {
        return "";
    }

    return String(
        elemento.value || ""
    ).trim();

}


/*
==================================================
NORMALIZAR WHATSAPP
==================================================
*/

function normalizarWhatsApp(numero) {

    return String(
        numero || ""
    )
        .replace(
            /\D/g,
            ""
        );

}


/*
==================================================
SALVAR NO GOOGLE SHEETS
==================================================
*/

async function salvarNoGoogleSheets(dados) {

    try {

        console.log(
            "Enviando confirmação para Google Sheets:",
            dados
        );


        const resposta =
            await fetch(
                GOOGLE_SHEETS_URL,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "text/plain;charset=utf-8"
                    },

                    body:
                        JSON.stringify({

                            acao:
                                "salvarPresencas",

                            lista: [
                                dados
                            ]

                        })

                }
            );


        if (!resposta.ok) {

            throw new Error(
                "Erro HTTP " +
                resposta.status
            );

        }


        const texto =
            await resposta.text();


        console.log(
            "Resposta do Google Sheets:",
            texto
        );


        if (!texto) {

            throw new Error(
                "Google Sheets não retornou resposta."
            );

        }


        let resultado;

        try {

            resultado =
                JSON.parse(texto);

        } catch (erroJSON) {

            console.error(
                "Resposta inválida do Google Apps Script:",
                texto
            );

            throw new Error(
                "O Google Sheets não retornou JSON válido."
            );

        }


        /*
        ------------------------------------------
        FORMATO ESPERADO
        ------------------------------------------

        {
            sucesso: true,
            resultados: [
                {
                    codigo: "CONV-123456"
                }
            ]
        }

        ------------------------------------------
        */


        if (
            resultado &&
            resultado.sucesso === false
        ) {

            throw new Error(
                resultado.mensagem ||
                "Google Sheets recusou o salvamento."
            );

        }


        if (
            resultado &&
            Array.isArray(
                resultado.resultados
            ) &&
            resultado.resultados.length > 0
        ) {

            const registro =
                resultado.resultados[0];


            if (!registro.codigo) {

                throw new Error(
                    "Google Sheets não retornou o código do convite."
                );

            }


            return registro;

        }


        /*
        ------------------------------------------
        Alguns Apps Scripts retornam diretamente
        o array.
        ------------------------------------------
        */

        if (
            Array.isArray(resultado) &&
            resultado.length > 0
        ) {

            const registro =
                resultado[0];


            if (!registro.codigo) {

                throw new Error(
                    "Código não retornado pelo Google Sheets."
                );

            }


            return registro;

        }


        throw new Error(
            "Resposta do Google Sheets sem código."
        );


    } catch (erro) {

        console.error(
            "Erro ao salvar no Google Sheets:",
            erro
        );

        throw erro;

    }

}


/*
==================================================
SALVAR NO FIREBASE
==================================================
*/

async function salvarNoFirebase(dados) {

    try {

        if (
            typeof window.salvarConfirmacao !==
            "function"
        ) {

            console.warn(
                "window.salvarConfirmacao não está disponível."
            );

            return false;

        }


        const sucesso =
            await window.salvarConfirmacao(
                dados
            );


        return sucesso === true;


    } catch (erro) {

        console.error(
            "Erro ao salvar confirmação no Firebase:",
            erro
        );

        return false;

    }

}


/*
==================================================
ENVIAR CONFIRMAÇÃO
==================================================
*/

async function enviarConfirmacao(evento) {

    evento.preventDefault();


    /*
    -----------------------------------------------
    BOTÃO
    -----------------------------------------------
    */

    const botaoEnviar =
        formPresenca
            ? formPresenca.querySelector(
                'button[type="submit"]'
            )
            : null;


    let textoOriginal =
        "Confirmar presença";


    if (botaoEnviar) {

        textoOriginal =
            botaoEnviar.innerText ||
            "Confirmar presença";


        if (
            botaoEnviar.disabled
        ) {

            return;

        }


        botaoEnviar.disabled =
            true;

        botaoEnviar.innerText =
            "Salvando...";

    }


    try {


        /*
        ==========================================
        LER FORMULÁRIO
        ==========================================
        */

        const nomeValor =
    obterValor(nome);


        const tipoValor =
            obterValor(tipo);


        const idadeValor =
            tipoValor === "Crianca"
                ? obterValor(idade)
                : "";


        const sexoValor =
            obterValor(sexo);


        const calcadoValor =
            (
                tipoValor === "Adulto" &&
                sexoValor === "Feminino"
            )
                ? obterValor(calcado)
                : "";


        const whatsappValor =
            normalizarWhatsApp(
                obterValor(whatsapp)
            );

console.log(
    "CAMPOS DA CONFIRMAÇÃO:",
    {
        nome: nome?.value,
        tipo: tipo?.value,
        sexo: sexo?.value,
        idade: idade?.value,
        calcado: calcado?.value,
        whatsapp: whatsapp?.value
    }
);


        /*
        ==========================================
        VALIDAÇÕES
        ==========================================
        */

        if (!nomeValor) {

            alert(
                "Informe o nome do convidado."
            );

            return;

        }


        if (!tipoValor) {

            alert(
                "Selecione se o convidado é adulto ou criança."
            );

            return;

        }


        if (
            tipoValor === "Crianca" &&
            !idadeValor
        ) {

            alert(
                "Informe a idade da criança."
            );

            return;

        }


        if (!whatsappValor) {

            alert(
                "Informe o número de WhatsApp."
            );

            return;

        }


        /*
        ==========================================
        DADOS
        ==========================================
        */

       const dados = {

    nome:
        nomeValor,

    tipo:
        tipoValor,

            idade:
                idadeValor,

            sexo:
                sexoValor,

            calcado:
                calcadoValor,

            whatsapp:
                whatsappValor

        };


        console.log(
            "Dados preparados:",
            dados
        );


        /*
        ==========================================
        1. GOOGLE SHEETS
        ==========================================

        O código oficial nasce aqui.

        Se o Sheets falhar, NÃO gravamos no
        Firebase para evitar códigos diferentes.
        ==========================================
        */

        let resultadoGoogle;


        try {

            resultadoGoogle =
                await salvarNoGoogleSheets(
                    dados
                );

        } catch (erroGoogle) {

            console.error(
                "Falha no Google Sheets:",
                erroGoogle
            );


            alert(
                "Não foi possível registrar sua confirmação no momento.\n\n" +
                "Verifique sua conexão e tente novamente."
            );


            return;

        }


        /*
        ==========================================
        CÓDIGO OFICIAL
        ==========================================
        */

        const codigo =
            resultadoGoogle &&
            resultadoGoogle.codigo
                ? resultadoGoogle.codigo
                : null;


        if (!codigo) {

            throw new Error(
                "O Google Sheets não forneceu o código da confirmação."
            );

        }


        dados.codigo =
            codigo;


        console.log(
            "Código gerado pelo Google Sheets:",
            codigo
        );


        /*
        ==========================================
        2. FIREBASE
        ==========================================
        */

        const firebaseSalvo =
            await salvarNoFirebase(
                dados
            );


        /*
        ==========================================
        IMPORTANTE
        ==========================================

        O Google Sheets é a base principal da
        confirmação.

        Mesmo que o Firebase apresente algum
        problema, a confirmação já foi registrada
        no Sheets.

        ==========================================
        */


        if (!firebaseSalvo) {

            console.warn(
                "Confirmação salva no Google Sheets, mas não no Firebase."
            );

        }


        /*
        ==========================================
        3. MOSTRAR RESULTADO
        ==========================================
        */

        mostrarConfirmacaoSucesso(
            dados
        );


    } catch (erro) {

        console.error(
            "Erro ao confirmar presença:",
            erro
        );


        alert(
            "Não foi possível concluir a confirmação de presença.\n\n" +
            "Tente novamente."
        );


    } finally {

        if (botaoEnviar) {

            botaoEnviar.disabled =
                false;

            botaoEnviar.innerText =
                textoOriginal;

        }

    }

}


/*
==================================================
MOSTRAR SUCESSO
==================================================
*/

function mostrarConfirmacaoSucesso(dados) {

    if (!listaConvidados) {

        alert(
            "Presença confirmada!\n\n" +
            "Código: " +
            dados.codigo
        );

        return;

    }


    /*
    -----------------------------------------------
    LIMPA FORMULÁRIO
    -----------------------------------------------
    */

    if (formPresenca) {

        formPresenca.reset();

    }


    atualizarCamposVisiveis();


    /*
    -----------------------------------------------
    CARTÃO
    -----------------------------------------------
    */

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "convidado-confirmado";


    card.innerHTML = `

        <div class="sucesso-confirmacao">

            <div class="icone-sucesso">
                ✓
            </div>

            <h3>
                Presença confirmada!
            </h3>

            <p>
                ${escaparHTML(dados.nome)}
            </p>

            <div class="codigo-convite">

                <span>
                    Seu código:
                </span>

                <strong>
                    ${escaparHTML(dados.codigo)}
                </strong>

            </div>

            <div class="acoes-convite">

                <button
                    type="button"
                    class="btn-whatsapp-convite"
                    id="btnWhatsAppConvite"
                >
                    💬 Enviar pelo WhatsApp
                </button>

            </div>

        </div>

    `;


    listaConvidados.appendChild(
        card
    );


    /*
    -----------------------------------------------
    WHATSAPP
    -----------------------------------------------
    */

    const btnWhatsApp =
        card.querySelector(
            "#btnWhatsAppConvite"
        );


    if (btnWhatsApp) {

        btnWhatsApp.addEventListener(
            "click",
            function () {

                enviarConviteWhatsApp(
                    dados
                );

            }
        );

    }


    /*
    -----------------------------------------------
    ROLAR PARA RESULTADO
    -----------------------------------------------
    */

    card.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/*
==================================================
WHATSAPP
==================================================
*/

function enviarConviteWhatsApp(dados) {

    const numero =
        normalizarWhatsApp(
            dados.whatsapp
        );


    /*
    -----------------------------------------------
    LINK DO CONVITE
    -----------------------------------------------
    */

    const urlSite =
        window.location.origin +
        "/convite.html?codigo=" +
        encodeURIComponent(
            dados.codigo
        );


    /*
    -----------------------------------------------
    MENSAGEM
    -----------------------------------------------
    */

    const mensagem =
        "Olá! Sua presença no casamento de Aryana & Raul Filipe foi confirmada! ❤️\n\n" +

        "Seu código do convite é: " +
        dados.codigo +
        "\n\n" +

        "Acesse seu convite:\n" +
        urlSite;


    /*
    -----------------------------------------------
    WHATSAPP
    -----------------------------------------------
    */

    const urlWhatsApp =
        numero
            ? "https://wa.me/" +
              numero +
              "?text=" +
              encodeURIComponent(
                  mensagem
              )

            : "https://wa.me/?text=" +
              encodeURIComponent(
                  mensagem
              );


    window.open(
        urlWhatsApp,
        "_blank"
    );

}


/*
==================================================
BOTÃO VOLTAR
==================================================
*/

function configurarBotaoVoltar() {

    if (!btnVoltar) {
        return;
    }


    btnVoltar.addEventListener(
        "click",
        function () {

            if (
                window.history.length > 1
            ) {

                window.history.back();

                return;

            }


            window.location.href =
                "index.html";

        }
    );

}


/*
==================================================
ESCAPAR HTML
==================================================
*/

function escaparHTML(texto) {

    return String(
        texto ?? ""
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


/*
==================================================
FUNÇÕES GLOBAIS
==================================================
*/

window.enviarConfirmacao =
    enviarConfirmacao;


window.gerarCodigoReserva =
    gerarCodigoReserva;


window.enviarConviteWhatsApp =
    enviarConviteWhatsApp;