const API_URL = 'https://script.google.com/macros/s/AKfycby80_WmJnsA4hsPa3jWsGFoAjehhFEa9LBkPsGBPyQrJ7AepYJZiQg5iIJ6Ts61jUGa/exec';

let datosApp = {};
console.log("inicio")
async function cargarDatos() {
    console.log("Iniciando carga...")
    try {
        const respuesta = await fetch(API_URL);
        console.log("Respuesta recibida, procesando JSON..."); // Log 2
        datosApp = await respuesta.json();
        console.log("Datos procesados:", datosApp); // Log 3

        const select = document.getElementById('producto');
        datosApp.productos.forEach(prod => {
            let opcion = document.createElement('option'); // CORREGIDO: 'option'
            opcion.value = prod.costo;
            opcion.text = prod.nombre;
            select.appendChild(opcion);
        });
        console.log("Carga finalizada con éxito"); // Log 4
    } catch (error) {
        console.error("Error al cargar datos", error);
    }
}

function calcular() {
    // CORREGIDO: Cambié la coma por punto en document.getElementById
    const selectProd = document.getElementById('producto');
    const costoInsumo = parseFloat(selectProd.value); 
    const cantidad = parseFloat(document.getElementById('cantidad').value);

    // Validación básica: asegura que se seleccionó algo y hay cantidad
    if (isNaN(costoInsumo) || isNaN(cantidad)) {
        alert("Por favor selecciona un producto y pon una cantidad válida.");
        return;
    }

    const gastosFijos = datosApp.parametros.reduce((total, p) => total + p.costo, 0);
    const costoTotalUnitario = costoInsumo + gastosFijos;
    
    const margenDecimal = datosApp.margen / 100;
    const precioVentaSugerido = costoTotalUnitario * (1 + margenDecimal);
    const gananciaTotal = (precioVentaSugerido - costoTotalUnitario) * cantidad;

    const resDiv = document.getElementById('resultado');
    resDiv.classList.remove('hidden');
    resDiv.innerHTML = `
        <p><strong>Costo Unitario Total:</strong> $${costoTotalUnitario.toFixed(2)}</p>
        <p><strong>Precio Venta Sugerido:</strong> $${precioVentaSugerido.toFixed(2)}</p>
        <p><strong>Ganancia Estimada:</strong> $${gananciaTotal.toFixed(2)}</p>
    `;
}
console.log("Casi final")
cargarDatos();
console.log("Si es el final")