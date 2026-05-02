const votante = JSON.parse(localStorage.getItem("votante"));
const votoPresidencial = JSON.parse(localStorage.getItem("votoPresidencial"));
const votoSenadores = JSON.parse(localStorage.getItem("votoSenadores"));
const votoDiputados = JSON.parse(localStorage.getItem("votoDiputados"));
const votoParlamento = JSON.parse(localStorage.getItem("votoParlamento"));

if (!votante) {
    window.location.href = "../formulario.html";
}

const datosVotante = document.getElementById("datosVotante");
const resumenVotos = document.getElementById("resumenVotos");
const btnFinalizar = document.getElementById("btnFinalizar");

datosVotante.innerHTML = `
    <div class="dato"><strong>DNI:</strong><span>${votante.dni}</span></div>
    <div class="dato"><strong>Nombre:</strong><span>${votante.nombre} ${votante.apellidoP} ${votante.apellidoM}</span></div>
    <div class="dato"><strong>Grupo de votación:</strong><span>${votante.grupo}</span></div>
    <div class="dato"><strong>Fecha:</strong><span>${new Date().toLocaleString()}</span></div>
`;

function crearFila(tipo, partido, logo, detalle, claseExtra = "") {
    resumenVotos.innerHTML += `
        <div class="fila-voto ${claseExtra}">
            <div class="tipo">${tipo}</div>
            <img src="${logo}" class="logo" alt="Logo">
            <div class="partido">${partido}</div>
            <div class="detalle">${detalle}</div>
        </div>
    `;
}

if (votoPresidencial) { 
    const candidato = votoPresidencial.candidato;

    crearFila(
        "Presidente",
        candidato.partido || candidato.nombre,
        candidato.logo ? "../" + candidato.logo : "../images.png",
        candidato.tipo === "blanco"
            ? "Voto en blanco"
            : `Candidato: ${candidato.nombre}`
    );
}

if (votoSenadores) {
    crearFila(
        "Senador Nacional",
        votoSenadores.senadorNacional.partido,
        votoSenadores.senadorNacional.logo || "../images.png",
        `Preferenciales: ${votoSenadores.preferencialNacional.filter(Boolean).join(", ") || "Sin preferencial"}`
    );

    crearFila(
        "Senador Lima",
        votoSenadores.senadorLima.partido,
        votoSenadores.senadorLima.logo || "../images.png",
        `Preferencial: ${votoSenadores.preferencialLima.filter(Boolean).join(", ") || "Sin preferencial"}`
    );
}

if (votoDiputados) {
    crearFila(
        "Diputados Lima",
        votoDiputados.partido.partido,
        votoDiputados.partido.logo || "../images.png",
        `Preferenciales: ${votoDiputados.preferencial.filter(Boolean).join(", ") || "Sin preferencial"}`
    );
}

if (votoParlamento) {
    crearFila(
        "Parlamento Andino",
        votoParlamento.partido.partido,
        votoParlamento.partido.logo || "../images.png",
        `Preferenciales: ${votoParlamento.preferencial.filter(Boolean).join(", ") || "Sin preferencial"}`,
        "parlamento"
    );
}

btnFinalizar.addEventListener("click", async () => {
    const votoCompleto = {
        votante: votante,
        votos: {
            presidente: votoPresidencial,
            senadores: votoSenadores,
            diputados: votoDiputados,
            parlamento: votoParlamento
        }
    };

    try {
        const respuesta = await fetch("/api/votos", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(votoCompleto)
        });

        const data = await respuesta.json();

        if (!respuesta.ok) {
            alert(data.mensaje || "No se pudo guardar el voto.");
            return;
        }

        alert("Voto guardado correctamente en MongoDB.");

        localStorage.clear();
        window.location.href = "../formulario.html";

    } catch (error) {
        console.error("Error al guardar el voto:", error);
        alert("Error al conectar con el servidor.");
    }
});