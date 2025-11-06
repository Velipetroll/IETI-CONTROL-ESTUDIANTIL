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

      galeria.innerHTML = "<p>Cargando imágenes...</p>";

      // Ruta basada en las carpetas reales en Cloudinary
      // ejemplo: https://res.cloudinary.com/dweoz84zz/image/upload/v1/matriculas/2024/6A/
      const folderPath = `${tipo}/${anio}/${grado}`;
      const apiUrl = `https://res.cloudinary.com/${CLOUD_NAME}/resources/image/upload?prefix=${folderPath}/&max_results=50`;

      try {
        const res = await fetch(apiUrl, {
          headers: {
            // 👇 Cloudinary requiere autenticación si se usa /resources
            // Por eso, usamos JSON list si existe un tag. Si no, avisamos.
          },
        });

        if (!res.ok) {
          galeria.innerHTML = `
            <p class="text-danger">
              ❌ No se puede listar carpetas directamente desde Cloudinary sin API privada.<br>
              Pero si subes imágenes con tags, sí se pueden mostrar.
            </p>`;
          return;
        }

        const data = await res.json();
        galeria.innerHTML = "";

        if (!data.resources || data.resources.length === 0) {
          galeria.innerHTML = "<p class='text-muted'>No se encontraron imágenes en esta carpeta.</p>";
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
        console.error("Error buscando imágenes:", error);
        galeria.innerHTML = "<p class='text-muted'>No se encontraron imágenes o hubo un error.</p>";
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
      // ⚠️ ya no usamos tags (no son necesarios)
      // formData.append("tags", `${tipo}_${anio}_${grado}`);

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
