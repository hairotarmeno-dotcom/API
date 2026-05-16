const votante =
    JSON.parse(localStorage.getItem("votanteSeleccionado"))
    ||
    JSON.parse(localStorage.getItem("votante"));

if (!votante) {

    window.location.href = "formulario.html";
}

const datosContenedor =
      document.getElementById("datosVotante");

if (datosContenedor) {

    datosContenedor.textContent =
        `Votante:
        ${votante.nombres || votante.nombre || ""}
        ${votante.apellidos || votante.apellidoP || ""}
        | DNI: ${votante.dni || ""}`;
}

const listaCandidatos =
      document.getElementById("listaCandidatos");

const btnConfirmar =
      document.getElementById("btnConfirmar");

const btnSiguiente =
      document.getElementById("btnSiguiente");

const mensaje =
      document.getElementById("mensaje");

let candidatoSeleccionado = null;

let indiceActual = -1;

let votoConfirmado = false;

let timerInstruccion = null;

const candidatos = [

  {
    id:1,
    nombre:"PABLO ALFONSO LOPEZ CHAU NAVA",
    vicepresidentes:"Luis Villanueva y Ruth Buendia",
    partido:"Ahora Nación - AN",
    logo:"img_candidatos/logo1.jpeg",
    foto:"img_partido/candidato1.jpg"
  },

  {
    id:2,
    nombre:"RICARDO PABLO BELMONT CASSINELLI",
    vicepresidentes:"Daniel Barragan y Dina Hancco",
    partido:"Partido Cívico Obras",
    logo:"img_candidatos/logo2.jpeg",
    foto:"img_partido/candidato2.jpg"
  },

  {
    id:15,
    nombre:"VOTO EN BLANCO",
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


function leerCandidato(candidato){

    if(candidato.tipo === "blanco"){

        hablar("Voto en blanco.");

        return;
    }

    hablar(
        `Candidato:
        ${candidato.nombre}.
        Partido político:
        ${candidato.partido}.`
    );
}


setTimeout(() => {

    hablar(
        `Cédula presidencial asistida.
        Use flecha arriba y abajo
        para recorrer candidatos.
        Presione Enter para seleccionar.
        Presione espacio para confirmar voto.`
    );

}, 1000);


function renderizarCandidatos(){

    if(!listaCandidatos) return;

    listaCandidatos.innerHTML = "";

    const fragmento =
          document.createDocumentFragment();

    candidatos.forEach(candidato => {

        const tarjeta =
              document.createElement("div");

        tarjeta.classList.add("candidato");

        if(candidato.tipo === "blanco"){

            tarjeta.classList.add("voto-blanco");

            tarjeta.innerHTML = `
                <div class="info">

                    <h2>
                        VOTO EN BLANCO
                    </h2>

                </div>

                <input type="radio"
                       name="voto">
            `;

        }else{

            tarjeta.innerHTML = `
                <img src="${candidato.logo}"
                     class="logo">

                <div class="info">

                    <h3>
                        ${candidato.partido}
                    </h3>

                    <p>
                        <strong>
                            ${candidato.nombre}
                        </strong>
                    </p>

                    <p>
                        ${candidato.vicepresidentes}
                    </p>

                </div>

                <img src="${candidato.foto}"
                     class="foto">

                <input type="radio"
                       name="voto">
            `;
        }

        tarjeta.addEventListener("click", () => {

            if(votoConfirmado) return;

            seleccionarCandidato(
                candidato,
                tarjeta
            );
        });

        fragmento.appendChild(tarjeta);
    });

    listaCandidatos.appendChild(fragmento);
}


function seleccionarCandidato(
    candidato,
    tarjeta
){

    candidatoSeleccionado = candidato;

    document
    .querySelectorAll(".candidato")

    .forEach(card => {

        card.classList.remove("seleccionado");

        card.style.opacity = "0.5";

        card.style.border = "none";

        const radio =
              card.querySelector("input");

        if(radio){

            radio.checked = false;
        }
    });

    tarjeta.classList.add("seleccionado");

    tarjeta.style.opacity = "1";

    tarjeta.style.border =
        "3px solid #1e3a8a";

    const radio =
          tarjeta.querySelector("input");

    if(radio){

        radio.checked = true;
    }

    leerCandidato(candidato);

    clearTimeout(timerInstruccion);

    timerInstruccion = setTimeout(() => {

        hablar(
            `Opción seleccionada.
            Presione espacio para confirmar voto.`
        );

    }, 1800);
}


function confirmarVoto(){

    if(votoConfirmado) return;

    if(!candidatoSeleccionado){

        hablar(
            `Seleccione un candidato
            antes de continuar.`
        );

        return;
    }

    votoConfirmado = true;

    const voto = {

        dni: votante.dni,

        nombre:
            `${votante.nombres || votante.nombre || ""}
            ${votante.apellidos || votante.apellidoP || ""}`,

        grupo:
            votante.grupo || "B",

        candidato:
            candidatoSeleccionado,

        fecha:
            new Date().toLocaleString()
    };

    localStorage.setItem(
        "votoPresidencial",
        JSON.stringify(voto)
    );

    if(mensaje){

        mensaje.style.color = "green";

        mensaje.textContent =
            candidatoSeleccionado.tipo === "blanco"
            ?
            "Voto en blanco registrado."
            :
            `Voto registrado para:
             ${candidatoSeleccionado.nombre}`;
    }

    hablar(
        `Voto presidencial registrado
        correctamente.
        Avanzando a senadores.`
    );

    document
    .querySelectorAll(".candidato")

    .forEach(card => {

        card.style.pointerEvents = "none";
    });

    if(btnConfirmar){

        btnConfirmar.style.display = "none";
    }

    if(btnSiguiente){

        btnSiguiente.style.display = "block";
    }

    setTimeout(() => {

        window.location.href =
            "Senadores/senadores.html";

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
                "Senadores/senadores.html";
        }
    );
}


document.addEventListener("keydown", e => {

    if(votoConfirmado) return;

    const tarjetas =
          document.querySelectorAll(".candidato");

    if(e.key === "ArrowDown"){

        e.preventDefault();

        if(indiceActual < candidatos.length - 1){

            indiceActual++;

            tarjetas[indiceActual]
                .scrollIntoView({

                    behavior:"smooth",

                    block:"center"
                });

            leerCandidato(
                candidatos[indiceActual]
            );

            tarjetas.forEach(card => {

                card.style.border = "none";
            });

            tarjetas[indiceActual]
                .style.border =
                    "3px solid #1e3a8a";
        }
    }

    if(e.key === "ArrowUp"){

        e.preventDefault();

        if(indiceActual > 0){

            indiceActual--;

            tarjetas[indiceActual]
                .scrollIntoView({

                    behavior:"smooth",

                    block:"center"
                });

            leerCandidato(
                candidatos[indiceActual]
            );

            tarjetas.forEach(card => {

                card.style.border = "none";
            });

            tarjetas[indiceActual]
                .style.border =
                    "3px solid #1e3a8a";
        }
    }

    if(e.key === "Enter"){

        e.preventDefault();

        if(
            indiceActual >= 0
            &&
            indiceActual < candidatos.length
        ){

            seleccionarCandidato(

                candidatos[indiceActual],

                tarjetas[indiceActual]
            );
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
.querySelectorAll("input, button, a")

.forEach(el => {

    el.setAttribute("tabindex", "-1");
});

document.addEventListener("focusin", e => {

    if(
        e.target
        &&
        typeof e.target.blur === "function"
    ){

        e.target.blur();
    }
});

renderizarCandidatos();