const API_URL = 'https://script.google.com/macros/s/AKfycby9BP62iHbN1nI-58_o0losI-QmBLqdkFehcMvk5psx2SVotJACHXEPaxHW_DqWPTH2/exec';

let datosApp = {};
let ultimoCalculo = {};

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

const META_MENSUAL = 250000;

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
    const margenDecimal = datosApp.margen / 100;
    const precioVentaSugerido = costoTotalUnitario * (1 + margenDecimal);
    const gananciaUnitario = precioVentaSugerido - costoTotalUnitario

    const costoTotalProduccion = costoTotalUnitario * cantidad
    const gananciaTotal = (precioVentaSugerido - costoTotalUnitario) * cantidad;

    ultimoCalculo = {
        producto: selectProd.options[selectProd.selectedIndex].text,
        cantidad: cantidad,
        total: (gananciaUnitario * cantidad).toFixed(0)
    };

    const resDiv = document.getElementById('resultado');
    resDiv.classList.remove('hidden');
    resDiv.innerHTML = `
        <div class="space-y-3">
            <div class="flex justify-between"><span>Costo Unitario:</span> <span class="font-medium">$${costoTotalUnitario.toFixed(2)}</span></div>
            <div class="flex justify-between"><span>Ganancia/Unidad:</span> <span class="font-medium text-green-600">$${gananciaUnitario.toFixed(2)}</span></div>
            <div class="flex justify-between"><span>Costo Total:</span> <span class="font-medium">$${costoTotalProduccion.toFixed(2)}</span></div>
            <div class="flex justify-between"><span>Ganancia Total:</span> <span class="font-medium text-green-600"">$${gananciaTotal.toFixed(2)}</span></div>
            <div class="flex justify-between"><span>Precio Sugerido:</span> <span class="font-medium">$${precioVentaSugerido.toFixed(2)}</span></div>
            <button onclick="guardarVenta()" class="w-full bg-green-600 text-white py-2 rounded">Guardar Venta Realizada</button>
            <button onclick="consultarMeta()" class="w-full bg-purple-600 text-white py-2 rounded">¿Cuánto me falta para los $250k?</button>
        </div>
    `;
}

async function guardarVenta() {
    await fetch(API_URL, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(ultimoCalculo)
    });
    alert("¡Venta guardada en el historial!")
}

function consultarMeta(){
    const vendidoActual = parseFloat(prompt("¿Cuánto dinero llevas acumulado en ganancias este mes?", "0"));
    if (isNaN(vendidoActual)) return;

    const faltante = META_MENSUAL - vendidoActual;
    
    // Actualizamos el Dashboard en pantalla
    const dash = document.getElementById('dashboard-meta');
    dash.classList.remove('hidden');
    document.getElementById('vendido-actual').innerText = `$${vendidoActual.toLocaleString()}`;
    document.getElementById('faltante-actual').innerText = `$${faltante > 0 ? faltante.toLocaleString() : "0"}`;

    // Calculamos faltante por producto
    const selectProd = document.getElementById('producto');
    const gananciaUnit = (parseFloat(selectProd.value) * (datosApp.margen / 100));
    const unidadesNecesarias = Math.ceil(faltante / gananciaUnit);

    if (faltante > 0) {
        alert(`Te faltan $${faltante.toLocaleString()}. Debes vender ${unidadesNecesarias} unidades de ${selectProd.options[selectProd.selectedIndex].text} para llegar.`);
    } else {
        alert("¡Meta cumplida! ¡Excelente trabajo!");
    }
}

cargarDatos();
