// --- Configuración de Cloudinary ---
const CLOUD_NAME = "dweoz84zz"; // tu cloud_name
const UPLOAD_PRESET = "estudiantes"; // tu upload preset

document.addEventListener("DOMContentLoaded", () => {
  const buscarBtn = document.getElementById("buscar");
  const uploadForm = document.getElementById("uploadForm");
  const galeria = document.getElementById("galeria");

  // --- Subir imágenes con TAGS ---
  if (uploadForm) {
    uploadForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const file = uploadForm.imagen.files[0];
      const grado = uploadForm.grado.value;
      const anio = uploadForm.anio.value;
      // Si no existe dataset.tipo, usamos el nombre del HTML
      const tipo = document.title.toLowerCase().includes("observadores")
        ? "observadores"
        : "matriculas";

      if (!file || !grado || !anio) {
        alert("❗Selecciona archivo, grado y año");
        return;
      }

      const tag = `${tipo}_${anio}_${grado}`; // Ejemplo: observadores_2025_6A

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", `${tipo}/${anio}/${grado}`);
      formData.append("tags", tag);

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        console.log("✅ Imagen subida:", data);
        alert("✅ Imagen subida correctamente con tag: " + tag);
      } catch (error) {
        console.error("❌ Error al subir:", error);
        alert("❌ Error al subir la imagen");
      }
    });
  }

  // --- Buscar imágenes por TAG ---
  if (buscarBtn) {
    buscarBtn.addEventListener("click", async () => {
      const grado = document.getElementById("grado").value;
      const anio = document.getElementById("anio").value;
      const tipo = document.title.toLowerCase().includes("observadores")
        ? "observadores"
        : "matriculas";

      if (!grado || !anio) {
        galeria.innerHTML = "<p class='text-danger'>Selecciona grado y año.</p>";
        return;
      }

      const tag = `${tipo}_${anio}_${grado}`;
      galeria.innerHTML = `<p>Cargando imágenes del grupo <b>${tag}</b>...</p>`;

      const url = `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${tag}.json`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        galeri
