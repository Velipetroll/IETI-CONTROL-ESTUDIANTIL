import express from "express";
import { v2 as cloudinary } from "cloudinary";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// 🔧 Configura tu Cloudinary (usa tus credenciales reales)
cloudinary.config({
  cloud_name: "dweoz84zz", // ✅ tu cloud name
  api_key: "TU_API_KEY",   // 🔑 tu API key
  api_secret: "TU_API_SECRET", // ⚠️ tu API secret (no lo compartas)
});

// 📁 Endpoint para listar imágenes por tipo, año y grado
app.get("/api/listar", async (req, res) => {
  const { tipo, anio, grado } = req.query;

  if (!tipo || !anio || !grado) {
    return res.status(400).json({ error: "Faltan parámetros" });
  }

  const folder = `${tipo}/${anio}/${grado}`;
  console.log("Buscando en carpeta:", folder);

  try {
    const result = await cloudinary.search
      .expression(`folder="${folder}"`)
      .sort_by("public_id", "desc")
      .max_results(100)
      .execute();

    res.json(result.resources);
  } catch (error) {
    console.error("Error al buscar en Cloudinary:", error);
    res.status(500).json({ error: error.mes
