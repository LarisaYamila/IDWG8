
const veterinarios = JSON.parse(localStorage.getItem('veterinarios')) || [];

const listadoVeterinarios = document.getElementById("tabla-veterinarios");

const total = document.getElementById("total");

const form = document.getElementById("form-veterinarios");

//const btnEditar = new bootstrap.Modal(document.getElementById('modal-editar'));

let idVeterinarioEditar;

function eliminarVeterinario(idVeterinario) {
    const indice = veterinarios.findIndex((veterinario)=> veterinario.idVeterinario === idVeterinario);
    veterinarios.splice(indice,1);
    guardarEnLocalStorage();
    mostrar();
}

window.eliminarVeterinario = eliminarVeterinario;

function editarVeterinario(idVeterinario) {
    idVeterinarioEditar = idVeterinario;

    const veterinario = veterinarios.find((veterinario) => veterinario.idVeterinario === idVeterinario);

    document.getElementById("editar-matricula").value = veterinario.matricula;
    document.getElementById("editar-nombre").value = veterinario.nombre;
    document.getElementById("editar-especializacion").value = veterinario.especializacion;
    document.getElementById("editar-valorConsulta").value = veterinario.valorConsulta;

    const modal = new bootstrap.Modal(document.getElementById("modal-editar"));
    modal.show();
}

window.editarVeterinario = editarVeterinario;





function mostrar () {
    listadoVeterinarios.innerHTML = ''; 

    veterinarios.forEach( (veterinario) => {
        listadoVeterinarios.innerHTML += `
            <tr>
                <td>${veterinario.idVeterinario.slice(0, 5)}</td>
                <td>${veterinario.matricula}</td>
                <td>${veterinario.nombre}</td>
                <td>${veterinario.especializacion}</td>
                <td>${veterinario. valorConsulta}</td>
                <td>
                    <button class="btn btn-danger btn-sm" onclick="eliminarVeterinario('${veterinario.idVeterinario}')">
                          Eliminar

                    </button>
                   
                    <button class="btn btn-warning btn-sm" onclick="editarVeterinario('${veterinario.idVeterinario}')">

                          Editar

                    </button>

                </td>
                


            </tr>
        `
    })

    total.textContent = veterinarios.length;

};

mostrar();

function guardarEnLocalStorage() {
    localStorage.setItem('veterinarios', JSON.stringify(veterinarios));

}

form.addEventListener('submit', (evento) => {
    evento.preventDefault();

    const datos = new FormData(form);

    const matricula = datos.get('matricula');
    const nombre = datos.get('nombre');
    const especializacion = datos.get('especializacion');
    const  valorConsulta = datos.get('valorConsulta');

    const nuevoVeterinario = {
        idVeterinario: crypto.randomUUID(),
        matricula: parseInt(datos.get('matricula')),
        nombre: datos.get('nombre').trim(),
        especializacion: datos.get('especializacion').trim(),
         valorConsulta: parseFloat(datos.get('valorConsulta'))
        
    }

    veterinarios.push(nuevoVeterinario);

    guardarEnLocalStorage();

    mostrar();
    form.reset();
});


const formEditar = document.getElementById("form-editar-veterinario");

formEditar.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const veterinario = veterinarios.find(
        (veterinario) => veterinario.idVeterinario === idVeterinarioEditar
    );

    if (!veterinario) return;

    veterinario.matricula = parseInt(document.getElementById("editar-matricula").value);
    veterinario.nombre = document.getElementById("editar-nombre").value.trim();
    veterinario.especializacion = document.getElementById("editar-especializacion").value;
    veterinario.valorConsulta = parseFloat(document.getElementById("editar-valorConsulta").value);

    guardarEnLocalStorage();
    mostrar();

    bootstrap.Modal.getInstance(document.getElementById("modal-editar")).hide();

})