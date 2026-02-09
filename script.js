// Elementos del DOM
const totalAmountInput = document.getElementById('totalAmount');
const clearBtn = document.getElementById('clearBtn');
const resultsSection = document.getElementById('resultsSection');

// Elementos de resultados
const subtotalEl = document.getElementById('subtotal');
const ivaEl = document.getElementById('iva');
const retencionFuenteEl = document.getElementById('retencionFuente');
const retencionIVAEl = document.getElementById('retencionIVA');
const totalRetencionesEl = document.getElementById('totalRetenciones');
const montoNetoEl = document.getElementById('montoNeto');

// Constantes de cálculo
const IVA_RATE = 0.15;
const RETENCION_FUENTE_RATE = 0.0175;
const RETENCION_IVA_RATE = 0.30;

// Función para formatear números como moneda
function formatCurrency(value) {
    return '$' + value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Función para validar input (solo números y un punto decimal)
function validateInput(value) {
    // Remover todo excepto números y punto decimal
    let cleaned = value.replace(/[^\d.]/g, '');

    // Asegurar solo un punto decimal
    const parts = cleaned.split('.');
    if (parts.length > 2) {
        cleaned = parts[0] + '.' + parts.slice(1).join('');
    }

    return cleaned;
}

// Función principal de cálculo
function calculate(total) {
    if (!total || total <= 0) {
        hideResults();
        return;
    }

    // 1. Subtotal (base imponible sin IVA): Total / 1.15
    const subtotal = total / (1 + IVA_RATE);

    // 2. IVA: Total - Subtotal
    const iva = total - subtotal;

    // 3. Retención en la fuente: Subtotal × 1.75%
    const retencionFuente = subtotal * RETENCION_FUENTE_RATE;

    // 4. Retención de IVA: IVA × 30%
    const retencionIVA = iva * RETENCION_IVA_RATE;

    // 5. Total de retenciones
    const totalRetenciones = retencionFuente + retencionIVA;

    // 6. Monto neto a pagar: Total - Total retenciones
    const montoNeto = total - totalRetenciones;

    // Actualizar UI
    updateResults({
        subtotal,
        iva,
        retencionFuente,
        retencionIVA,
        totalRetenciones,
        montoNeto
    });
}

// Función para actualizar los resultados en la UI
function updateResults(results) {
    subtotalEl.textContent = formatCurrency(results.subtotal);
    ivaEl.textContent = formatCurrency(results.iva);
    retencionFuenteEl.textContent = formatCurrency(results.retencionFuente);
    retencionIVAEl.textContent = formatCurrency(results.retencionIVA);
    totalRetencionesEl.textContent = formatCurrency(results.totalRetenciones);
    montoNetoEl.textContent = formatCurrency(results.montoNeto);

    // Mostrar sección de resultados con animación
    if (resultsSection.classList.contains('hidden')) {
        resultsSection.classList.remove('hidden');
        resultsSection.classList.add('animate-fade-in');
    }
}

// Función para ocultar resultados
function hideResults() {
    resultsSection.classList.add('hidden');
}

// Event listener para el input
totalAmountInput.addEventListener('input', function (e) {
    // Validar y limpiar input
    const validatedValue = validateInput(e.target.value);
    e.target.value = validatedValue;

    // Calcular si hay un valor válido
    const total = parseFloat(validatedValue);
    calculate(total);
});

// Event listener para el botón de limpiar
clearBtn.addEventListener('click', function () {
    totalAmountInput.value = '';
    hideResults();
    totalAmountInput.focus();
});

// Prevenir entrada de caracteres no numéricos
totalAmountInput.addEventListener('keypress', function (e) {
    const char = String.fromCharCode(e.which);
    if (!/[\d.]/.test(char)) {
        e.preventDefault();
    }
});

// Focus automático al cargar la página
window.addEventListener('load', function () {
    totalAmountInput.focus();
});
