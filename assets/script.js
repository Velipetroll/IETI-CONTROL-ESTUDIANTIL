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

      // Usamos el tag con el formato tipo_anio_
