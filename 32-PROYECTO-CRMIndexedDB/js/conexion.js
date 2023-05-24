export function clienteBD() {
    //crear la conexion a la base de datos
    const respuesta = indexedDB.open('clienteBD', 1);

    respuesta.onerror = function (e) {
        console.log('Error al abrir la base de datos');
    }

    respuesta.onsuccess = function (e) {
        const db = e.target.result;
        console.log('Base de datos abierta correctamente');

    }

    respuesta.onupgradeneeded = function (e) {
        const db = e.target.result;

        // Crear o actualizar los almacenes de objetos (object stores)
        const store = db.createObjectStore('clienteBD', { keyPath: 'id', autoIncrement: true });

        // Puedes agregar índices a los almacenes de objetos si es necesario
        store.createIndex('nombre', 'nombre', { unique: false });
        store.createIndex('email', 'email', { unique: true });
        store.createIndex('telefono', 'telefono', { unique: false });
        store.createIndex('empresa', 'empresa', { unique: false });

        console.log("Estructura de la base de datos creada o actualizada");
    }
}

export function insertarCliente(objDatos) {
    const respuesta = indexedDB.open('clienteBD', 1);

    respuesta.onerror = function (e) {
        console.log("Error al abrir la base de datos");
    };

    respuesta.onsuccess = function (e) {
        const db = e.target.result;
        // Aquí puedes comenzar a trabajar con la base de datos

        const transaction = db.transaction(['clienteBD'], 'readwrite');
        const store = transaction.objectStore('clienteBD');

        const addRequest = store.add(objDatos);

        addRequest.onsuccess = function (event) {
            console.log("Datos insertados correctamente");
        };

        addRequest.onerror = function (event) {
            console.log("Error al insertar los datos");
        };
    };
}

export function mostrarDatos(divLista) {
    let objeto;

    const respuesta = indexedDB.open('clienteBD', 1);

    respuesta.onerror = function (event) {
        console.log("Error al abrir la base de datos");
        // arrayDatos = 'Error al abrir la base de datos';
    };

    respuesta.onsuccess = function (e) {
        const db = e.target.result;
        // Aquí puedes comenzar a trabajar con la base de datos

        const transaction = db.transaction(['clienteBD'], 'readonly');
        const store = transaction.objectStore('clienteBD');

        const getRequest = store.getAll(); // Obetener todo los datos

        getRequest.onsuccess = function (event) {
            const data = event.target.result;

            insertarHTML(divLista, data);
        };
    };
}

function insertarHTML(div, datos) {
    limpiarHTML(div);
    datos.forEach(dato => {
        const { nombre, email, telefono, empresa, id } = dato;
        const tr = document.createElement('TR');
        tr.innerHTML = `
        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
            <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
            <p class="text-sm leading-10 text-gray-700"> ${email} </p>
        </td>
        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
            <p class="text-gray-700">${telefono}</p>
        </td>
        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
            <p class="text-gray-600">${empresa}</p>
        </td>
        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
            <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
            <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
        </td>`;
        div.appendChild(tr);
    });
}

export function eliminarCliente(id) {
    const request = indexedDB.open('clienteBD', 1);

    request.onerror = function (event) {
        console.log("Error al abrir la base de datos");
    };

    request.onsuccess = function (event) {
        const db = event.target.result;

        const transaction = db.transaction(['clienteBD'], 'readwrite');
        const store = transaction.objectStore('clienteBD');

        const deleteRequest = store.delete(id);

        deleteRequest.onsuccess = function (event) {
            console.log("Elemento eliminado correctamente");
        };

        deleteRequest.onerror = function (event) {
            console.log("Error al eliminar el elemento");
        };
    };
}

function limpiarHTML(divLista) {
    while (divLista.firstChild) {
        divLista.removeChild(divLista.firstChild);
    }
}

export function llenarInput(id, nombre, email, telefono, empresa, valor) {
    const request = indexedDB.open('clienteBD', 1);

    request.onerror = function (event) {
        console.log("Error al abrir la base de datos");
    };

    request.onsuccess = function (event) {
        const db = event.target.result;

        const transaction = db.transaction(['clienteBD'], 'readwrite');
        const store = transaction.objectStore('clienteBD');
        const key = id; // Reemplaza 'clave_elemento' con la clave del elemento que deseas actualizar
        const getRequest = store.get(key);

        if (valor) {
            getRequest.onsuccess = function (event) {
                const data = event.target.result;
    
                nombre.value = data.nombre;
                email.value = data.email;
                telefono.value = data.telefono;
                empresa.value = data.empresa;
            };
        } else {
            getRequest.onsuccess = function (event) {
                const data = event.target.result;

                data.nombre = nombre.value;
                data.email = email.value;
                data.telefono = telefono.value;
                data.empresa = empresa.value;

                const updateRequest = store.put(data);
            };
        }
        

        getRequest.onerror = function (event) {
            console.log("Error al obtener el dato");
        };
    }
}