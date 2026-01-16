/** Lógica del Formulario */

document.addEventListener('DOMContentLoaded', () => {
    
    // Configuración del servicio
    const CONFIG = {
        ACCESS_KEY: "d18a8bb9-19b1-4f98-b8dd-91d5db4ddd16",
        API_URL: "https://api.web3forms.com/submit"
    };

    // Selección de elementos
    const form = document.getElementById('infoForm');
    const inputs = form.querySelectorAll('input');
    const submitBtn = form.querySelector('.submit-btn');
    const feedback = document.getElementById('formFeedback');
    
    // Elementos del Popup
    const successPopup = document.getElementById('successPopup');
    const closeSuccessX = document.getElementById('closeSuccessX');
    const closeSuccessBtn = document.getElementById('closeSuccessBtn');

    // Patrones de validación
    const patterns = {
        nombre: /^[a-zA-ZÁ-ÿ\s]{5,40}$/,
        telefono: /^09\d{8}$/,
        email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
    };

    // Función de validación por campo
    const validateField = (field) => {
        const group = field.closest('.input-group');
        let isValid = true;

        if (field.name === 'telefono') {
            const cleanValue = field.value.replace(/\D/g, '');
            if (!patterns.telefono.test(cleanValue)) isValid = false;
        } else if (patterns[field.name]) {
            if (!patterns[field.name].test(field.value.trim())) isValid = false;
        } else {
            if (field.value.trim() === '') isValid = false;
        }

        if (!isValid) {
            group.classList.add('error');
        } else {
            group.classList.remove('error');
        }
        return isValid;
    };

    // Listeners para validación en tiempo real
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            const group = input.closest('.input-group');
            if (group.classList.contains('error')) validateField(input);
            if (input.name === 'telefono') input.value = input.value.replace(/\D/g, '');
        });
    });

    // Envío del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validar antes de enviar
        let isFormValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) isFormValid = false;
        });

        if (!isFormValid) {
            feedback.textContent = "Por favor, corrige los campos marcados.";
            feedback.className = "form-feedback error";
            return;
        }

        // Preparar UI
        feedback.textContent = "";
        const originalBtnContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        // Datos del formulario
        const formData = new FormData(form);
        formData.append("access_key", CONFIG.ACCESS_KEY);

        try {
            // Petición a Web3Forms
            const response = await fetch(CONFIG.API_URL, {
                method: "POST",
                body: formData
            });

            const data = await response.json();

            if (response.ok) {
                handleSuccess();
            } else {
                console.error("Web3Forms Error:", data);
                handleError(data.message || "Error al enviar el formulario.");
            }

        } catch (error) {
            console.error("Network Error:", error);
            handleError("Hubo un problema de conexión. Intenta nuevamente.");
        } finally {
            submitBtn.innerHTML = originalBtnContent;
            submitBtn.disabled = false;
        }
    });

    // Manejo de éxito
    function handleSuccess() {
        form.reset();
        document.querySelectorAll('.input-group').forEach(g => g.classList.remove('error', 'valid'));
        showPopup();
    }

    // Manejo de errores
    function handleError(msg) {
        feedback.textContent = msg;
        feedback.className = "form-feedback error";
    }

    // Funciones del Popup
    function showPopup() {
        successPopup.style.display = 'flex';
        setTimeout(() => successPopup.classList.add('show'), 10);
    }

    function hidePopup() {
        successPopup.classList.remove('show');
        setTimeout(() => successPopup.style.display = 'none', 300);
    }

    // Listeners para cerrar Popup
    if (closeSuccessX) closeSuccessX.addEventListener('click', hidePopup);
    if (closeSuccessBtn) closeSuccessBtn.addEventListener('click', hidePopup);
    window.addEventListener('click', (e) => {
        if (e.target === successPopup) hidePopup();
    });
});