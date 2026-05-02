async function cargarResultados(){
    try{
        const respuestaResultados=await fetch("/api/resultados");
        const resultados=await respuestaResultados.json();
        document.getElementById("totalVotantes").textContent=resultados.totalVotantes;
        crearGrafico("graficoPresidente",resultados.presidente);
        crearGrafico("graficoSenadorNacional",resultados.senadorNacional);
        crearGrafico("graficoSenadorLima",resultados.senadorLima);
        crearGrafico("graficoDiputados",resultados.diputados);
        crearGrafico("graficoParlamento",resultados.parlamentoAndino);
        const respuestaVotantes=await fetch("/api/votantes");
        const votantes=await respuestaVotantes.json();
        mostrarVotantes(votantes);
    }catch (error) {
        console.error("ERROR REAL:", error);
    }
}
function crearGrafico(idCanvas,datos){
    const etiquetas=datos.map(item=>item.nombre);
    const cantidades=datos.map(item=>item.cantidad);
    new Chart(document.getElementById(idCanvas),{type:"bar",data:{labels:etiquetas,datasets:[{label:"Cantidad de votos",data:cantidades}]},options:{responsive:true,plugins:{legend:{display:false}},scales:{y:{beginAtZero:true,ticks:{precision:0}}}}});
}
function mostrarVotantes(votantes){
    const tabla=document.getElementById("tablaVotantes");
    tabla.innerHTML="";
    votantes.forEach(item=>{
        const v=item.votante;
        const fila=document.createElement("tr");
        fila.innerHTML=`<td>${v.dni}</td><td>${v.nombre} ${v.apellidoP} ${v.apellidoM}</td><td>${v.grupo}</td><td>${new Date(item.fechaRegistro).toLocaleString()}</td>`;
        tabla.appendChild(fila);
    });
}
cargarResultados();
setInterval(cargarResultados, 5000);