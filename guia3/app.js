
// ===== 1. Conexión =====

console.log('app.js conectado');


// ===== 2. Funciones de validación =====

function validarNombre(nombre) {
    const limpio = nombre.trim();

    if (limpio === '') {
        return 'Escribe tu nombre.';
    }

    if (limpio.length < 2) {
        return 'Tu nombre debe tener al menos 2 letras.';
    }

    return '';
}


function validarCelular(celular) {
    const limpio = celular.replace(/\s/g, '');

    if (limpio === '') {
        return 'Escribe tu número de celular.';
    }

    if (!/^9\d{8}$/.test(limpio)) {
        return 'El celular debe tener 9 dígitos y empezar con 9. Ejemplo: 987 654 321.';
    }

    return '';
}


function validarProducto(producto) {
    return producto === '' ? 'Elige un producto.' : '';
}


function validarCantidad(valor) {
    const cantidad = Number(valor);

    if (valor === '' || !Number.isInteger(cantidad) || cantidad < 1) {
        return 'La cantidad debe ser un número entero mayor que 0.';
    }

    if (cantidad > 100) {
        return 'Para más de 100 unidades, llámanos por teléfono.';
    }

    return '';
}


function obtenerFechaHoy() {
    const hoy = new Date();

    const anio = hoy.getFullYear();
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const dia = String(hoy.getDate()).padStart(2, '0');

    return anio + '-' + mes + '-' + dia;
}


function validarFecha(fecha) {
    if (fecha === '') {
        return 'Elige la fecha de recojo.';
    }

    if (fecha < obtenerFechaHoy()) {
        return 'No puedes elegir una fecha pasada.';
    }

    return '';
}


// ===== 3. Mostrar u ocultar errores =====

function mostrarError(id, mensaje) {
    const campo = document.getElementById(id);
    const error = document.getElementById('error-' + id);

    error.textContent = mensaje;

    if (mensaje) {
        campo.setAttribute('aria-invalid', 'true');
    } else {
        campo.removeAttribute('aria-invalid');
    }
}


// ===== 4. Preparar el formulario =====

const formulario = document.querySelector('form');
const estado = document.getElementById('estado');

const fecha = document.getElementById('fecha');
fecha.min = obtenerFechaHoy();

const indicaciones = document.getElementById('indicaciones');
const contador = document.getElementById('contador');


// ===== 5. Contador de caracteres =====

indicaciones.addEventListener('input', function () {
    const restantes = 200 - indicaciones.value.length;

    contador.textContent = 'Te quedan ' + restantes + ' caracteres.';
});


// ===== 6. Reglas de validación =====

const reglas = [
    ['nombre', validarNombre],
    ['celular', validarCelular],
    ['producto', validarProducto],
    ['cantidad', validarCantidad],
    ['fecha', validarFecha]
];


// ===== 7. Escuchar el envío del formulario =====

formulario.addEventListener('submit', function (evento) {

    evento.preventDefault();

    estado.textContent = '';

    let primerError = null;

    for (const [id, validar] of reglas) {

        const valor = document.getElementById(id).value;
        const mensaje = validar(valor);

        mostrarError(id, mensaje);

        if (mensaje && primerError === null) {
            primerError = id;
        }
    }

    const acepta = document.getElementById('consentimiento').checked;

    const avisoConsentimiento =
        'Necesitamos tu autorización para atender el pedido.';

    mostrarError(
        'consentimiento',
        acepta ? '' : avisoConsentimiento
    );

    if (!acepta && primerError === null) {
        primerError = 'consentimiento';
    }

    if (primerError !== null) {

        estado.textContent =
            'Revisa los campos marcados para continuar.';

        document.getElementById(primerError).focus();

        return;
    }


    // ===== 8. Calcular el total estimado =====

    const precios = {
        'Pan de yema': 0.50,
        'Pan francés': 0.30,
        'Chancay': 0.60,
        'Torta de chocolate': 45.00
    };

    const nombre = document.getElementById('nombre').value.trim();
    const producto = document.getElementById('producto').value;
    const cantidad = Number(document.getElementById('cantidad').value);
    const fechaPedido = document.getElementById('fecha').value;

    const total = precios[producto] * cantidad;

    estado.textContent =
        'Gracias, ' + nombre +
        '. Recibimos tu pedido de ' +
        cantidad + ' x ' + producto +
        ' para el ' + fechaPedido +
        '. Total estimado: S/ ' +
        total.toFixed(2) +
        '. Te confirmaremos por WhatsApp.';

    formulario.reset();

    fecha.min = obtenerFechaHoy();

    contador.textContent = 'Te quedan 200 caracteres.';

});
