if (!estaLogueado()) {
    window.location.href = 'login.html'
}

const pacientes = JSON.parse(localStorage.getItem('pacientes')) || [];

document.getElementById('nombre-usuario').textContent = sessionStorage.getItem('usuario');