/*
==================================================
CASAMENTO ARYANA & RAUL FILIPE
CONFIRMAÇÃO DE PRESENÇA
==================================================
*/


/*
==================================================
GOOGLE SHEETS
==================================================
*/

const GOOGLE_SHEETS_URL =
    "https://script.google.com/macros/s/AKfycbwxoY3KVrIxOjRvZ8nWJOhwA3dWoK_OVnR3Wj893rZLONMIhIpE_TrOFaRLsmm41q1Q/exec";


/*
==================================================
ELEMENTOS
==================================================
*/

const formPresenca =
    document.getElementById("formPresenca");

const listaConvidadosFormulario =
    document.getElementById(
        "listaConvidadosFormulario"
    );

const btnAdicionarConvidado =
    document.getElementById(
        "btnAdicionarConvidado"
    );

const listaConvidados =
    document.getElementById(
        "listaConvidados"
    );

const btnVoltar =
    document.getElementById(
        "btnVoltarConfirmacao"
    );


let contadorConvidados = 1;


/*
==================================================
INICIALIZAÇÃO
==================================================
*/

function iniciarConfirmacao() {

    console.log(
        "Sistema de confirmação iniciado."
    );


    /*
    ------------------------------------------
    BOTÃO ADICIONAR
    ------------------------------------------
    */

    if (btnAdicionarConvidado) {

        btnAdicionarConvidado.addEventListener(
            "click",
            function (evento) {

                evento.preventDefault();

                console.log(
                    "Botão adicionar convidado clicado."
                );

                adicionarOutroConvidado();

            }
        );

    } else {

        console.error(
            "ERRO: botão #btnAdicionarConvidado não encontrado."
        );

    }


    /*
    ------------------------------------------
    FORMULÁRIO
    ------------------------------------------
    */

    if (formPresenca) {

        formPresenca.addEventListener(
            "submit",
            enviarConfirmacao
        );

    }


    /*
    ------------------------------------------
    CONFIGURA CONVIDADO 1
    ------------------------------------------
    */

    const primeiroBloco =
        listaConvidadosFormulario
            ?.querySelector(
                ".bloco-convidado"
            );


    if (primeiroBloco) {

        configurarBlocoConvidado(
            primeiroBloco
        );

    }


    /*
    ------------------------------------------
    BOTÃO VOLTAR
    ------------------------------------------
    */

    if (btnVoltar) {

        btnVoltar.addEventListener(
            "click",
            function () {

                if (
                    window.history.length > 1
                ) {

                    window.history.back();

                } else {

                    window.location.href =
                        "index.html";

                }

            }
        );

    }

}


/*
==================================================
ADICIONAR OUTRO CONVIDADO
==================================================
*/

function adicionarOutroConvidado() {

    if (!listaConvidadosFormulario) {

        console.error(
            "ERRO: #listaConvidadosFormulario não encontrado."
        );

        return;

    }


    contadorConvidados++;


    const numero =
        contadorConvidados;


    console.log(
        "Criando convidado:",
        numero
    );


    const bloco =
        document.createElement("div");


    bloco.className =
        "bloco-convidado";


    bloco.dataset.convidado =
        numero;


    bloco.innerHTML = `

        <div class="cabecalho-convidado">

            <h3>
                Convidado ${numero}
            </h3>

            <button
                type="button"
                class="btn-remover-convidado"
            >
                ✕ Remover
            </button>

        </div>


        <label>
            Nome completo
        </label>

        <input
            type="text"
            class="campo-nome"
            placeholder="Digite o nome completo"
        >


        <label>
            Tipo de convidado
        </label>

        <select
            class="campo-tipo"
        >

            <option value="">
                Selecione
            </option>

            <option value="Adulto">
                Adulto
            </option>

            <option value="Crianca">
                Criança
            </option>

        </select>


        <div
            class="campo-idade-container"
            style="display:none;"
        >

            <label>
                Idade da criança
            </label>

            <input
                type="number"
                class="campo-idade"
                min="0"
                max="17"
            >

        </div>


        <label>
            Sexo <span>(opcional)</span>
        </label>

        <select
            class="campo-sexo"
        >

            <option value="">
                Não informar
            </option>

            <option value="Feminino">
                Feminino
            </option>

            <option value="Masculino">
                Masculino
            </option>

        </select>


        <div
            class="campo-calcado-container"
            style="display:none;"
        >

            <label>
                Número do calçado
            </label>

            <input
                type="number"
                class="campo-calcado"
                min="20"
                max="50"
            >

        </div>


        <label>
            WhatsApp
        </label>

        <input
            type="tel"
            class="campo-whatsapp"
            placeholder="(21) 99999-9999"
        >

    `;


    listaConvidadosFormulario.appendChild(
        bloco
    );


    /*
    ------------------------------------------
    CONFIGURA O NOVO BLOCO
    ------------------------------------------
    */

    configurarBlocoConvidado(
        bloco
    );


    /*
    ------------------------------------------
    SCROLL
    ------------------------------------------
    */

    bloco.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}


/*
==================================================
CONFIGURAR BLOCO
==================================================
*/

function configurarBlocoConvidado(
    bloco
) {

    if (!bloco) {
        return;
    }


    const tipo =
        bloco.querySelector(
            ".campo-tipo"
        );

    const sexo =
        bloco.querySelector(
            ".campo-sexo"
        );

    const idadeContainer =
        bloco.querySelector(
            ".campo-idade-container"
        );

    const idade =
        bloco.querySelector(
            ".campo-idade"
        );

    const calcadoContainer =
        bloco.querySelector(
            ".campo-calcado-container"
        );

    const calcado =
        bloco.querySelector(
            ".campo-calcado"
        );


    function atualizarCampos() {

        const tipoValor =
            tipo
                ? tipo.value
                : "";


        const sexoValor =
            sexo
                ? sexo.value
                : "";


        /*
        ======================================
        CRIANÇA
        ======================================
        */

        const ehCrianca =
            tipoValor === "Crianca";


        if (idadeContainer) {

            idadeContainer.style.display =
                ehCrianca
                    ? "block"
                    : "none";

        }


        if (idade) {

            idade.required =
                ehCrianca;


            if (!ehCrianca) {

                idade.value = "";

            }

        }


        /*
        ======================================
        MULHER ADULTA
        ======================================
        */

        const mostrarCalcado =
            tipoValor === "Adulto" &&
            sexoValor === "Feminino";


        if (calcadoContainer) {

            calcadoContainer.style.display =
                mostrarCalcado
                    ? "block"
                    : "none";

        }


        if (calcado) {

            calcado.required = false;


            if (!mostrarCalcado) {

                calcado.value = "";

            }

        }

    }


    if (tipo) {

        tipo.addEventListener(
            "change",
            atualizarCampos
        );

    }


    if (sexo) {

        sexo.addEventListener(
            "change",
            atualizarCampos
        );

    }


    /*
    ======================================
    REMOVER CONVIDADO
    ======================================
    */

    const btnRemover =
        bloco.querySelector(
            ".btn-remover-convidado"
        );


    if (btnRemover) {

        btnRemover.addEventListener(
            "click",
            function () {

                bloco.remove();

                renumerarConvidados();

            }
        );

    }


    atualizarCampos();

}


/*
==================================================
RENUMERAR
==================================================
*/

function renumerarConvidados() {

    const blocos =
        listaConvidadosFormulario
            ? listaConvidadosFormulario.querySelectorAll(
                ".bloco-convidado"
            )
            : [];


    blocos.forEach(
        function (
            bloco,
            indice
        ) {

            const numero =
                indice + 1;


            bloco.dataset.convidado =
                numero;


            const titulo =
                bloco.querySelector(
                    "h3"
                );


            if (titulo) {

                titulo.textContent =
                    "Convidado " +
                    numero;

            }

        }
    );


    contadorConvidados =
        blocos.length;


    console.log(
        "Total de convidados:",
        contadorConvidados
    );

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
    ).replace(
        /\D/g,
        ""
    );

}


/*
==================================================
SALVAR GOOGLE SHEETS
==================================================
*/

async function salvarNoGoogleSheets(
    dados
) {

    console.log(
        "Enviando para Google Sheets:",
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
        "Resposta Google Sheets:",
        texto
    );


    if (!texto) {

        throw new Error(
            "Google Sheets não retornou resposta."
        );

    }


    const resultado =
        JSON.parse(texto);


    if (
        resultado.sucesso === false
    ) {

        throw new Error(
            resultado.mensagem ||
            "Google Sheets recusou o salvamento."
        );

    }


    if (
        resultado.resultados &&
        resultado.resultados.length
    ) {

        return resultado.resultados[0];

    }


    if (
        Array.isArray(resultado) &&
        resultado.length
    ) {

        return resultado[0];

    }


    throw new Error(
        "Google Sheets não retornou código."
    );

}


/*
==================================================
FIREBASE
==================================================
*/

async function salvarNoFirebase(
    dados
) {

    try {

        if (
            typeof window.salvarConfirmacao !==
            "function"
        ) {

            console.warn(
                "Firebase: função salvarConfirmacao não disponível."
            );

            return false;

        }


        return await
            window.salvarConfirmacao(
                dados
            );

    } catch (erro) {

        console.error(
            "Erro Firebase:",
            erro
        );

        return false;

    }

}


/*
==================================================
CONFIRMAR PRESENÇA
==================================================
*/

async function enviarConfirmacao(
    evento
) {

    evento.preventDefault();


    const botao =
        formPresenca
            ?.querySelector(
                'button[type="submit"]'
            );


    if (botao?.disabled) {
        return;
    }


    if (botao) {

        botao.disabled =
            true;

        botao.innerText =
            "Salvando...";

    }


    try {

        const blocos =
            listaConvidadosFormulario
                .querySelectorAll(
                    ".bloco-convidado"
                );


        if (!blocos.length) {

            throw new Error(
                "Nenhum convidado encontrado."
            );

        }


        const convidados = [];


        /*
        ======================================
        LER CONVIDADOS
        ======================================
        */

        for (
            const bloco
            of blocos
        ) {

            const nome =
                obterValor(
                    bloco.querySelector(
                        ".campo-nome"
                    )
                );


            const tipo =
                obterValor(
                    bloco.querySelector(
                        ".campo-tipo"
                    )
                );


            const idade =
                tipo === "Crianca"
                    ? obterValor(
                        bloco.querySelector(
                            ".campo-idade"
                        )
                    )
                    : "";


            const sexo =
                obterValor(
                    bloco.querySelector(
                        ".campo-sexo"
                    )
                );


            const calcado =
                (
                    tipo === "Adulto" &&
                    sexo === "Feminino"
                )
                    ? obterValor(
                        bloco.querySelector(
                            ".campo-calcado"
                        )
                    )
                    : "";


            const whatsapp =
                normalizarWhatsApp(
                    obterValor(
                        bloco.querySelector(
                            ".campo-whatsapp"
                        )
                    )
                );


            /*
            ==================================
            VALIDAÇÕES
            ==================================
            */

            if (!nome) {

                alert(
                    "Informe o nome de todos os convidados."
                );

                return;

            }


            if (!tipo) {

                alert(
                    "Selecione o tipo de todos os convidados."
                );

                return;

            }


            if (
                tipo === "Crianca" &&
                !idade
            ) {

                alert(
                    "Informe a idade da criança."
                );

                return;

            }


            if (!whatsapp) {

                alert(
                    "Informe o WhatsApp de todos os convidados."
                );

                return;

            }


            convidados.push({

                nome:
                    nome,

                tipo:
                    tipo,

                idade:
                    idade,

                sexo:
                    sexo,

                calcado:
                    calcado,

                whatsapp:
                    whatsapp

            });

        }


        /*
        ======================================
        SALVAR TODOS
        ======================================
        */

        const confirmados = [];


        for (
            const convidado
            of convidados
        ) {

            console.log(
                "Salvando convidado:",
                convidado
            );


            /*
            GOOGLE
            */

            const resultado =
                await salvarNoGoogleSheets(
                    convidado
                );


            if (
                !resultado ||
                !resultado.codigo
            ) {

                throw new Error(
                    "Google Sheets não retornou o código."
                );

            }


            convidado.codigo =
                resultado.codigo;


            /*
            FIREBASE
            */

            await salvarNoFirebase(
                convidado
            );


            confirmados.push(
                convidado
            );

        }


        /*
        ======================================
        SUCESSO
        ======================================
        */

        mostrarConfirmacoesSucesso(
            confirmados
        );


    } catch (erro) {

        console.error(
            "Erro ao confirmar:",
            erro
        );


        alert(
            "Não foi possível concluir a confirmação.\n\n" +
            erro.message
        );


    } finally {

        if (botao) {

            botao.disabled =
                false;

            botao.innerText =
                "Confirmar presença";

        }

    }

}


/*
==================================================
MOSTRAR SUCESSO
==================================================
*/

function mostrarConfirmacoesSucesso(
    convidados
) {

    if (!listaConvidados) {

        console.error(
            "ERRO: #listaConvidados não encontrado."
        );

        return;

    }


    /*
    ======================================
    LIMPA RESULTADO ANTERIOR
    ======================================
    */

    listaConvidados.innerHTML = "";


    /*
    ======================================
    ESCONDE O FORMULÁRIO
    ======================================
    */

    if (formPresenca) {

        formPresenca.style.display =
            "none";

    }


    /*
    ======================================
    CRIA CARD DE SUCESSO
    ======================================
    */

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "convidados-confirmados";


    let html = `

        <div class="sucesso-confirmacao">

            <div class="icone-sucesso">
                ✓
            </div>

            <h3>
                Presença confirmada!
            </h3>

            <p>
                ${convidados.length === 1
                    ? "O convidado foi registrado com sucesso."
                    : "Todos os convidados foram registrados com sucesso."
                }
            </p>

            <p class="mensagem-codigos">
                Guarde os códigos abaixo. Eles identificam
                individualmente cada convidado.
            </p>

            <div class="lista-codigos">

    `;


    /*
    ======================================
    LISTA DOS CONVIDADOS
    ======================================
    */

    convidados.forEach(
        function (
            convidado,
            indice
        ) {

            html += `

                <div
                    class="codigo-convidado"
                    data-indice="${indice}"
                >

                    <div class="numero-convidado">
                        Convidado ${indice + 1}
                    </div>

                    <strong class="nome-convidado">
                        ${escaparHTML(
                            convidado.nome
                        )}
                    </strong>

                    <div class="codigo-label">
                        Código do convite
                    </div>

                    <strong class="codigo-valor">
                        ${escaparHTML(
                            convidado.codigo
                        )}
                    </strong>

                    <button
                        type="button"
                        class="btn-whatsapp-convite"
                    >
                        💬 Enviar convite pelo WhatsApp
                    </button>

                </div>

            `;

        }
    );


    html += `

            </div>


            <div class="mensagem-final-confirmacao">

                ❤️ Obrigado por confirmar sua presença!

                <br><br>

                Estamos muito felizes em celebrar
                esse momento com você.

            </div>


            <button
                type="button"
                class="btn-nova-confirmacao"
            >
                Fazer nova confirmação
            </button>

        </div>

    `;


    /*
    ======================================
    INSERE RESULTADO
    ======================================
    */

    card.innerHTML =
        html;


    listaConvidados.appendChild(
        card
    );


    /*
    ======================================
    BOTÕES WHATSAPP
    ======================================
    */

    const botoesWhatsApp =
        card.querySelectorAll(
            ".btn-whatsapp-convite"
        );


    botoesWhatsApp.forEach(
        function (
            botao,
            indice
        ) {

            botao.addEventListener(
                "click",
                function () {

                    enviarConviteWhatsApp(
                        convidados[indice]
                    );

                }
            );

        }
    );


    /*
    ======================================
    NOVA CONFIRMAÇÃO
    ======================================
    */

    const btnNovaConfirmacao =
        card.querySelector(
            ".btn-nova-confirmacao"
        );


    if (btnNovaConfirmacao) {

        btnNovaConfirmacao.addEventListener(
            "click",
            function () {

                /*
                ------------------------------
                LIMPA RESULTADO
                ------------------------------
                */

                listaConvidados.innerHTML =
                    "";


                /*
                ------------------------------
                MOSTRA FORMULÁRIO NOVAMENTE
                ------------------------------
                */

                if (formPresenca) {

                    formPresenca.style.display =
                        "";

                    formPresenca.reset();

                }


                /*
                ------------------------------
                REMOVE CONVIDADOS EXTRAS
                ------------------------------
                */

                const blocos =
                    listaConvidadosFormulario
                        ?.querySelectorAll(
                            ".bloco-convidado"
                        );


                if (blocos) {

                    blocos.forEach(
                        function (
                            bloco,
                            indice
                        ) {

                            if (indice > 0) {

                                bloco.remove();

                            }

                        }
                    );

                }


                /*
                ------------------------------
                REINICIA CONTADOR
                ------------------------------
                */

                contadorConvidados =
                    1;


                /*
                ------------------------------
                CONFIGURA CONVIDADO 1
                ------------------------------
                */

                const primeiro =
                    listaConvidadosFormulario
                        ?.querySelector(
                            ".bloco-convidado"
                        );


                if (primeiro) {

                    configurarBlocoConvidado(
                        primeiro
                    );

                }


                /*
                ------------------------------
                VOLTA PARA O FORMULÁRIO
                ------------------------------
                */

                formPresenca?.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }
        );

    }


    /*
    ======================================
    ROLAGEM PARA O RESULTADO
    ======================================
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

function enviarConviteWhatsApp(
    dados
) {

    const numero =
        normalizarWhatsApp(
            dados.whatsapp
        );

    const mensagem =
        "Olá! Sua presença no casamento de Aryana & Raul Filipe foi confirmada! ❤️\n\n" +

        "Seu código do convite é: " +
        dados.codigo;


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
ESCAPAR HTML
==================================================
*/

function escaparHTML(
    texto
) {

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
 FUNÇÃO GLOBAL
==================================================
*/

window.adicionarOutroConvidado =
    adicionarOutroConvidado;

window.enviarConfirmacao =
    enviarConfirmacao;

window.enviarConviteWhatsApp =
    enviarConviteWhatsApp;


/*
==================================================
INICIAR
==================================================
*/

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        iniciarConfirmacao
    );

} else {

    iniciarConfirmacao();

}