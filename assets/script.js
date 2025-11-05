// Configura tu Cloudinary aquí 👇
const CLOUD_NAME = "TU_CLOUD_NAME";
const UPLOAD_PRESET = "TU_UPLOAD_PRESET";

document.addEventListener('DOMContentLoaded', () => {
  const buscarBtn = document.getElementById('buscar');
  const uploadForm = document.getElementById('uploadForm');
  const galeria = document.getElementById('galeria');

  // --- Buscar imágenes por grado y año ---
  if (buscarBtn) {
    buscarBtn.addEventListener('click', async () => {
      const grado = document.getElementById('grado').value;
      const anio = document.getElementById('anio').value;

      if (!grado || !anio) {
        galeria.innerHTML = "<p class='text-danger'>Selecciona grado y año.</p>";
        return;
      }

      galeria.innerHTML = "<p>Cargando...</p>";
      const tag = `${anio}_${grado}`;
      const url = `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${tag}.json`;

      try {
        const res = await fetch(url);
        const data = await res.json();
        galeria.innerHTML = "";
        data.resources.forEach(img => {
          const col = document.createElement('div');
          col.className = "col-md-3";
          col.innerHTML = `<img src="${img.secure_url}" class="img-fluid rounded shadow-sm">`;
          galeria.appendChild(col);
        });
      } catch {
        galeria.innerHTML = "<p class='text-muted'>No se encontraron imágenes.</p>";
      }
    });
  }

  // --- Subir imágenes ---
  if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const file = uploadForm.imagen.files[0];
      const grado = uploadForm.grado.value;
      const anio = uploadForm.anio.value;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);
      formData.append("tags", `${anio}_${grado}`);

      try {
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: "POST",
          body: formData
        });
        const data = await res.json();
        alert("✅ Imagen subida correctamente");
        console.log(data);
      } catch {
        alert("❌ Error al subir la imagen");
      }
    });
  }
});
