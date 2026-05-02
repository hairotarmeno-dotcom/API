const express = require("express");
const path = require("path");
const { MongoClient } = require("mongodb");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 8000;
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || "cedula_votacion";

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

let db;
let votosCollection;

async function conectarMongo() {
    if (!MONGO_URI) {
        throw new Error("Falta configurar la variable de entorno MONGO_URI");
    }

    const client = new MongoClient(MONGO_URI);
    await client.connect();

    db = client.db(DB_NAME);
    votosCollection = db.collection("votos");

    await votosCollection.createIndex({ "votante.dni": 1 }, { unique: true });

    console.log("Conectado correctamente a MongoDB");
}

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "formulario.html"));
});

app.get("/api/estado", (req, res) => {
    res.json({ mensaje: "API de cédula virtual funcionando" });
});

app.get("/api/votantes/:dni/existe", async (req, res) => {
    try {
        const { dni } = req.params;
        const voto = await votosCollection.findOne({ "votante.dni": dni });

        res.json({ existe: !!voto });
    } catch (error) {
        res.status(500).json({ mensaje: "Error al verificar DNI" });
    }
});

app.post("/api/votos", async (req, res) => {
    try {
        const { votante, votos } = req.body;

        if (!votante || !votante.dni || !votos) {
            return res.status(400).json({ mensaje: "Faltan datos del votante o de los votos" });
        }

        if (!/^\d{8}$/.test(votante.dni)) {
            return res.status(400).json({ mensaje: "El DNI debe tener 8 dígitos" });
        }

        const documento = {
            votante,
            votos,
            fechaRegistro: new Date()
        };

        const resultado = await votosCollection.insertOne(documento);

        res.status(201).json({
            mensaje: "Voto registrado correctamente",
            id: resultado.insertedId
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({ mensaje: "Este DNI ya registró su voto" });
        }

        console.error(error);
        res.status(500).json({ mensaje: "Error al guardar el voto" });
    }
});

app.get("/api/votantes", async (req, res) => {
    try {
        const votantes = await votosCollection
            .find({}, { projection: { _id: 0, votante: 1, fechaRegistro: 1 } })
            .sort({ fechaRegistro: -1 })
            .toArray();

        res.json(votantes);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al listar votantes" });
    }
});

function contarPorCampo(documentos, obtenerNombre) {
    const conteo = {};

    documentos.forEach((doc) => {
        const nombre = obtenerNombre(doc) || "Sin voto";
        conteo[nombre] = (conteo[nombre] || 0) + 1;
    });

    return Object.entries(conteo)
        .map(([nombre, cantidad]) => ({ nombre, cantidad }))
        .sort((a, b) => b.cantidad - a.cantidad);
}

app.get("/api/resultados", async (req, res) => {
    try {
        const documentos = await votosCollection.find({}).toArray();
        const totalVotantes = documentos.length;

        const resultados = {
            totalVotantes,
            presidente: contarPorCampo(documentos, (d) => {
                console.log("VOTO PRESIDENTE:", d.votos?.presidente);

                const partido = d.votos?.presidente?.candidato?.partido;
                const candidato = d.votos?.presidente?.candidato?.nombre;

                return (partido || candidato || "Sin voto").trim();
            }),
            senadorNacional: contarPorCampo(documentos, (d) => d.votos?.senadores?.senadorNacional?.partido),
            senadorLima: contarPorCampo(documentos, (d) => d.votos?.senadores?.senadorLima?.partido),
            diputados: contarPorCampo(documentos, (d) => d.votos?.diputados?.partido?.partido),
            parlamentoAndino: contarPorCampo(documentos, (d) => d.votos?.parlamento?.partido?.partido)
        };

        res.json(resultados);
    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: "Error al obtener resultados" });
    }
});

conectarMongo()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    })
    .catch((error) => {
        console.error("No se pudo iniciar el servidor:", error.message);
        process.exit(1);
    });
