const votante = JSON.parse(localStorage.getItem("votante"));

if (!votante) {
    window.location.href = "../formulario.html";
}

document.getElementById("datosVotante").textContent =
    `Votante: ${votante.nombre} ${votante.apellidoP} ${votante.apellidoM} | DNI: ${votante.dni}`;

const listaDiputados = document.getElementById("listaDiputados");
const btnConfirmar = document.getElementById("btnConfirmar");
const btnSiguiente = document.getElementById("btnSiguiente");
const mensaje = document.getElementById("mensaje");

let diputadoSeleccionado = null;
let tarjetaSeleccionada = null;

const partidosDiputados = [
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

partidosDiputados.forEach(opcion => {

    const tarjeta = document.createElement("div");
    tarjeta.classList.add("opcion");

    if (opcion.tipo === "blanco") {
        tarjeta.classList.add("voto-blanco");

        tarjeta.innerHTML = `
            <span>VOTO EN BLANCO</span>
            <input type="radio" name="diputado" value="${opcion.id}">
        `;
    }

    else {
        tarjeta.innerHTML = `
            <img src="${opcion.logo}" class="logo">

            <div class="info">
                <h3>${opcion.partido}</h3>

                <div class="preferencial">
                    <label>Pref. 1:</label>
                      <input type="number" min="1" max="10" disabled>

                      <label>Pref. 2:</label>
                      <input type="number" min="1" max="10" disabled>
                </div>
            </div>

            <input type="radio" name="diputado" value="${opcion.id}">
        `;
    }


    tarjeta.addEventListener("click", () => {

        diputadoSeleccionado = opcion;
        tarjetaSeleccionada = tarjeta;

        document.querySelectorAll("input[name='diputado']").forEach(radio => {
            radio.closest(".opcion").classList.remove("seleccionado");
        });

        tarjeta.classList.add("seleccionado");
        tarjeta.querySelector("input[type='radio']").checked = true;

        document.querySelectorAll("input[name='diputado']").forEach(radio => {
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

    listaDiputados.appendChild(tarjeta);
});

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
        limitarPreferencial(input, 10);
    });
});

btnConfirmar.addEventListener("click", () => {

    if (!tarjetaSeleccionada) {
        mensaje.textContent = "Debes seleccionar un partido.";
        mensaje.style.color = "red";
        return;
    }

    const inputs = tarjetaSeleccionada.querySelectorAll("input[type='number']");
    const pref1 = inputs[0] ? inputs[0].value : "";
    const pref2 = inputs[1] ? inputs[1].value : "";

    if (pref1 && pref2 && pref1 === pref2) {
        mensaje.textContent = "No puedes repetir números preferenciales";
        mensaje.style.color = "red";
        return;
    }

    const votoDiputados = {
        dni: votante.dni,
        partido: diputadoSeleccionado,
        preferencial: [pref1, pref2],
        fecha: new Date().toLocaleString()
    };

    localStorage.setItem("votoDiputados", JSON.stringify(votoDiputados));

    mensaje.textContent = "Voto de diputados registrado correctamente";
    mensaje.style.color = "green";

    document.querySelectorAll("input").forEach(i => i.disabled = true);
    document.querySelectorAll(".opcion").forEach(c => c.style.pointerEvents = "none");

    btnConfirmar.style.display = "none";
    btnSiguiente.style.display = "block";
});

btnSiguiente.addEventListener("click", () => {
    window.location.href = "../Parlamento/parlamento.html";
});
