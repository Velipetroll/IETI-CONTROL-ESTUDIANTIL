// --- Configuración de Cloudinary ---
const CLOUD_NAME = "dweoz84zz"; // tu cloud name
const UPLOAD_PRESET = "estudiantes"; // tu upload preset

document.addEventListener("DOMContentLoaded", () => {
  const buscarBtn = document.getElementById("buscar");
  const uploadForm = document.getElementById("uploadForm");
  const galeria = document.getElementById("galeria");

  // --- Buscar imágenes por tag (más seguro y sin servidor) ---
  if (buscarBtn) {
    buscarBtn.addEventListener("click", async () => {
      const grado = document.getElementById("grado").value;
      const anio = document.getElementById("anio").value;
      const tipo = document.body.dataset.tipo; // matriculas u observadores

      if (!grado || !anio) {
        galeria.innerHTML = "<p class='text-danger'>Selecciona grado y año.</p>";
        return;
      }

      const tag = `${tipo}_${anio}_${grado}`;
      galeria.innerHTML = "<p>Cargando imágenes...</p>";

      const url = `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${tag}.json`;

      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("No hay JSON generado aún");

        const data = await res.json();
        galeria.innerHTML = "";

        if (!data.resources || data.resources.length === 0) {
          galeria.innerHTML = "<p class='text-muted'>No hay imágenes para este grupo.</p>";
          return;
        }

        data.resources.forEach(img => {
          const div = document.createElement("div");
          div.className = "col-md-3 mb-3";
          div.innerHTML = `
            <img src="${img.secure_url}" class="img-fluid rounded shadow-sm">
          `;
          galeria.appendChild(div);
        });
      } catch (err) {
        console.error("Error al buscar imágenes:", err);
        galeria.innerHTML = "<p class='text-danger'>No se encontraron imágenes o el JSON aún no existe.</p>";
      }
    });
  }

  // --- Subir imágenes ---
  if (uploadForm) {
    uploadForm.addEventListener("submit", async e => {
      e.preventDefault();

      const file = uploadForm.imagen.files[0];
      const grado = uploadForm.grado.value;
      const anio = uploadForm.anio.value;
      const tipo = document.body.dataset.tipo;

      if (!file || !grado || !anio) {
        alert("❗Selecciona archivo, grado y año");
        return;
      }

      const tag = `${tipo}_${anio}_${grado}`;
      const folder = `${tipo}/${anio}/${grado}`;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", folder);
      formData.append("tags", tag); // ✅ Esto genera el JSON para listar luego

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        console.log("✅ Subida exitosa:", data);
        alert("✅ Imagen subida correctamente con tag: " + tag);
      } catch (error) {
        console.error("❌ Error al subir la imagen:", error);
        alert("❌ Error al subir la imagen");
      }
    });
  }
});
