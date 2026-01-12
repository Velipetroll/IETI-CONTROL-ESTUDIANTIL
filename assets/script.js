const API_BASE = "https://backend-cloudinary.vercel.app"; 


const CLOUD_NAME = "dweoz84zz"; 
const UPLOAD_PRESET = "estudiantes"; 

document.addEventListener("DOMContentLoaded", () => {
  const buscarBtn = document.getElementById("buscar");
  const uploadForm = document.getElementById("uploadForm");
  const galeria = document.getElementById("galeria");

  if (buscarBtn) {
    buscarBtn.addEventListener("click", async () => {
      const grado = document.getElementById("grado").value;
      const anio = document.getElementById("anio").value;
      const tipo = document.body.dataset.tipo;

      if (!grado || !anio) {
        galeria.innerHTML = "<p class='text-danger'>Selecciona grado y año.</p>";
        return;
      }

      galeria.innerHTML = "<p>Cargando archivos...</p>";

      try {
        const res = await fetch(`${API_BASE}/imagenes?tipo=${tipo}&anio=${anio}&grado=${grado}`);
        const data = await res.json();

        galeria.innerHTML = "";

        if (!data.length) {
          galeria.innerHTML = "<p class='text-muted'>No se encontraron archivos.</p>";
          return;
        }

        data.forEach((file) => {
          const col = document.createElement("div");
          col.className = "col-md-3 mb-3 text-center";

          col.innerHTML = `
            <img src="${file.url}" class="img-fluid rounded shadow-sm mb-2">
            <button class="btn btn-primary btn-sm w-100"
              onclick="window.location='${API_BASE}/descargar?public_id=${file.public_id}'">
              Descargar archivo
            </button>
          `;

          galeria.appendChild(col);
        });
      } catch (error) {
        galeria.innerHTML = "<p class='text-danger'>Error cargando archivos.</p>";
      }
    });
  }

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

      const folder = `${tipo}/${anio}/${grado}`;

      const cloudinaryURL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/auto/upload`;

      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("folder", folder);

      try {
        const res = await fetch(cloudinaryURL, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data.secure_url) {
          alert("✅ Archivo subido correctamente");
          console.log("Cloudinary:", data);
        } else {
          alert("❌ Error al subir el archivo");
          console.error(data);
        }
      } catch (error) {
        alert("❌ Error al conectar con Cloudinary");
        console.error(error);
      }
    });
  }
});
