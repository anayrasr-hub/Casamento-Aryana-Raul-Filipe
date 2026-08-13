/*
================================================
CASAMENTO ARYANA & RAUL FILIPE

SERVIÇOS FIREBASE
Arquivo: firebase-service.js

Firebase versão modular
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
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { db } from "./firebase-config.js";


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

        const consulta = query(
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
            await getDocs(consulta);

        const escolhidos = [];

        snapshot.forEach(
            doc => {

                escolhidos.push({

                    id: doc.id,

                    ...doc.data()

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
REGISTRAR PIX
================================================
*/

async function salvarPix(
    presente,
    convidado = "Convidado"
) {

    try {

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
                    convidado,

                data:
                    new Date()

            }
        );

        console.log(
            "PIX registrado com sucesso."
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
SALVAR CONFIRMAÇÃO DE PRESENÇA
================================================
*/

async function salvarConfirmacao(
    dados
) {

    try {

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
==================================================
BUSCAR CONVIDADOS
FONTE OFICIAL: GOOGLE SHEETS
==================================================
*/

async function buscarConvidados() {

    const GOOGLE_SHEETS_URL =
        "https://script.google.com/macros/s/AKfycbwxoY3KVrIxOjRvZ8nWJOhwA3dWoK_OVnR3Wj893rZLONMIhIpE_TrOFaRLsmm41q1Q/exec";


    try {

        console.log(
            "Buscando confirmações no Google Sheets..."
        );


        const resposta =
            await fetch(
                GOOGLE_SHEETS_URL +
                "?acao=listarConvidados"
            );


        if (!resposta.ok) {

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
                resultado &&
                resultado.erro
                    ? resultado.erro
                    : "Erro ao consultar Google Sheets."
            );

        }


        const convidados =
            Array.isArray(
                resultado.convidados
            )
                ? resultado.convidados
                : [];


        /*
        ------------------------------------------
        NORMALIZA OS DADOS PARA O PAINEL
        ------------------------------------------
        */

        return convidados.map(
            function(convidado) {

                return {

                    id:
                        convidado.id,

                    codigo:
                        convidado.codigo || "",

                    nome:
                        convidado.nome || "",

                    tipo:
                        convidado.tipo || "",

                    idade:
                        convidado.idade || "",

                    sexo:
                        convidado.sexo || "",

                    calcado:
                        convidado.calcado || "",

                    whatsapp:
                        convidado.whatsapp || "",

                    checkin:
                        convidado.checkin || "",

                    dataCheckin:
                        convidado.dataCheckin || "",

                    data:
                        convidado.data || ""

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

}==================================================
BUSCAR REGISTROS DE PIX
==================================================
*/

async function buscarPix() {

    try {

        const consulta = query(
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
            doc => {

                lista.push({

                    id:
                        doc.id,

                    ...doc.data()

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
==================================================
ADMINISTRADOR
EDITAR REGISTRO
==================================================
*/

async function editarRegistro(
    colecao,
    id,
    dados
) {

    try {

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
==================================================
ADMINISTRADOR
EXCLUIR REGISTRO
==================================================
*/

async function excluirRegistro(
    colecao,
    id
) {

    try {

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
        error?.code || "sem código"
    );

    return false;

    }

}


/*
================================================
DISPONIBILIZAR FUNÇÕES
PARA OS OUTROS ARQUIVOS
================================================
*/

window.salvarEscolhaPresente =
    salvarEscolhaPresente;

window.buscarPresentesEscolhidos =
    buscarPresentesEscolhidos;

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
window.editarRegistro =
    editarRegistro;

window.excluirRegistro =
    excluirRegistro;

/*
==================================================
BUSCAR CONFIRMAÇÕES DO GOOGLE SHEETS
==================================================
*/

const GOOGLE_SHEETS_URL =
    "https://script.google.com/macros/s/AKfycbwxoY3KVrIxOjRvZ8nWJOhwA3dWoK_OVnR3Wj893rZLONMIhIpE_TrOFaRLsmm41q1Q/exec";


async function buscarConfirmacoesGoogleSheets() {

    try {

        console.log(
            "Buscando confirmações no Google Sheets..."
        );

        const resposta =
            await fetch(
                GOOGLE_SHEETS_URL,
                {
                    method: "GET",
                    cache: "no-store"
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


        let resultado;


        try {

            resultado =
                JSON.parse(texto);

        } catch (erroJSON) {

            console.error(
                "Resposta do Google Sheets não é JSON:",
                texto
            );

            return [];

        }


        /*
        ==========================================
        FORMATO ATUAL DO SEU APPS SCRIPT

        {
            sucesso: true,
            convidados: [...]
        }
        ==========================================
        */

        if (
            resultado &&
            resultado.sucesso === true &&
            Array.isArray(
                resultado.convidados
            )
        ) {

            return resultado.convidados;

        }


        /*
        ==========================================
        CASO O APPS SCRIPT RETORNE "resultados"
        ==========================================
        */

        if (
            resultado &&
            Array.isArray(
                resultado.resultados
            )
        ) {

            return resultado.resultados;

        }


        /*
        ==========================================
        CASO RETORNE DIRETAMENTE UM ARRAY
        ==========================================
        */

        if (
            Array.isArray(resultado)
        ) {

            return resultado;

        }


        console.warn(
            "Nenhuma confirmação encontrada no retorno:",
            resultado
        );

        return [];


    } catch (erro) {

        console.error(
            "Erro ao buscar confirmações do Google Sheets:",
            erro
        );

        return [];

    }

}


window.buscarConfirmacoesGoogleSheets =
    buscarConfirmacoesGoogleSheets;