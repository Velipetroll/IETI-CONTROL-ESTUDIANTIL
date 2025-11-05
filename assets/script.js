// Configura tu Cloudinary aquí 👇
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
      const tipo = document.body.dataset.tipo; // "matriculas" o "observadores"

      if (!grado || !anio) {
        galeria.innerHTML = "<p class='text-danger'>Selecciona grado y año.</p>";
        return;
      }

      galeria.innerHTML = "<p>Cargando...</p>";

      // Buscar por tag asignado al subir
      const tag = `${tipo}_${anio}_${grado}`;
      const url = `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${tag}.json`;

      try {
        const res = await fetch(url);
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
            <img src="${img.secure_url}" class="img-fluid rounded shadow-sm">
          `;
          galeria.appendChild(col);
        });
      } catch (error) {
        galeria.innerHTML = "<p class='text-muted'>No se encontraron imágenes.</p>";
        console.error(error);
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
      const tipo = document.body.dataset.tipo; // "matriculas" o "observadores"

      if (!file || !grado || !anio) {
        alert("❗Selecciona archivo, grado y año");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", `${tipo}/${anio}/${grado}`);
      formData.append("tags", `${tipo}_${anio}_${grado}`);

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();
        alert("✅ Imagen subida correctamente");
        console.log("Resultado Cloudinary:", data);
      } catch (error) {
        alert("❌ Error al subir la imagen");
        console.error(error);
      }
    });
  }
});
