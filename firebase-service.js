/*
================================================
CASAMENTO ARYANA & RAUL FILIPE

SERVIÇOS FIREBASE
Arquivo: firebase-service.js

Firebase versão modular

ETAPA 1:
Firebase → Google Sheets

IMPORTANTE:
- Nenhuma exclusão automática nesta etapa.
- Firebase ID é enviado para o Google Sheets.
- Firebase continua sendo preservado.
- Firebase Storage NÃO é utilizado.
- Comprovantes de PIX NÃO são armazenados.
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
URL GOOGLE SHEETS
================================================
*/

const GOOGLE_SHEETS_URL =
    "https://script.google.com/macros/s/AKfycbwxoY3KVrIxOjRvZ8nWJOhwA3dWoK_OVnR3Wj893rZLONMIhIpE_TrOFaRLsmm41q1Q/exec";


/*
================================================
FUNÇÃO AUXILIAR
ENVIA DADOS PARA GOOGLE SHEETS
================================================
*/

async function enviarParaGoogleSheets(dados) {

    try {

        console.log(
            "Enviando dados para Google Sheets:",
            dados
        );


        await fetch(
            GOOGLE_SHEETS_URL,
            {

                method:
                    "POST",

                mode:
                    "no-cors",

                headers: {

                    "Content-Type":
                        "text/plain;charset=utf-8"

                },

                body:
                    JSON.stringify(
                        dados
                    )

            }
        );


        console.log(
            "Dados enviados para Google Sheets."
        );


        return true;


    } catch (erro) {

        console.warn(
            "Não foi possível enviar dados para Google Sheets:",
            erro
        );


        return false;

    }

}


/*
================================================
SALVAR ESCOLHA DE PRESENTE
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


        /*
        ================================================
        1. FIRESTORE
        ================================================
        */

        const registroPresente = {

            presenteId:
                presente.id,

            nomePresente:
                presente.nome,

            convidado:
                convidado,

            data:
                new Date()

        };


        /*
         * IMPORTANTE:
         *
         * addDoc retorna o DocumentReference.
         *
         * O ID real do documento está em:
         *
         * docRef.id
         */

        const docRef =
            await addDoc(
                collection(
                    db,
                    "presentes_escolhidos"
                ),
                registroPresente
            );


        const firebaseId =
            docRef.id;


        console.log(
            "Presente salvo no Firebase:",
            presente.nome
        );


        console.log(
            "Firebase ID do presente:",
            firebaseId
        );


        /*
        ================================================
        2. GOOGLE SHEETS
        ================================================
        */

        await enviarParaGoogleSheets({

            acao:
                "registrarPresenteFirebase",

            firebaseId:
                firebaseId,

            presenteId:
                presente.id || "",

            presente:
                presente.nome ||
                "Presente",

            convidado:
                convidado,

            data:
                new Date().toISOString()

        });


        /*
        ================================================
        3. SUCESSO
        ================================================
        */

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
REGISTRAR PIX
================================================

O comprovante NÃO é enviado nem armazenado.

O arquivo é apenas validado localmente
pelo presentes.js.

O Firestore registra o PIX.

O Google Sheets recebe uma cópia
administrativa do registro.

================================================
*/

async function salvarPix(
    presente,
    convidado,
    valor
) {

    console.log(
        "Iniciando salvamento do PIX..."
    );


    try {

        if (!presente) {

            throw new Error(
                "Presente não informado."
            );

        }


        if (!convidado) {

            throw new Error(
                "Nome do convidado não informado."
            );

        }


        if (
            !valor ||
            Number(valor) <= 0
        ) {

            throw new Error(
                "Valor do PIX inválido."
            );

        }


        /*
        ============================================
        1. FIRESTORE
        ============================================
        */

        const registroPix = {

            presenteId:
                presente.id || null,

            presente:
                presente.nome ||
                presente.nomePresente ||
                "Presente",

            convidado:
                convidado,

            valor:
                Number(valor),

            comprovanteAnexado:
                true,

            status:
                "Recebido",

            data:
                new Date()

        };


        /*
         * Captura o ID real do documento.
         */

        const docRef =
            await addDoc(
                collection(
                    db,
                    "pix"
                ),
                registroPix
            );


        const firebaseId =
            docRef.id;


        console.log(
            "PIX salvo no Firestore."
        );


        console.log(
            "Firebase ID do PIX:",
            firebaseId
        );


        /*
        ============================================
        2. GOOGLE SHEETS
        ============================================
        */

        await enviarParaGoogleSheets({

            acao:
                "registrarPixFirebase",

            firebaseId:
                firebaseId,

            presenteId:
                presente.id || "",

            presente:
                presente.nome ||
                presente.nomePresente ||
                "Presente",

            convidado:
                convidado,

            valor:
                Number(valor),

            comprovanteAnexado:
                true,

            status:
                "Recebido",

            data:
                new Date().toISOString()

        });


        /*
        ============================================
        3. SUCESSO
        ============================================
        */

        return true;


    } catch (erro) {

        console.error(
            "Erro ao salvar PIX:",
            erro
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


        /*
        ============================================
        1. FIRESTORE
        ============================================
        */

        const registroConvidado = {

            ...dados,

            data:
                new Date()

        };


        const docRef =
            await addDoc(
                collection(
                    db,
                    "convidados"
                ),
                registroConvidado
            );


        const firebaseId =
            docRef.id;


        console.log(
            "Confirmação salva com sucesso."
        );


        console.log(
            "Firebase ID do convidado:",
            firebaseId
        );


        /*
        ============================================
        2. GOOGLE SHEETS
        ============================================
        */

        await enviarParaGoogleSheets({

            acao:
                "registrarConvidadoFirebase",

            firebaseId:
                firebaseId,

            ...dados,

            data:
                new Date().toISOString()

        });


        /*
        ============================================
        3. SUCESSO
        ============================================
        */

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
                        convidado.firebaseId ||
                        convidado.codigo ||
                        "",

                    firebaseId:
                        convidado.firebaseId ||
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
            "Presentes escolhidos:",
            lista
        );


        return lista;


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
SINCRONIZAÇÃO FIREBASE → GOOGLE SHEETS
================================================

ETAPA 1

Esta função:

1. Lê convidados do Firestore;
2. Lê PIX do Firestore;
3. Lê presentes escolhidos do Firestore;
4. Envia tudo para o Google Sheets;
5. O codigo.gs atualiza ou adiciona;
6. NÃO exclui nada.

================================================
*/

async function sincronizarFirebaseComSheets() {

    console.log(
        "========================================"
    );

    console.log(
        "INICIANDO SINCRONIZAÇÃO FIREBASE → SHEETS"
    );

    console.log(
        "ETAPA 1 - SEM EXCLUSÕES"
    );

    console.log(
        "========================================"
    );


    try {

        /*
        ============================================
        1. CONVIDADOS
        ============================================
        */

        console.log(
            "Lendo coleção convidados..."
        );


        const convidadosSnapshot =
            await getDocs(
                collection(
                    db,
                    "convidados"
                )
            );


        const convidados = [];


        convidadosSnapshot.forEach(
            registro => {

                const dados =
                    registro.data();


                convidados.push({

                    firebaseId:
                        registro.id,

                    ...dados

                });

            }
        );


        console.log(
            "Convidados encontrados:",
            convidados.length
        );


        /*
        ============================================
        2. PIX
        ============================================
        */

        console.log(
            "Lendo coleção pix..."
        );


        const pixSnapshot =
            await getDocs(
                collection(
                    db,
                    "pix"
                )
            );


        const pix = [];


        pixSnapshot.forEach(
            registro => {

                const dados =
                    registro.data();


                pix.push({

                    firebaseId:
                        registro.id,

                    ...dados

                });

            }
        );


        console.log(
            "PIX encontrados:",
            pix.length
        );


        /*
        ============================================
        3. PRESENTES
        ============================================
        */

        console.log(
            "Lendo coleção presentes_escolhidos..."
        );


        const presentesSnapshot =
            await getDocs(
                collection(
                    db,
                    "presentes_escolhidos"
                )
            );


        const presentes = [];


        presentesSnapshot.forEach(
            registro => {

                const dados =
                    registro.data();


                presentes.push({

                    firebaseId:
                        registro.id,

                    ...dados

                });

            }
        );


        console.log(
            "Presentes encontrados:",
            presentes.length
        );


        /*
        ============================================
        4. ENVIAR CONVIDADOS
        ============================================
        */

        let convidadosEnviados = 0;


        for (
            const convidado of convidados
        ) {

            const enviado =
                await enviarParaGoogleSheets({

                    acao:
                        "registrarConvidadoFirebase",

                    ...convidado

                });


            if (enviado) {

                convidadosEnviados++;
            }

        }


        /*
        ============================================
        5. ENVIAR PIX
        ============================================
        */

        let pixEnviados = 0;


        for (
            const registroPix of pix
        ) {

            const enviado =
                await enviarParaGoogleSheets({

                    acao:
                        "registrarPixFirebase",

                    ...registroPix

                });


            if (enviado) {

                pixEnviados++;
            }

        }


        /*
        ============================================
        6. ENVIAR PRESENTES
        ============================================
        */

        let presentesEnviados = 0;


        for (
            const presente of presentes
        ) {

            const enviado =
                await enviarParaGoogleSheets({

                    acao:
                        "registrarPresenteFirebase",

                    firebaseId:
                        presente.firebaseId,

                    presenteId:
                        presente.presenteId ||
                        "",

                    presente:
                        presente.nomePresente ||
                        presente.presente ||
                        "Presente",

                    convidado:
                        presente.convidado ||
                        "Convidado",

                    data:
                        converterDataParaISO(
                            presente.data
                        )

                });


            if (enviado) {

                presentesEnviados++;
            }

        }


        /*
        ============================================
        7. RESULTADO
        ============================================
        */

        const resultado = {

            sucesso:
                true,

            etapa:
                1,

            exclusoes:
                0,

            firebase: {

                convidados:
                    convidados.length,

                pix:
                    pix.length,

                presentes:
                    presentes.length

            },

            enviados: {

                convidados:
                    convidadosEnviados,

                pix:
                    pixEnviados,

                presentes:
                    presentesEnviados

            },

            mensagem:
                "Sincronização Firebase → Google Sheets concluída. Nenhum registro foi excluído."

        };


        console.log(
            "========================================"
        );

        console.log(
            "SINCRONIZAÇÃO CONCLUÍDA"
        );

        console.log(
            resultado
        );

        console.log(
            "========================================"
        );


        return resultado;


    } catch (error) {

        console.error(
            "ERRO NA SINCRONIZAÇÃO:",
            error
        );


        return {

            sucesso:
                false,

            etapa:
                1,

            exclusoes:
                0,

            mensagem:
                "Erro durante a sincronização.",

            erro:
                error.message

        };

    }

}


/*
================================================
CONVERTER DATA FIREBASE PARA ISO
================================================
*/

function converterDataParaISO(valor) {

    if (!valor) {

        return "";
    }


    /*
     * Timestamp do Firestore
     */

    if (
        typeof valor === "object" &&
        valor !== null
    ) {

        if (
            typeof valor.toDate ===
            "function"
        ) {

            return valor
                .toDate()
                .toISOString();
        }


        if (
            valor.seconds !== undefined
        ) {

            return new Date(
                Number(valor.seconds) * 1000
            ).toISOString();
        }
    }


    /*
     * Date
     */

    if (
        valor instanceof Date
    ) {

        return valor.toISOString();
    }


    /*
     * String
     */

    if (
        typeof valor === "string"
    ) {

        const data =
            new Date(valor);


        if (
            !isNaN(
                data.getTime()
            )
        ) {

            return data.toISOString();
        }
    }


    /*
     * Número
     */

    if (
        typeof valor === "number"
    ) {

        const data =
            new Date(valor);


        if (
            !isNaN(
                data.getTime()
            )
        ) {

            return data.toISOString();
        }
    }


    return "";

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

IMPORTANTE:

Esta função continua disponível porque
já fazia parte do sistema.

A ETAPA 1 NÃO chama esta função
automaticamente.

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
DISPONIBILIZAR FUNÇÕES GLOBAIS
================================================
*/

window.salvarEscolhaPresente =
    salvarEscolhaPresente;


window.buscarPresentesEscolhidos =
    buscarPresentesEscolhidos;


window.salvarPix =
    salvarPix;


window.buscarPix =
    buscarPix;


window.salvarConfirmacao =
    salvarConfirmacao;


window.buscarConvidados =
    buscarConvidados;


window.editarRegistro =
    editarRegistro;


window.excluirRegistro =
    excluirRegistro;


window.buscarConfirmacoesGoogleSheets =
    buscarConfirmacoesGoogleSheets;


/*
 * NOVA FUNÇÃO DA ETAPA 1
 */

window.sincronizarFirebaseComSheets =
    sincronizarFirebaseComSheets;


/*
================================================
LOG FINAL
================================================
*/

console.log(
    "Firebase Service carregado com sucesso."
);

console.log(
    "Firebase Storage desativado."
);

console.log(
    "Comprovantes PIX não serão armazenados."
);

console.log(
    "Sincronização Firebase → Sheets disponível."
);
