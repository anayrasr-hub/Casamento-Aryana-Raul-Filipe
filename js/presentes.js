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
- Upload de comprovante
- Registro PIX no Google Sheets
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
OBTER LISTA DO DATA.JS
================================================
*/

function obterPresentes(){

    if(
        Array.isArray(
            window.presentes
        )
    ){

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

function normalizarTexto(texto){

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

function configurarPesquisa(){

    const campo =
        document.getElementById(
            "buscar"
        );


    if(!campo){

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

function configurarCategorias(){

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

function configurarModal(){

    const modal =
        document.getElementById(
            "modalPresente"
        );


    const fechar =
        document.querySelector(
            ".fechar"
        );


    if(fechar){

        fechar.addEventListener(
            "click",
            () => {

                fecharModalPresente();

            }
        );

    }


    if(modal){

        modal.addEventListener(
            "click",
            event => {

                if(
                    event.target === modal
                ){

                    fecharModalPresente();

                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if(
                event.key === "Escape"
            ){

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

function fecharModalPresente(){

    const modal =
        document.getElementById(
            "modalPresente"
        );


    if(modal){

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

async function carregarStatusPresentes(){

    try{

        if(
            typeof window.buscarPresentesEscolhidos !==
            "function"
        ){

            console.warn(
                "window.buscarPresentesEscolhidos() não está disponível."
            );

            presentesEscolhidos = [];

            return;

        }


        presentesEscolhidos =
            await window.buscarPresentesEscolhidos();


        if(
            !Array.isArray(
                presentesEscolhidos
            )
        ){

            presentesEscolhidos = [];

        }


        console.log(
            "Presentes já escolhidos:",
            presentesEscolhidos.length
        );


    }catch(error){

        console.error(
            "Erro ao carregar escolhas:",
            error
        );

        presentesEscolhidos = [];

    }

}


/*
================================================
CARREGAR PRESENTES
================================================
*/

function carregarPresentes(){

    const container =
        document.getElementById(
            "listaPresentes"
        );


    if(!container){

        console.error(
            "Elemento #listaPresentes não encontrado."
        );

        return;

    }


    container.innerHTML = "";


    const todosPresentes =
        obterPresentes();


    listaPresentes =
        [...todosPresentes];


    /*
    ------------------------------
    PESQUISA
    ------------------------------
    */

    if(
        textoPesquisa !== ""
    ){

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
    ------------------------------
    CATEGORIA
    ------------------------------
    */

    if(
        normalizarTexto(
            categoriaAtual
        ) !==
        normalizarTexto(
            "Todos"
        )
    ){

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
    ------------------------------
    ORDENAR
    ------------------------------
    */

    listaPresentes.sort(
        (a,b) => {

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
    ------------------------------
    CONTADOR
    ------------------------------
    */

    const contador =
        document.getElementById(
            "contadorPresentes"
        );


    if(contador){

        contador.textContent =
            `${listaPresentes.length} presentes`;

    }


    /*
    ------------------------------
    NENHUM RESULTADO
    ------------------------------
    */

    if(
        listaPresentes.length === 0
    ){

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
){

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


    if(
        quantidadeEscolhas > 0
    ){

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
            src="${imagem}"
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
                    data-id="${presente.id}">

                    Escolher presente

                </button>


                <button
                    type="button"
                    class="btn-presente btn-pix"
                    data-pix-id="${presente.id}">

                    Presentear com PIX

                </button>

            </div>

        </div>

    `;


    /*
    ------------------------------
    IMAGEM
    ------------------------------
    */

    const img =
        card.querySelector(
            ".imagem-presente"
        );


    if(img){

        img.addEventListener(
            "error",
            () => {

                if(
                    !img.dataset.erro
                ){

                    img.dataset.erro =
                        "1";


                    img.src =
                        "imagens/presente-padrao.jpg";

                }

            }
        );

    }


    /*
    ------------------------------
    ESCOLHER PRESENTE
    ------------------------------
    */

    const botaoEscolher =
        card.querySelector(
            ".btn-escolher"
        );


    if(botaoEscolher){

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
    ------------------------------
    PIX
    ------------------------------
    */

    const botaoPix =
        card.querySelector(
            ".btn-pix"
        );


    if(botaoPix){

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

function escolherPresente(id){

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


    if(
        !presenteSelecionado
    ){

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


    if(titulo){

        titulo.textContent =
            presenteSelecionado.nome;

    }


    const imagem =
        document.getElementById(
            "imagemPresente"
        );


    if(imagem){

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


    if(valor){

        valor.style.display =
            "none";

        valor.innerHTML = "";

    }


    const nome =
        document.getElementById(
            "nomeConvidado"
        );


    if(nome){

        nome.value = "";

    }


    const mensagem =
        document.getElementById(
            "mensagem"
        );


    if(mensagem){

        mensagem.value = "";

    }


    const modal =
        document.getElementById(
            "modalPresente"
        );


    if(modal){

        modal.style.display =
            "flex";


        setTimeout(
            () => {

                if(nome){

                    nome.focus();

                }

            },
            100
        );

    }

}


/*
================================================
CONFIRMAR ESCOLHA
================================================
*/

function configurarBotaoConfirmar(){

    const botao =
        document.getElementById(
            "confirmarEscolha"
        );


    if(!botao){

        return;

    }


    botao.onclick =
        confirmarEscolha;

}


/*
================================================
CONFIRMAR ESCOLHA
================================================
*/

async function confirmarEscolha(){

    if(
        !presenteSelecionado
    ){

        alert(
            "Selecione um presente."
        );

        return;

    }


    const campoNome =
        document.getElementById(
            "nomeConvidado"
        );


    const nome =
        campoNome
            ?
            campoNome.value.trim()
            :
            "";


    if(
        nome === ""
    ){

        alert(
            "Informe seu nome."
        );


        if(campoNome){

            campoNome.focus();

        }


        return;

    }


    const campoMensagem =
        document.getElementById(
            "mensagem"
        );


    const mensagem =
        campoMensagem
            ?
            campoMensagem.value.trim()
            :
            "";


    const botao =
        document.getElementById(
            "confirmarEscolha"
        );


    if(botao){

        botao.disabled =
            true;

        botao.textContent =
            "Salvando...";

    }


    try{

        if(
            typeof window.salvarEscolhaPresente !==
            "function"
        ){

            throw new Error(
                "A função salvarEscolhaPresente() não está disponível."
            );

        }


        const convidado = {

            nome:
                nome,

            mensagem:
                mensagem

        };


        const sucesso =
            await window.salvarEscolhaPresente(
                presenteSelecionado,
                convidado
            );


        if(!sucesso){

            throw new Error(
                "Não foi possível salvar a escolha."
            );

        }


        fecharModalPresente();


        await carregarStatusPresentes();


        carregarPresentes();


        mostrarMensagem(
            "Presente escolhido com sucesso! ❤️"
        );


    }catch(error){

        console.error(
            "Erro ao confirmar escolha:",
            error
        );


        alert(
            "Não foi possível registrar sua escolha. Tente novamente."
        );


    }finally{

        if(botao){

            botao.disabled =
                false;

            botao.textContent =
                "Confirmar Escolha";

        }

    }

}


/*
================================================
CONFIGURAR FORMULÁRIO PIX
================================================
*/

function configurarFormularioPix(){

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


    if(campoNome){

        campoNome.addEventListener(
            "input",
            atualizarEstadoBotaoPix
        );

    }


    if(campoValor){

        campoValor.addEventListener(
            "input",
            () => {

                formatarValorPix();

                atualizarEstadoBotaoPix();

            }
        );

    }


    if(campoComprovante){

        campoComprovante.addEventListener(
            "change",
            () => {

                mostrarNomeArquivoPix();

                atualizarEstadoBotaoPix();

            }
        );

    }


    atualizarEstadoBotaoPix();

}


/*
================================================
FORMATAR VALOR PIX
================================================
*/

function formatarValorPix(){

    const campo =
        document.getElementById(
            "valorPix"
        );


    if(!campo){

        return;

    }


    let valor =
        campo.value;


    valor =
        valor.replace(
            /\D/g,
            ""
        );


    if(
        valor === ""
    ){

        campo.value = "";

        return;

    }


    let numero =
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

function obterValorPixNumerico(){

    const campo =
        document.getElementById(
            "valorPix"
        );


    if(!campo){

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


    if(
        !Number.isFinite(
            numero
        )
    ){

        return 0;

    }


    return numero;

}


/*
================================================
MOSTRAR NOME DO ARQUIVO
================================================
*/

function mostrarNomeArquivoPix(){

    const campo =
        document.getElementById(
            "comprovantePix"
        );


    const area =
        document.getElementById(
            "nomeArquivoPix"
        );


    if(
        !campo ||
        !area
    ){

        return;

    }


    if(
        !campo.files ||
        campo.files.length === 0
    ){

        area.textContent =
            "";

        return;

    }


    const arquivo =
        campo.files[0];


    area.textContent =
        "Comprovante selecionado: " +
        arquivo.name;

}


/*
================================================
ATUALIZAR BOTÃO PIX
================================================
*/

function atualizarEstadoBotaoPix(){

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
        nome &&
        nome.value.trim() !== "";


    const valorValido =
        valor > 0;


    const comprovanteValido =
        comprovante &&
        comprovante.files &&
        comprovante.files.length > 0;


    const podeConfirmar =
        nomeValido &&
        valorValido &&
        comprovanteValido;


    if(botao){

        botao.disabled =
            !podeConfirmar;

    }


    const status =
        document.getElementById(
            "statusPix"
        );


    if(status){

        if(!nomeValido){

            status.textContent =
                "Informe seu nome.";

        }

        else if(!valorValido){

            status.textContent =
                "Informe o valor que deseja presentear.";

        }

        else if(!comprovanteValido){

            status.textContent =
                "Anexe o comprovante do PIX.";

        }

        else{

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

function abrirPix(id){

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


    if(
        !presenteSelecionado
    ){

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


    if(nomePresentePix){

        nomePresentePix.textContent =
            presenteSelecionado.nome;

    }


    const elementoChave =
        document.getElementById(
            "chavePix"
        );


    if(elementoChave){

        elementoChave.value =
            CHAVE_PIX;

    }


    const nomeConvidadoPix =
        document.getElementById(
            "nomeConvidadoPix"
        );


    if(nomeConvidadoPix){

        nomeConvidadoPix.value =
            "";

    }


    const valorPix =
        document.getElementById(
            "valorPix"
        );


    if(valorPix){

        valorPix.value =
            "";

    }


    const comprovantePix =
        document.getElementById(
            "comprovantePix"
        );


    if(comprovantePix){

        comprovantePix.value =
            "";

    }


    const nomeArquivoPix =
        document.getElementById(
            "nomeArquivoPix"
        );


    if(nomeArquivoPix){

        nomeArquivoPix.textContent =
            "";

    }


    atualizarEstadoBotaoPix();


    if(modalPix){

        modalPix.style.display =
            "flex";


        setTimeout(
            () => {

                if(nomeConvidadoPix){

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
================================================
*/

async function registrarPix(){

    if(
        !presenteSelecionado
    ){

        alert(
            "Nenhum presente foi selecionado."
        );

        return;

    }


    /*
    --------------------------------
    NOME
    --------------------------------
    */

    const campoNome =
        document.getElementById(
            "nomeConvidadoPix"
        );


    const convidado =
        campoNome
        ?
        campoNome.value.trim()
        :
        "";


    if(
        convidado === ""
    ){

        alert(
            "Informe seu nome."
        );

        if(campoNome){

            campoNome.focus();

        }

        return;

    }


    /*
    --------------------------------
    VALOR
    --------------------------------
    */

    const valor =
        obterValorPixNumerico();


    if(
        valor <= 0
    ){

        alert(
            "Informe o valor que deseja presentear."
        );

        const campoValor =
            document.getElementById(
                "valorPix"
            );


        if(campoValor){

            campoValor.focus();

        }

        return;

    }


    /*
    --------------------------------
    COMPROVANTE
    --------------------------------
    */

    const campoComprovante =
        document.getElementById(
            "comprovantePix"
        );


    if(
        !campoComprovante ||
        !campoComprovante.files ||
        campoComprovante.files.length === 0
    ){

        alert(
            "Anexe o comprovante do PIX antes de confirmar."
        );

        return;

    }


    const arquivo =
        campoComprovante.files[0];


    /*
    --------------------------------
    BOTÃO
    --------------------------------
    */

    const botao =
        document.getElementById(
            "btnConfirmarPix"
        );


    if(botao){

        botao.disabled =
            true;

        botao.textContent =
            "Enviando comprovante...";

    }


    const status =
        document.getElementById(
            "statusPix"
        );


    try{

        /*
        ========================================
        1 — VERIFICAR SERVIÇO FIREBASE
        ========================================
        */

        if(
            typeof window.enviarComprovantePix !==
            "function"
        ){

            throw new Error(
                "A função enviarComprovantePix() não está disponível."
            );

        }


        if(
            typeof window.salvarPix !==
            "function"
        ){

            throw new Error(
                "A função salvarPix() não está disponível."
            );

        }


        /*
        ========================================
        2 — STATUS
        ========================================
        */

        if(status){

            status.textContent =
                "Enviando comprovante...";

        }


        /*
        ========================================
        3 — ENVIAR ARQUIVO
        ========================================
        */

        const comprovanteUrl =
            await window.enviarComprovantePix(
                arquivo,
                presenteSelecionado
            );


        if(
            !comprovanteUrl
        ){

            throw new Error(
                "Não foi possível enviar o comprovante."
            );

        }


        /*
        ========================================
        4 — STATUS
        ========================================
        */

        if(status){

            status.textContent =
                "Registrando seu presente...";

        }


        /*
        ========================================
        5 — REGISTRAR PIX
        ========================================
        */

        const sucesso =
            await window.salvarPix(

                presenteSelecionado,

                convidado,

                valor,

                comprovanteUrl

            );


        if(!sucesso){

            throw new Error(
                "Não foi possível registrar o presente por PIX."
            );

        }


        /*
        ========================================
        6 — FECHAR
        ========================================
        */

        fecharPix();


        /*
        ========================================
        7 — MENSAGEM
        ========================================
        */

        mostrarMensagem(
            "Obrigado pelo carinho! ❤️\n\n" +
            "Seu presente por PIX foi registrado com sucesso."
        );


    }catch(error){

        console.error(
            "Erro ao registrar PIX:",
            error
        );


        alert(
            "Não foi possível confirmar o presente por PIX.\n\n" +
            "Verifique o comprovante e tente novamente."
        );


        atualizarEstadoBotaoPix();


    }finally{

        if(botao){

            botao.textContent =
                "Confirmar presente com PIX";

        }

    }

}


/*
================================================
FECHAR PIX
================================================
*/

function fecharPix(){

    const modalPix =
        document.getElementById(
            "modalPix"
        );


    if(modalPix){

        modalPix.style.display =
            "none";

    }


    /*
    Limpar formulário.
    */

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


    if(nome){

        nome.value =
            "";

    }


    if(valor){

        valor.value =
            "";

    }


    if(comprovante){

        comprovante.value =
            "";

    }


    if(nomeArquivo){

        nomeArquivo.textContent =
            "";

    }


    atualizarEstadoBotaoPix();


    presenteSelecionado =
        null;

}


/*
================================================
COPIAR PIX
================================================
*/

async function copiarPix(){

    try{

        await copiarTexto(
            CHAVE_PIX
        );


        mostrarMensagem(
            "Chave PIX copiada! ❤️"
        );


    }catch(error){

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

async function copiarTexto(texto){

    try{

        if(
            navigator.clipboard &&
            window.isSecureContext
        ){

            await navigator.clipboard.writeText(
                texto
            );

            return true;

        }

    }catch(error){

        console.warn(
            "Clipboard moderno falhou:",
            error
        );

    }


    try{

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


        document.execCommand(
            "copy"
        );


        area.remove();


        return true;


    }catch(error){

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

function obterChavePix(){

    return CHAVE_PIX;

}


/*
================================================
MENSAGEM
================================================
*/

function mostrarMensagem(texto){

    const mensagem =
        document.getElementById(
            "mensagemSucesso"
        );


    if(mensagem){

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

function escaparHTML(valor){

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
