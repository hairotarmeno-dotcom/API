document.getElementById("formRegistro").addEventListener("submit", function(e) {
    e.preventDefault();

    const dni = document.getElementById("dni").value.trim();
    const nombre = document.getElementById("nombre").value.trim();
    const apellidoP = document.getElementById("apellidoP").value.trim();
    const apellidoM = document.getElementById("apellidoM").value.trim();
    const grupo = document.getElementById("grupo").value.trim();

    const mensaje = document.getElementById("mensaje");

    if (!/^\d{8}$/.test(dni)) {
        mensaje.style.color = "red";
        mensaje.textContent = "DNI inválido. Debe tener 8 dígitos.";
        return;
    }

    if (nombre.length < 2) {
        mensaje.style.color = "red";
        mensaje.textContent = "Ingrese un nombre válido.";
        return;
    }

    if (apellidoP.length < 2 || apellidoM.length < 2) {
        mensaje.style.color = "red";
        mensaje.textContent = "Ingrese apellidos válidos.";
        return;
    }

    if (!/^\d{6}$/.test(grupo)) {
        mensaje.style.color = "red";
        mensaje.textContent = "Grupo de votación inválido. Debe tener 6 dígitos.";
        return;
    }

    const votante = {
        dni: dni,
        nombre: nombre,
        apellidoP: apellidoP,
        apellidoM: apellidoM,
        grupo: grupo
    };

    localStorage.setItem("votante", JSON.stringify(votante));

    mensaje.style.color = "green";
    mensaje.textContent = "Datos guardados correctamente. Redirigiendo...";

    setTimeout(() => {
        window.location.href = "president.html";
    }, 1500);
});