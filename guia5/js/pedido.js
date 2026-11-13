
let pedido = [];

const lista = document.getElementById('lista-pedido');
const totalTexto = document.getElementById('total');
const mensajeVacio = document.getElementById('pedido-vacio');
const aviso = document.getElementById('aviso');
const tituloPedido = document.getElementById('titulo-pedido');
const botonVaciar = document.getElementById('btn-vaciar');

const sugerencia = document.getElementById('sugerencia-mantequilla');
const botonMantequilla = document.getElementById('btn-mantequilla');

const notas = document.getElementById('notas');
const contador = document.getElementById('contador');
const errorNotas = document.getElementById('error-notas');

function soles(monto) {
    return 'S/ ' + monto.toFixed(2);
}

function calcularTotal() {
    let total = pedido.reduce((suma, item) => {
        return suma + item.precio * item.cantidad;
    }, 0);

    totalTexto.textContent = soles(total);
}

function anunciar(mensaje) {
    aviso.textContent = mensaje;
}

function tienePan() {
    return pedido.find(item =>
        item.nombre === 'Pan de yema' ||
        item.nombre === 'Pan francés' ||
        item.nombre === 'Chancay'
    );
}

function render() {
    lista.replaceChildren();

    pedido.forEach(item => {
        const fila = document.createElement('li');
        fila.className = 'item-pedido';

        const informacion = document.createElement('div');
        informacion.className = 'informacion-producto';

        const nombre = document.createElement('strong');
        nombre.className = 'nombre-producto';
        nombre.textContent = item.nombre;

        const detalle = document.createElement('span');
        detalle.className = 'detalle-producto';
        detalle.textContent = soles(item.precio) + ' por unidad';

        informacion.append(nombre);
        informacion.append(detalle);

        const controles = document.createElement('div');
        controles.className = 'controles';

        const botonMenos = document.createElement('button');
        botonMenos.type = 'button';
        botonMenos.textContent = '-';
        botonMenos.className = 'btn-cantidad';
        botonMenos.dataset.nombre = item.nombre;
        botonMenos.dataset.accion = 'menos';
        botonMenos.setAttribute('aria-label', 'Disminuir ' + item.nombre);

        const cantidad = document.createElement('span');
        cantidad.className = 'cantidad';
        cantidad.textContent = item.cantidad;

        const botonMas = document.createElement('button');
        botonMas.type = 'button';
        botonMas.textContent = '+';
        botonMas.className = 'btn-cantidad';
        botonMas.dataset.nombre = item.nombre;
        botonMas.dataset.accion = 'mas';
        botonMas.setAttribute('aria-label', 'Aumentar ' + item.nombre);

        controles.append(botonMenos);
        controles.append(cantidad);
        controles.append(botonMas);

        const subtotal = document.createElement('strong');
        subtotal.className = 'subtotal-producto';
        subtotal.textContent = soles(item.precio * item.cantidad);

        const botonQuitar = document.createElement('button');
        botonQuitar.type = 'button';
        botonQuitar.textContent = 'Eliminar';
        botonQuitar.className = 'btn-quitar';
        botonQuitar.dataset.nombre = item.nombre;

        fila.append(informacion);
        fila.append(controles);
        fila.append(subtotal);
        fila.append(botonQuitar);

        lista.append(fila);
    });

    if (pedido.length === 0) {
        mensajeVacio.style.display = 'block';
    } else {
        mensajeVacio.style.display = 'none';
    }

    botonVaciar.disabled = pedido.length === 0;

    calcularTotal();

    const hayPan = tienePan();
    const hayMantequilla = pedido.find(item =>
        item.nombre === 'Mantequilla'
    );

    if (hayPan && !hayMantequilla) {
        sugerencia.hidden = false;
    } else {
        sugerencia.hidden = true;
    }
}

function agregar(nombre, precio) {
    const posicion = pedido.findIndex(item =>
        item.nombre === nombre
    );

    if (posicion !== -1) {
        pedido[posicion].cantidad++;
    } else {
        pedido.push({
            nombre: nombre,
            precio: precio,
            cantidad: 1
        });
    }

    render();
    anunciar(nombre + ' agregado al pedido.');
}

function quitar(nombre) {
    const posicion = pedido.findIndex(item =>
        item.nombre === nombre
    );

    if (posicion !== -1) {
        pedido.splice(posicion, 1);
    }

    render();
    anunciar(nombre + ' eliminado del pedido.');
    tituloPedido.focus();
}

function cambiarCantidad(nombre, accion) {
    const producto = pedido.find(item =>
        item.nombre === nombre
    );

    if (producto) {
        if (accion === 'mas') {
            producto.cantidad++;
        }

        if (accion === 'menos') {
            producto.cantidad--;

            if (producto.cantidad === 0) {
                quitar(nombre);
                return;
            }
        }

        render();
        anunciar('Cantidad de ' + nombre + ' actualizada.');
    }
}

document.querySelector('.catalogo').addEventListener('click', evento => {
    const boton = evento.target.closest('.btn-anadir');

    if (boton) {
        const tarjeta = boton.closest('.producto');

        const nombre = tarjeta.dataset.nombre;
        const precio = Number(tarjeta.dataset.precio);

        agregar(nombre, precio);
    }
});

lista.addEventListener('click', evento => {
    const boton = evento.target.closest('button');

    if (boton) {
        const nombre = boton.dataset.nombre;
        const accion = boton.dataset.accion;

        if (accion === 'mas' || accion === 'menos') {
            cambiarCantidad(nombre, accion);
        } else {
            quitar(nombre);
        }
    }
});

botonMantequilla.addEventListener('click', () => {
    agregar('Mantequilla', 2.50);
});

notas.addEventListener('input', evento => {
    const texto = evento.target.value;

    contador.textContent = texto.length + ' / 200';

    if (texto.length > 0 && texto.trim() === '') {
        errorNotas.textContent = 'No escribas solamente espacios.';
    } else {
        errorNotas.textContent = '';
    }
});

notas.addEventListener('change', () => {
    notas.value = notas.value.trim();

    contador.textContent = notas.value.length + ' / 200';

    if (notas.value.length === 0) {
        errorNotas.textContent = '';
    }
});

render();
