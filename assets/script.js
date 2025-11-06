// --- Configuración Cloudinary ---
const CLOUD_NAME = "dweoz84zz"; // tu cloud_name
const UPLOAD_PRESET = "estudiantes"; // tu upload preset

document.addEventListener("DOMContentLoaded", () => {
  const buscarBtn = document.getElementById("buscar");
  const uploadForm = document.getElementById("uploadForm");
  const galeria = document.getElementById("galeria");

  // --- Subir imágenes ---
  if (uploadForm) {
    uploadForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const file = uploadForm.imagen.files[0];
      const grado = uploadForm.grado.value;
      const anio = uploadForm.anio.value;

      // Detectar si la página es de observadores o matrículas
      const tipo = document.title.toLowerCase().includes("observadores")
        ? "observadores"
        : "matriculas";

      if (!file || !grado || !anio) {
        alert("❗Selecciona archivo, grado y año");
        return;
      }

      const tag = `${tipo}_${anio}_${grado}`; // Ejemplo: observadores_2025_6A
      const folderPath = `${tipo}/${anio}/${grado}`;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", folderPath);
      formData.append("tags", tag);

      galeria.innerHTML = "<p>Subiendo imagen...</p>";

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data.secure_url) {
          galeria.innerHTML = `<p class='text-success'>✅ Imagen subida correctamente.</p>`;
          console.log("📤 Subida exitosa:", data);
        } else {
          galeria.innerHTML = `<p class='text-danger'>❌ Error al subir: ${data.error?.message || "Verifica el preset o formato"}</p>`;
          console.error("Error Cloudinary:", data);
        }
      } catch (error) {
        galeria.innerHTML = `<p class='text-danger'>❌ Error al subir la imagen.</p>`;
        console.error("Error de conexión:", error);
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
      const url = `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${tag}.json`;

      galeria.innerHTML = `<p>Cargando imágenes del grupo <b>${tag}</b>...</p>`;

      try {
        const res = await fetch(url);
        const data = await res.json();

        galeria.innerHTML = "";

        if (!data.resources || data.resources.length === 0) {
          galeria.innerHTML = `<p class="text-muted">No hay imágenes con el tag <b>${tag}</b>.</p>`;
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
        console.error("Error cargando imágenes:", error);
        galeria.innerHTML = "<p class='text-danger'>Error al buscar imágenes.</p>";
      }
    });
  }
});
