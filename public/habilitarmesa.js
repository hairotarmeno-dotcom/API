import { initializeApp } from "https://www.gstatic.com/firebasejs/12.13.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

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

const db = getFirestore(app);

const usuarioGoogle =
      JSON.parse(
          localStorage.getItem(
              "usuarioGoogle"
          )
      );

if(!usuarioGoogle){

    window.location.href =
        "login.html";
}

if(!usuarioGoogle.admin){

    alert(
      "No tiene permisos."
    );

    document.body.innerHTML = `
      <h1>Acceso denegado</h1>
    `;
}

const estadoMesa =
      document.getElementById("estadoMesa");

const estadoMesaTexto =
      document.getElementById("estadoMesaTexto");

const contenedorA =
      document.getElementById("votantesGrupoA");

const contenedorB =
      document.getElementById("votantesGrupoB");

const btnConfirmar =
      document.getElementById("btnConfirmar");

const btnSiguiente =
      document.getElementById("btnSiguiente");

const modalMesa =
      document.getElementById("modalMesa");


let esMesaAbierta =
      localStorage.getItem(
          "mesaAbierta"
      ) === "true";

let personaSeleccionadaTemporal = null;


let DatosPersonas = [

  { id:1, nombres:"Luis Alberto", apellidos:"Quispe Huamán", dni:"70000001", grupo:"A" },

  { id:2, nombres:"María Fernanda", apellidos:"Ccallo Sosa", dni:"70000002", grupo:"A" },

  { id:3, nombres:"Jhonatan", apellidos:"Rios Vargas", dni:"70000003", grupo:"A" },

  { id:4, nombres:"Rosa Elena", apellidos:"Mamani Paredes", dni:"70000004", grupo:"A" },

  { id:5, nombres:"Kevin Joel", apellidos:"Condori Flores", dni:"70000005", grupo:"A" },

  { id:6, nombres:"Daniela", apellidos:"Torres Yupanqui", dni:"70000006", grupo:"A" },

  { id:7, nombres:"Miguel Ángel", apellidos:"Chura Lopez", dni:"70000007", grupo:"A" },

  { id:8, nombres:"Patricia Milagros", apellidos:"Ramos Nina", dni:"70000008", grupo:"A" },

  { id:9, nombres:"Anthony David", apellidos:"Vilca Castro", dni:"70000009", grupo:"A" },

  { id:10, nombres:"Andrea Lucero", apellidos:"Huanca Pérez", grupo:"B", dni:"70000010" },

  { id:11, nombres:"Jose Manuel", apellidos:"Tito Ramirez", grupo:"B", dni:"70000011" },

  { id:12, nombres:"Sofia Isabel", apellidos:"Puma Salas", grupo:"B", dni:"70000012" },

  { id:13, nombres:"Carlos Alberto", apellidos:"Choque Medina", grupo:"B", dni:"70000013" },

  { id:14, nombres:"Valeria Noemi", apellidos:"Apaza León", grupo:"B", dni:"70000014" },

  { id:15, nombres:"Richard Alexis", apellidos:"Callata Ortiz", grupo:"B", dni:"70000015" },

  { id:16, nombres:"Camila Alejandra", apellidos:"Zuñiga Quispe", grupo:"B", dni:"70000016" },

  { id:17, nombres:"Brayan Enrique", apellidos:"Paredes Luna", grupo:"B", dni:"70000017" },

  { id:18, nombres:"Fiorella Lisbeth", apellidos:"Coa Silva", grupo:"B", dni:"70000018" },

  { id:19, nombres:"Carlos Eduardo", apellidos:"Cahuana Rojas", grupo:"B", dni:"70000019" },

  { id:20, nombres:"Nicole Andrea", apellidos:"Valencia Ticona", grupo:"B", dni:"70000020" }
];


function abrirPanelMesa(){

    modalMesa.style.display = "flex";
}

function cerrarPanelMesa(){

    modalMesa.style.display = "none";
}


function activarAsistenciaVoz(persona){

    window.speechSynthesis.cancel();

    const mensajeTexto = `
      Votante del Grupo B seleccionado.
      ${persona.nombres}
      ${persona.apellidos}.
      Proceda a presionar el botón
      de confirmación.
    `;

    const lectura =
          new SpeechSynthesisUtterance(mensajeTexto);

    lectura.lang = "es-PE";

    lectura.rate = 0.90;

    window.speechSynthesis.speak(lectura);
}


function mostrarVotantes(){

    if(!contenedorA || !contenedorB) return;

    contenedorA.innerHTML = "";

    contenedorB.innerHTML = "";

    const fragA =
          document.createDocumentFragment();

    const fragB =
          document.createDocumentFragment();

    DatosPersonas.forEach(persona => {

        const tarjeta =
              document.createElement("div");

        tarjeta.className = "votante-tarjeta";

        if(persona.grupo === "B"){

            tarjeta.classList.add(
                "tarjeta-discapacidad"
            );
        }

        const radio =
              document.createElement("input");

        radio.type = "radio";

        radio.name = "votanteSeleccionadoRadio";

        radio.id = `votante-${persona.id}`;

        const etiqueta =
              document.createElement("label");

        etiqueta.htmlFor = `votante-${persona.id}`;

        etiqueta.textContent =
        `${persona.apellidos},
        ${persona.nombres}
        - DNI: ${persona.dni}`;

        tarjeta.appendChild(radio);

        tarjeta.appendChild(etiqueta);

        tarjeta.addEventListener("click", evento => {

            if(evento.target !== radio){

                radio.checked = true;
            }

            marcarVotanteTemporal(
                persona,
                radio
            );
        });

        if(persona.grupo === "A"){

            fragA.appendChild(tarjeta);

        }else{

            fragB.appendChild(tarjeta);
        }
    });

    contenedorA.appendChild(fragA);

    contenedorB.appendChild(fragB);
}


function marcarVotanteTemporal(
    persona,
    radioElement
){

    if(!esMesaAbierta){

        radioElement.checked = false;

        alert(
          "⚠️ Primero debe aperturar la mesa."
        );

        return;
    }

    personaSeleccionadaTemporal = persona;

    if(persona.grupo === "B"){

        activarAsistenciaVoz(persona);

    }else{

        window.speechSynthesis.cancel();
    }
}


function irAlFormulario(){

    if(!esMesaAbierta){

        alert(
          "⚠️ La mesa está cerrada."
        );

        return;
    }

    if(!personaSeleccionadaTemporal){

        alert(
          "⚠️ Seleccione un votante."
        );

        return;
    }

    localStorage.setItem(
        "votanteSeleccionado",
        JSON.stringify(personaSeleccionadaTemporal)
    );

    if(personaSeleccionadaTemporal.grupo === "B"){

        window.location.href =
            "president.html";

    }else{

        window.location.href =
            "formulario.html";
    }
}


if(btnConfirmar){

    btnConfirmar.addEventListener(
        "click",
        irAlFormulario
    );
}


function abrirMesa(){

    localStorage.setItem(
        "mesaAbierta",
        true
    );

    esMesaAbierta = true;

    estadoMesa.textContent =
        "Mesa Abierta";

    estadoMesaTexto.textContent =
        "Mesa Abierta";

    estadoMesa.style.backgroundColor =
        "#16a34a";

    estadoMesa.style.color =
        "white";

    cerrarPanelMesa();

    alert(
      "✅ Mesa aperturada correctamente."
    );
}


function cerrarMesa(){

    localStorage.setItem(
        "mesaAbierta",
        false
    );

    esMesaAbierta = false;

    personaSeleccionadaTemporal = null;

    window.speechSynthesis.cancel();

    estadoMesa.textContent =
        "Mesa Cerrada";

    estadoMesaTexto.textContent =
        "Mesa Cerrada";

    estadoMesa.style.backgroundColor =
        "#dc2626";

    estadoMesa.style.color =
        "white";

    const radios =
          document.getElementsByName(
              "votanteSeleccionadoRadio"
          );

    radios.forEach(radio => {

        radio.checked = false;
    });

    alert(
      "❌ Mesa cerrada correctamente."
    );
}

async function cargarVotantesFirestore(){

    try{

        const querySnapshot =
              await getDocs(
                  collection(
                      db,
                      "votantes_habilitados"
                  )
              );

        DatosPersonas = [];

        querySnapshot.forEach(doc => {

            DatosPersonas.push({

                id: doc.id,

                ...doc.data()
            });
        });

        mostrarVotantes();

    }catch(error){

        console.error(error);

        alert(
          "Error cargando votantes"
        );
    }
}

cargarVotantesFirestore();

if(esMesaAbierta){

    estadoMesa.textContent =
        "Mesa Abierta";

    estadoMesaTexto.textContent =
        "Mesa Abierta";

    estadoMesa.style.backgroundColor =
        "#16a34a";
}

if(!esMesaAbierta){
    abrirPanelMesa();
}

window.abrirMesa = abrirMesa;

window.cerrarMesa = cerrarMesa;

window.abrirPanelMesa = abrirPanelMesa;

window.cerrarPanelMesa = cerrarPanelMesa;