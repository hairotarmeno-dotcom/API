import { initializeApp }
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {

    getAuth,

    GoogleAuthProvider,

    signInWithPopup

}
from "https://www.gstatic.com/firebasejs/12.13.0/firebase-auth.js";


const firebaseConfig = {

    apiKey: "AIzaSyCqbvZrum86DlaHa793S598KAm25pEU6rs",

    authDomain: "sistema-electoral-onpe.firebaseapp.com",

    projectId: "sistema-electoral-onpe",

    storageBucket: "sistema-electoral-onpe.firebasestorage.app",

    messagingSenderId: "694309126938",

    appId: "1:694309126938:web:e53bf7502d5c801cd322a3",

    measurementId: "G-QR2MBLE2VR"
};

const app =
      initializeApp(firebaseConfig);

const auth =
      getAuth(app);


const provider =
      new GoogleAuthProvider();


const btnGoogle =
      document.getElementById("btnGoogle");


btnGoogle.addEventListener(
    "click",

    async () => {

        try{

            const resultado =
                  await signInWithPopup(
                      auth,
                      provider
                  );

            const usuario =
                  resultado.user;

            console.log(usuario);

            const correosAutorizados = [

                "gosthmeits.024@gmail.com"
            ];

            const esAdministrador =
                            
                correosAutorizados.includes(
                    usuario.email
                );

            if(esAdministrador){

                const pin =
                    prompt(
                        "Ingrese código de verificación institucional"
                    );

                if(pin !== "2026"){

                    alert(
                        "Código incorrecto."
                    );

                    return;
                }
            }

            localStorage.setItem(

                "usuarioGoogle",

                JSON.stringify({

                    nombre:
                        usuario.displayName,

                    correo:
                        usuario.email,

                    foto:
                        usuario.photoURL,

                    admin:
                        esAdministrador
                })
            );

            window.location.href =
                "habilitarmesa.html";

        }catch(error){

            console.error(error);

            alert(error.message);
        }
    }
);