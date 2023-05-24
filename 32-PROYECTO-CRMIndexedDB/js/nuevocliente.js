import {insertarCliente} from './conexion.js';

const inputNombre = document.querySelector('#nombre');
const inputEmail = document.querySelector('#email');
const inputTelefono = document.querySelector('#telefono');
const inputEmpresa = document.querySelector('#empresa');

const formulario = document.querySelector('#formulario');

let DB;

const objDatos = {
    nombre: '',
    email: '',
    telefono: '',
    empresa: ''
}

class Interfaz {
    mostrarAlerta(mensaje, tipo) {
        const alerta = document.createElement('P');
        if (tipo === 'error') {
            alerta.classList.add('text-center', 'mr-10', 'ml-10', 'mt-5', 'p-3', 'bg-red-200', 'text-red-700');
        }

        alerta.textContent = mensaje;

        if (formulario.children.length <= 5) {
            formulario.appendChild(alerta);
        }

        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}

const interfaz = new Interfaz();

eventListener();

function eventListener() {
    inputNombre.addEventListener('input', validarInput);
    inputEmail.addEventListener('input', validarInput);
    inputTelefono.addEventListener('input', validarInput);
    inputEmpresa.addEventListener('input', validarInput);
}

function validarInput(e) {
    objDatos[e.target.name] = e.target.value;

    console.log(objDatos);
}

formulario.addEventListener('submit', (e) => {
    e.preventDefault();
    if (Object.values(objDatos).includes('')) {

        interfaz.mostrarAlerta('Todos los campos son obligatorios', 'error');
        return;
    }

    insertarCliente({ ...objDatos });

    resetearObjeto();

    // limpiarCampos();

    window.location.href = '/32-PROYECTO-CRMIndexedDB/index.html';
});

function resetearObjeto() {
    inputNombre.value = '';
    inputEmail.value = '';
    inputTelefono.value = '';
    inputEmpresa.value = '';

    objDatos.nombre = '';
    objDatos.email = '';
    objDatos.telefono = '';
    objDatos.empresa = '';
}