/*
================================================
CASAMENTO ARYANA & RAUL FILIPE

LISTA DE PRESENTES

Arquivo: presentes.js

Funções:
- Carregar presentes
- Pesquisa
- Filtros
- Escolha de presente
- Registro Firebase
- PIX
- Validação de comprovante
- Registro PIX no Google Sheets

IMPORTANTE:
O comprovante do PIX NÃO é armazenado.
Ele permanece somente no navegador para
validar o envio antes do registro.
================================================
*/


/*
================================================
VARIÁVEIS
================================================
*/

let presenteSelecionado = null;

let presentesEscolhidos = [];

let categoriaAtual = "Todos";

let textoPesquisa = "";

let listaPresentes = [];


/*
================================================
CONFIGURAÇÃO PIX
================================================
*/

const CHAVE_PIX =
    "anayrasr@gmail.com";


/*
================================================
INICIALIZAÇÃO
================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "Lista de presentes iniciada."
        );

        configurarPesquisa();

        configurarCategorias();

        configurarModal();

        configurarBotaoConfirmar();

        configurarFormularioPix();

        await carregarStatusPresentes();

        carregarPresentes();

    }
);


/*
================================================
CONFIGURAR FORMULÁRIO PIX
================================================
*/

function configurarFormularioPix() {

    const comprovante =
        document.getElementById(
            "comprovantePix"
        );

    const botao =
        document.getElementById(
            "btnConfirmarPix"
        );

    const nome =
        document.getElementById(
            "nomeConvidadoPix"
        );

    const valor =
        document.getElementById(
            "valorPix"
        );

    const nomeArquivo =
        document.getElementById(
            "nomeArquivoPix"
        );


    if (!comprovante || !botao) {

        console.warn(
            "Elementos do formulário PIX não encontrados."
        );

        return;

    }


    /*
    --------------------------------------------
    ESTADO INICIAL
    --------------------------------------------
    */

    botao.disabled = true;


    /*
    --------------------------------------------
    ANEXAR COMPROVANTE
    --------------------------------------------
    */

    comprovante.addEventListener(
        "change",
        function () {

            const arquivo =
                this.files[0];


            botao.disabled =
                true;


            if (nomeArquivo) {

                nomeArquivo.textContent =
                    "";

            }


            if (!arquivo) {

                atualizarEstadoBotaoPix();

                return;

            }


            const tamanhoMaximo =
                10 * 1024 * 1024;


            const tiposPermitidos = [

                "image/jpeg",

                "image/png",

                "image/webp",

                "application/pdf"

            ];


            if (
                arquivo.size >
                tamanhoMaximo
            ) {

                alert(
                    "O comprovante deve ter no máximo 10 MB."
                );

                this.value = "";

                atualizarEstadoBotaoPix();

                return;

            }


            if (
                !tiposPermitidos.includes(
                    arquivo.type
                )
            ) {

                alert(
                    "Formato de comprovante não permitido."
                );

                this.value = "";

                atualizarEstadoBotaoPix();

                return;

            }


            if (nomeArquivo) {

                nomeArquivo.textContent =
                    "✓ Comprovante anexado: " +
                    arquivo.name;

            }


            atualizarEstadoBotaoPix();

        }
    );


    /*
    --------------------------------------------
    NOME
    --------------------------------------------
    */

    if (nome) {

        nome.addEventListener(
            "input",
            atualizarEstadoBotaoPix
        );

    }


    /*
    --------------------------------------------
    VALOR
    --------------------------------------------
    */

    if (valor) {

        valor.addEventListener(
            "input",
            function () {

                formatarValorPix();

                atualizarEstadoBotaoPix();

            }
        );

    }


    /*
    --------------------------------------------
    BOTÃO
    --------------------------------------------
    */

    botao.addEventListener(
        "click",
        registrarPix
    );


    console.log(
        "Botão PIX configurado com sucesso."
    );

}


/*
================================================
FECHAR PIX
================================================
*/

function fecharPix() {

    const modal =
        document.getElementById(
            "modalPix"
        );


    if (modal) {

        modal.classList.remove(
            "ativo"
        );

        modal.style.display =
            "none";

    }


    const nome =
        document.getElementById(
            "nomeConvidadoPix"
        );


    const valor =
        document.getElementById(
            "valorPix"
        );


    const comprovante =
        document.getElementById(
            "comprovantePix"
        );


    const nomeArquivo =
        document.getElementById(
            "nomeArquivoPix"
        );


    const status =
        document.getElementById(
            "statusPix"
        );


    const botao =
        document.getElementById(
            "btnConfirmarPix"
        );


    if (nome) {

        nome.value =
            "";

    }


    if (valor) {

        valor.value =
            "";

    }


    if (comprovante) {

        comprovante.value =
            "";

    }


    if (nomeArquivo) {

        nomeArquivo.textContent =
            "";

    }


    if (status) {

        status.textContent =
            "";

    }


    if (botao) {

        botao.disabled =
            true;

        botao.textContent =
            "Confirmar presente com PIX";

    }


    presenteSelecionado =
        null;

}


/*
================================================
OBTER LISTA DO DATA.JS
================================================
*/

function obterPresentes() {

    if (
        Array.isArray(
            window.presentes
        )
    ) {

        return window.presentes;

    }


    console.error(
        "A lista 'presentes' não foi encontrada no data.js."
    );


    return [];

}


/*
================================================
NORMALIZAR TEXTO
================================================
*/

function normalizarTexto(
    texto
) {

    return String(
        texto ?? ""
    )
    .normalize("NFD")
    .replace(
        /[\u0300-\u036f]/g,
        ""
    )
    .toLowerCase()
    .trim();

}


/*
================================================
PESQUISA
================================================
*/

function configurarPesquisa() {

    const campo =
        document.getElementById(
            "buscar"
        );


    if (!campo) {

        return;

    }


    campo.addEventListener(
        "input",
        () => {

            textoPesquisa =
                normalizarTexto(
                    campo.value
                );


            carregarPresentes();

        }
    );

}


/*
================================================
FILTROS
================================================
*/

function configurarCategorias() {

    const botoes =
        document.querySelectorAll(
            ".categorias button"
        );


    botoes.forEach(
        botao => {

            botao.addEventListener(
                "click",
                () => {

                    categoriaAtual =
                        botao.dataset.cat ||
                        "Todos";


                    botoes.forEach(
                        btn => {

                            btn.classList.remove(
                                "ativo"
                            );

                        }
                    );


                    botao.classList.add(
                        "ativo"
                    );


                    carregarPresentes();

                }
            );

        }
    );

}


/*
================================================
MODAL
================================================
*/

function configurarModal() {

    const modal =
        document.getElementById(
            "modalPresente"
        );


    const fechar =
        document.querySelector(
            ".fechar"
        );


    if (fechar) {

        fechar.addEventListener(
            "click",
            () => {

                fecharModalPresente();

            }
        );

    }


    if (modal) {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    fecharModalPresente();

                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                fecharModalPresente();

                fecharPix();

            }

        }
    );

}


/*
================================================
FECHAR MODAL PRESENTE
================================================
*/

function fecharModalPresente() {

    const modal =
        document.getElementById(
            "modalPresente"
        );


    if (modal) {

        modal.style.display =
            "none";

    }


    presenteSelecionado =
        null;

}


/*
================================================
STATUS FIREBASE
================================================
*/

async function carregarStatusPresentes() {

    try {

        if (
            typeof window.buscarPresentesEscolhidos !==
            "function"
        ) {

            console.warn(
                "window.buscarPresentesEscolhidos() não está disponível."
            );


            presentesEscolhidos =
                [];


            return;

        }


        presentesEscolhidos =
            await window.buscarPresentesEscolhidos();


        if (
            !Array.isArray(
                presentesEscolhidos
            )
        ) {

            presentesEscolhidos =
                [];

        }


        console.log(
            "Presentes já escolhidos:",
            presentesEscolhidos.length
        );


    } catch (error) {

        console.error(
            "Erro ao carregar escolhas:",
            error
        );


        presentesEscolhidos =
            [];

    }

}


/*
================================================
CARREGAR PRESENTES
================================================
*/

function carregarPresentes() {

    const container =
        document.getElementById(
            "listaPresentes"
        );


    if (!container) {

        console.error(
            "Elemento #listaPresentes não encontrado."
        );


        return;

    }


    container.innerHTML =
        "";


    const todosPresentes =
        obterPresentes();


    listaPresentes =
        [...todosPresentes];


    /*
    --------------------------------------------
    PESQUISA
    --------------------------------------------
    */

    if (
        textoPesquisa !== ""
    ) {

        listaPresentes =
            listaPresentes.filter(
                presente => {

                    const nome =
                        normalizarTexto(
                            presente.nome
                        );


                    const categoria =
                        normalizarTexto(
                            presente.categoria
                        );


                    return (

                        nome.includes(
                            textoPesquisa
                        )

                        ||

                        categoria.includes(
                            textoPesquisa
                        )

                    );

                }
            );

    }


    /*
    --------------------------------------------
    CATEGORIA
    --------------------------------------------
    */

    if (
        normalizarTexto(
            categoriaAtual
        ) !==
        normalizarTexto(
            "Todos"
        )
    ) {

        listaPresentes =
            listaPresentes.filter(
                presente => {

                    return (

                        normalizarTexto(
                            presente.categoria
                        )
                        ===
                        normalizarTexto(
                            categoriaAtual
                        )

                    );

                }
            );

    }


    /*
    --------------------------------------------
    ORDENAR
    --------------------------------------------
    */

    listaPresentes.sort(
        (a, b) => {

            return String(
                a.nome ?? ""
            ).localeCompare(
                String(
                    b.nome ?? ""
                ),
                "pt-BR"
            );

        }
    );


    /*
    --------------------------------------------
    CONTADOR
    --------------------------------------------
    */

    const contador =
        document.getElementById(
            "contadorPresentes"
        );


    if (contador) {

        contador.textContent =
            `${listaPresentes.length} presentes`;

    }


    /*
    --------------------------------------------
    NENHUM RESULTADO
    --------------------------------------------
    */

    if (
        listaPresentes.length === 0
    ) {

        const mensagem =
            document.createElement(
                "div"
            );


        mensagem.className =
            "nenhum-presente";


        mensagem.textContent =
            "Nenhum presente encontrado.";


        container.appendChild(
            mensagem
        );


        return;

    }


    /*
    --------------------------------------------
    CRIAR CARDS
    --------------------------------------------
    */

    listaPresentes.forEach(
        presente => {

            criarCardPresente(
                presente,
                container
            );

        }
    );

}


/*
================================================
CRIAR CARD
================================================
*/

function criarCardPresente(
    presente,
    container
) {

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "card-presente";


    const escolhas =
        Array.isArray(
            presentesEscolhidos
        )
        ?
        presentesEscolhidos.filter(
            escolha =>
                Number(
                    escolha.presenteId
                )
                ===
                Number(
                    presente.id
                )
        )
        :
        [];


    const quantidadeEscolhas =
        escolhas.length;


    let avisoEscolhido =
        "";


    if (
        quantidadeEscolhas > 0
    ) {

        avisoEscolhido = `

            <div class="aviso-ja-escolhido">

                ❤️ Já escolhido

            </div>

        `;

    }


    const imagem =
        presente.imagem ||
        "imagens/presente-padrao.jpg";


    card.innerHTML = `

        <img
            class="imagem-presente"
            src="${escaparHTML(imagem)}"
            alt="${escaparHTML(
                presente.nome
            )}"
        >


        <div class="info-presente">

            <div class="categoria">

                ${escaparHTML(
                    presente.categoria
                )}

            </div>


            <h3>

                ${escaparHTML(
                    presente.nome
                )}

            </h3>


            ${avisoEscolhido}


            <div class="acoes-presente">

                <button
                    type="button"
                    class="btn-presente btn-escolher"
                    data-id="${escaparHTML(
                        presente.id
                    )}">

                    Escolher presente

                </button>


                <button
                    type="button"
                    class="btn-presente btn-pix"
                    data-pix-id="${escaparHTML(
                        presente.id
                    )}">

                    Presentear com PIX

                </button>

            </div>

        </div>

    `;


    /*
    --------------------------------------------
    IMAGEM
    --------------------------------------------
    */

    const img =
        card.querySelector(
            ".imagem-presente"
        );


    if (img) {

        img.addEventListener(
            "error",
            () => {

                if (
                    !img.dataset.erro
                ) {

                    img.dataset.erro =
                        "1";


                    img.src =
                        "imagens/presente-padrao.jpg";

                }

            }
        );

    }


    /*
    --------------------------------------------
    ESCOLHER PRESENTE
    --------------------------------------------
    */

    const botaoEscolher =
        card.querySelector(
            ".btn-escolher"
        );


    if (botaoEscolher) {

        botaoEscolher.addEventListener(
            "click",
            () => {

                escolherPresente(
                    presente.id
                );

            }
        );

    }


    /*
    --------------------------------------------
    PIX
    --------------------------------------------
    */

    const botaoPix =
        card.querySelector(
            ".btn-pix"
        );


    if (botaoPix) {

        botaoPix.addEventListener(
            "click",
            () => {

                abrirPix(
                    presente.id
                );

            }
        );

    }


    container.appendChild(
        card
    );

}


/*
================================================
ESCOLHER PRESENTE
================================================
*/

function escolherPresente(
    id
) {

    const presentesAtuais =
        obterPresentes();


    presenteSelecionado =
        presentesAtuais.find(
            presente =>
                Number(
                    presente.id
                )
                ===
                Number(id)
        );


    if (
        !presenteSelecionado
    ) {

        console.error(
            "Presente não encontrado:",
            id
        );


        return;

    }


    const titulo =
        document.getElementById(
            "tituloPresente"
        );


    if (titulo) {

        titulo.textContent =
            presenteSelecionado.nome;

    }


    const imagem =
        document.getElementById(
            "imagemPresente"
        );


    if (imagem) {

        imagem.src =
            presenteSelecionado.imagem ||
            "imagens/presente-padrao.jpg";


        imagem.alt =
            presenteSelecionado.nome;

    }


    const valor =
        document.getElementById(
            "valorPresente"
        );


    if (valor) {

        valor.style.display =
            "none";

        valor.innerHTML =
            "";

    }


    const nome =
        document.getElementById(
            "nomeConvidado"
        );


    if (nome) {

        nome.value =
            "";

    }


    const mensagem =
        document.getElementById(
            "mensagem"
        );


    if (mensagem) {

        mensagem.value =
            "";

    }


    const modal =
        document.getElementById(
            "modalPresente"
        );


    if (modal) {

        modal.style.display =
            "flex";


        setTimeout(
            () => {

                if (nome) {

                    nome.focus();

                }

            },
            100
        );

    }

}


/*
================================================
CONFIGURAR BOTÃO CONFIRMAR PRESENTE
================================================
*/

function configurarBotaoConfirmar() {

    const botao =
        document.getElementById(
            "confirmarEscolha"
        );


    if (!botao) {

        return;

    }


    botao.addEventListener(
        "click",
        confirmarEscolha
    );

}


/*
================================================
CONFIRMAR ESCOLHA
================================================
*/

async function confirmarEscolha() {

    console.log(
        "================================="
    );


    console.log(
        "CONFIRMAÇÃO DE PRESENTE INICIADA"
    );


    console.log(
        "================================="
    );


    if (!presenteSelecionado) {

        console.error(
            "Nenhum presente está selecionado."
        );


        alert(
            "Selecione um presente antes de confirmar."
        );


        return;

    }


    console.log(
        "Presente selecionado:",
        presenteSelecionado
    );


    const campoNome =
        document.getElementById(
            "nomeConvidado"
        );


    if (!campoNome) {

        console.error(
            "Campo #nomeConvidado não encontrado."
        );


        alert(
            "Não foi possível localizar o campo de nome."
        );


        return;

    }


    const nome =
        campoNome.value.trim();


    if (
        nome === ""
    ) {

        alert(
            "Informe seu nome."
        );


        campoNome.focus();


        return;

    }


    const campoMensagem =
        document.getElementById(
            "mensagem"
        );


    const mensagem =
        campoMensagem
            ? campoMensagem.value.trim()
            : "";


    const botao =
        document.getElementById(
            "confirmarEscolha"
        );


    if (botao) {

        botao.disabled =
            true;


        botao.textContent =
            "Salvando...";

    }


    try {

        console.log(
            "Verificando salvarEscolhaPresente..."
        );


        if (
            typeof window.salvarEscolhaPresente !==
            "function"
        ) {

            throw new Error(
                "A função de salvamento dos presentes não está disponível."
            );

        }


        /*
        ----------------------------------------
        IMPORTANTE
        ----------------------------------------

        Mantemos o formato que o seu
        firebase-service.js já espera:

        convidado = texto

        ----------------------------------------
        */

        const convidado =
            nome;


        console.log(
            "Dados que serão enviados:",
            {
                presente:
                    presenteSelecionado,

                convidado:
                    convidado,

                mensagem:
                    mensagem
            }
        );


        console.log(
            "Chamando salvarEscolhaPresente()..."
        );


        const resultado =
            await window.salvarEscolhaPresente(
                presenteSelecionado,
                convidado
            );


        console.log(
            "Retorno de salvarEscolhaPresente():",
            resultado
        );


        if (
            resultado === false
        ) {

            throw new Error(
                "O sistema informou que não foi possível salvar a escolha."
            );

        }


        /*
        ----------------------------------------
        ATUALIZAR STATUS
        ----------------------------------------
        */

        await carregarStatusPresentes();


        carregarPresentes();


        /*
        ----------------------------------------
        FECHAR MODAL
        ----------------------------------------
        */

        fecharModalPresente();


        /*
        ----------------------------------------
        SUCESSO
        ----------------------------------------
        */

        mostrarMensagem(
            "Presente escolhido com sucesso! ❤️"
        );


        console.log(
            "CONFIRMAÇÃO CONCLUÍDA COM SUCESSO."
        );


    } catch (error) {

        console.error(
            "================================="
        );


        console.error(
            "ERRO AO CONFIRMAR PRESENTE"
        );


        console.error(
            error
        );


        console.error(
            "================================="
        );


        alert(
            "Não foi possível registrar sua escolha.\n\n" +
            (
                error?.message ||
                "Verifique sua conexão e tente novamente."
            )
        );


    } finally {

        if (botao) {

            botao.disabled =
                false;


            botao.textContent =
                "Confirmar Escolha";

        }

    }

}


/*
================================================
FORMATAR VALOR PIX
================================================
*/

function formatarValorPix() {

    const campo =
        document.getElementById(
            "valorPix"
        );


    if (!campo) {

        return;

    }


    let valor =
        campo.value;


    valor =
        valor.replace(
            /\D/g,
            ""
        );


    if (
        valor === ""
    ) {

        campo.value =
            "";

        return;

    }


    const numero =
        Number(valor) / 100;


    campo.value =
        numero.toLocaleString(
            "pt-BR",
            {
                style:
                    "currency",

                currency:
                    "BRL"
            }
        );

}


/*
================================================
OBTER VALOR NUMÉRICO
================================================
*/

function obterValorPixNumerico() {

    const campo =
        document.getElementById(
            "valorPix"
        );


    if (!campo) {

        return 0;

    }


    let valor =
        campo.value
            .replace(
                /R\$/gi,
                ""
            )
            .replace(
                /\s/g,
                ""
            )
            .replace(
                /\./g,
                ""
            )
            .replace(
                ",",
                "."
            );


    const numero =
        Number(valor);


    if (
        !Number.isFinite(
            numero
        )
    ) {

        return 0;

    }


    return numero;

}


/*
================================================
ATUALIZAR BOTÃO PIX
================================================
*/

function atualizarEstadoBotaoPix() {

    const botao =
        document.getElementById(
            "btnConfirmarPix"
        );


    const nome =
        document.getElementById(
            "nomeConvidadoPix"
        );


    const valor =
        obterValorPixNumerico();


    const comprovante =
        document.getElementById(
            "comprovantePix"
        );


    const nomeValido =
        !!(
            nome &&
            nome.value.trim() !== ""
        );


    const valorValido =
        valor > 0;


    const comprovanteValido =
        !!(
            comprovante &&
            comprovante.files &&
            comprovante.files.length > 0
        );


    const podeConfirmar =
        nomeValido &&
        valorValido &&
        comprovanteValido;


    if (botao) {

        botao.disabled =
            !podeConfirmar;

    }


    const status =
        document.getElementById(
            "statusPix"
        );


    if (status) {

        if (!nomeValido) {

            status.textContent =
                "Informe seu nome.";

        }

        else if (!valorValido) {

            status.textContent =
                "Informe o valor que deseja presentear.";

        }

        else if (!comprovanteValido) {

            status.textContent =
                "Anexe o comprovante do PIX.";

        }

        else {

            status.textContent =
                "Tudo certo! Você já pode confirmar o presente. ❤️";

        }

    }

}


/*
================================================
ABRIR PIX
================================================
*/

function abrirPix(
    id
) {

    const presentesAtuais =
        obterPresentes();


    presenteSelecionado =
        presentesAtuais.find(
            presente =>
                Number(
                    presente.id
                )
                ===
                Number(id)
        );


    if (
        !presenteSelecionado
    ) {

        console.error(
            "Presente não encontrado para PIX:",
            id
        );


        return;

    }


    const modalPix =
        document.getElementById(
            "modalPix"
        );


    const nomePresentePix =
        document.getElementById(
            "nomePresentePix"
        );


    if (nomePresentePix) {

        nomePresentePix.textContent =
            presenteSelecionado.nome;

    }


    const elementoChave =
        document.getElementById(
            "chavePix"
        );


    if (elementoChave) {

        elementoChave.value =
            CHAVE_PIX;

    }


    const nomeConvidadoPix =
        document.getElementById(
            "nomeConvidadoPix"
        );


    if (nomeConvidadoPix) {

        nomeConvidadoPix.value =
            "";

    }


    const valorPix =
        document.getElementById(
            "valorPix"
        );


    if (valorPix) {

        valorPix.value =
            "";

    }


    const comprovantePix =
        document.getElementById(
            "comprovantePix"
        );


    if (comprovantePix) {

        comprovantePix.value =
            "";

    }


    const nomeArquivoPix =
        document.getElementById(
            "nomeArquivoPix"
        );


    if (nomeArquivoPix) {

        nomeArquivoPix.textContent =
            "";

    }


    const statusPix =
        document.getElementById(
            "statusPix"
        );


    if (statusPix) {

        statusPix.textContent =
            "Informe seu nome.";

    }


    const botao =
        document.getElementById(
            "btnConfirmarPix"
        );


    if (botao) {

        botao.disabled =
            true;

        botao.textContent =
            "Confirmar presente com PIX";

    }


    if (modalPix) {

        modalPix.style.display =
            "flex";


        setTimeout(
            () => {

                if (nomeConvidadoPix) {

                    nomeConvidadoPix.focus();

                }

            },
            100
        );

    }

}


/*
================================================
REGISTRAR PIX

O comprovante é apenas validado localmente.

NÃO:
- envia para Firebase Storage
- cria URL
- armazena arquivo

SIM:
- registra o PIX no Firestore
- registra no Google Sheets
================================================
*/

async function registrarPix() {

    console.log(
        "Iniciando registro do presente por PIX..."
    );


    try {

        if (!presenteSelecionado) {

            throw new Error(
                "Nenhum presente foi selecionado."
            );

        }


        const campoNome =
            document.getElementById(
                "nomeConvidadoPix"
            );


        const campoValor =
            document.getElementById(
                "valorPix"
            );


        const campoComprovante =
            document.getElementById(
                "comprovantePix"
            );


        const nome =
            campoNome
                ? campoNome.value.trim()
                : "";


        const valorTexto =
            campoValor
                ? campoValor.value.trim()
                : "";


        const arquivo =
            campoComprovante &&
            campoComprovante.files
                ? campoComprovante.files[0]
                : null;


        /*
        ----------------------------------------
        NOME
        ----------------------------------------
        */

        if (!nome) {

            alert(
                "Digite seu nome para continuar."
            );


            if (campoNome) {

                campoNome.focus();

            }


            atualizarEstadoBotaoPix();


            return;

        }


        /*
        ----------------------------------------
        VALOR
        ----------------------------------------
        */

        if (!valorTexto) {

            alert(
                "Informe o valor do PIX."
            );


            if (campoValor) {

                campoValor.focus();

            }


            atualizarEstadoBotaoPix();


            return;

        }


        /*
        ----------------------------------------
        COMPROVANTE
        ----------------------------------------
        */

        if (!arquivo) {

            alert(
                "Anexe o comprovante do PIX."
            );


            if (campoComprovante) {

                campoComprovante.click();

            }


            atualizarEstadoBotaoPix();


            return;

        }


        /*
        ----------------------------------------
        VALIDAR TAMANHO
        ----------------------------------------
        */

        const tamanhoMaximo =
            10 * 1024 * 1024;


        if (
            arquivo.size >
            tamanhoMaximo
        ) {

            alert(
                "O comprovante deve ter no máximo 10 MB."
            );


            campoComprovante.value =
                "";


            atualizarEstadoBotaoPix();


            return;

        }


        /*
        ----------------------------------------
        VALIDAR FORMATO
        ----------------------------------------
        */

        const tiposPermitidos = [

            "image/jpeg",

            "image/png",

            "image/webp",

            "application/pdf"

        ];


        if (
            !tiposPermitidos.includes(
                arquivo.type
            )
        ) {

            alert(
                "Formato de comprovante não permitido."
            );


            campoComprovante.value =
                "";


            atualizarEstadoBotaoPix();


            return;

        }


        /*
        ----------------------------------------
        CONVERTER VALOR
        ----------------------------------------
        */

        let valorNumerico =
            valorTexto
                .replace(
                    /R\$/gi,
                    ""
                )
                .replace(
                    /\s/g,
                    ""
                )
                .replace(
                    /\./g,
                    ""
                )
                .replace(
                    ",",
                    "."
                );


        valorNumerico =
            Number(
                valorNumerico
            );


        if (
            !Number.isFinite(
                valorNumerico
            ) ||
            valorNumerico <= 0
        ) {

            alert(
                "Informe um valor de PIX válido."
            );


            if (campoValor) {

                campoValor.focus();

            }


            atualizarEstadoBotaoPix();


            return;

        }


        /*
        ----------------------------------------
        BOTÃO
        ----------------------------------------
        */

        const status =
            document.getElementById(
                "statusPix"
            );


        const botao =
            document.getElementById(
                "btnConfirmarPix"
            );


        if (status) {

            status.textContent =
                "Registrando seu presente...";

        }


        if (botao) {

            botao.disabled =
                true;


            botao.textContent =
                "Registrando...";

        }


        /*
        ----------------------------------------
        VERIFICAR SERVIÇO
        ----------------------------------------
        */

        if (
            typeof window.salvarPix !==
            "function"
        ) {

            throw new Error(
                "Serviço de registro do PIX não está disponível."
            );

        }


        /*
        ----------------------------------------
        REGISTRAR PIX
        ----------------------------------------
        */

        const sucesso =
            await window.salvarPix(
                presenteSelecionado,
                nome,
                valorNumerico
            );


        if (!sucesso) {

            throw new Error(
                "Não foi possível registrar o presente com PIX."
            );

        }


        console.log(
            "Presente com PIX registrado com sucesso."
        );


        if (status) {

            status.textContent =
                "Presente registrado com sucesso! ❤️";

        }


        /*
        ----------------------------------------
        ATUALIZAR LISTA
        ----------------------------------------
        */

        await carregarStatusPresentes();


        carregarPresentes();


        /*
        ----------------------------------------
        FECHAR MODAL
        ----------------------------------------
        */

        fecharPix();


        /*
        ----------------------------------------
        SUCESSO
        ----------------------------------------
        */

        mostrarMensagem(
            "Presente registrado com sucesso! ❤️"
        );


        console.log(
            "REGISTRO PIX CONCLUÍDO COM SUCESSO."
        );


    } catch (error) {

        console.error(
            "================================="
        );


        console.error(
            "ERRO AO REGISTRAR PIX"
        );


        console.error(
            error
        );


        console.error(
            "================================="
        );


        const status =
            document.getElementById(
                "statusPix"
            );


        const botao =
            document.getElementById(
                "btnConfirmarPix"
            );


        if (status) {

            status.textContent =
                error?.message ||
                "Não foi possível registrar o presente.";

        }


        if (botao) {

            botao.disabled =
                false;


            botao.textContent =
                "Confirmar presente com PIX";

        }


        alert(
            error?.message ||
            "Não foi possível registrar o presente."
        );

    }

}


/*
================================================
COPIAR PIX
================================================
*/

async function copiarPix() {

    try {

        const sucesso =
            await copiarTexto(
                CHAVE_PIX
            );


        if (sucesso) {

            mostrarMensagem(
                "Chave PIX copiada! ❤️"
            );

        } else {

            throw new Error(
                "Não foi possível copiar."
            );

        }


    } catch (error) {

        console.error(
            "Erro ao copiar PIX:",
            error
        );


        alert(
            "Chave PIX:\n\n" +
            CHAVE_PIX
        );

    }

}


/*
================================================
COPIAR TEXTO
================================================
*/

async function copiarTexto(
    texto
) {

    try {

        if (
            navigator.clipboard &&
            window.isSecureContext
        ) {

            await navigator.clipboard.writeText(
                texto
            );


            return true;

        }

    } catch (error) {

        console.warn(
            "Clipboard moderno falhou:",
            error
        );

    }


    try {

        const area =
            document.createElement(
                "textarea"
            );


        area.value =
            texto;


        area.style.position =
            "fixed";


        area.style.left =
            "-9999px";


        area.style.top =
            "0";


        document.body.appendChild(
            area
        );


        area.focus();

        area.select();


        const sucesso =
            document.execCommand(
                "copy"
            );


        area.remove();


        return sucesso;


    } catch (error) {

        console.error(
            "Erro ao copiar texto:",
            error
        );


        return false;

    }

}


/*
================================================
OBTER CHAVE PIX
================================================
*/

function obterChavePix() {

    return CHAVE_PIX;

}


/*
================================================
MENSAGEM
================================================
*/

function mostrarMensagem(
    texto
) {

    const mensagem =
        document.getElementById(
            "mensagemSucesso"
        );


    if (mensagem) {

        mensagem.textContent =
            texto;


        mensagem.style.display =
            "block";


        setTimeout(
            () => {

                mensagem.style.display =
                    "none";

            },
            3500
        );


        return;

    }


    alert(
        texto
    );

}


/*
================================================
ESCAPAR HTML
================================================
*/

function escaparHTML(
    valor
) {

    return String(
        valor ?? ""
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
================================================
FUNÇÕES GLOBAIS
================================================
*/

window.registrarPix =
    registrarPix;


window.fecharPix =
    fecharPix;


window.copiarPix =
    copiarPix;


window.abrirPix =
    abrirPix;


console.log(
    "presentes.js carregado com sucesso."
);
