//Constantes
const CLAVE_ANIMALES = 'animales'
const ID_LISTADO_ANIMALES = 'listado-animales'
const ID_TOTAL_ANIMALES = 'total'
const ID_FORM_ANIMALES = 'form-animales'
const ID_INPUT_NOMBRE_DUENIO = 'nombreDuenio'

//regexp
const patronSinNumeros = /^([^0-9]*)$/;

//Elementos HTML
const listadoDeAnimalesHTML = document.getElementById(ID_LISTADO_ANIMALES);
const totalAnimalesHTML = document.getElementById(ID_TOTAL_ANIMALES);
const formAnimalesHTML = document.getElementById(ID_FORM_ANIMALES);
const inputNombreDuenioHTML = document.getElementById(ID_INPUT_NOMBRE_DUENIO)
let botonDeBajaHTML;

//Arrays
let listaDeAnimales = [];

//Funciones
function cargarListaDeAnimales() {
    listaDeAnimales = JSON.parse(localStorage.getItem(CLAVE_ANIMALES))

    if(listaDeAnimales == undefined)
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

                <td><button class="btn btn-danger" onclick="eliminarAnimal('${animal.idAnimal}')">Baja</button></td>
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
        listaDeAnimales = listaDeAnimales.filter( animal => animal.idAnimal !== idAnimal)
        guardarListaDeAnimales()
    }
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

cargarListaDeAnimales();
renderListaDeAnimales();

