if (!estaLogueado()) {
    window.location.href = 'login.html'
}

const pacientes = JSON.parse(localStorage.getItem('animales')) || [];

document.getElementById('nombre-usuario').textContent = sessionStorage.getItem('usuario');

const veterinarios = JSON.parse(localStorage.getItem('veterinarios')) || [];

const turnos = JSON.parse(localStorage.getItem('turnos')) || [];

const historiaClinica = JSON.parse(localStorage.getItem('historiasclinicas')) || [];

document.getElementById('total-pacientes').textContent = pacientes.length;
document.getElementById('total-veterinarios').textContent = veterinarios.length;

document.getElementById('total-turnos').textContent = turnos.length;

document.getElementById('total-historia').textContent = historiaClinica.length;
