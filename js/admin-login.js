/*
==================================================
CASAMENTO ARYANA & RAUL FILIPE
LOGIN ADMINISTRATIVO
==================================================
*/

import {
    getAuth,
    signInWithEmailAndPassword,
    setPersistence,
    browserLocalPersistence
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { app } from "./firebase-config.js";


const auth = getAuth(app);


const form =
    document.getElementById("formLoginAdmin");

const campoEmail =
    document.getElementById("email");

const campoSenha =
    document.getElementById("senha");

const botao =
    document.getElementById("btnEntrarAdmin");

const mensagem =
    document.getElementById("erroLogin");


function mostrarMensagem(
    texto,
    tipo = "erro"
) {

    if (!mensagem) {
        return;
    }

    mensagem.textContent = texto;

    mensagem.className =
        "erro-login-admin " + tipo;
}


if (form) {

    form.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();

            const email =
                campoEmail
                ? campoEmail.value.trim()
                : "";

            const senha =
                campoSenha
                ? campoSenha.value
                : "";


            if (!email || !senha) {

                mostrarMensagem(
                    "Informe o e-mail e a senha."
                );

                return;
            }


            if (botao) {

                botao.disabled = true;

                botao.textContent =
                    "Entrando...";
            }


            mostrarMensagem("");


            try {

                /*
                ==========================================
                MANTER LOGIN NO NAVEGADOR
                ==========================================
                */

                await setPersistence(
                    auth,
                    browserLocalPersistence
                );


                /*
                ==========================================
                FAZER LOGIN
                ==========================================
                */

                const resultado =
                    await signInWithEmailAndPassword(
                        auth,
                        email,
                        senha
                    );


                console.log(
                    "Login administrativo realizado:",
                    resultado.user.email
                );


                mostrarMensagem(
                    "Login realizado. Abrindo painel...",
                    "sucesso"
                );


                /*
                ==========================================
                PEQUENO TEMPO PARA O FIREBASE CONFIRMAR
                ==========================================
                */

                setTimeout(
                    () => {

                        window.location.replace(
                            "admin.html"
                        );

                    },
                    300
                );


            } catch (error) {

                console.error(
                    "ERRO COMPLETO NO LOGIN:",
                    error
                );


                let texto =
                    "Não foi possível entrar.";


                switch (error.code) {

                    case "auth/invalid-credential":

                        texto =
                            "E-mail ou senha incorretos.";

                        break;


                    case "auth/wrong-password":

                        texto =
                            "Senha incorreta.";

                        break;


                    case "auth/user-not-found":

                        texto =
                            "Usuário administrador não encontrado.";

                        break;


                    case "auth/invalid-email":

                        texto =
                            "Informe um e-mail válido.";

                        break;


                    case "auth/user-disabled":

                        texto =
                            "Este usuário está desativado no Firebase.";

                        break;


                    case "auth/too-many-requests":

                        texto =
                            "Muitas tentativas. Aguarde alguns minutos e tente novamente.";

                        break;


                    case "auth/network-request-failed":

                        texto =
                            "Falha de conexão com o Firebase.";

                        break;


                    case "auth/operation-not-allowed":

                        texto =
                            "O login por e-mail e senha não está habilitado no Firebase.";

                        break;


                    default:

                        texto =
                            "Erro no login: " +
                            (
                                error.code ||
                                error.message ||
                                "erro desconhecido"
                            );

                }


                mostrarMensagem(
                    texto
                );


            } finally {

                if (botao) {

                    botao.disabled = false;

                    botao.textContent =
                        "Entrar";

                }

            }

        }
    );

}