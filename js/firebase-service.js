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
================================================
BUSCAR CONVIDADOS
================================================
*/

async function buscarConvidados() {

    try {

        const snapshot =
            await getDocs(
                collection(
                    db,
                    "convidados"
                )
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

        return lista;

    } catch (error) {

        console.error(
            "Erro ao buscar convidados:",
            error
        );

        return [];

    }

}

/*
==================================================
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