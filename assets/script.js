const API_BASE = "https://backend-cloudinary.vercel.app"; // 🔁 cambia esto luego por tu URL de Vercel

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

      try {
        const res = await fetch(`${API_BASE}/imagenes?tipo=${tipo}&anio=${anio}&grado=${grado}`);
        const data = await res.json();

        galeria.innerHTML = "";

        if (!data.length) {
          galeria.innerHTML = "<p class='text-muted'>No se encontraron imágenes.</p>";
          return;
        }

        data.forEach((img) => {
          const col = document.createElement("div");
          col.className = "col-md-3 mb-3";
          col.innerHTML = `<img src="${img.url}" class="img-fluid rounded shadow-sm">`;
          galeria.appendChild(col);
        });
      } catch (error) {
        console.error("Error cargando imágenes:", error);
        galeria.innerHTML = "<p class='text-danger'>Error cargando imágenes.</p>";
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
      const tipo = document.body.dataset.tipo;

      if (!file || !grado || !anio) {
        alert("❗Selecciona archivo, grado y año");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("grado", grado);
      formData.append("anio", anio);
      formData.append("tipo", tipo);

      try {
        const res = await fetch(`${API_BASE}/upload`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (res.ok) {
          alert("✅ Imagen subida correctamente");
          console.log("Cloudinary:", data);
        } else {
          alert("❌ Error al subir la imagen");
          console.error(data);
        }
      } catch (error) {
        alert("❌ Error de conexión con el servidor");
        console.error(error);
      }
    });
  }
});


