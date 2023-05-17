const mascotaInput = document.querySelector('#mascota');
const propietarioInput = document.querySelector('#propietario');
const telefonoInput = document.querySelector('#telefono');
const fechaInput = document.querySelector('#fecha');
const horaInput = document.querySelector('#hora');
const sintomasInput = document.querySelector('#sintomas');

const formulario = document.querySelector('#nueva-cita');

const  contenido = document.querySelector('#contenido');

const ulCitas = document.querySelector('#citas');

let editando;



class Citas {
    constructor() {
        this.arrayCitas = [];
    }

    llenarCita(cita) {
        this.arrayCitas = [...this.arrayCitas, cita];
    }

    eliminarCita(id) {
        this.arrayCitas = this.arrayCitas.filter(citas => citas.id !== id);
    }

    editarCita(objCitasActualizada) {
        // arrayCitas [] = [{id:1}, {id:2}] === {id: 1} // se actualiza el array con el objeto actualizado
        this.arrayCitas = this.arrayCitas.map(objCitas => objCitas.id === objCitasActualizada.id ? objCitasActualizada : objCitas);
    }
}

class Interfaz {
    imprimirAlerta(mensaje, tipo) {
        // crear un div
        const divMensaje = document.createElement('DIV');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');
        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }
    
        divMensaje.textContent = mensaje;

        if (contenido.children.length < 3) {
            contenido.insertBefore(divMensaje, document.querySelector('.agregar-cita'));
        }
        
        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    mostrarCitas({arrayCitas}) {
        // const { arrayCitas } = cita;
        this.limpiarHTML();
        arrayCitas.forEach(citas => {
            const {id, mascota, propietario, telefono, fecha, hora, sintomas} = citas;
            
            const divCita = document.createElement('DIV');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            const mascotaParrafo = document.createElement('H2');
            mascotaParrafo.classList.add('card-title', 'font-weight-bolder');
            mascotaParrafo.textContent = mascota;

            const propietarioParrafo = document.createElement('P');
            propietarioParrafo.classList.add('card-title', 'font-weight-bold');
            propietarioParrafo.innerHTML = `<span class="font-weight-bolder">Propietario: </span>${propietario}`;
            
            const telefonoParrafo = document.createElement('P');
            telefonoParrafo.classList.add('card-title', 'font-weight-bold');
            telefonoParrafo.innerHTML = `<span class="font-weight-bolder">Telefono: </span>${telefono}`;;

            const fechaParrafo = document.createElement('P');
            fechaParrafo.classList.add('card-title', 'font-weight-bold');
            fechaParrafo.innerHTML = `<span class="font-weight-bolder">Fecha: </span>${fecha}`;;

            const horaParrafo = document.createElement('P');
            horaParrafo.classList.add('card-title', 'font-weight-bold');
            horaParrafo.innerHTML = `<span class="font-weight-bolder">Hora: </span>${hora}`;;
            
            const sintomasParrafo = document.createElement('P');
            sintomasParrafo.classList.add('card-title', 'font-weight-bold');
            sintomasParrafo.innerHTML = `<span class="font-weight-bolder">Sintomas: </span>${sintomas}`;;

            const btnEliminar = document.createElement('button');
            btnEliminar.classList.add('btn', 'btn-danger', 'mr-2');
            btnEliminar.textContent = 'Eliminar';

            // se hace click en el boton
            btnEliminar.onclick = () => eliminarCita(id);
            
            // actualizar
            const btnEditar = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-primary');
            btnEditar.textContent = 'Editar';

            btnEditar.onclick = () => editarCitas(citas);

            divCita.appendChild(mascotaParrafo);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);

            divCita.appendChild(btnEliminar);
            divCita.appendChild(btnEditar);

            ulCitas.appendChild(divCita);
        });

        localStorage.setItem('citas', JSON.stringify(arrayCitas));
    }

    limpiarHTML() {
        while (ulCitas.firstChild) {
            ulCitas.removeChild(ulCitas.firstChild);
        }
    }
}

const interfaz = new Interfaz();
const cita = new Citas();

document.addEventListener('DOMContentLoaded', () => {
    cita.arrayCitas = JSON.parse(localStorage.getItem('citas')) || [];
    interfaz.mostrarCitas(cita);
});

// Funciones
eventListener();
function eventListener() {
    mascotaInput.addEventListener('input', datosCitas);
    propietarioInput.addEventListener('input', datosCitas);
    telefonoInput.addEventListener('input', datosCitas);
    fechaInput.addEventListener('input', datosCitas);
    horaInput.addEventListener('input', datosCitas);
    sintomasInput.addEventListener('input', datosCitas);

    formulario.addEventListener('submit', agregarCita);
}

// OBJETO DATOS
const objCitas = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: '',
}

// Agregando datos al objeto
function datosCitas(e) {
    objCitas[e.target.name] = e.target.value;
}

// Valida y agrega una nueva citas
function agregarCita(e) {
    e.preventDefault();

    // Extraer la informacion del objCitas
    const {mascota, propietario, telefono, fecha, hora, sintomas} = objCitas;

    // validar
    if (mascota === '' || propietario === '' || telefono === '' || fecha === '' || sintomas === '') {
        interfaz.imprimirAlerta('Todos los campos son obligatorios', 'error');
        return;
    }

    if (editando) {
        interfaz.imprimirAlerta('Editado correctamente', 'correcto');
        
        // Se pasa el objeto de la cita edicion
        cita.editarCita({...objCitas});

        formulario.querySelector('button[type="submit"]').textContent = 'Crear citas';
        editando = false;
    } else {
        // Creando una nueva cita
        objCitas.id = Date.now();

        // Se le envia como parametro una copia del objeto
        cita.llenarCita({ ...objCitas });

        interfaz.imprimirAlerta('Se agrego correctamente', 'correcto');
    }

    

    // Reiniciar el objeto
    reiniciarObjeto();

    formulario.reset();

    // Mostrar citas
    interfaz.mostrarCitas(cita);
}

function reiniciarObjeto() {
    objCitas.mascota = '';
    objCitas.propietario = '';
    objCitas.telefono = '';
    objCitas.fecha = '';
    objCitas.hora = '';
    objCitas.sintomas = '';
}

function eliminarCita(id) {
    // Eliminar la cita
    cita.eliminarCita(id);

    // Muestre el mensaje
    interfaz.imprimirAlerta('La cita se ha eliminado correctamente', 'correcto');

    interfaz.mostrarCitas(cita);
}

function editarCitas(citas) {
    const {id, mascota, propietario, telefono, fecha, hora, sintomas} = citas;

    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    objCitas.mascota = mascota;
    objCitas.propietario = propietario;
    objCitas.telefono = telefono;
    objCitas.fecha = fecha;
    objCitas.hora = hora;
    objCitas.sintomas = sintomas;
    objCitas.id = id;

    formulario.querySelector('button[type="submit"]').textContent = 'Guardar cambios';

    editando = true;
}