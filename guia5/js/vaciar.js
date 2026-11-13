// Confirmación para vaciar el pedido mediante Bootstrap

document.getElementById('confirmarVaciar').addEventListener('click', () => {

    pedido.length = 0;

    render();

    anunciar('Se vació el pedido. Total: S/ 0.00.');

    tituloPedido.focus();

});