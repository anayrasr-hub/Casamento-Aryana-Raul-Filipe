/*
================================================
CASAMENTO ARYANA & RAUL FILIPE

SERVIÇOS FIREBASE
Arquivo: firebase-service.js

Firebase versão modular

Funções:
- Presentes
- PIX
- Upload de comprovante
- Google Sheets
- Confirmação de presença
- Check-in
================================================
*/


/*
================================================
FIREBASE FIRESTORE
================================================
*/

import {

    collection,

    addDoc,

    getDocs,

    query,

    orderBy,

    doc,

    updateDoc,

    deleteDoc

}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


/*
================================================
FIREBASE STORAGE
================================================
*/

import {

    getStorage,

    ref,

    uploadBytes,

    getDownloadURL

}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";


/*
================================================
CONFIGURAÇÃO FIREBASE
================================================
*/

import {

    app,

    db

}
from "./firebase-config.js";


/*
================================================
STORAGE
================================================
*/

const storage =
    getStorage(
        app
    );


/*
================================================
URL GOOGLE SHEETS
================================================
*/

const GOOGLE_SHEETS_URL =
    "https://script.google.com/macros/s/AKfycbwxoY3KVrIxOjRvZ8nWJOhwA3dWoK_OVnR3Wj893rZLONMIhIpE_TrOFaRLsmm41q1Q/exec";


/*
================================================
SALVAR PRESENTE ESCOLHIDO
================================================
*/

async function salvarEscolhaPresente(
    presente,
    convidado = "Convidado"
) {

    try {

        if (!presente) {

            throw new Error(
                "Presente não informado."
            );

        }


        await addDoc(
            collection(
                db,
                "presentes_escolhidos"
            ),
            {

                presenteId:
                    presente.id,

                nomePresente:
                    presente.nome,

                convidado:
                    convidado,

                data:
                    new Date()

            }
        );


        console.log(
            "Presente salvo com sucesso:",
            presente.nome
        );


        return true;


    } catch (error) {

        console.error(
            "Erro ao salvar presente:",
            error
        );


        return false;

    }

}


/*
================================================
BUSCAR PRESENTES ESCOLHIDOS
================================================
*/

async function buscarPresentesEscolhidos() {

    try {

        const consulta =
            query(
                collection(
                    db,
                    "presentes_escolhidos"
                ),
                orderBy(
                    "data",
                    "desc"
                )
            );


        const snapshot =
            await getDocs(
                consulta
            );


        const escolhidos = [];


        snapshot.forEach(
            registro => {

                escolhidos.push({

                    id:
                        registro.id,

                    ...registro.data()

                });

            }
        );


        console.log(
            "Presentes escolhidos:",
            escolhidos
        );


        return escolhidos;


    } catch (error) {

        console.error(
            "Erro ao buscar presentes escolhidos:",
            error
        );


        return [];

    }

}


/*
================================================
ENVIAR COMPROVANTE PIX
================================================

Recebe o arquivo selecionado pelo convidado.

O arquivo é armazenado no:

Firebase Storage

Pasta:

comprovantes_pix/
================================================
*/

async function enviarComprovantePix(
    arquivo,
    presente
) {

    try {

        if (!arquivo) {

            throw new Error(
                "Nenhum comprovante foi selecionado."
            );

        }


        if (!presente) {

            throw new Error(
                "Presente não informado."
            );

        }


        /*
        ========================================
        VALIDAR TAMANHO
        ========================================
        */

        const tamanhoMaximo =
            10 * 1024 * 1024;


        if (
            arquivo.size >
            tamanhoMaximo
        ) {

            throw new Error(
                "O comprovante deve ter no máximo 10 MB."
            );

        }


        /*
        ========================================
        VALIDAR TIPO
        ========================================
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

            throw new Error(
                "Formato de comprovante não permitido."
            );

        }


        /*
        ========================================
        NOME SEGURO
        ========================================
        */

        const extensao =
            obterExtensaoArquivo(
                arquivo.name
            );


        const identificador =
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .substring(2, 10);


        const nomeArquivo =
            "pix_" +
            String(
                presente.id
            ) +
            "_" +
            identificador +
            extensao;


        /*
        ========================================
        CAMINHO STORAGE
        ========================================
        */

        const caminho =
            "comprovantes_pix/" +
            nomeArquivo;


        console.log(
            "Enviando comprovante:",
            caminho
        );


        /*
        ========================================
        REFERÊNCIA
        ========================================
        */

        const referencia =
            ref(
                storage,
                caminho
            );


        /*
        ========================================
        METADADOS
        ========================================
        */

        const metadata = {

            contentType:
                arquivo.type,

            customMetadata: {

                presenteId:
                    String(
                        presente.id
                    ),

                presente:
                    String(
                        presente.nome
                    )

            }

        };


        /*
        ========================================
        UPLOAD
        ========================================
        */

        await uploadBytes(
            referencia,
            arquivo,
            metadata
        );


        /*
        ========================================
        URL
        ========================================
        */

        const url =
            await getDownloadURL(
                referencia
            );


        console.log(
            "Comprovante enviado com sucesso:",
            url
        );


        return url;


    } catch (error) {

        console.error(
            "Erro ao enviar comprovante:",
            error
        );


        throw error;

    }

}


/*
================================================
OBTER EXTENSÃO
================================================
*/

function obterExtensaoArquivo(
    nome
) {

    const ultimoPonto =
        String(
            nome || ""
        )
        .lastIndexOf(".");


    if(
        ultimoPonto === -1
    ){

        return "";

    }


    return String(
        nome
    )
    .substring(
        ultimoPonto
    )
    .toLowerCase();

}


/*
================================================
REGISTRAR PIX
================================================

Fluxo:

Site
↓
Firebase Storage
↓
URL do comprovante
↓
Google Sheets

A função exige:

- presente
- convidado
- valor
- comprovanteUrl
================================================
*/

async function salvarPix(

    presente,

    convidado = "Convidado",

    valor = 0,

    comprovanteUrl = ""

) {

    try {

        if (!presente) {

            throw new Error(
                "Presente não informado."
            );

        }


        /*
        ========================================
        VALIDAR CONVIDADO
        ========================================
        */

        const nomeConvidado =
            String(
                convidado || ""
            ).trim();


        if (
            !nomeConvidado
        ) {

            throw new Error(
                "Nome do convidado não informado."
            );

        }


        /*
        ========================================
        VALIDAR VALOR
        ========================================
        */

        const valorNumerico =
            Number(
                valor
            );


        if (
            !Number.isFinite(
                valorNumerico
            ) ||
            valorNumerico <= 0
        ) {

            throw new Error(
                "Valor do PIX inválido."
            );

        }


        /*
        ========================================
        VALIDAR COMPROVANTE
        ========================================
        */

        const urlComprovante =
            String(
                comprovanteUrl || ""
            ).trim();


        if (
            !urlComprovante
        ) {

            throw new Error(
                "Comprovante não informado."
            );

        }


        /*
        ========================================
        1 — FIRESTORE
        ========================================
        */

        await addDoc(
            collection(
                db,
                "pix"
            ),
            {

                presenteId:
                    presente.id,

                presente:
                    presente.nome,

                convidado:
                    nomeConvidado,

                valor:
                    valorNumerico,

                comprovanteUrl:
                    urlComprovante,

                status:
                    "Recebido",

                data:
                    new Date()

            }
        );


        console.log(
            "PIX salvo no Firestore."
        );


        /*
        ========================================
        2 — GOOGLE SHEETS
        ========================================
        */

        const dadosSheets = {

            acao:
                "registrarPix",

            presenteId:
                String(
                    presente.id
                ),

            presente:
                String(
                    presente.nome
                ),

            convidado:
                nomeConvidado,

            valor:
                valorNumerico,

            comprovanteUrl:
                urlComprovante

        };


        const resposta =
            await fetch(
                GOOGLE_SHEETS_URL,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "text/plain;charset=utf-8"

                    },

                    body:
                        JSON.stringify(
                            dadosSheets
                        )

                }
            );


        if (
            !resposta.ok
        ) {

            console.warn(
                "Google Sheets retornou HTTP:",
                resposta.status
            );

        }


        console.log(
            "PIX enviado para Google Sheets."
        );


        return true;


    } catch (error) {

        console.error(
            "Erro ao registrar PIX:",
            error
        );


        return false;

    }

}


/*
================================================
BUSCAR REGISTROS DE PIX
================================================
*/

async function buscarPix() {

    try {

        const consulta =
            query(
                collection(
                    db,
                    "pix"
                ),
                orderBy(
                    "data",
                    "desc"
                )
            );


        const snapshot =
            await getDocs(
                consulta
            );


        const lista = [];


        snapshot.forEach(
            registro => {

                lista.push({

                    id:
                        registro.id,

                    ...registro.data()

                });

            }
        );


        console.log(
            "Registros de PIX:",
            lista
        );


        return lista;


    } catch (error) {

        console.error(
            "Erro ao buscar registros de PIX:",
            error
        );


        return [];

    }

}


/*
================================================
SALVAR CONFIRMAÇÃO DE PRESENÇA
================================================
*/

async function salvarConfirmacao(
    dados
) {

    try {

        if (!dados) {

            throw new Error(
                "Dados da confirmação não informados."
            );

        }


        await addDoc(
            collection(
                db,
                "convidados"
            ),
            {

                ...dados,

                data:
                    new Date()

            }
        );


        console.log(
            "Confirmação salva com sucesso."
        );


        return true;


    } catch (error) {

        console.error(
            "Erro confirmação:",
            error
        );


        return false;

    }

}


/*
================================================
BUSCAR CONFIRMAÇÕES
FONTE OFICIAL: GOOGLE SHEETS
================================================
*/

async function buscarConvidados() {

    try {

        console.log(
            "Buscando confirmações no Google Sheets..."
        );


        const resposta =
            await fetch(
                GOOGLE_SHEETS_URL +
                "?acao=listarConvidados",
                {

                    method:
                        "GET",

                    cache:
                        "no-store"

                }
            );


        if (
            !resposta.ok
        ) {

            throw new Error(
                "Erro HTTP " +
                resposta.status
            );

        }


        const resultado =
            await resposta.json();


        console.log(
            "Resposta Google Sheets:",
            resultado
        );


        if (
            !resultado ||
            resultado.sucesso !== true
        ) {

            throw new Error(
                resultado?.erro ||
                resultado?.mensagem ||
                "Erro ao consultar Google Sheets."
            );

        }


        const convidados =
            Array.isArray(
                resultado.convidados
            )
                ? resultado.convidados
                : [];


        return convidados.map(
            convidado => {

                return {

                    id:
                        convidado.id ||
                        convidado.codigo ||
                        "",

                    codigo:
                        convidado.codigo ||
                        "",

                    nome:
                        convidado.nome ||
                        convidado.nomeCompleto ||
                        "",

                    tipo:
                        convidado.tipo ||
                        "",

                    idade:
                        convidado.idade ||
                        "",

                    sexo:
                        convidado.sexo ||
                        "",

                    calcado:
                        convidado.calcado ||
                        "",

                    whatsapp:
                        convidado.whatsapp ||
                        "",

                    checkin:
                        convidado.checkin ||
                        "",

                    dataCheckin:
                        convidado.dataCheckin ||
                        "",

                    data:
                        convidado.data ||
                        ""

                };

            }
        );


    } catch (error) {

        console.error(
            "Erro ao buscar confirmações no Google Sheets:",
            error
        );


        return [];

    }

}


/*
================================================
BUSCAR CONFIRMAÇÕES GOOGLE SHEETS
================================================
*/

async function buscarConfirmacoesGoogleSheets() {

    try {

        console.log(
            "Buscando confirmações do Google Sheets..."
        );


        const resposta =
            await fetch(
                GOOGLE_SHEETS_URL,
                {

                    method:
                        "GET",

                    cache:
                        "no-store"

                }
            );


        if (
            !resposta.ok
        ) {

            throw new Error(
                "Erro HTTP " +
                resposta.status
            );

        }


        const texto =
            await resposta.text();


        if (!texto) {

            return [];

        }


        let resultado;


        try {

            resultado =
                JSON.parse(
                    texto
                );

        } catch (erroJSON) {

            console.error(
                "Resposta do Google Sheets não é JSON:",
                texto
            );

            return [];

        }


        if (
            resultado &&
            resultado.sucesso === true &&
            Array.isArray(
                resultado.convidados
            )
        ) {

            return resultado.convidados;

        }


        if (
            resultado &&
            Array.isArray(
                resultado.resultados
            )
        ) {

            return resultado.resultados;

        }


        if (
            Array.isArray(
                resultado
            )
        ) {

            return resultado;

        }


        return [];


    } catch (error) {

        console.error(
            "Erro ao buscar confirmações:",
            error
        );


        return [];

    }

}


/*
================================================
EDITAR REGISTRO
================================================
*/

async function editarRegistro(
    colecao,
    id,
    dados
) {

    try {

        if (
            !colecao ||
            !id ||
            !dados
        ) {

            throw new Error(
                "Coleção, ID ou dados não informados."
            );

        }


        const referencia =
            doc(
                db,
                colecao,
                id
            );


        await updateDoc(
            referencia,
            dados
        );


        console.log(
            "Registro atualizado:",
            colecao,
            id
        );


        return true;


    } catch (error) {

        console.error(
            "Erro ao editar registro:",
            error
        );


        return false;

    }

}


/*
================================================
EXCLUIR REGISTRO
================================================
*/

async function excluirRegistro(
    colecao,
    id
) {

    try {

        if (
            !colecao ||
            !id
        ) {

            throw new Error(
                "Coleção ou ID não informado."
            );

        }


        const referencia =
            doc(
                db,
                colecao,
                id
            );


        await deleteDoc(
            referencia
        );


        console.log(
            "Registro excluído:",
            colecao,
            id
        );


        return true;


    } catch (error) {

        console.error(
            "Erro ao excluir registro:",
            error
        );


        console.error(
            "Código Firebase:",
            error?.code ||
            "sem código"
        );


        return false;

    }

}


/*
================================================
DISPONIBILIZAR FUNÇÕES
================================================
*/

window.salvarEscolhaPresente =
    salvarEscolhaPresente;


window.buscarPresentesEscolhidos =
    buscarPresentesEscolhidos;


window.enviarComprovantePix =
    enviarComprovantePix;


window.salvarPix =
    salvarPix;


window.salvarConfirmacao =
    salvarConfirmacao;


window.buscarConvidados =
    buscarConvidados;


window.buscarPix =
    buscarPix;


window.editarRegistro =
    editarRegistro;


window.excluirRegistro =
    excluirRegistro;


window.buscarConfirmacoesGoogleSheets =
    buscarConfirmacoesGoogleSheets;


console.log(
    "Firebase Service carregado com sucesso."
);

console.log(
    "Firebase Storage preparado para comprovantes PIX."
);
