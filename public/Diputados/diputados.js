const votante =
    JSON.parse(localStorage.getItem("votanteSeleccionado"))
    ||
    JSON.parse(localStorage.getItem("votante"));

if (!votante) {

    window.location.href =
        "../formulario.html";
}

const datosContenedor =
      document.getElementById("datosVotante");

if (datosContenedor) {

    datosContenedor.textContent =
        `Votante:
        ${votante.nombres || votante.nombre || ""}
        ${votante.apellidos || votante.apellidoP || ""}
        | DNI: ${votante.dni}`;
}

const listaDiputados =
      document.getElementById("listaDiputados");

const btnConfirmar =
      document.getElementById("btnConfirmar");

const btnSiguiente =
      document.getElementById("btnSiguiente");

const mensaje =
      document.getElementById("mensaje");

let diputadoSeleccionado = null;

let tarjetaSeleccionada = null;

let indiceActual = -1;

let votoConfirmado = false;


const partidos = [

    {
        id:1,
        partido:"Ahora Nación - AN",
        logo:"../img_partido/candidato1.jpg"
    },

    {
        id:2,
        partido:"Partido Cívico Obras",
        logo:"../img_partido/candidato2.jpg"
    },

    {
        id:3,
        partido:"Partido del Buen Gobierno",
        logo:"../img_partido/candidato3.jpg"
    },

    {
        id:4,
        partido:"Partido Político Integridad Democrática",
        logo:"../img_partido/candidato4.jpg"
    },

    {
        id:5,
        partido:"Partido Sicreo",
        logo:"../img_partido/candidato5.jpg"
    },

    {
        id:6,
        partido:"Partido Frente de la Esperanza 2021",
        logo:"../img_partido/candidato6.jpg"
    },

    {
        id:7,
        partido:"Renovación Popular",
        logo:"../img_partido/candidato7.jpg"
    },

    {
        id:8,
        partido:"Fuerza Popular",
        logo:"../img_partido/candidato8.jpg"
    },

    {
        id:9,
        partido:"Alianza para el Progreso",
        logo:"../img_partido/candidato9.jpg"
    },

    {
        id:10,
        partido:"Fe en el Perú",
        logo:"../img_partido/candidato10.jpg"
    },

    {
        id:11,
        partido:"Avanza País",
        logo:"../img_partido/candidato11.jpg"
    },

    {
        id:12,
        partido:"Partido Aprista Peruano",
        logo:"../img_partido/candidato12.jpg"
    },

    {
        id:13,
        partido:"Partido País para Todos",
        logo:"../img_partido/candidato13.jpg"
    },

    {
        id:14,
        partido:"Primero la Gente",
        logo:"../img_partido/candidato14.jpg"
    },

    {
        id:15,
        partido:"VOTO EN BLANCO",
        tipo:"blanco"
    }
];


function hablar(texto, velocidad = 0.95){

    window.speechSynthesis.cancel();

    const voz =
          new SpeechSynthesisUtterance(texto);

    voz.lang = "es-PE";

    voz.rate = velocidad;

    window.speechSynthesis.speak(voz);
}


setTimeout(() => {

    hablar(
        `Cédula de Diputados.
        Use flechas arriba y abajo
        para recorrer partidos.
        Presione Enter para seleccionar.`
    );

}, 1200);


function renderizarOpciones(){

    if(!listaDiputados) return;

    listaDiputados.innerHTML = "";

    partidos.forEach(partido => {

        const tarjeta =
              document.createElement("div");

        tarjeta.classList.add("opcion");

        if(partido.tipo === "blanco"){

            tarjeta.classList.add("voto-blanco");

            tarjeta.innerHTML = `
                <span>
                    VOTO EN BLANCO
                </span>

                <input type="radio">
            `;

        }else{

            tarjeta.innerHTML = `
                <img src="${partido.logo}"
                     class="logo">

                <div class="info">

                    <h3>
                        ${partido.partido}
                    </h3>

                    <div class="preferencial">

                        <label>
                            Pref. 1
                        </label>

                        <input type="text"
                               maxlength="2"
                               class="input-pref"
                               disabled>

                        <label>
                            Pref. 2
                        </label>

                        <input type="text"
                               maxlength="2"
                               class="input-pref"
                               disabled>

                    </div>
                </div>

                <input type="radio">
            `;
        }

        const inputs =
              tarjeta.querySelectorAll(".input-pref");

        inputs.forEach(input => {

            input.addEventListener("click", e => {

                e.stopPropagation();
            });

            input.addEventListener("input", () => {

                input.value =
                    input.value.replace(/\D/g, "");

                if(input.value === "") return;

                let numero =
                    parseInt(input.value);

                if(numero > 20){

                    input.value = 20;

                    hablar(
                        "El máximo permitido es veinte."
                    );
                }

                if(numero < 1){

                    input.value = 1;
                }
            });
        });

        tarjeta.addEventListener("click", () => {

            if(votoConfirmado) return;

            seleccionarTarjeta(
                tarjeta,
                partido
            );
        });

        listaDiputados.appendChild(tarjeta);
    });
}


function seleccionarTarjeta(
    tarjeta,
    partido
){

    listaDiputados
    .querySelectorAll(".opcion")

    .forEach(card => {

        card.classList.remove("seleccionado");

        card.style.opacity = "0.5";

        const radio =
              card.querySelector("input[type='radio']");

        if(radio){

            radio.checked = false;
        }

        card.querySelectorAll(".input-pref")
            .forEach(i => {

                i.disabled = true;
            });
    });

    tarjeta.classList.add("seleccionado");

    tarjeta.style.opacity = "1";

    const radio =
          tarjeta.querySelector("input[type='radio']");

    if(radio){

        radio.checked = true;
    }

    tarjeta.querySelectorAll(".input-pref")
        .forEach(i => {

            i.disabled = false;
        });

    diputadoSeleccionado = partido;

    tarjetaSeleccionada = tarjeta;

    hablar(

        partido.tipo === "blanco"

        ?

        "Voto en blanco seleccionado."

        :

        `${partido.partido} seleccionado.`
    );

    const primerInput =
          tarjeta.querySelector(".input-pref");

    if(primerInput){

        setTimeout(() => {

            primerInput.focus();

        }, 300);
    }
}


function confirmarVoto(){

    if(votoConfirmado) return;

    let pref1 = "";
    let pref2 = "";

    if(tarjetaSeleccionada){

        const inputs =
              tarjetaSeleccionada
              .querySelectorAll(".input-pref");

        pref1 = inputs[0]?.value || "";
        pref2 = inputs[1]?.value || "";
    }

    if(
        pref1 &&
        pref2 &&
        pref1 === pref2
    ){

        mensaje.textContent =
            "No puede repetir números.";

        mensaje.style.color = "red";

        hablar(
            "Error. No puede repetir números preferenciales."
        );

        return;
    }

    const voto = {

        dni:votante.dni,

        partido:
            diputadoSeleccionado ||
            {
                partido:"VOTO EN BLANCO",
                tipo:"blanco"
            },

        preferencial:[
            pref1,
            pref2
        ],

        fecha:
            new Date().toLocaleString()
    };

    localStorage.setItem(
        "votoDiputados",
        JSON.stringify(voto)
    );

    votoConfirmado = true;

    mensaje.textContent =
        "Voto registrado correctamente.";

    mensaje.style.color = "green";

    hablar(
        "Voto registrado correctamente. Redirigiendo a Parlamento Andino."
    );

    document
    .querySelectorAll("input")

    .forEach(i => {

        i.disabled = true;
    });

    document
    .querySelectorAll(".opcion")

    .forEach(card => {

        card.style.pointerEvents = "none";
    });

    if(btnConfirmar){

        btnConfirmar.style.display = "none";
    }

    setTimeout(() => {

        window.location.href =
            "../Parlamento/parlamento.html";

    }, 3500);
}


if(btnConfirmar){

    btnConfirmar.addEventListener(
        "click",
        confirmarVoto
    );
}

if(btnSiguiente){

    btnSiguiente.addEventListener(
        "click",

        () => {

            window.location.href =
                "../Parlamento/parlamento.html";
        }
    );
}


document.addEventListener("keydown", e => {

    if(votoConfirmado) return;

    const activo =
          document.activeElement;

    const esInput =
          activo &&
          activo.classList.contains("input-pref");

    if(esInput && e.key !== "Tab"){

        return;
    }

    if(
        e.key === "ArrowDown"
        ||
        e.key === "ArrowUp"
    ){

        e.preventDefault();

        const tarjetas =
              listaDiputados.querySelectorAll(".opcion");

        if(
            e.key === "ArrowDown"
            &&
            indiceActual < tarjetas.length - 1
        ){

            indiceActual++;
        }

        if(
            e.key === "ArrowUp"
            &&
            indiceActual > 0
        ){

            indiceActual--;
        }

        tarjetas.forEach(card => {

            card.style.border = "none";
        });

        tarjetas[indiceActual]
            .style.border =
                "3px solid #1e3a8a";

        hablar(
            partidos[indiceActual].partido
        );
    }

    if(e.key === "Enter"){

        e.preventDefault();

        const tarjetas =
              listaDiputados.querySelectorAll(".opcion");

        if(tarjetas[indiceActual]){

            tarjetas[indiceActual].click();
        }
    }

    if(
        e.key === " "
        ||
        e.code === "Space"
    ){

        e.preventDefault();

        confirmarVoto();
    }

}, true);


document
.querySelectorAll(
    "input[type='radio'], button, a"
)

.forEach(el => {

    el.setAttribute(
        "tabindex",
        "-1"
    );
});

document.addEventListener(
    "focusin",

    e => {

        if(
            e.target &&
            !e.target.classList.contains("input-pref")
        ){

            e.target.blur();
        }
    }
);


window.onbeforeunload = function(){

    return "¿Seguro que deseas salir?";
};

renderizarOpciones();