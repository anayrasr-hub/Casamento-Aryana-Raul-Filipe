/*
==================================================
CASAMENTO ARYANA & RAUL FILIPE

LOGIN ADMINISTRATIVO

Arquivo: admin-login.js
==================================================
*/


import {

    getAuth,

    signInWithEmailAndPassword

} from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import { app }
from "./firebase-config.js";


/*
==================================================
FIREBASE AUTH
==================================================
*/

const auth =
    getAuth(app);


/*
==================================================
ELEMENTOS
==================================================
*/

const form =
    document.getElementById(
        "formLoginAdmin"
    );


const campoEmail =
    document.getElementById(
        "email"
    );


const campoSenha =
    document.getElementById(
        "senha"
    );


const botao =
    document.getElementById(
        "btnEntrarAdmin"
    );


const mensagem =
    document.getElementById(
        "erroLogin"
    );


/*
==================================================
MOSTRAR MENSAGEM
==================================================
*/

function mostrarMensagem(
    texto,
    tipo = "erro"
) {

    if (!mensagem) {

        return;

    }


    mensagem.textContent =
        texto;


    mensagem.className =
        `erro-login-admin ${tipo}`;

}


/*
==================================================
LOGIN
==================================================
*/

if (form) {

    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            const email =
                campoEmail
                ?
                campoEmail.value.trim()
                :
                "";


            const senha =
                campoSenha
                ?
                campoSenha.value
                :
                "";


            if (
                email === "" ||
                senha === ""
            ) {

                mostrarMensagem(
                    "Informe o e-mail e a senha."
                );

                return;

            }


            /*
            --------------------------------------
            DESABILITAR BOTÃO
            --------------------------------------
            */

            if (botao) {

                botao.disabled =
                    true;

                botao.textContent =
                    "Entrando...";

            }


            mostrarMensagem(
                ""
            );


            try {

                /*
                ----------------------------------
                AUTENTICAR FIREBASE
                ----------------------------------
                */

                await signInWithEmailAndPassword(
                    auth,
                    email,
                    senha
                );


                /*
                ----------------------------------
                LOGIN REALIZADO
                ----------------------------------
                */

                mostrarMensagem(
                    "Login realizado. Aguarde...",
                    "sucesso"
                );


                /*
                ----------------------------------
                IR PARA ADMIN
                ----------------------------------
                */

                window.location.href =
                    "admin.html";


            } catch (error) {

                console.error(
                    "Erro no login:",
                    error
                );


                let texto =
                    "Não foi possível entrar.";


                /*
                ----------------------------------
                MENSAGENS MAIS AMIGÁVEIS
                ----------------------------------
                */

                if (
                    error.code ===
                    "auth/invalid-credential"
                ) {

                    texto =
                        "E-mail ou senha incorretos.";

                }


                else if (
                    error.code ===
                    "auth/invalid-email"
                ) {

                    texto =
                        "Informe um e-mail válido.";

                }


                else if (
                    error.code ===
                    "auth/user-disabled"
                ) {

                    texto =
                        "Este usuário está desativado.";

                }


                mostrarMensagem(
                    texto
                );


            } finally {

                if (botao) {

                    botao.disabled =
                        false;

                    botao.textContent =
                        "Entrar";

                }

            }

        }
    );

}