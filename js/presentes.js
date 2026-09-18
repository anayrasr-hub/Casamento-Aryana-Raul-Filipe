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
                    data-id="${escaparHTML(presente.id)}">

                    Escolher presente

                </button>


                <button
                    type="button"
                    class="btn-presente btn-pix"
                    data-pix-id="${escaparHTML(presente.id)}">

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
CONFIGURAR BOTÃO CONFIRMAR PRESENTE
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

async function confirmarEscolha(){

    console.log("=================================");
    console.log("CONFIRMAÇÃO DE PRESENTE INICIADA");
    console.log("=================================");

    /*
    --------------------------------------------
    VERIFICAR PRESENTE SELECIONADO
    --------------------------------------------
    */

    if(!presenteSelecionado){

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


    /*
    --------------------------------------------
    NOME DO CONVIDADO
    --------------------------------------------
    */

    const campoNome =
        document.getElementById(
            "nomeConvidado"
        );


    if(!campoNome){

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


    if(nome === ""){

        alert(
            "Informe seu nome."
        );

        campoNome.focus();

        return;

    }


    /*
    --------------------------------------------
    MENSAGEM
    --------------------------------------------
    */

    const campoMensagem =
        document.getElementById(
            "mensagem"
        );


    const mensagem =
        campoMensagem
            ? campoMensagem.value.trim()
            : "";


    /*
    --------------------------------------------
    BOTÃO
    --------------------------------------------
    */

    const botao =
        document.getElementById(
            "confirmarEscolha"
        );


    if(botao){

        botao.disabled = true;

        botao.textContent =
            "Salvando...";

    }


    try{

        /*
        ========================================
        VERIFICAR FUNÇÃO FIREBASE
        ========================================
        */

        console.log(
            "Verificando salvarEscolhaPresente..."
        );


        if(
            typeof window.salvarEscolhaPresente !==
            "function"
        ){

            console.error(
                "window.salvarEscolhaPresente não está disponível."
            );

            throw new Error(
                "A função de salvamento dos presentes não está disponível."
            );

        }


        /*
        ========================================
        MONTAR DADOS DO CONVIDADO
        ========================================
        */

        const convidado = {

            nome:
                nome,

            mensagem:
                mensagem

        };


        console.log(
            "Dados que serão enviados:",
            {
                presente: presenteSelecionado,
                convidado: convidado
            }
        );


        /*
        ========================================
        SALVAR
        ========================================
        */

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


        /*
        ========================================
        IMPORTANTE
        ========================================

        Só considera erro se a função retornar
        explicitamente false.

        Assim, caso o Firebase salve e a função
        não tenha return true, a confirmação
        continuará funcionando.
        */

        if(resultado === false){

            throw new Error(
                "O sistema informou que não foi possível salvar a escolha."
            );

        }


        /*
        ========================================
        ATUALIZAR STATUS
        ========================================
        */

        console.log(
            "Escolha salva. Atualizando lista..."
        );


        await carregarStatusPresentes();


        carregarPresentes();


        /*
        ========================================
        FECHAR MODAL
        ========================================
        */

        fecharModalPresente();


        /*
        ========================================
        MENSAGEM DE SUCESSO
        ========================================
        */

        mostrarMensagem(
            "Presente escolhido com sucesso! ❤️"
        );


        console.log(
            "CONFIRMAÇÃO CONCLUÍDA COM SUCESSO."
        );


    }catch(error){

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


    }finally{

        /*
        ----------------------------------------
        RESTAURAR BOTÃO
        ----------------------------------------
        */

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


    /*
    --------------------------------------------
    NOME
    --------------------------------------------
    */

    if(campoNome){

        campoNome.addEventListener(
            "input",
            atualizarEstadoBotaoPix
        );

    }


    /*
    --------------------------------------------
    VALOR
    --------------------------------------------
    */

    if(campoValor){

        campoValor.addEventListener(
            "input",
            () => {

                formatarValorPix();

                atualizarEstadoBotaoPix();

            }
        );

    }


    /*
    --------------------------------------------
    COMPROVANTE
    --------------------------------------------
    */

    if(campoComprovante){

        campoComprovante.addEventListener(
            "change",
            () => {

                mostrarNomeArquivoPix();

                atualizarEstadoBotaoPix();

            }
        );

    }


    /*
    --------------------------------------------
    BOTÃO PIX
    --------------------------------------------
    IMPORTANTE:
    O botão precisa chamar registrarPix().
    --------------------------------------------
    */

    const botaoPix =
        document.getElementById(
            "btnConfirmarPix"
        );


    if(botaoPix){

        botaoPix.addEventListener(
            "click",
            registrarPix
        );

        console.log(
            "Botão PIX configurado com sucesso."
        );

    }else{

        console.error(
            "Botão #btnConfirmarPix não encontrado."
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

    console.log(
        "Iniciando registro do presente por PIX..."
    );


    if(
        !presenteSelecionado
    ){

        alert(
            "Nenhum presente foi selecionado."
        );

        return;

    }


    /*
    --------------------------------------------
    NOME
    --------------------------------------------
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
    --------------------------------------------
    VALOR
    --------------------------------------------
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
    --------------------------------------------
    COMPROVANTE
    --------------------------------------------
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
    --------------------------------------------
    BOTÃO
    --------------------------------------------
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
        1 — VERIFICAR SERVIÇOS FIREBASE
        ========================================
        */

        console.log(
            "Verificando serviços Firebase..."
        );


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
        3 — UPLOAD
        ========================================
        */

        console.log(
            "Enviando comprovante para o Firebase Storage..."
        );


        const comprovanteUrl =
            await window.enviarComprovantePix(
                arquivo,
                presenteSelecionado
            );


        console.log(
            "URL do comprovante:",
            comprovanteUrl
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
                "Comprovante enviado. Registrando seu presente...";

        }


        /*
        ========================================
        5 — FIRESTORE + GOOGLE SHEETS
        ========================================
        */

        console.log(
            "Registrando presente por PIX..."
        );


        const sucesso =
            await window.salvarPix(

                presenteSelecionado,

                convidado,

                valor,

                comprovanteUrl

            );


        console.log(
            "Resultado do registro PIX:",
            sucesso
        );


        if(!sucesso){

            throw new Error(
                "Não foi possível registrar o presente por PIX."
            );

        }


        /*
        ========================================
        6 — ATUALIZAR LISTA
        ========================================
        */

        fecharPix();


        await carregarStatusPresentes();


        carregarPresentes();


        /*
        ========================================
        7 — SUCESSO
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


        if(status){

            status.textContent =
                "Não foi possível concluir o registro.";

        }


        alert(
            "Não foi possível confirmar o presente por PIX.\n\n" +
            "Detalhes: " +
            (
                error?.message ||
                "erro desconhecido"
            )
        );


        atualizarEstadoBotaoPix();


    }finally{

        if(botao){

            botao.textContent =
                "Confirmar presente com PIX";

            /*
            Recalcula o estado do botão.
            */

            atualizarEstadoBotaoPix();

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


    const status =
        document.getElementById(
            "statusPix"
        );


    if(status){

        status.textContent =
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

        const sucesso =
            await copiarTexto(
                CHAVE_PIX
            );


        if(sucesso){

            mostrarMensagem(
                "Chave PIX copiada! ❤️"
            );

        }else{

            throw new Error(
                "Não foi possível copiar."
            );

        }


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


        const sucesso =
            document.execCommand(
                "copy"
            );


        area.remove();


        return sucesso;


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

window.abrirPix =
    abrirPix;

console.log(
    "presentes.js carregado com sucesso."
);
