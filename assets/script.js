// Configura tus datos de Cloudinary
const CLOUD_NAME = "dweoz84zz";
const UPLOAD_PRESET = "estudiantes";

const uploadInput = document.getElementById("uploadInput");
const uploadBtn = document.getElementById("uploadBtn");
const gradoSelect = document.getElementById("grado");
const anioSelect = document.getElementById("anio");
const tipo = document.body.dataset.tipo; // "matriculas" o "observadores"

uploadBtn.addEventListener("click", async () => {
  const file = uploadInput.files[0];
  const grado = gradoSelect.value;
  const anio = anioSelect.value;

  if (!file || !grado || !anio) {
    alert("Selecciona archivo, grado y año");
    return;
  }

  const folderPath = `${tipo}/${anio}/${grado}`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);
  formData.append("folder", folderPath);

  try {
    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    alert("✅ Archivo subido correctamente a " + folderPath);
    console.log("URL:", data.secure_url);
  } catch (err) {
    console.error(err);
    alert("❌ Error al subir la imagen");
  }
});
