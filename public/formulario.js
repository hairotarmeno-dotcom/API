import { initializeApp }

from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {

    getFirestore,

    collection,

    getDocs

}

from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


const firebaseConfig = {

    apiKey: "TU_API_KEY",

    authDomain: "sistema-electoral-onpe.firebaseapp.com",

    projectId: "sistema-electoral-onpe",

    storageBucket: "sistema-electoral-onpe.firebasestorage.app",

    messagingSenderId: "694309126938",

    appId: "1:694309126938:web:e53bf7502d5c801cd322a3",

    measurementId: "G-QR2MBLE2VR"
};

const app =
      initializeApp(firebaseConfig);

const db =
      getFirestore(app);


document
.getElementById("formRegistro")

.addEventListener(

    "submit",

    async function(e){

        e.preventDefault();

        const dni =
              document.getElementById("dni")
              .value
              .trim();

        const nombre =
              document.getElementById("nombre")
              .value
              .trim()
              .toLowerCase();

        const apellidoP =
              document.getElementById("apellidoP")
              .value
              .trim()
              .toLowerCase();

        const apellidoM =
              document.getElementById("apellidoM")
              .value
              .trim()
              .toLowerCase();

        const numeroSeguridad =
              document.getElementById("numeroSeguridad")
              .value
              .trim();

        const mensaje =
              document.getElementById("mensaje");


        if(!/^\d{8}$/.test(dni)){

            mensaje.style.color = "red";

            mensaje.textContent =
              "DNI inválido.";

            return;
        }

        if(nombre.length < 2){

            mensaje.style.color = "red";

            mensaje.textContent =
              "Nombre inválido.";

            return;
        }

        if(
            apellidoP.length < 2
            ||
            apellidoM.length < 2
        ){

            mensaje.style.color = "red";

            mensaje.textContent =
              "Apellidos inválidos.";

            return;
        }

        if(!/^\d{1}$/.test(numeroSeguridad)){

            mensaje.style.color = "red";

            mensaje.textContent =
              "Número de verificación inválido.";

            return;
        }

        try{

            const querySnapshot =
                  await getDocs(
                      collection(
                          db,
                          "votantes_habilitados"
                      )
                  );

            let votanteEncontrado = null;

            querySnapshot.forEach(doc => {

                const data = doc.data();

                const nombresFirestore =
                    data.nombres
                    .toLowerCase()
                    .split(" ");

                const apellidosFirestore =
                    data.apellidos
                    .toLowerCase()
                    .split(" ");

                const nombreFirestore =
                    nombresFirestore[0];

                const apellidoPFirestore =
                    apellidosFirestore[0];

                const apellidoMFirestore =
                    apellidosFirestore[1] || "";

                if(

                    data.dni === dni
                    &&
                    nombreFirestore === nombre
                    &&
                    apellidoPFirestore === apellidoP
                    &&
                    apellidoMFirestore === apellidoM
                    &&
                    data.numeroSeguridad === numeroSeguridad

                ){

                    votanteEncontrado = data;
                }
            });


            if(!votanteEncontrado){

                mensaje.style.color = "red";

                mensaje.textContent =
                  "Datos incorrectos o votante no habilitado.";

                return;
            }


            const votante = {

                dni,

                nombre,

                apellidoP,

                apellidoM,

                grupo:
                    votanteEncontrado.grupo
            };

            localStorage.setItem(

                "votante",

                JSON.stringify(votante)
            );

            mensaje.style.color = "green";

            mensaje.textContent =
              "Identidad validada correctamente.";


            setTimeout(() => {

                window.location.href =
                    "president.html";

            }, 1500);

        }catch(error){

            console.error(error);

            mensaje.style.color = "red";

            mensaje.textContent =
              "Error verificando identidad.";
        }
    }
);


document
.getElementById("dni")

.addEventListener(

    "input",

    function(){

        this.value =
            this.value
            .replace(/\D/g, "")
            .slice(0,8);
    }
);

document
.getElementById("numeroSeguridad")

.addEventListener(

    "input",

    function(){

        this.value =
            this.value
            .replace(/\D/g, "")
            .slice(0,1);
    }
);

[
    "nombre",
    "apellidoP",
    "apellidoM"
]

.forEach(id => {

    document
    .getElementById(id)

    .addEventListener(

        "input",

        function(){

            this.value =
                this.value.replace(
                    /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g,
                    ""
                );
        }
    );
});