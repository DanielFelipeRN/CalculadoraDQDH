const API_URL = 'https://script.google.com/macros/s/AKfycby80_WmJnsA4hsPa3jWsGFoAjehhFEa9LBkPsGBPyQrJ7AepYJZiQg5iIJ6Ts61jUGa/exec';

let datosApp = {};

async function cargarDatos() {
   
    try {
        const respuesta = await fetch(API_URL);
        datosApp = await respuesta.json();

        const select = document.getElementById('producto');
        datosApp.productos.forEach(prod => {
            let opcion = document.createElement('option'); 
            opcion.value = prod.costo;
            opcion.text = prod.nombre;
            select.appendChild(opcion);
        });
    } catch (error) {
        console.error("Error al cargar datos", error);
    }
}

function calcular() {
    const selectProd = document.getElementById('producto');
    const costoInsumo = parseFloat(selectProd.value); 
    const cantidad = parseFloat(document.getElementById('cantidad').value);

    if (isNaN(costoInsumo) || isNaN(cantidad) || cantidad <= 0) {
        alert("Por favor, ingresa los datos establecidos y reales");
        return;
    }

    const gastosFijos = datosApp.parametros.reduce((total, p) => total + parseFloat(p.costo), 0);
    const costoTotalUnitario = costoInsumo + gastosFijos;
    const costoTotalProduccion = costoTotalUnitario * cantidad
    
    const margenDecimal = datosApp.margen / 100;
    const precioVentaSugerido = costoTotalUnitario * (1 + margenDecimal);
    const gananciaTotal = (precioVentaSugerido - costoTotalUnitario) * cantidad;
    const gananciaUnitario = precioVentaSugerido - costoTotalUnitario

    const resDiv = document.getElementById('resultado');
    resDiv.classList.remove('hidden');
    resDiv.innerHTML = `
        <div class="flex justify-between border-b pb-2"><span>Costo Unitario:</span> <span class="font-bold">$${costoTotalUnitario.toFixed(2)}</span></div>
        <div class="flex justify-between border-b pb-2"><span>Ganancia Total:</span> <span class="font-bold text-green-600">$${gananciaUnitario.toFixed(2)}</span></div>
        <div class="flex justify-between border-b pb-2"><span>Costo Total:</span> <span class="font-bold text-red-600">$${costoTotalProduccion.toFixed(2)}</span></div>
        <div class="flex justify-between border-b pb-2"><span>Ganancia Total:</span> <span class="font-bold text-green-600">$${gananciaTotal.toFixed(2)}</span></div>
        <div class="flex justify-between pt-2"><span>Precio Sugerido:</span> <span class="font-bold text-blue-600">$${precioVentaSugerido.toFixed(2)}</span></div>
    `;
}

cargarDatos();
