//Constantes
const CLAVE_ANIMALES = 'animales'
const ID_LISTADO_ANIMALES = 'listado-animales'
const ID_TOTAL_ANIMALES = 'total'
const ID_FORM_ANIMALES = 'form-animales'
const ID_FORM_EDITAR_ANIMALES = 'form-editar-animal'
const ID_INPUT_NOMBRE_DUENIO = 'nombreDuenio'
const ID_INPUT_EDITAR_NOMBRE_DUENIO = 'editarNombreDuenio'
const ID_DIALOG_EDITAR_ANIMAL = 'dialogEditarAnimal'
const ID_DIALOG_ELIMINAR_ANIMAL = 'dialogEliminarAnimal'
const ID_BOTON_CONFIRMAR_ELIMINAR = 'btnConfirmarEliminar'

//regexp
const patronSinNumeros = /^([^0-9]*)$/;

//Elementos HTML
const listadoDeAnimalesHTML = document.getElementById(ID_LISTADO_ANIMALES);
const totalAnimalesHTML = document.getElementById(ID_TOTAL_ANIMALES);
const formAnimalesHTML = document.getElementById(ID_FORM_ANIMALES);
const inputNombreDuenioHTML = document.getElementById(ID_INPUT_NOMBRE_DUENIO)
const inputEditarNombreDuenioHTML = document.getElementById(ID_INPUT_EDITAR_NOMBRE_DUENIO)
const formEditarAnimalesHTML = document.getElementById(ID_FORM_EDITAR_ANIMALES);
const dialogEditarAnimalHTML = document.getElementById(ID_DIALOG_EDITAR_ANIMAL);
const dialogEliminarAnimalHTML = document.getElementById(ID_DIALOG_ELIMINAR_ANIMAL);
const botonConfirmarEliminarHTML = document.getElementById(ID_BOTON_CONFIRMAR_ELIMINAR);

//Arrays
let listaDeAnimales = [];

//Variables
let idAnimalEliminar = null;

//Funciones
function cargarListaDeAnimales() {
    listaDeAnimales = JSON.parse(localStorage.getItem(CLAVE_ANIMALES))

    if (listaDeAnimales == undefined)
        listaDeAnimales = []
}

function guardarListaDeAnimales() {
    localStorage.setItem(CLAVE_ANIMALES, JSON.stringify(listaDeAnimales))
}

function renderListaDeAnimales() {
    listadoDeAnimalesHTML.innerHTML = '';

    listaDeAnimales.forEach((animal) => {
        listadoDeAnimalesHTML.innerHTML += `
            <tr id="${animal.idAnimal}"> 
                <td>${animal.nombreDuenio}</td>

                <td>${animal.tipoAnimal}</td>

                <td>${animal.nombreAnimal}</td>

                <td>${animal.color}</td>

                <td>${animal.edad}</td>

                <td>${animal.peso}</td>

                <td>${animal.esterilizado}</td>

                <td>
                <button commandfor="dialogEditarAnimal" command="show-modal" class="btn-outline theme-secondary btn-icon" onclick="cargarFormEditarAnimal('${animal.idAnimal}')"><i class="bi bi-pencil-square"></i></button>
                <button commandfor="dialogEliminarAnimal" command="show-modal" class="btn-subtle theme-warning btn-icon" onclick="${(() => {idAnimalEliminar = animal.idAnimal})()}"><i class="bi bi-trash"></i></button>
                </td>
            </tr>
        `
    });

    totalAnimalesHTML.textContent = listaDeAnimales.length;
};

function crearObjetoAnimal(nuevoAnimal) {
    const animal = {
        idAnimal: crypto.randomUUID(),
        nombreDuenio: nuevoAnimal.nombreDuenio.trim(),
        tipoAnimal: nuevoAnimal.tipoAnimal,
        nombreAnimal: nuevoAnimal.nombreAnimal.trim(),
        color: nuevoAnimal.color.trim(),
        edad: Number(nuevoAnimal.edad),
        peso: parseFloat(nuevoAnimal.peso),
        esterilizado: nuevoAnimal.esterilizado
    }

    listaDeAnimales.push(animal);
    guardarListaDeAnimales();
}

function eliminarAnimal(idAnimal) {
    const filaAHTML = document.getElementById(idAnimal);

    if (filaAHTML !== null) {
        filaAHTML.remove();
        listaDeAnimales = listaDeAnimales.filter(animal => animal.idAnimal !== idAnimal)
        guardarListaDeAnimales()
        totalAnimalesHTML.textContent = listaDeAnimales.length;
    }
}

function guardarAnimalEditado(animalEditado) {
    listaDeAnimales = listaDeAnimales.map(animal => {
        if (animal.idAnimal == animalEditado.idAnimal)
            return animalEditado

        return animal
    })

    guardarListaDeAnimales();
}

function cargarFormEditarAnimal(idAnimal) {
    const animalEncontrado = listaDeAnimales.find(animal => animal.idAnimal == idAnimal)

    if (animalEncontrado == undefined)
        return

    formEditarAnimalesHTML.elements["idAnimal"].value = animalEncontrado.idAnimal
    formEditarAnimalesHTML.elements["nombreDuenio"].value = animalEncontrado.nombreDuenio
    formEditarAnimalesHTML.elements["tipoAnimal"].value = animalEncontrado.tipoAnimal
    formEditarAnimalesHTML.elements["nombreAnimal"].value = animalEncontrado.nombreAnimal
    formEditarAnimalesHTML.elements["color"].value = animalEncontrado.color
    formEditarAnimalesHTML.elements["edad"].value = animalEncontrado.edad
    formEditarAnimalesHTML.elements["peso"].value = animalEncontrado.peso
    formEditarAnimalesHTML.elements["esterilizado"].value = animalEncontrado.esterilizado
}

//Funciones de Eventos HTML
formAnimalesHTML.addEventListener('submit', (evento) => {
    // evitar que recargue la pagina
    evento.preventDefault();

    const animalFormulario = new FormData(formAnimalesHTML);

    const nuevoAnimal = {
        idAnimal: crypto.randomUUID(),
        nombreDuenio: animalFormulario.get('nombreDuenio').trim(),
        tipoAnimal: animalFormulario.get('tipoAnimal'),
        nombreAnimal: animalFormulario.get('nombreAnimal').trim(),
        color: animalFormulario.get('color').trim(),
        edad: Number(animalFormulario.get('edad')),
        peso: parseFloat(animalFormulario.get('peso')),
        esterilizado: animalFormulario.get('esterilizado')
    }

    if (nuevoAnimal.nombreAnimal == undefined || nuevoAnimal.nombreAnimal.length == 0)
        nuevoAnimal.nombreAnimal = "Sin Detalle"

    if (!patronSinNumeros.test(nuevoAnimal.nombreDuenio)) {
        alert("El nombre del Dueño no debe contener números.");
        inputNombreDuenioHTML.focus();
        return;
    }

    if (!patronSinNumeros.test(nuevoAnimal.color)) {
        alert("El color no debe contener números.");
        inputNombreDuenioHTML.focus();
        return;
    }

    crearObjetoAnimal(nuevoAnimal)
    renderListaDeAnimales();

    //limpiar en formulario para la proxima carga
    formAnimalesHTML.reset();
})

formEditarAnimalesHTML.addEventListener('submit', (evento) => {
    // evitar que recargue la pagina
    evento.preventDefault();

    const editarAnimalFormulario = new FormData(formEditarAnimalesHTML);

    const editarAnimal = {
        idAnimal: editarAnimalFormulario.get("idAnimal"),
        nombreDuenio: editarAnimalFormulario.get('nombreDuenio').trim(),
        tipoAnimal: editarAnimalFormulario.get('tipoAnimal'),
        nombreAnimal: editarAnimalFormulario.get('nombreAnimal').trim(),
        color: editarAnimalFormulario.get('color').trim(),
        edad: Number(editarAnimalFormulario.get('edad')),
        peso: parseFloat(editarAnimalFormulario.get('peso')),
        esterilizado: editarAnimalFormulario.get('esterilizado')
    }

    if (editarAnimal.nombreAnimal == undefined || editarAnimal.nombreAnimal.length == 0)
        nuevoAnimal.nombreAnimal = "Sin Detalle"

    if (!patronSinNumeros.test(editarAnimal.nombreDuenio)) {
        alert("El nombre del Dueño no debe contener números.");
        inputEditarNombreDuenioHTML.focus();
        return;
    }

    if (!patronSinNumeros.test(editarAnimal.color)) {
        alert("El color no debe contener números.");
        inputEditarNombreDuenioHTML.focus();
        return;
    }

    guardarAnimalEditado(editarAnimal)
    renderListaDeAnimales();

    //cerrar dialog editar animal
    dialogEditarAnimalHTML.close();

    //limpiar en formulario para la proxima carga
    formAnimalesHTML.reset();
})

botonConfirmarEliminarHTML.addEventListener("click", () => {
    if (idAnimalEliminar == null) {
        dialogEliminarAnimalHTML.close()
        return
    }
    
    eliminarAnimal(idAnimalEliminar);
    idAnimalEliminar == null
    dialogEliminarAnimalHTML.close()
});

cargarListaDeAnimales();
renderListaDeAnimales();

