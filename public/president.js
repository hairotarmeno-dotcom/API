const votante = JSON.parse(localStorage.getItem("votante"));

if (!votante) {
    window.location.href = "formulario.html";
}

document.getElementById("datosVotante").textContent =
    `Votante: ${votante.nombre} ${votante.apellidoP} ${votante.apellidoM} | DNI: ${votante.dni}`;

const candidatos = [
  {
    id: 1,
    nombre: "PABLO ALFONSO LOPEZ CHAU NAVA",
    vicepresidentes: "Luis Villanueva y Ruth Buendia",
    partido: "Ahora Nación - AN",
    logo: "img_candidatos/logo1.jpeg",
    foto: "img_partido/candidato1.jpg"
  },
  {
    id: 2,
    nombre: "RICARDO PABLO BELMONT CASSINELLI",
    vicepresidentes: "Daniel Barragan y Dina Hancco",
    partido: "Partido Cívico Obras",
    logo: "img_candidatos/logo2.jpeg",
    foto: "img_partido/candidato2.jpg"
  },
  {
    id: 3,
    nombre: "JORGE NIETO MONTESINOS",
    vicepresidentes: "Susana Matute y Carlos Caballero",
    partido: "Partido del Buen Gobierno",
    logo: "img_candidatos/logo3.jpeg",
    foto: "img_partido/candidato3.jpg"
  },
  {
    id: 4,
    nombre: "WOLFGANG MARIO GROZO COSTA",
    vicepresidentes: "Bertha Azabache y Wellington Prada",
    partido: "Partido Político Integridad Democrática",
    logo: "img_candidatos/logo4.jpeg",
    foto: "img_partido/candidato4.jpg"
  },
  {
    id: 5,
    nombre: "ALFONSO CARLOS ESPA Y GARCES-ALVEAR",
    vicepresidentes: "Alejandro Santa Maria y Melitza Yanzich",
    partido: "Partido Sicreo",
    logo: "img_candidatos/logo5.jpeg",
    foto: "img_partido/candidato5.jpg"
  },
  {
    id: 6,
    nombre: "LUIS FERNANDO OLIVERA VEGA",
    vicepresidentes: "Elizabeth del Rosario y Carlos Cuaresma",
    partido: "Partido Frente de la Esperanza 2021",
    logo: "img_candidatos/logo6.jpeg",
    foto: "img_partido/candidato6.jpg"
  },
  {
    id: 7,
    nombre: "RAFAEL BERNARDO LÓPEZ ALIAGA CAZORLA",
    vicepresidentes: "Norma Martina y Jhon Ramos",
    partido: "Renovación Popular",
    logo: "img_candidatos/logo7.jpeg",
    foto: "img_partido/candidato7.jpg"
  },
  {
    id: 8,
    nombre: "KEIKO SOFIA FUJIMORI HIGUCHI",
    vicepresidentes: "Luis Galareta y Miguel Torres",
    partido: "Fuerza Popular",
    logo: "img_candidatos/logo8.jpeg",
    foto: "img_partido/candidato8.jpg"
  },
  {
    id: 9,
    nombre: "CESAR ACUÑA PERALTA",
    vicepresidentes: "Jessica Tumi y Alejandro Soto",
    partido: "Alianza para el Progreso",
    logo: "img_candidatos/logo9.jpeg",
    foto: "img_partido/candidato9.jpg"
  },
  {
    id: 10,
    nombre: "ALVARO GONZALO PAZ DE LA BARRA FREIGEIRO",
    vicepresidentes: "Yessika Arteaga y Shellah Palacios",
    partido: "Fe en el Perú",
    logo: "img_candidatos/logo10.jpeg",
    foto: "img_partido/candidato10.jpg"
  },
  {
    id: 11,
    nombre: "JOSE DANIEL WILLIAMS ZAPATA",
    vicepresidentes: "Fernan Altuve y Adriana Tudela",
    partido: "Avanza País - Partido de Integración Social",
    logo: "img_candidatos/logo11.jpeg",
    foto: "img_partido/candidato11.jpg"
  },
  {
    id: 12,
    nombre: "PITTER ENRIQUE VALDERRAMA PEÑA",
    vicepresidentes: "Maria Valdivia y Lucio Vasquez",
    partido: "Partido Aprista Peruano",
    logo: "img_candidatos/logo12.jpeg",
    foto: "img_partido/candidato12.jpg"
  },
  {
    id: 13,
    nombre: "CARLOS GONSALO ALVAREZ LOAYZA",
    vicepresidentes: "Maria Chambizea y Diego Guevara",
    partido: "Partido País para Todos",
    logo: "img_candidatos/logo13.jpeg",
    foto: "img_partido/candidato13.jpg"
  },
  {
    id: 14,
    nombre: "MARIA SOLEDAD PEREZ TELLO DE RODRIGUEZ",
    vicepresidentes: "Raul Molina y Manuel Ato del Avellanal",
    partido: "Primero la Gente - Comunidad, Ecología, Libertad y Progreso",
    logo: "img_candidatos/logo14.jpeg",
    foto: "img_partido/candidato14.jpg"
  },
  {
    id: 16,
    nombre: "Voto en blanco",
    tipo: "blanco"
  }
];

const listaCandidatos = document.getElementById("listaCandidatos");
const btnConfirmar = document.getElementById("btnConfirmar");
const btnSiguiente = document.getElementById("btnSiguiente");
const mensaje = document.getElementById("mensaje");

let candidatoSeleccionado = null;

candidatos.forEach(candidato => {
  const tarjeta = document.createElement("div");
  tarjeta.classList.add("candidato");

  if (candidato.tipo === "blanco") {
    tarjeta.classList.add("voto-blanco");

    tarjeta.innerHTML = `
      <div class="info">
        <h2>VOTO EN BLANCO</h2>
      </div>
      <input type="radio" name="voto" value="${candidato.id}">
    `;
  } 
  
  else {
    tarjeta.innerHTML = `
      <img src="${candidato.logo}" class="logo">

      <div class="info">
        <h3>${candidato.partido}</h3>
        <p><strong>${candidato.nombre}</strong></p>
        <p>${candidato.vicepresidentes}</p>
      </div>

      <img src="${candidato.foto}" class="foto">

      <input type="radio" name="voto" value="${candidato.id}">
    `;
  }

  tarjeta.addEventListener("click", () => {
    candidatoSeleccionado = candidato;

    document.querySelectorAll(".candidato").forEach(card => {
      card.classList.remove("seleccionado");
    });

    tarjeta.classList.add("seleccionado");
    tarjeta.querySelector("input").checked = true;
  });

  listaCandidatos.appendChild(tarjeta);
});

btnConfirmar.addEventListener("click", () => {

    if (candidatoSeleccionado === null) {
        mensaje.textContent = "Debes seleccionar un candidato antes de confirmar.";
        mensaje.style.color = "red";
        return;
    }

    const votante = JSON.parse(localStorage.getItem("votante"));

    const voto = {
        dni: votante.dni,
        nombre: `${votante.nombre} ${votante.apellidoP} ${votante.apellidoM}`,
        grupo: votante.grupo,
        candidato: candidatoSeleccionado,
        fecha: new Date().toLocaleString()
    };

    localStorage.setItem("votoPresidencial", JSON.stringify(voto));

    mensaje.textContent = `Voto registrado para: ${candidatoSeleccionado.nombre}`;
    mensaje.style.color = "green";

    document.querySelectorAll("input[name='voto']").forEach(radio => {
        radio.disabled = true;
    });

    document.querySelectorAll(".candidato").forEach(card => {
        card.style.pointerEvents = "none";
    });

    btnSiguiente.style.display = "block";
    btnConfirmar.style.display = "none";
});

btnSiguiente.addEventListener("click", () => {
    window.location.href = "Senadores/senadores.html";
});