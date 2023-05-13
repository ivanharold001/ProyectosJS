// Constructores

// OBJETO SEGURO ------------------
function Seguro(marca, year, tipo) {
    this.marca = marca;
    this.year = year;
    this.tipo = tipo;
}

// Realiza la cotizacion con los datos
Seguro.prototype.cotizarSeguro = function () {
    /*
        opcion 1 = Americano 1.15
        opcion 2 = Americano 1.05
        opcion 3 = Americano 1.35
    */

    let cantidad;
    const base = 2000;

    switch (this.marca) {
        case "1":
            cantidad = base * 1.15;
            break;
        case "2":
            cantidad = base * 1.05;
            break;
        case "3":
            cantidad = base * 1.35;
            break;
        default:
            break;
    }

    // Leer el año
    const diferencia = new Date().getFullYear() - this.year;
    // Cada año la diferencia es menor el costo vaa reducice un 3%
    cantidad -= ((diferencia * 3) * cantidad) / 100;

    /*
        Si el seguro es basico se multiplica por un 30% mas
        Si el seguro es completp se multiplica por un 50% mas
    */
    if (this.tipo === 'basico') {
        cantidad *= 1.30;
    } else {
        cantidad *= 1.50;
    }

    return cantidad;
}

// OBJETO INTERFAZ DE USUARIO ------
function IntefazUsuario() { }

//Llenar las obciones de los años
IntefazUsuario.prototype.llenarOpciones = function () {
    const max = new Date().getFullYear();
    const min = max - 20;

    const selectYear = document.querySelector('#year');

    for (let i = max; i > min; i--) {
        let opcion = document.createElement('option');
        opcion.value = i;
        opcion.textContent = i;
        selectYear.appendChild(opcion);
    }
}

//Alerta
IntefazUsuario.prototype.MostrarAlerta = function (mensaje, tipo) {
    const div = document.createElement('DIV');

    if (tipo === 'error') {
        div.classList.add('error');
    } else {
        div.classList.add('correcto');
    }

    div.classList.add('mensaje', 'mt-10');
    div.textContent = mensaje;

    // insertar en le html
    const formulario = document.querySelector('#cotizar-seguro');
    if (formulario.children.length < 7) {
        formulario.insertBefore(div, document.querySelector('#resultado'));
        setTimeout(() => {
            div.remove();
        }, 3000);
    }
}

IntefazUsuario.prototype.mostrarResultado = function(total, seguro) {
    // crear el resultado
    const {marca, year, tipo} = seguro;
    let textoMarca;
    switch (marca) {
        case '1': textoMarca = 'Americano';
        break;
        case '2': textoMarca = 'Asiatico';
        break;
        case '3': textoMarca = 'Europeo';
        break;
        default:
            break;
    }
    const div = document.createElement('DIV');
    div.classList.add('mt-10');
    div.innerHTML = `
        <p class="header">Tu Resumen</p>
        <p class="font-bold">Total: <span class="font-normal">$ ${total}</span></p>
        <p class="font-bold">Marca: <span class="font-normal">${textoMarca}</span></p>
        <p class="font-bold">Año: <span class="font-normal">${year}</span></p>
        <p class="font-bold">Tipo seguro: <span class="font-normal capitalize">${tipo}</span></p>
    `;

    const resultado = document.querySelector('#resultado');
    

    // Mostrar spinner
    const spinner = document.querySelector('#cargando');
    spinner.style.display = 'block';

    setTimeout(() => {
        spinner.style.display = 'none';
        // console.log(resultado.children.length );
        if (resultado.children.length != 1) {
            resultado.appendChild(div);
        }
    }, 3000);
    
}

const interfaz = new IntefazUsuario();

document.addEventListener('DOMContentLoaded', () => {

    interfaz.llenarOpciones();
});

// Eventos
eventListeners();
function eventListeners() {
    const formulario = document.querySelector('#cotizar-seguro');
    formulario.addEventListener('submit', cotizarSeguro);
}

function cotizarSeguro(e) {
    e.preventDefault();

    // Leer la marca seleccionada
    const marca = document.querySelector('#marca').value;

    // Leer el ano
    const year = document.querySelector('#year').value;

    // Leer los radio buttons
    const tipo = document.querySelector('input[name="tipo"]:checked').value;

    if (marca === '' || year === '' || tipo === '') {
        interfaz.MostrarAlerta('Todos los campos son obligatorios', 'error');
        return;
    }

    interfaz.MostrarAlerta('Cotizando...', 'correcto');
    // Ocultar las cotizaciones previas
    const resultados = document.querySelector('#resultado DIV');

    if (resultados != null) {
        resultados.remove();
    }
    const seguro1 = new Seguro(marca, year, tipo);

    const total = seguro1.cotizarSeguro();

    interfaz.mostrarResultado(total, seguro1);
}