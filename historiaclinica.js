const CLAVE_HISTORIAS = 'historiasclinicas';

// Obtener los datos guardados en LocalStorage
let historias = JSON.parse(localStorage.getItem(CLAVE_HISTORIAS)) || [];

const animales = JSON.parse(localStorage.getItem('animales')) || [];
const veterinarios = JSON.parse(localStorage.getItem('veterinarios')) || [];

// Elementos HTML
const tablaHistorias = document.getElementById('tabla-historias');
const total = document.getElementById('total');
const form = document.getElementById('form-historias');
const selectMascota = document.getElementById('mascota');
const selectVeterinario = document.getElementById('veterinario');
const filtroMascota = document.getElementById('filtro-mascota');

// Cargar las mascotas registradas en el select

if (!estaLogueado()) {
    alert('Debes iniciar sesión para acceder a esta página.');
    window.location.href = 'login.html';
} else {
    iniciar();
}

// Mostrar las mascotas registradas en el select
function cargarMascotas() {
    animales.forEach((animal) => {
        const opcion = document.createElement('option');
        opcion.value = animal.idAnimal;
        opcion.textContent = `${animal.nombreAnimal} - ${animal.nombreDuenio}`;
        selectMascota.appendChild(opcion)

        const opcionFiltro = document.createElement('option');
        opcionFiltro.value = animal.idAnimal;
        opcionFiltro.textContent = `${animal.nombreAnimal} - ${animal.nombreDuenio}`;

        filtroMascota.appendChild(opcionFiltro);
    
    });
}

// Mostrar los veterinarios registrados en el select
function cargarVeterinarios() {
    veterinarios.forEach((veterinario) => {
        const opcion = document.createElement('option');
        opcion.value = veterinario.idVeterinario;
        opcion.textContent = veterinario.nombre;
       
        selectVeterinario.appendChild(opcion);
    });
}


// Guardar las historias clínicas en LocalStorage
function guardarEnLocalStorage() {
    localStorage.setItem(CLAVE_HISTORIAS, JSON.stringify(historias));
}

// Agregar una celda al final de la tabla para mostrar el total de historias clínicas registradas
function agregarCelda(fila, contenido) {
    const celda = document.createElement('td');
    celda.textContent = contenido;
    fila.appendChild(celda);
}

// Mostrar las historias clínicas registradas
function mostrar() {
    tablaHistorias.innerHTML = '';

    const mascotaSeleccionada = filtroMascota.value;
    const historiasFiltradas = historias.filter((historia) => {
        return !mascotaSeleccionada || 
        String(historia.mascota) === mascotaSeleccionada;
        
});

// Ordenar las consultas
    historiasFiltradas.sort((a, b) => 
        new Date(b.fechaHora) - new Date(a.fechaHora)
    );

    historiasFiltradas.forEach((historia) => {
        const animal = animales.find(
            (animal) => String(animal.idAnimal) === String (historia.mascota)
        );

        const veterinario = veterinarios.find(
            (veterinario) => 
                String(veterinario.idVeterinario) === historia.veterinario
        );


        const nombreMascota = animal ? animal.nombreAnimal : 'No disponible';
        const nombreDuenio = animal ? animal.nombreDuenio : 'No disponible';
        const nombreVeterinario = veterinario ? veterinario.nombre : 'No disponible';

        const fila = document.createElement('tr');

        agregarCelda(fila, nombreMascota);
        agregarCelda(fila, nombreDuenio);
        agregarCelda(fila, nombreVeterinario);
        agregarCelda(fila, historia.fechaHora.replace('T', ' '));
        agregarCelda(fila, historia.diagnostico);
        agregarCelda(fila, historia.tratamiento);
        tablaHistorias.appendChild(fila);

    });

    total.textContent = historiasFiltradas.length;
}

// Registrar una historia clínica
form.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const datos = new FormData(form);

    const mascota = datos.get('mascota');
    const veterinario = datos.get('veterinario');
    const fechaHora = datos.get('fechaHora');
    const diagnostico = datos.get('diagnostico');
    const tratamiento = datos.get('tratamiento');

// Comprobar que se hayan seleccionado los datos
    if (!mascota || !veterinario || !fechaHora || !diagnostico || !tratamiento) {
        alert('Completá todos los campos.');
        return;
    }

// Comprobar que la fecha y hora no sean futuras
    const hoy = new Date();
    const fechaActual = [
        hoy.getFullYear(),
        String(hoy.getMonth() + 1).padStart(2, '0'),
        String(hoy.getDate()).padStart(2, '0'),
    ].join('-') + 'T' + [
        String(hoy.getHours()).padStart(2, '0'),
        String(hoy.getMinutes()).padStart(2, '0'),
    ].join(':');

    if (fechaHora > fechaActual) {
        alert('La fecha y hora de la historia clínica no pueden ser futuras.');
        return;
    }
    const nuevaHistoria = {
        idHistoria: crypto.randomUUID(),
        fechaHora: fechaHora,
        mascota: mascota,
        veterinario: veterinario,
        diagnostico: diagnostico,
        tratamiento: tratamiento
    };

    historias.push(nuevaHistoria);

    guardarEnLocalStorage();
    mostrar();

    form.reset();

    alert('Historia clínica registrada correctamente.');
});

// Mostrar las historias clínicas al cargar la página
filtroMascota.addEventListener('change', mostrar);

//Cargar los datos al abrir la página
function iniciar() {
    cargarMascotas();
    cargarVeterinarios();
    mostrar();
}