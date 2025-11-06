// Configuración de Cloudinary
const CLOUD_NAME = "dweoz84zz"; // tu cloud_name
const UPLOAD_PRESET = "estudiantes"; // tu upload preset

document.addEventListener("DOMContentLoaded", () => {
  const buscarBtn = document.getElementById("buscar");
  const uploadForm = document.getElementById("uploadForm");
  const galeria = document.getElementById("galeria");

  // --- Buscar imágenes por grado y año ---
  if (buscarBtn) {
    buscarBtn.addEventListener("click", async () => {
      const grado = document.getElementById("grado").value;
      const anio = document.getElementById("anio").value;
      const tipo = document.body.dataset.tipo || "matriculas"; // por si falta el atributo

      if (!grado || !anio) {
        galeria.innerHTML = "<p class='text-danger'>Selecciona grado y año.</p>";
        return;
      }

      galeria.innerHTML = "<p>Cargando imágenes...</p>";

      // URL pública del JSON generado automáticamente por Cloudinary según el tag
      const tag = `${tipo}_${anio}_${grado}`; // Ej: matriculas_2024_6A
      const url = `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${tag}.json`;

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("No existe el listado en Cloudinary");

        const data = await res.json();
        galeria.innerHTML = "";

        if (!data.resources || data.resources.length === 0) {
          galeria.innerHTML = "<p class='text-muted'>No se encontraron imágenes.</p>";
          return;
        }

        data.resources.forEach((img) => {
          const col = document.createElement("div");
          col.className = "col-md-3 mb-3";
          col.innerHTML = `
            <img src="${img.secure_url}" class="img-fluid rounded shadow-sm" alt="Imagen de ${grado}">
          `;
          galeria.appendChild(col);
        });
      } catch (error) {
        galeria.innerHTML = "<p class='text-danger'>No se encontraron imágenes en Cloudinary.</p>";
        console.error("Error al cargar imágenes:", error);
      }
    });
  }

 // --- Subir imágenes ---
if (uploadForm) {
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const file = uploadForm.imagen.files[0];
    const grado = uploadForm.grado.value;
    const anio = uploadForm.anio.value;
    const tipo = document.body.dataset.tipo || "matriculas";

    if (!file || !grado || !anio) {
      alert("❗Selecciona archivo, grado y año");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    formData.append("folder", `${tipo}/${anio}/${grado}`);
    formData.append("tags", `${tipo}_${anio}_${grado}`);

    console.log("Subiendo con tags:", `${tipo}_${anio}_${grado}`);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Respuesta de Cloudinary:", data);

      if (data.secure_url) {
        alert("✅ Imagen subida correctamente");
      } else {
        alert("⚠️ Hubo un problema al subir la imagen.");
      }
    } catch (error) {
      alert("❌ Error al subir la imagen");
      console.error(error);
    }
  });
}
