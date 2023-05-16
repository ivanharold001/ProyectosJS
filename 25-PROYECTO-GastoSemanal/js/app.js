// Varibles
const formulario = document.querySelector('#agregar-gasto');
const ulGastos = document.querySelector('#gastos ul');
const restante = document.querySelector('#restante');
let arrayGastos = [];

class Gastos {
    constructor(gasto, cantidad, presupuesto, id) {
        this.id = id;
        this.gasto = gasto;
        this.cantidad = cantidad;
        this.presupuesto = presupuesto;
    }

    sumarCantidad() {
        const suma = arrayGastos.reduce((total, gastos) => total + Number(gastos.cantidad), 0);
        return suma;
    }

    calcularRestante() {
        return this.presupuesto = this.presupuesto - this.sumarCantidad();
    }

    restanteActualizar(resto) {
        return this.presupuesto = this.presupuesto + resto;
    }

    getPresupuesto() {
        return this.presupuesto;
    }
}

class Interfaz {
    mostrarMensaje(mensaje, tipo) {
        const alerta = document.createElement('P');
        if (tipo === 'error') {
            alerta.classList.add('alert', 'alert-danger', 'text-center', 'font-weight-bold');
        }

        if (tipo === 'correcto') {
            alerta.classList.add('alert', 'alert-success', 'text-center', 'font-weight-bold');
        }

        if (tipo === 'agotado') {
            alerta.classList.add('alert', 'alert-info', 'text-center', 'font-weight-bold');
        }

        alerta.textContent = mensaje;

        if (formulario.parentElement.children.length < 3) {
            formulario.parentElement.insertBefore(alerta, formulario);
        }

        setTimeout(() => {
            alerta.remove();
        }, 3000);
        
    }

    mostrarGastos() {
        // const divGastos = document.querySelector('#gastos');
        this.limpiarHTML();
        arrayGastos.forEach( gastos => {
            const {gasto, cantidad, id} = gastos;
            const li = document.createElement('LI');
            const btnEliminar = document.createElement('BUTTON');
            const span = document.createElement('SPAN');
            li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
            li.innerHTML = `${gasto}`;
            
            span.classList.add('badge', 'badge-pill', 'badge-primary');
            span.textContent = `$ ${cantidad}`;
            btnEliminar.classList.add('btn', 'btn-danger');
            // btnEliminar.setAttribute('data-id', id);
            btnEliminar.id = id;
            btnEliminar.textContent = 'Eliminar';

            li.appendChild(span);
            li.appendChild(btnEliminar);

            ulGastos.appendChild(li);
            this.mostrarMensaje('Gasto agregado correctamente', 'correcto');

            // btnEliminar.onclick = () => {
            //     this.eliminarGasto(id);
            // }
        });
    }

    agregarGasto(objGasto) {
        arrayGastos = [...arrayGastos, objGasto];
        this.mostrarGastos();
        restante.textContent = `${objGasto.calcularRestante()}`;
    }

    // eliminarGasto(id) {

    //     arrayGastos = arrayGastos.filter( gastos => gastos.id !== id);
    //     this.mostrarGastos();
    // }

    eliminarGasto(objGasto) {
        ulGastos.onclick = (e) => {
            e.preventDefault();
            if (e.target.classList.contains('btn')) {
                const resto = e.target.parentElement.children[0].textContent.substring(2).trim();
                arrayGastos = arrayGastos.filter( gastos => gastos.id !== Number(e.target.id));
                restante.textContent = `${objGasto.restanteActualizar(Number(resto))}`;
                this.mostrarGastos();
                this.actualizarRestante(objGasto);
            }
        }
    }

    limpiarHTML() {
        while (ulGastos.firstChild) {
            ulGastos.removeChild(ulGastos.firstChild);
        }
    }

    actualizarRestante(objGasto) {
        if (objGasto.getPresupuesto() <= 0) {
            formulario.children[2].disabled = true;
        } else {
            formulario.children[2].disabled = false;
        }
    }
}

const interfaz = new Interfaz();

// Eventos
document.addEventListener('DOMContentLoaded', () => {
    const presupuesto = Number(prompt('¿Cual es tu presupuesto?'));
    console.log(presupuesto);
    if (presupuesto === '' || isNaN(presupuesto) || presupuesto <= 0) {
        location.reload();
    }

    document.querySelector('#total').textContent = `${presupuesto}`;
    document.querySelector('#restante').textContent = `${presupuesto}`;
    

    formulario.addEventListener('submit', (e) => {
        e.preventDefault();

        const gasto = document.querySelector('#gasto').value.trim();
        const cantidad = document.querySelector('#cantidad').value.trim();
        if (gasto === '' || cantidad === '') {
            interfaz.mostrarMensaje('Campos vacios', 'error');
            return;
        }
        
        const objGasto = new Gastos(gasto, cantidad, presupuesto, Date.now());

        this.gasto.value = '';
        this.cantidad.value = '';

        interfaz.agregarGasto(objGasto);

        interfaz.eliminarGasto(objGasto);

        interfaz.actualizarRestante(objGasto);
        // interfaz.actualizarGasto();
    });
});

// Funciones