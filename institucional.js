//Constantes
const URL_API_INICIALES_SVG = 'https://api.dicebear.com/10.x/initials/svg'
const CLAVE_VETERINARIOS = 'veterinarios'
const ID_DIV_PROFESIONALES = 'profesionales'

//Elementos HTML
const divProfesionalesHTML = document.getElementById(ID_DIV_PROFESIONALES)

let listaDeVeterinarios = [
  {
    idVeterinario: "307d5cf7-a1e1-4390-8c60-8037051e901a",
    matricula: 5576,
    nombre: "José Rivadavia",
    especializacion: "Cirugía Veterinaria",
    valorConsulta: 75000.00,
    imagenPerfil: 'images/jose-rivadavia.jpg',
  },
  {
    idVeterinario: "317d5cf7-a1e1-4391-8c61-8137051e901b",
    matricula: 1114,
    nombre: "Pia Grancetti",
    especializacion: "MEDICINA DE GRANDES ANIMALES",
    valorConsulta: 50000.00,
    imagenPerfil: 'images/pia-grancetti.jpg',
  },
  {
    idVeterinario: "327d5cf7-a1e1-4392-8c62-8237051e901c",
    matricula: 1530,
    nombre: "Felipe Antoniutti",
    especializacion: "MEDICINA DE PEQUEÑOS ANIMALES",
    valorConsulta: 30000.00,
    imagenPerfil: 'images/felipe-atoniutti.jpg',
  },
];

//Funciones
function cargarListaDeVeterinarios() {
  const listaVeterinariosLocalStorage = JSON.parse(localStorage.getItem(CLAVE_VETERINARIOS))

  if (listaVeterinariosLocalStorage !== null)
    listaDeVeterinarios = [...listaDeVeterinarios, ...listaVeterinariosLocalStorage]
}

function crearProfesionalHTML(
  idVeterinario = '',
  matricula = 9999,
  nombre = 'Sin Nombre',
  especializacion = 'Sin Especialización',
  valorConsulta = 9999.99,
  imagenPerfil = ''
) {
  if (idVeterinario.length === 0) return;

  if (imagenPerfil.length === 0) {
    imagenPerfil = `${URL_API_INICIALES_SVG}?seed=${encodeURIComponent(nombre)}`;
  }

  const precioFormateado = Number(valorConsulta).toLocaleString('es-AR');

  return `
    <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
      <article id="${idVeterinario}" class="card h-100 border-0 shadow-sm text-center">
        <div class="card-body p-4 d-flex flex-column">
          <img 
            src="${imagenPerfil}" 
            alt="Foto de ${nombre}" 
            class="rounded-circle mx-auto mb-3 object-fit-cover"
            style="width: 110px; height: 110px;"
          >

          <h3 class="h5 card-title fw-semibold mb-2 text-dark">
            ${nombre}
          </h3>

          <p class="text-uppercase small text-secondary mb-1">
            ${especializacion.trim()}
          </p>

          <p class="mb-3">
            <span class="badge bg-success-subtle text-success fw-medium">
              MAT ${matricula}
            </span>
          </p>

          <div class="mt-auto border-top pt-3">
            <span class="text-secondary small d-block">Valor Consulta</span>
            <span class="fw-bold fs-5 text-dark">$${precioFormateado}</span>
          </div>

        </div>
      </article>
    </div>
  `;
}

function renderListaDeVeterinarios() {
  listaDeVeterinarios.forEach(veterinario => {
    divProfesionalesHTML.innerHTML += crearProfesionalHTML(
      veterinario.idVeterinario,
      veterinario.matricula,
      veterinario.nombre,
      veterinario.especializacion,
      veterinario.valorConsulta,
      veterinario.imagenPerfil,
    )
  })
}

cargarListaDeVeterinarios();
renderListaDeVeterinarios();