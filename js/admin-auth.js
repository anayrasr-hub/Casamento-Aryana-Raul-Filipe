/*
==================================================
CASAMENTO ARYANA & RAUL FILIPE

PROTEÇÃO DA ÁREA ADMINISTRATIVA

Arquivo: admin-auth.js
==================================================
*/

import {
    getAuth,
    onAuthStateChanged,
    signOut
}
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { app }
from "./firebase-config.js";


/*
==================================================
FIREBASE AUTH
==================================================
*/

const auth =
    getAuth(app);

window.adminAuthReady =
    new Promise(
        (resolve, reject) => {

            const unsubscribe =
                onAuthStateChanged(
                    auth,
                    user => {

                        unsubscribe();

                        if (!user) {

                            reject(
                                new Error(
                                    "Usuário não autenticado."
                                )
                            );

                            window.location.href =
                                "admin-login.html";

                            return;

                        }


                        console.log(
                            "Administrador autenticado:",
                            user.email
                        );


                        const elementoEmail =
                            document.getElementById(
                                "emailAdministrador"
                            );


                        if (elementoEmail) {

                            elementoEmail.textContent =
                                user.email;

                        }


                        resolve(
                            user
                        );

                    },
                    error => {

                        reject(
                            error
                        );

                    }
                );

        }
    );
/*
==================================================
VERIFICAR LOGIN
==================================================
*/

onAuthStateChanged(
    auth,
    user => {

        if (!user) {

            console.warn(
                "Usuário não autenticado. Redirecionando para o login."
            );

            window.location.href =
                "admin-login.html";

            return;

        }


        console.log(
            "Administrador autenticado:",
            user.email
        );


        /*
        ------------------------------------------
        MOSTRAR E-MAIL DO ADMIN
        ------------------------------------------
        */

        const elementoEmail =
            document.getElementById(
                "emailAdministrador"
            );


        if (elementoEmail) {

            elementoEmail.textContent =
                user.email;

        }

    }
);


/*
==================================================
FUNÇÃO SAIR
==================================================
*/

async function sairAdmin() {

    try {

        await signOut(
            auth
        );

        window.location.href =
            "admin-login.html";

    } catch (error) {

        console.error(
            "Erro ao sair da Administração:",
            error
        );

        alert(
            "Não foi possível sair. Tente novamente."
        );

    }

}


/*
==================================================
EXPOR FUNÇÃO
==================================================
*/

window.sairAdmin =
    sairAdmin;