import { llenarInput } from './conexion.js';

const a = document.querySelector('#nombre');
const b = document.querySelector('#email');
const c = document.querySelector('#telefono');
const d = document.querySelector('#empresa');

const formulario = document.querySelector('#formulario');

document.addEventListener('DOMContentLoaded', () => {

    // Obtener un id de la url
    const parametroURL = new URLSearchParams(window.location.search);
    const idCliente = Number(parametroURL.get('id'));// 01

    llenarInput(idCliente, a, b, c, d, true)

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
    
        llenarInput(idCliente, a, b, c, d, false);
        window.location.href = '/32-PROYECTO-CRMIndexedDB/index.html';
    });
});

