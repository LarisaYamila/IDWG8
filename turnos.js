
const CLAVE_TURNOS = 'turnos';

// Obtener los datos guardados en LocalStorage
let turnos = JSON.parse(localStorage.getItem(CLAVE_TURNOS)) || [];

const animales = JSON.parse(localStorage.getItem('animales')) || [];
const veterinarios = JSON.parse(localStorage.getItem('veterinarios')) || [];

// Elementos HTML
const tablaTurnos = document.getElementById('tabla-turnos');
const total = document.getElementById('total');
const form = document.getElementById('form-turnos');
const selectMascota = document.getElementById('mascota');
const selectVeterinario = document.getElementById('veterinario');
const valorConsulta = document.getElementById('valor-consulta');

// Mostrar las mascotas registradas en el select
function cargarMascotas() {
    animales.forEach((animal) => {
        selectMascota.innerHTML += `
            <option value="${animal.idAnimal}">
                ${animal.nombreAnimal} - ${animal.nombreDuenio}
            </option>
        `;
    });
}

// Mostrar los veterinarios registrados en el select
function cargarVeterinarios() {
    veterinarios.forEach((veterinario) => {
        selectVeterinario.innerHTML += `
            <option value="${veterinario.idVeterinario}">
                ${veterinario.nombre}
            </option>
        `;
    });
}

// Mostrar el precio de la consulta
selectVeterinario.addEventListener('change', () => {
    const veterinario = veterinarios.find(
        (veterinario) =>
            veterinario.idVeterinario === selectVeterinario.value
    );

    if (veterinario) {
        valorConsulta.textContent = '$' + veterinario.valorConsulta;
    } else {
        valorConsulta.textContent = '$0';
    }
});

// Guardar los turnos en LocalStorage
function guardarEnLocalStorage() {
    localStorage.setItem(CLAVE_TURNOS, JSON.stringify(turnos));
}

// Mostrar los turnos registrados
function mostrar() {
    tablaTurnos.innerHTML = '';

    turnos.forEach((turno) => {

        const animal = animales.find(
            (animal) => animal.idAnimal === turno.mascota
        );

        const veterinario = veterinarios.find(
            (veterinario) =>
                veterinario.idVeterinario === turno.veterinario
        );

        const nombreMascota = animal ? animal.nombreAnimal : 'No disponible';
        const nombreDuenio = animal ? animal.nombreDuenio : 'No disponible';
        const nombreVeterinario = veterinario ? veterinario.nombre : 'No disponible';
        const precio = veterinario ? veterinario.valorConsulta : 0;

        tablaTurnos.innerHTML += `
            <tr>
                <td>${nombreMascota}</td>
                <td>${nombreDuenio}</td>
                <td>${nombreVeterinario}</td>
                <td>${turno.fechaHora.replace('T', ' ')}</td>
                <td>$${precio}</td>
                <td>
                    <button class="btn btn-outline-danger btn-sm"
                        onclick="eliminarTurno('${turno.idTurno}')">
                        Eliminar
                    </button>
                </td>
            </tr>
        `;
    });

    total.textContent = turnos.length;
}

// Eliminar un turno
function eliminarTurno(idTurno) {
    const confirmar = confirm('¿Querés eliminar este turno?');

    if (!confirmar) {
        return;
    }

    turnos = turnos.filter(
        (turno) => turno.idTurno !== idTurno
    );

    guardarEnLocalStorage();
    mostrar();
}

// Permitir utilizar la función desde el HTML
window.eliminarTurno = eliminarTurno;

// Registrar un turno
form.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const datos = new FormData(form);

    const mascota = datos.get('mascota');
    const veterinario = datos.get('veterinario');
    const fechaHora = datos.get('fechaHora');

    // Comprobar que se hayan seleccionado los datos
    if (!mascota || !veterinario || !fechaHora) {
        alert('Completá todos los campos.');
        return;
    }

    // Comprobar que el turno sea para una fecha futura
    if (new Date(fechaHora) <= new Date()) {
        alert('La fecha y hora del turno deben ser futuras.');
        return;
    }

    // Comprobar que el veterinario no tenga otro turno a esa hora
    const turnoExistente = turnos.find(
        (turno) =>
            turno.veterinario === veterinario &&
            turno.fechaHora === fechaHora
    );

    if (turnoExistente) {
        alert('El veterinario ya tiene un turno registrado en ese horario.');
        return;
    }

    const nuevoTurno = {
        idTurno: crypto.randomUUID(),
        fechaHora: fechaHora,
        mascota: mascota,
        veterinario: veterinario
    };

    turnos.push(nuevoTurno);

    guardarEnLocalStorage();
    mostrar();

    form.reset();
    valorConsulta.textContent = '$0';
});

// Cargar los datos al abrir la página
cargarMascotas();
cargarVeterinarios();
mostrar();
