const API_BASE = "https://backend-cloudinary.vercel.app";

document.addEventListener("DOMContentLoaded", () => {
  const buscarBtn = document.getElementById("buscar");
  const uploadForm = document.getElementById("uploadForm");
  const galeria = document.getElementById("galeria");

  /* ============================
        LISTAR ARCHIVOS
  ============================ */
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
              onclick="window.open('${API_BASE}/descargar?public_id=${file.public_id}', '_blank')">
              Descargar archivo
            </button>
          `;
          galeria.appendChild(col);
        });
      } catch {
        galeria.innerHTML = "<p class='text-danger'>Error cargando archivos.</p>";
      }
    });
  }

  /* ============================
        SUBIR ARCHIVO (RAW + PROGRESO + RETRY)
  ============================ */
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

      // Barra de progreso
      const progresoDiv = document.getElementById("progreso");
      if (progresoDiv) progresoDiv.innerHTML = `
        <div class="progress my-2">
          <div id="barraProgreso" class="progress-bar progress-bar-striped progress-bar-animated"
          role="progressbar" style="width: 0%">0%</div>
        </div>
      `;

      const subirConReintentos = (intento = 1) =>
        new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open("POST", `${API_BASE}/upload`);

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const porcentaje = Math.round((event.loaded / event.total) * 100);
              const barra = document.getElementById("barraProgreso");
              if (barra) {
                barra.style.width = porcentaje + "%";
                barra.textContent = porcentaje + "%";
              }
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              resolve(JSON.parse(xhr.responseText));
            } else {
              if (intento < 3) {
                console.warn(`Reintentando subida (${intento}/3)...`);
                resolve(subirConReintentos(intento + 1));
              } else {
                reject("Error al subir archivo.");
              }
            }
          };

          xhr.onerror = () => {
            if (intento < 3) {
              console.warn(`Reintentando por error de red (${intento}/3)...`);
              resolve(subirConReintentos(intento + 1));
            } else {
              reject("Error de red.");
            }
          };

          const formData = new FormData();
          formData.append("file", file);
          formData.append("grado", grado);
          formData.append("anio", anio);
          formData.append("tipo", tipo);

          xhr.send(formData);
        });

      try {
        const respuesta = await subirConReintentos();

        alert("✅ Archivo subido correctamente");
        console.log("Cloudinary:", respuesta);
      } catch (error) {
        alert("❌ No se pudo subir el archivo: " + error);
      }
    });
  }
});
