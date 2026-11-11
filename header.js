document.addEventListener('DOMContentLoaded', () => {
    // Verificamos si el usuario ya inició sesión
    const usuarioLogueado = typeof estaLogueado === 'function' && estaLogueado();

    const linkLogin = document.getElementById('link-login');
    // Buscamos la lista principal del menú de Bootstrap donde están Inicio, Institucional, Contacto
    const menuNav = document.querySelector('.navbar-nav.me-auto'); 

    if (usuarioLogueado) {
        // 1. Si está logueado y existe el botón de login, lo transformamos en "Cerrar Sesión"
        if (linkLogin) {
            linkLogin.innerHTML = `
                <button class="btn btn-formulario" type="button" onclick="cerrarSesion()">Cerrar sesión</button>
            `;
        }

        // 2. Si estamos en la página pública y el menú principal existe, le agregamos el enlace al "Panel"
        if (menuNav) {
            // Evitamos duplicarlo por si acaso recarga o se ejecuta dos veces
            const panelExistente = document.getElementById('link-panel-dinamico');
            if (!panelExistente) {
                const liPanel = document.createElement('li');
                liPanel.className = 'nav-item';
                liPanel.id = 'link-panel-dinamico';
                liPanel.innerHTML = `<a class="nav-link" href="panelAdmin.html">Panel</a>`;
                
                // Lo agregamos al final de la barra de navegación principal
                menuNav.appendChild(liPanel);
            }
        }
    }
});