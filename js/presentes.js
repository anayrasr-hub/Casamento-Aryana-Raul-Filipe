/*
================================================
CASAMENTO ARYANA & RAUL FILIPE

LISTA DE PRESENTES

Arquivo: presentes.js
Versão 3.0

Funções:
- Carregar presentes
- Pesquisa
- Filtros por categoria
- Escolha de presente
- Registro no Firebase
- PIX
- Modal de confirmação

IMPORTANTE:
Os valores dos presentes NÃO são exibidos.
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

const CHAVE_PIX = "anayrasr@gmail.com";


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

Usado para permitir filtros mesmo quando
há diferença de maiúsculas/minúsculas
ou acentuação.
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
FILTROS DE CATEGORIA
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
MODAL DE ESCOLHA
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


    /*
    ------------------------------
    BOTÃO FECHAR
    ------------------------------
    */

    if(fechar){

        fechar.addEventListener(
            "click",
            () => {

                fecharModalPresente();

            }
        );

    }


    /*
    ------------------------------
    CLICAR FORA DO MODAL
    ------------------------------
    */

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


    /*
    ------------------------------
    ESC
    ------------------------------
    */

    document.addEventListener(
        "keydown",
        event => {

            if(
                event.key === "Escape"
            ){

                fecharModalPresente();

            }

        }
    );

}


/*
================================================
FECHAR MODAL
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
CARREGAR STATUS DO FIREBASE
================================================

O status é consultado apenas para manter
a sincronização.

NÃO exibimos "Já escolhido".

O presente continua disponível para
outros convidados.
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
MONTAR LISTA DE PRESENTES
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


    /*
    ------------------------------
    LIMPAR LISTA
    ------------------------------
    */

    container.innerHTML = "";


    /*
    ------------------------------
    OBTER PRESENTES
    ------------------------------
    */

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


    /*
    ------------------------------
    CRIAR CARDS
    ------------------------------
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
){

    const card =
        document.createElement(
            "div"
        );


    card.className =
        "card-presente";


    /*
    ------------------------------
    IMAGEM
    ------------------------------
    */

    const imagem =
        presente.imagem ||
        "imagens/presente-padrao.jpg";


    /*
    ------------------------------
    CARD
    ------------------------------
    */

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


            <div class="acoes-presente">

                <button

                    type="button"

                    class="btn-presente btn-escolher"

                    data-id="${presente.id}"

                >

                    Escolher presente

                </button>


                <button

                    type="button"

                    class="btn-presente btn-pix"

                    data-pix-id="${presente.id}"

                >

                    Presentear com PIX

                </button>

            </div>

        </div>

    `;


    /*
    ------------------------------
    CORRIGIR IMAGEM
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
    BOTÃO ESCOLHER
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
    BOTÃO PIX
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


    /*
    ------------------------------
    TÍTULO
    ------------------------------
    */

    const titulo =
        document.getElementById(
            "tituloPresente"
        );


    if(titulo){

        titulo.textContent =
            presenteSelecionado.nome;

    }


    /*
    ------------------------------
    IMAGEM
    ------------------------------
    */

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


    /*
    ------------------------------
    NÃO EXIBIR VALOR
    ------------------------------
    */

    const valor =
        document.getElementById(
            "valorPresente"
        );


    if(valor){

        valor.style.display =
            "none";


        valor.innerHTML = "";

    }


    /*
    ------------------------------
    LIMPAR FORMULÁRIO
    ------------------------------
    */

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


    /*
    ------------------------------
    ABRIR MODAL
    ------------------------------
    */

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
BOTÃO CONFIRMAR ESCOLHA
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


    /*
    Evita cadastrar o mesmo listener
    mais de uma vez.
    */

    botao.onclick =
        confirmarEscolha;

}


/*
================================================
CONFIRMAR ESCOLHA
================================================
*/

async function confirmarEscolha(){

    /*
    ------------------------------
    VERIFICAR PRESENTE
    ------------------------------
    */

    if(
        !presenteSelecionado
    ){

        alert(
            "Selecione um presente."
        );


        return;

    }


    /*
    ------------------------------
    NOME
    ------------------------------
    */

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


    /*
    ------------------------------
    MENSAGEM
    ------------------------------
    */

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


    /*
    ------------------------------
    DESABILITAR BOTÃO
    ------------------------------
    */

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

        /*
        --------------------------
        VERIFICAR FUNÇÃO FIREBASE
        --------------------------
        */

if(
    typeof window.salvarEscolhaPresente
    !== "function"
){

    throw new Error(
        "A função salvarEscolhaPresente() não está disponível."
    );

}

        /*
        --------------------------
        DADOS DO CONVIDADO
        --------------------------
        */

        const convidado = {

            nome:
                nome,

            mensagem:
                mensagem

        };


        /*
        --------------------------
        SALVAR FIREBASE
        --------------------------
        */

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


        /*
        --------------------------
        FECHAR MODAL
        --------------------------
        */

        fecharModalPresente();


        /*
        --------------------------
        ATUALIZAR STATUS
        --------------------------
        */

        await carregarStatusPresentes();


        carregarPresentes();


        /*
        --------------------------
        MENSAGEM
        --------------------------
        */

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
PIX
================================================
*/

function abrirPix(id){

    const presentesAtuais =
        obterPresentes();


    presenteSelecionado =
        presentesAtuais.find(
            presente =>
                Number(presente.id) ===
                Number(id)
        );


    if(!presenteSelecionado){

        console.error(
            "Presente não encontrado para PIX:",
            id
        );

        return;

    }


    /*
    ================================================
    MODAL PIX
    ================================================
    */

    const modalPix =
        document.getElementById(
            "modalPix"
        );


    /*
    --------------------------------
    PREENCHER NOME DO PRESENTE
    --------------------------------
    */

    const nomePresentePix =
        document.getElementById(
            "nomePresentePix"
        );


    if(nomePresentePix){

        nomePresentePix.textContent =
            presenteSelecionado.nome;

    }


    /*
    --------------------------------
    CHAVE PIX
    --------------------------------
    */

    const elementoChave =
        document.getElementById(
            "chavePix"
        );


    if(elementoChave){

        /*
        Se for INPUT
        */

        if(
            elementoChave.tagName ===
            "INPUT"
        ){

            elementoChave.value =
                CHAVE_PIX;

        }

        /*
        Se for outro elemento
        */

        else{

            elementoChave.textContent =
                CHAVE_PIX;

        }

    }


    /*
    --------------------------------
    NÃO EXIBIR VALOR
    --------------------------------
    */

    const valorPix =
        document.getElementById(
            "valorPix"
        );


    if(valorPix){

        valorPix.textContent = "";

        valorPix.style.display =
            "none";

    }


    /*
    --------------------------------
    LIMPAR NOME DO CONVIDADO
    --------------------------------
    */

    const nomeConvidadoPix =
        document.getElementById(
            "nomeConvidadoPix"
        );


    if(nomeConvidadoPix){

        nomeConvidadoPix.value = "";

    }


    /*
    --------------------------------
    ABRIR MODAL
    --------------------------------
    */

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

        return;

    }


    /*
    ================================================
    CASO O MODAL NÃO EXISTA
    ================================================
    */

    copiarTexto(
        CHAVE_PIX
    );


    alert(
        "A chave PIX foi copiada! ❤️\n\n" +
        CHAVE_PIX
    );

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
    NOME DO CONVIDADO
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


    try{

        /*
        --------------------------------
        VERIFICAR FIREBASE
        --------------------------------
        */

        if(
            typeof window.salvarPix !==
            "function"
        ){

            throw new Error(
                "A função salvarPix() não está disponível."
            );

        }


        /*
        --------------------------------
        SALVAR PIX
        --------------------------------
        */

        const sucesso =
            await window.salvarPix(

                presenteSelecionado,

                convidado

            );


        if(!sucesso){

            throw new Error(
                "Não foi possível registrar o PIX."
            );

        }


        /*
        --------------------------------
        FECHAR MODAL
        --------------------------------
        */

        fecharPix();


        /*
        --------------------------------
        MENSAGEM
        --------------------------------
        */

        mostrarMensagem(
    "Obrigado pelo carinho! ❤️\n\n" +
    "Sua escolha de presentear com PIX foi registrada com sucesso."
);


    }catch(error){

        console.error(
            "Erro ao registrar PIX:",
            error
        );


        alert(
            "Não foi possível registrar o PIX.\n\n" +
            "Tente novamente."
        );

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
OBTER CHAVE PIX
================================================
*/

function obterChavePix(){

    return CHAVE_PIX;

}


/*
================================================
COPIAR TEXTO
================================================
*/

async function copiarTexto(texto){

    /*
    --------------------------------
    CLIPBOARD MODERNO
    --------------------------------
    */

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


    /*
    --------------------------------
    MÉTODO ALTERNATIVO
    --------------------------------
    */

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
MENSAGEM
================================================
*/

function mostrarMensagem(texto){

    /*
    Se existir um elemento
    específico para mensagens,
    utiliza ele.
    */

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


    /*
    Caso não exista,
    utiliza alert.
    */

    alert(
        texto
    );

}


/*
================================================
ESCAPAR HTML
================================================

Evita que nomes cadastrados no data.js
sejam interpretados como HTML.
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
FIM DO PRESENTES.JS
================================================
*/