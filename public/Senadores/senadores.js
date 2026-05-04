const votante = JSON.parse(localStorage.getItem("votante"));

if (!votante) {
    window.location.href = "formulario.html";
}

document.getElementById("datosVotante").textContent =
    `Votante: ${votante.nombre} ${votante.apellidoP} ${votante.apellidoM} | DNI: ${votante.dni}`;

const listaNacional = document.getElementById("listaNacional");
const listaLima = document.getElementById("listaLima");
const btnConfirmar = document.getElementById("btnConfirmar");
const btnSiguiente = document.getElementById("btnSiguiente");
const mensaje = document.getElementById("mensaje");

let senadorNacionalSeleccionado = null;
let senadorLimaSeleccionado = null;
let tarjetaSeleccionadaNacional = null;
let tarjetaSeleccionadaLima = null;

const partidosSenadores = [
  {
    id: 1,
    partido: "Ahora Nación - AN",
    logo: "../img_partido/candidato1.jpg"
  },
  {
    id: 2,
    partido: "Partido Cívico Obras",
    logo: "../img_partido/candidato2.jpg"
  },
  {
    id: 3,
    partido: "Partido del Buen Gobierno",
    logo: "../img_partido/candidato3.jpg"
  },
  {
    id: 4,
    partido: "Partido Político Integridad Democrática",
    logo: "../img_partido/candidato4.jpg"
  },
  {
    id: 5,
    partido: "Partido Sicreo",
    logo: "../img_partido/candidato5.jpg"
  },
  {
    id: 6,
    partido: "Partido Frente de la Esperanza 2021",
    logo: "../img_partido/candidato6.jpg"
  },
  {
    id: 7,
    partido: "Renovación Popular",
    logo: "../img_partido/candidato7.jpg"
  },
  {
    id: 8,
    partido: "Fuerza Popular",
    logo: "../img_partido/candidato8.jpg"
  },
  {
    id: 9,
    partido: "Alianza para el Progreso",
    logo: "../img_partido/candidato9.jpg"
  },
  {
    id: 10,
    partido: "Fe en el Perú",
    logo: "../img_partido/candidato10.jpg"
  },
  {
    id: 11,
    partido: "Avanza País - Partido de Integración Social",
    logo: "../img_partido/candidato11.jpg"
  },
  {
    id: 12,
    partido: "Partido Aprista Peruano",
    logo: "../img_partido/candidato12.jpg"
  },
  {
    id: 13,
    partido: "Partido País para Todos",
    logo: "../img_partido/candidato13.jpg"
  },
  {
    id: 14,
    partido: "Primero la Gente - Comunidad, Ecología, Libertad y Progreso",
    logo: "../img_partido/candidato14.jpg"
  },
  {
    id: 16,
    partido: "Voto en blanco",
    tipo: "blanco"
  }
];

const senadoresNacional = partidosSenadores;
const senadoresLima = partidosSenadores;


function mostrarOpciones(lista, contenedor, tipoVoto) {
    lista.forEach(opcion => {
        const tarjeta = document.createElement("div");
        tarjeta.classList.add("opcion");

        if (opcion.tipo === "blanco") {
            tarjeta.classList.add("voto-blanco");
            tarjeta.innerHTML = `
                <span>VOTO EN BLANCO</span>
                <input type="radio" name="${tipoVoto}" value="${opcion.id}">
            `;
        } else {
           tarjeta.innerHTML = `
                <img src="${opcion.logo}" class="logo">

                <div class="info">
                    <h3>${opcion.partido}</h3>

                    <div class="preferencial">
                        <label>Pref. 1:</label>
                        <input 
                            type="number" 
                            min="1" 
                            max="${tipoVoto === "senadorNacional" ? "10" : "5"}" 
                            disabled
                        >

                        ${
                        tipoVoto === "senadorNacional"
                        ? `
                            <label>Pref. 2:</label>
                            <input type="number" min="1" max="10" disabled>
                        `
                        : ""
                        }
                    </div>
                </div>

                <input type="radio" name="${tipoVoto}" value="${opcion.id}">
            `;
        }

        tarjeta.addEventListener("click", () => {
            if (tipoVoto === "senadorNacional") {
                senadorNacionalSeleccionado = opcion;
                tarjetaSeleccionadaNacional = tarjeta;
            } else {
                senadorLimaSeleccionado = opcion;
                tarjetaSeleccionadaLima = tarjeta;
            }

            document.querySelectorAll(`input[name='${tipoVoto}']`).forEach(radio => {
                radio.closest(".opcion").classList.remove("seleccionado");
            });

            tarjeta.classList.add("seleccionado");
            tarjeta.querySelector("input").checked = true;
            
            document.querySelectorAll(`input[name='${tipoVoto}']`).forEach(radio => {
              const card = radio.closest(".opcion");

              card.querySelectorAll("input[type='number']").forEach(input => {
                  if (card === tarjeta) {
                      input.disabled = false;
                  } else {
                      input.disabled = true;
                      input.value = "";
                  }
                });
            });

        });

        contenedor.appendChild(tarjeta);
    });
}

mostrarOpciones(senadoresNacional, listaNacional, "senadorNacional");
mostrarOpciones(senadoresLima, listaLima, "senadorLima");

function limitarPreferencial(input, maximo) {
    input.value = input.value.replace(/\D/g, "");

    if (input.value === "") return;

    let numero = parseInt(input.value);

    if (numero < 1) {
        input.value = "";
    } else if (numero > maximo) {
        input.value = maximo;
    }
}

document.querySelectorAll("input[type='number']").forEach(input => {
    input.addEventListener("input", () => {
        const card = input.closest(".opcion");
        const radio = card.querySelector("input[type='radio']");
        const maximo = radio.name === "senadorNacional" ? 10 : 5;

        limitarPreferencial(input, maximo);
    });
});

document.querySelectorAll("input[type='number']").forEach(input => {
    input.addEventListener("input", () => {
        input.value = input.value.replace(/\D/g, "");

        if (input.value === "") return;

        let numero = parseInt(input.value);

        if (numero < 1) {
            input.value = "";
        } else if (numero > 10) {
            input.value = "10";
        }
    });
});

btnConfirmar.addEventListener("click", () => {

    if (!tarjetaSeleccionadaNacional || !tarjetaSeleccionadaLima) {
        mensaje.textContent = "Debes seleccionar una opción en ambas secciones.";
        mensaje.style.color = "red";
        return;
    }

    const inputsN = tarjetaSeleccionadaNacional.querySelectorAll("input[type='number']");
    const pref1N = inputsN[0] ? inputsN[0].value : "";
    const pref2N = inputsN[1] ? inputsN[1].value : "";

    const inputsL = tarjetaSeleccionadaLima.querySelectorAll("input[type='number']");
    const pref1L = inputsL[0] ? inputsL[0].value : "";
    const pref2L = "";

    if (pref1N && pref2N && pref1N === pref2N) {
    mensaje.textContent = "No puedes repetir números en voto preferencial nacional";
    mensaje.style.color = "red";
    return;
    }

    if (pref1L && pref2L && pref1L === pref2L) {
        mensaje.textContent = "No puedes repetir números en voto preferencial Lima";
        mensaje.style.color = "red";
        return;
    }

    const votoSenadores = {
        dni: votante.dni,
        senadorNacional: senadorNacionalSeleccionado,
        senadorLima: senadorLimaSeleccionado,
        preferencialNacional: [pref1N, pref2N],
        preferencialLima: [pref1L, pref2L],
        fecha: new Date().toLocaleString()
    };

    localStorage.setItem("votoSenadores", JSON.stringify(votoSenadores));

    mensaje.textContent = "Votos registrados correctamente";
    mensaje.style.color = "green";


    document.querySelectorAll("input[type='radio']").forEach(radio => {
        radio.disabled = true;
    });

    document.querySelectorAll(".opcion").forEach(card => {
        card.style.pointerEvents = "none";
    });

    btnConfirmar.style.display = "none";
    btnSiguiente.style.display = "block";
});

btnSiguiente.addEventListener("click", () => {
    window.location.href = "../Diputados/diputados.html";
});