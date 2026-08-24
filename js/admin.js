/*
==================================================
CASAMENTO ARYANA & RAUL FILIPE

PAINEL ADMINISTRATIVO

Arquivo: admin.js
==================================================
*/


let todosPresentesAdmin = [];

let escolhasAdmin = [];

let pixAdmin = [];

let convidadosAdmin = [];

let presenteDetalheAtual = null;


/*
==================================================
INICIALIZAÇÃO
==================================================
*/

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        console.log(
            "Painel administrativo iniciado."
        );


        configurarAbas();

        configurarPesquisas();

        configurarModal();

        configurarBotaoSair();


        /*
        ------------------------------------------
        AGUARDAR AUTENTICAÇÃO
        ------------------------------------------
        */

        if (
            window.adminAuthReady
        ) {

            try {

                await window.adminAuthReady;

            } catch (error) {

                console.error(
                    "Erro na autenticação Admin:",
                    error
                );

                return;

            }

        }


        await carregarDadosAdmin();

    }
);


/*
==================================================
CARREGAR TODOS OS DADOS
==================================================
*/

async function carregarDadosAdmin() {

    mostrarCarregando(
        "listaAdminPresentes",
        "Carregando presentes..."
    );


    mostrarCarregando(
        "listaAdminPix",
        "Carregando registros de PIX..."
    );


    mostrarCarregando(
        "listaAdminConvidados",
        "Carregando confirmações..."
    );


    try {

        /*
        ------------------------------------------
        PRESENTES
        ------------------------------------------
        */

        todosPresentesAdmin =
            obterPresentesAdmin();


        /*
        ------------------------------------------
        ESCOLHAS DE PRESENTES
        ------------------------------------------
        */

        if (
            typeof window.buscarPresentesEscolhidos ===
            "function"
        ) {

            escolhasAdmin =
                await window.buscarPresentesEscolhidos();

        } else {

            console.error(
                "buscarPresentesEscolhidos() não está disponível."
            );

            escolhasAdmin = [];

        }


        /*
        ------------------------------------------
        PIX
        ------------------------------------------
        */

        if (
            typeof window.buscarPix ===
            "function"
        ) {

            pixAdmin =
                await window.buscarPix();

        } else {

            console.error(
                "buscarPix() não está disponível."
            );

            pixAdmin = [];

        }


        /*
        ------------------------------------------
        CONFIRMAÇÕES
        ------------------------------------------
        */

        if (
            typeof window.buscarConvidados ===
            "function"
        ) {

            convidadosAdmin =
                await window.buscarConvidados();


            console.log(
                "Confirmações carregadas:",
                convidadosAdmin
            );

        } else {

            console.error(
                "buscarConvidados() não está disponível."
            );

            convidadosAdmin = [];

        }


        /*
        ------------------------------------------
        ATUALIZAR RESUMO
        ------------------------------------------
        */

        atualizarResumo();


        /*
        ------------------------------------------
        ATUALIZAR LISTAS
        ------------------------------------------
        */

        carregarListaPresentesAdmin();


        carregarListaPixAdmin();


        carregarListaConvidadosAdmin();


    } catch (error) {

        console.error(
            "Erro ao carregar dados administrativos:",
            error
        );


        mostrarErro(
            "listaAdminPresentes",
            "Não foi possível carregar os presentes."
        );


        mostrarErro(
            "listaAdminPix",
            "Não foi possível carregar os registros de PIX."
        );


        mostrarErro(
            "listaAdminConvidados",
            "Não foi possível carregar as confirmações."
        );

    }

}


        /*
        ------------------------------------------
        PIX
        ------------------------------------------
        */

        if (
            typeof window.buscarPix ===
            "function"
        ) {

            pixAdmin =
                await window.buscarPix();

        } else {

            pixAdmin = [];

        }


/*
------------------------------------------
CONFIRMAÇÕES DE PRESENÇA
GOOGLE SHEETS
------------------------------------------
*/

if (
    typeof window.buscarConvidados ===
    "function"
) {

    convidadosAdmin =
        await window.buscarConvidados();

    console.log(
        "Confirmações carregadas no painel:",
        convidadosAdmin
    );

} else {

    console.error(
        "buscarConvidados() não está disponível."
    );

    convidadosAdmin = [];

}

/*
==================================================
OBTER PRESENTES DO DATA.JS
==================================================
*/

function obterPresentesAdmin() {

    if (
        Array.isArray(
            window.presentes
        )
    ) {

        return [
            ...window.presentes
        ];

    }


    console.error(
        "window.presentes não foi encontrado."
    );


    return [];

}


/*
==================================================
RESUMO ADMINISTRATIVO
==================================================
*/

function atualizarResumo() {

    const totalPresentes =
        document.getElementById(
            "totalPresentes"
        );


    const totalEscolhas =
        document.getElementById(
            "totalEscolhas"
        );


    const totalPix =
        document.getElementById(
            "totalPix"
        );


    const totalConvidados =
        document.getElementById(
            "totalConvidados"
        );


    /*
    ------------------------------------------
    PRESENTES DIFERENTES ESCOLHIDOS
    ------------------------------------------
    */

    const presentesEscolhidosUnicos =
        todosPresentesAdmin.filter(
            presente =>
                contarEscolhasPresente(
                    presente.id
                ).length > 0
        );


    /*
    ------------------------------------------
    TOTAL DE PRESENTES ESCOLHIDOS
    ------------------------------------------
    */

    if (totalPresentes) {

        totalPresentes.textContent =
            presentesEscolhidosUnicos.length;

    }


    /*
    ------------------------------------------
    TOTAL DE ESCOLHAS
    ------------------------------------------
    */

    if (totalEscolhas) {

        totalEscolhas.textContent =
            escolhasAdmin.length;

    }


    /*
    ------------------------------------------
    TOTAL PIX
    ------------------------------------------
    */

    if (totalPix) {

        totalPix.textContent =
            pixAdmin.length;

    }


    /*
    ------------------------------------------
    TOTAL CONVIDADOS
    ------------------------------------------
    */

    if (totalConvidados) {

        totalConvidados.textContent =
            convidadosAdmin.length;

    }

}

/*
==================================================
CONTAGEM DE ESCOLHAS POR PRESENTE
==================================================
*/

function contarEscolhasPresente(
    presenteId
) {

    return escolhasAdmin.filter(
        escolha =>
            String(
                escolha.presenteId
            ) ===
            String(
                presenteId
            )
    );

}


/*
==================================================
LISTA DE PRESENTES ESCOLHIDOS
==================================================

IMPORTANTE:
O painel administrativo NÃO exibe todos os
presentes do data.js.

Somente aparecem os presentes que possuem
pelo menos uma escolha registrada no Firebase.
==================================================
*/

function carregarListaPresentesAdmin(
    filtro = ""
) {

    const container =
        document.getElementById(
            "listaAdminPresentes"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    const texto =
        normalizarTextoAdmin(
            filtro
        );


    /*
    ------------------------------------------
    SOMENTE PRESENTES ESCOLHIDOS
    ------------------------------------------
    */

    let lista =
        todosPresentesAdmin.filter(
            presente => {

                const escolhas =
                    contarEscolhasPresente(
                        presente.id
                    );

                return escolhas.length > 0;

            }
        );


    /*
    ------------------------------------------
    PESQUISA
    ------------------------------------------
    */

    if (texto !== "") {

        lista =
            lista.filter(
                presente => {

                    const nome =
                        normalizarTextoAdmin(
                            presente.nome
                        );


                    const categoria =
                        normalizarTextoAdmin(
                            presente.categoria
                        );


                    return (

                        nome.includes(
                            texto
                        )

                        ||

                        categoria.includes(
                            texto
                        )

                    );

                }
            );

    }


    /*
    ------------------------------------------
    ORDENAR
    ------------------------------------------
    */

    lista.sort(
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
    ------------------------------------------
    NENHUM PRESENTE ESCOLHIDO
    ------------------------------------------
    */

    if (
        lista.length === 0
    ) {

        container.innerHTML = `

            <div class="admin-vazio">

                <div class="admin-vazio-icone">
                    🎁
                </div>

                <h3>
                    Nenhum presente escolhido
                </h3>

                <p>
                    Assim que um convidado escolher
                    um presente, ele aparecerá aqui.
                </p>

            </div>

        `;

        return;

    }


    /*
    ------------------------------------------
    CRIAR CARDS
    ------------------------------------------
    */

    lista.forEach(
        presente => {

            criarCardAdminPresente(
                presente,
                container
            );

        }
    );

}


/*
==================================================
CARD DO PRESENTE
==================================================
*/

function criarCardAdminPresente(
    presente,
    container
) {

    const escolhas =
        contarEscolhasPresente(
            presente.id
        );


    const quantidade =
        escolhas.length;


    const imagem =
        presente.imagem ||
        "imagens/presente-padrao.jpg";


    const card =
        document.createElement(
            "div"
        );


    card.className =
        "card-admin-presente";


    card.innerHTML = `

        <img
            src="${escaparHTMLAdmin(
                imagem
            )}"
            alt="${escaparHTMLAdmin(
                presente.nome
            )}"
            class="imagem-admin-presente"
        >


        <div class="card-admin-info">

            <div class="categoria">

                ${escaparHTMLAdmin(
                    presente.categoria
                )}

            </div>


            <h3>

                ${escaparHTMLAdmin(
                    presente.nome
                )}

            </h3>


            <div class="badge-escolhas">

                ❤️

                ${
                    quantidade === 0
                    ?
                    "Nenhuma escolha"
                    :
                    quantidade === 1
                    ?
                    "1 escolha"
                    :
                    `${quantidade} escolhas`
                }

            </div>

        </div>


        <button
            type="button"
            class="btn-detalhes"
            data-presente-id="${escaparHTMLAdmin(
                presente.id
            )}"
        >

            Ver detalhes

        </button>

    `;


    const img =
        card.querySelector(
            ".imagem-admin-presente"
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


    const botao =
        card.querySelector(
            ".btn-detalhes"
        );


    if (botao) {

        botao.addEventListener(
            "click",
            () => {

                abrirDetalhesPresente(
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
==================================================
DETALHES DO PRESENTE
==================================================
*/

function abrirDetalhesPresente(
    presenteId
) {

    const presente =
        todosPresentesAdmin.find(
            item =>
                String(
                    item.id
                ) ===
                String(
                    presenteId
                )
        );


    if (!presente) {

        return;

    }


    presenteDetalheAtual =
        presente;


    const escolhas =
        contarEscolhasPresente(
            presente.id
        );


    const modal =
        document.getElementById(
            "modalAdmin"
        );


    const conteudo =
        document.getElementById(
            "conteudoModalAdmin"
        );


    if (
        !modal ||
        !conteudo
    ) {

        return;

    }


    let htmlEscolhas = "";


    if (
        escolhas.length === 0
    ) {

        htmlEscolhas = `

            <div class="carregando">

                Nenhum convidado escolheu este presente.

            </div>

        `;

    } else {

        htmlEscolhas = `

            <table class="tabela-admin">

                <thead>

                    <tr>

                        <th>
                            Convidado
                        </th>

                        <th>
                            Data
                        </th>

                        <th>
                            Ações
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${escolhas
                        .map(
                            escolha => `

                                <tr>

                                    <td>

                                        ${escaparHTMLAdmin(
                                            obterNomeConvidadoEscolha(
                                                escolha
                                            )
                                        )}

                                    </td>


                                    <td>

                                        ${formatarDataAdmin(
                                            escolha.data
                                        )}

                                    </td>


                                    <td>

                                        <button
                                            type="button"
                                            class="btn-admin-editar"
                                            data-acao="editar-escolha"
                                            data-id="${escaparHTMLAdmin(
                                                escolha.id
                                            )}"
                                        >

                                            ✏️ Editar

                                        </button>


                                        <button
                                            type="button"
                                            class="btn-admin-excluir"
                                            data-acao="excluir-escolha"
                                            data-id="${escaparHTMLAdmin(
                                                escolha.id
                                            )}"
                                        >

                                            🗑️ Excluir

                                        </button>

                                    </td>

                                </tr>

                            `
                        )
                        .join("")
                    }

                </tbody>

            </table>

        `;

    }


    conteudo.innerHTML = `

        <h2>

            ${escaparHTMLAdmin(
                presente.nome
            )}

        </h2>


        <p>

            <strong>
                Categoria:
            </strong>

            ${escaparHTMLAdmin(
                presente.categoria
            )}

        </p>


        <p>

            <strong>
                Total de escolhas:
            </strong>

            ${escolhas.length}

        </p>


        <hr>


        <h3>

            Convidados

        </h3>


        ${htmlEscolhas}

    `;


    configurarAcoesEscolhasModal();


    modal.style.display =
        "flex";

}


/*
==================================================
AÇÕES DAS ESCOLHAS DO MODAL
==================================================
*/

function configurarAcoesEscolhasModal() {

    const botoesEditar =
        document.querySelectorAll(
            '[data-acao="editar-escolha"]'
        );


    botoesEditar.forEach(
        botao => {

            botao.addEventListener(
                "click",
                () => {

                    editarEscolha(
                        botao.dataset.id
                    );

                }
            );

        }
    );


    const botoesExcluir =
        document.querySelectorAll(
            '[data-acao="excluir-escolha"]'
        );


    botoesExcluir.forEach(
        botao => {

            botao.addEventListener(
                "click",
                () => {

                    excluirEscolha(
                        botao.dataset.id
                    );

                }
            );

        }
    );

}


/*
==================================================
EDITAR ESCOLHA
==================================================
*/

async function editarEscolha(
    id
) {

    const registro =
        escolhasAdmin.find(
            item =>
                String(
                    item.id
                ) ===
                String(
                    id
                )
        );


    if (!registro) {

        alert(
            "Registro não encontrado."
        );

        return;

    }


    const nomeAtual =
        obterNomeConvidadoEscolha(
            registro
        );


    const novoNome =
        prompt(
            "Nome do convidado:",
            nomeAtual
        );


    if (
        novoNome === null
    ) {

        return;

    }


    const nome =
        novoNome.trim();


    if (
        nome === ""
    ) {

        alert(
            "O nome não pode ficar vazio."
        );

        return;

    }


    let mensagemAtual =
        registro.mensagem ||
        "";


    const novaMensagem =
        prompt(
            "Mensagem do convidado (opcional):",
            mensagemAtual
        );


    if (
        novaMensagem === null
    ) {

        return;

    }


    if (
        typeof window.editarRegistro !==
        "function"
    ) {

        alert(
            "Função administrativa não disponível."
        );

        return;

    }


    const sucesso =
        await window.editarRegistro(
            "presentes_escolhidos",
            id,
            {
                convidado:
                    nome,

                mensagem:
                    novaMensagem.trim()
            }
        );


    if (!sucesso) {

        alert(
            "Não foi possível editar a escolha."
        );

        return;

    }


    await recarregarDadosAdmin();

    abrirDetalhesPresente(
        presenteDetalheAtual.id
    );


    mostrarMensagemAdmin(
        "Escolha atualizada com sucesso! ❤️"
    );

}


/*
==================================================
EXCLUIR ESCOLHA
==================================================
*/

async function excluirEscolha(
    id
) {

    const confirmado =
        confirm(
            "Tem certeza que deseja excluir esta escolha de presente?"
        );


    if (!confirmado) {

        return;

    }


    if (
        typeof window.excluirRegistro !==
        "function"
    ) {

        alert(
            "Função administrativa não disponível."
        );

        return;

    }


    const sucesso =
        await window.excluirRegistro(
            "presentes_escolhidos",
            id
        );


    if (!sucesso) {

        alert(
            "Não foi possível excluir a escolha."
        );

        return;

    }


    await recarregarDadosAdmin();


    if (
        presenteDetalheAtual
    ) {

        abrirDetalhesPresente(
            presenteDetalheAtual.id
        );

    }


    mostrarMensagemAdmin(
        "Escolha excluída com sucesso."
    );

}


/*
==================================================
LISTA PIX
==================================================
*/

function carregarListaPixAdmin() {

    const container =
        document.getElementById(
            "listaAdminPix"
        );


    if (!container) {

        return;

    }


    container.innerHTML = "";


    if (
        pixAdmin.length === 0
    ) {

        container.innerHTML = `

            <div class="carregando">

                Nenhum registro de PIX encontrado.

            </div>

        `;

        return;

    }


    const tabela =
        document.createElement(
            "table"
        );


    tabela.className =
        "tabela-admin";


    tabela.innerHTML = `

        <thead>

            <tr>

                <th>
                    Presente
                </th>

                <th>
                    Convidado
                </th>

                <th>
                    Data
                </th>

                <th>
                    Ações
                </th>

            </tr>

        </thead>


        <tbody></tbody>

    `;


    const tbody =
        tabela.querySelector(
            "tbody"
        );


    pixAdmin.forEach(
        registro => {

            const tr =
                document.createElement(
                    "tr"
                );


            tr.innerHTML = `

                <td>

                    ${escaparHTMLAdmin(
                        registro.presente ||
                        registro.nomePresente ||
                        "—"
                    )}

                </td>

                <td>
                    ${escaparHTMLAdmin(
                        registro.convidado ||
                        "Convidado"
                    )}

                </td>

                <td>

                    ${formatarDataAdmin(
                        registro.data
                    )}

                </td>


                <td>

                    <button
                        type="button"
                        class="btn-admin-editar"
                        data-acao="editar-pix"
                        data-id="${escaparHTMLAdmin(
                            registro.id
                        )}"
                    >

                        ✏️ Editar

                    </button>


                    <button
                        type="button"
                        class="btn-admin-excluir"
                        data-acao="excluir-pix"
                        data-id="${escaparHTMLAdmin(
                            registro.id
                        )}"
                    >

                        🗑️ Excluir

                    </button>

                </td>

            `;


            tbody.appendChild(
                tr
            );

        }
    );


    container.appendChild(
        tabela
    );


    configurarAcoesPix();

}


/*
==================================================
AÇÕES PIX
==================================================
*/

function configurarAcoesPix() {

    document
        .querySelectorAll(
            '[data-acao="editar-pix"]'
        )
        .forEach(
            botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        editarPix(
                            botao.dataset.id
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            '[data-acao="excluir-pix"]'
        )
        .forEach(
            botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        excluirPix(
                            botao.dataset.id
                        );

                    }
                );

            }
        );

}


/*
==================================================
EDITAR PIX
==================================================
*/

async function editarPix(
    id
) {

    const registro =
        pixAdmin.find(
            item =>
                String(
                    item.id
                ) ===
                String(
                    id
                )
        );


    if (!registro) {

        alert(
            "Registro de PIX não encontrado."
        );

        return;

    }


    const nomeAtual =
        obterNomeConvidadoEscolha(
            registro
        );


    const novoNome =
        prompt(
            "Nome do convidado:",
            nomeAtual
        );


    if (
        novoNome === null
    ) {

        return;

    }


    const nome =
        novoNome.trim();


    if (
        nome === ""
    ) {

        alert(
            "O nome não pode ficar vazio."
        );

        return;

    }


    const sucesso =
        await window.editarRegistro(
            "pix",
            id,
            {
                convidado:
                    nome
            }
        );


    if (!sucesso) {

        alert(
            "Não foi possível editar o PIX."
        );

        return;

    }


    await recarregarDadosAdmin();


    mostrarMensagemAdmin(
        "Registro de PIX atualizado com sucesso! ❤️"
    );

}


/*
==================================================
EXCLUIR PIX
==================================================
*/

async function excluirPix(
    id
) {

    const confirmado =
        confirm(
            "Tem certeza que deseja excluir este registro de PIX?"
        );


    if (!confirmado) {

        return;

    }


    const sucesso =
        await window.excluirRegistro(
            "pix",
            id
        );


    if (!sucesso) {

        alert(
            "Não foi possível excluir o registro de PIX."
        );

        return;

    }


    await recarregarDadosAdmin();


    mostrarMensagemAdmin(
        "Registro de PIX excluído com sucesso."
    );

}


/*
==================================================
LISTA CONVIDADOS
==================================================
*/

function carregarListaConvidadosAdmin(
    filtro = ""
) {

    const container =
        document.getElementById(
            "listaAdminConvidados"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    const texto =
        normalizarTextoAdmin(
            filtro
        );


    let lista =
        [
            ...convidadosAdmin
        ];


    /*
    ==========================================
    FILTRO
    ==========================================
    */

    if (texto !== "") {

        lista =
            lista.filter(
                convidado => {

                    const nome =
                        obterNomeConvidado(
                            convidado
                        );


                    const codigo =
                        String(
                            convidado.codigo ||
                            ""
                        );


                    const whatsapp =
                        String(
                            convidado.whatsapp ||
                            ""
                        );


                    const textoBusca =
                        (
                            nome +
                            " " +
                            codigo +
                            " " +
                            whatsapp
                        );


                    return normalizarTextoAdmin(
                        textoBusca
                    ).includes(
                        texto
                    );

                }
            );

    }


    /*
    ==========================================
    NENHUM REGISTRO
    ==========================================
    */

    if (
        lista.length === 0
    ) {

        container.innerHTML = `
            <div class="carregando">
                Nenhuma confirmação encontrada.
            </div>
        `;

        return;

    }


    /*
    ==========================================
    TABELA
    ==========================================
    */

    const tabela =
        document.createElement(
            "table"
        );


    tabela.className =
        "tabela-admin";


    tabela.innerHTML = `

        <thead>

            <tr>

                <th>
                    Data
                </th>

                <th>
                    Código
                </th>

                <th>
                    Nome
                </th>

                <th>
                    Tipo
                </th>

                <th>
                    Idade
                </th>

                <th>
                    Sexo
                </th>

                <th>
                    Calçado
                </th>

                <th>
                    WhatsApp
                </th>

                <th>
                    Check-in
                </th>

                <th>
                    Data Check-in
                </th>

            </tr>

        </thead>

        <tbody></tbody>

    `;


    const tbody =
        tabela.querySelector(
            "tbody"
        );


    /*
    ==========================================
    LINHAS
    ==========================================
    */

    lista.forEach(
        convidado => {

            const tr =
                document.createElement(
                    "tr"
                );


            /*
            DATA
            */

            const data =
                convidado.data
                    ? formatarDataAdmin(
                        convidado.data
                    )
                    : "—";


            /*
            DATA CHECK-IN
            */

            const dataCheckin =
                convidado.dataCheckin
                    ? formatarDataAdmin(
                        convidado.dataCheckin
                    )
                    : "—";


            /*
            CHECK-IN
            */

            const checkin =
                String(
                    convidado.checkin ||
                    ""
                ).toUpperCase();


            let textoCheckin =
                "—";


            if (
                checkin === "SIM"
            ) {

                textoCheckin =
                    "SIM";

            }


            tr.innerHTML = `

                <td>
                    ${escaparHTMLAdmin(
                        data
                    )}
                </td>


                <td>
                    <strong>
                        ${escaparHTMLAdmin(
                            convidado.codigo ||
                            "—"
                        )}
                    </strong>
                </td>


                <td>
                    ${escaparHTMLAdmin(
                        obterNomeConvidado(
                            convidado
                        )
                    )}
                </td>


                <td>
                    ${escaparHTMLAdmin(
                        convidado.tipo ||
                        "—"
                    )}
                </td>


                <td>
                    ${escaparHTMLAdmin(
                        convidado.idade ||
                        "—"
                    )}
                </td>


                <td>
                    ${escaparHTMLAdmin(
                        convidado.sexo ||
                        "—"
                    )}
                </td>


                <td>
                    ${escaparHTMLAdmin(
                        convidado.calcado ||
                        "—"
                    )}
                </td>


                <td>
                    ${escaparHTMLAdmin(
                        convidado.whatsapp ||
                        "—"
                    )}
                </td>


                <td>
                    ${escaparHTMLAdmin(
                        textoCheckin
                    )}
                </td>


                <td>
                    ${escaparHTMLAdmin(
                        dataCheckin
                    )}
                </td>

            `;


            tbody.appendChild(
                tr
            );

        }
    );


    container.appendChild(
        tabela
    );

}

/*
==================================================
AÇÕES CONVIDADOS
==================================================
*/

function configurarAcoesConvidados() {

    document
        .querySelectorAll(
            '[data-acao="editar-convidado"]'
        )
        .forEach(
            botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        editarConvidado(
                            botao.dataset.id
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            '[data-acao="excluir-convidado"]'
        )
        .forEach(
            botao => {

                botao.addEventListener(
                    "click",
                    () => {

                        excluirConvidado(
                            botao.dataset.id
                        );

                    }
                );

            }
        );

}


/*
==================================================
EDITAR CONFIRMAÇÃO
==================================================
*/

async function editarConvidado(
    id
) {

    const registro =
        convidadosAdmin.find(
            item =>
                String(
                    item.id
                ) ===
                String(
                    id
                )
        );


    if (!registro) {

        alert(
            "Confirmação não encontrada."
        );

        return;

    }


    const nomeAtual =
        obterNomeConvidado(
            registro
        );


    const novoNome =
        prompt(
            "Nome do convidado:",
            nomeAtual
        );


    if (
        novoNome === null
    ) {

        return;

    }


    const nome =
        novoNome.trim();


    if (
        nome === ""
    ) {

        alert(
            "O nome não pode ficar vazio."
        );

        return;

    }


    const novoTipo =
        prompt(
            "Tipo do convidado:",
            registro.tipo ||
            registro.tipoConvidado ||
            ""
        );


    if (
        novoTipo === null
    ) {

        return;

    }


    const novoSexo =
        prompt(
            "Sexo:",
            registro.sexo ||
            ""
        );


    if (
        novoSexo === null
    ) {

        return;

    }


    const novoWhatsapp =
        prompt(
            "WhatsApp:",
            registro.whatsapp ||
            registro.telefone ||
            ""
        );


    if (
        novoWhatsapp === null
    ) {

        return;

    }


    const dados = {

        nome:
            nome,

        tipo:
            novoTipo.trim(),

        sexo:
            novoSexo.trim(),

        whatsapp:
            novoWhatsapp.trim()

    };


    const sucesso =
        await window.editarRegistro(
            "convidados",
            id,
            dados
        );


    if (!sucesso) {

        alert(
            "Não foi possível editar a confirmação."
        );

        return;

    }


    await recarregarDadosAdmin();


    mostrarMensagemAdmin(
        "Confirmação atualizada com sucesso! ❤️"
    );

}


/*
==================================================
EXCLUIR CONFIRMAÇÃO
==================================================
*/

async function excluirConvidado(
    id
) {

    const confirmado =
        confirm(
            "Tem certeza que deseja excluir esta confirmação de presença?"
        );


    if (!confirmado) {

        return;

    }


    const sucesso =
        await window.excluirRegistro(
            "convidados",
            id
        );


    if (!sucesso) {

        alert(
            "Não foi possível excluir a confirmação."
        );

        return;

    }


    await recarregarDadosAdmin();


    mostrarMensagemAdmin(
        "Confirmação excluída com sucesso."
    );

}


/*
==================================================
OBTER NOME DA ESCOLHA
==================================================
*/

function obterNomeConvidadoEscolha(
    escolha
) {

    if (
        escolha &&
        typeof escolha.convidado ===
        "object"
    ) {

        return (
            escolha.convidado.nome ||
            "Convidado"
        );

    }


    return (
        escolha?.convidado ||
        "Convidado"
    );

}


/*
==================================================
OBTER NOME DO CONVIDADO
==================================================
*/

function obterNomeConvidado(
    convidado
) {

    return (

        convidado?.nome ||
        convidado?.nomeCompleto ||
        convidado?.convidado ||
        "Convidado"

    );

}


/*
==================================================
PESQUISAS
==================================================
*/

function configurarPesquisas() {

    const campoPresente =
        document.getElementById(
            "buscarPresenteAdmin"
        );


    if (campoPresente) {

        campoPresente.addEventListener(
            "input",
            () => {

                carregarListaPresentesAdmin(
                    campoPresente.value
                );

            }
        );

    }


    const campoConvidado =
        document.getElementById(
            "buscarConvidadoAdmin"
        );


    if (campoConvidado) {

        campoConvidado.addEventListener(
            "input",
            () => {

                carregarListaConvidadosAdmin(
                    campoConvidado.value
                );

            }
        );

    }

}


/*
==================================================
ABAS
==================================================
*/

function configurarAbas() {

    const botoes =
        document.querySelectorAll(
            ".admin-tabs .tab"
        );


    const abas = {

        presentes:
            document.getElementById(
                "abaPresentes"
            ),

        pix:
            document.getElementById(
                "abaPix"
            ),

        convidados:
            document.getElementById(
                "abaConvidados"
            )

    };


    botoes.forEach(
        botao => {

            botao.addEventListener(
                "click",
                () => {

                    const tab =
                        botao.dataset.tab;


                    botoes.forEach(
                        btn =>
                            btn.classList.remove(
                                "ativo"
                            )
                    );


                    botao.classList.add(
                        "ativo"
                    );


                    Object.values(
                        abas
                    ).forEach(
                        aba => {

                            if (aba) {

                                aba.classList.remove(
                                    "ativa"
                                );

                            }

                        }
                    );


                    if (
                        abas[tab]
                    ) {

                        abas[tab].classList.add(
                            "ativa"
                        );

                    }

                }
            );

        }
    );

}


/*
==================================================
MODAL
==================================================
*/

function configurarModal() {

    const modal =
        document.getElementById(
            "modalAdmin"
        );


    const fechar =
        document.getElementById(
            "fecharModalAdmin"
        );


    if (fechar) {

        fechar.addEventListener(
            "click",
            fecharModalAdmin
        );

    }


    if (modal) {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    modal
                ) {

                    fecharModalAdmin();

                }

            }
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key ===
                "Escape"
            ) {

                fecharModalAdmin();

            }

        }
    );

}


/*
==================================================
FECHAR MODAL
==================================================
*/

function fecharModalAdmin() {

    const modal =
        document.getElementById(
            "modalAdmin"
        );


    if (modal) {

        modal.style.display =
            "none";

    }


    presenteDetalheAtual =
        null;

}


/*
==================================================
BOTÃO SAIR
==================================================
*/

function configurarBotaoSair() {

    const botao =
        document.getElementById(
            "btnSair"
        );


    if (!botao) {

        return;

    }


    botao.addEventListener(
        "click",
        async () => {

            if (
                typeof window.sairAdmin ===
                "function"
            ) {

                await window.sairAdmin();

                return;

            }


            window.location.href =
                "admin-login.html";

        }
    );

}


/*
==================================================
RECARREGAR DADOS
==================================================
*/

async function recarregarDadosAdmin() {

    await carregarDadosAdmin();

}


/*
==================================================
MENSAGEM ADMIN
==================================================
*/

function mostrarMensagemAdmin(
    texto
) {

    const elemento =
        document.getElementById(
            "mensagemAdmin"
        );


    if (elemento) {

        elemento.textContent =
            texto;

        elemento.style.display =
            "block";


        setTimeout(
            () => {

                elemento.style.display =
                    "none";

            },
            3000
        );


        return;

    }


    alert(
        texto
    );

}


/*
==================================================
CARREGANDO
==================================================
*/

function mostrarCarregando(
    id,
    texto
) {

    const elemento =
        document.getElementById(
            id
        );


    if (elemento) {

        elemento.innerHTML = `

            <div class="carregando">

                ${escaparHTMLAdmin(
                    texto
                )}

            </div>

        `;

    }

}


/*
==================================================
ERRO
==================================================
*/

function mostrarErro(
    id,
    texto
) {

    const elemento =
        document.getElementById(
            id
        );


    if (elemento) {

        elemento.innerHTML = `

            <div class="carregando">

                ⚠️

                ${escaparHTMLAdmin(
                    texto
                )}

            </div>

        `;

    }

}


/*
==================================================
NORMALIZAR TEXTO
==================================================
*/

function normalizarTextoAdmin(
    texto
) {

    return String(
        texto ?? ""
    )
    .normalize(
        "NFD"
    )
    .replace(
        /[\u0300-\u036f]/g,
        ""
    )
    .toLowerCase()
    .trim();

}


/*
==================================================
FORMATAR DATA FIREBASE
==================================================
*/

function formatarDataAdmin(
    valor
) {

    if (!valor) {
        return "—";
    }


    try {

        const data =
            new Date(
                valor
            );


        if (
            isNaN(
                data.getTime()
            )
        ) {

            return String(
                valor
            );

        }


        return data.toLocaleString(
            "pt-BR",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );


    } catch (erro) {

        return String(
            valor
        );

    }

}


/*
==================================================
ESCAPAR HTML
==================================================
*/

function escaparHTMLAdmin(
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
==================================================
FIM
==================================================
*/
