const CLOUD_NAME = "dweoz84zz";

document.addEventListener("DOMContentLoaded", async () => {
  const galeria = document.getElementById("galeria");
  galeria.innerHTML = "<p>🔍 Buscando imágenes 'descarga.jpg' en todas las carpetas...</p>";

  const tipo = "matriculas"; // puedes cambiar a "observadores" si quieres probar esa parte
  const anios = ["2022", "2023", "2024", "2025"];
  const grados = ["6A","6B","6C","6D","6E","6F","7A","7B","7C","7D","7E","8A","8B","8C","8D","9A","9B","9C","10A","10B","11A","11B"];

  galeria.innerHTML = "";

  let encontrados = 0;

  for (const anio of anios) {
    for (const grado of grados) {
      const url = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${tipo}/${anio}/${grado}/descarga.jpg`;

      // Verificamos si existe
      try {
        const res = await fetch(url);
        if (res.ok) {
          encontrados++;
          const col = document.createElement("div");
          col.className = "col-md-3 mb-3";
          col.innerHTML = `
            <div class="card shadow-sm">
              <img src="${url}" class="img-fluid rounded">
              <p class="mt-2 small text-secondary">${tipo}/${anio}/${grado}/descarga.jpg</p>
            </div>
          `;
          galeria.appendChild(col);
        }
      } catch (err) {
        console.log(`No se encontró en ${anio}/${grado}`);
      }
    }
  }

  if (encontrados === 0) {
    galeria.innerHTML = `
      <p class="text-danger text-center">
        ❌ No se encontró ninguna imagen llamada <strong>descarga.jpg</strong> 
        en las carpetas especificadas.
      </p>
    `;
  } else {
    galeria.insertAdjacentHTML(
      "afterbegin",
      `<p class="text-success text-center">✅ Se encontraron ${encontrados} imágenes con nombre descarga.jpg</p>`
    );
  }
});
