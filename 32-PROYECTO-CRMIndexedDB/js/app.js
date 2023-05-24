import { clienteBD, mostrarDatos, eliminarCliente } from "./conexion.js";

const listaClientes = document.querySelector('#listado-clientes');

document.addEventListener('DOMContentLoaded', () => {
    clienteBD();

    mostrarDatos(listaClientes);

    listaClientes.onclick = (e) => {

        if (e.target.classList.contains('eliminar') && confirm("¿Estas seguro de eliminar el registro?")) {
            e.preventDefault();
            eliminarCliente(Number(e.target.dataset.cliente));
            mostrarDatos(listaClientes);
        }
    }
});
