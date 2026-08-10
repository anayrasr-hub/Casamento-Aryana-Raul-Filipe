/*
==================================================
CASAMENTO ARYANA & RAUL FILIPE

PROTEÇÃO DA ÁREA ADMINISTRATIVA
==================================================
*/

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import { app } from "./firebase-config.js";


const auth =
    getAuth(app);


/*
==================================================
VERIFICAÇÃO ÚNICA DA AUTENTICAÇÃO
==================================================
*/

window.adminAuthReady =
    new Promise(
        (resolve, reject) => {

            const unsubscribe =
                onAuthStateChanged(
                    auth,
                    user => {

                        unsubscribe();


                        if (!user) {

                            console.warn(
                                "Administrador não autenticado."
                            );


                            reject(
                                new Error(
                                    "Usuário não autenticado."
                                )
                            );


                            window.location.replace(
                                "admin-login.html"
                            );


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


                        resolve(user);

                    },

                    error => {

                        console.error(
                            "Erro ao verificar autenticação:",
                            error
                        );


                        reject(error);

                    }
                );

        }
    );


/*
==================================================
SAIR
==================================================
*/

async function sairAdmin() {

    try {

        await signOut(auth);


        console.log(
            "Administrador saiu do sistema."
        );


        window.location.replace(
            "admin-login.html"
        );


    } catch (error) {

        console.error(
            "Erro ao sair:",
            error
        );


        alert(
            "Não foi possível sair. Tente novamente."
        );

    }

}


window.sairAdmin =
    sairAdmin;