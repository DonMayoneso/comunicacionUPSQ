document.addEventListener('DOMContentLoaded', function() {
    
    // 1. LEER PARÁMETRO URL (Ej: titulacion.html?tab=producto)
    const params = new URLSearchParams(window.location.search);
    const activeTab = params.get('tab');

    // 2. FUNCIÓN PARA CAMBIAR PESTAÑA
    function switchTab(tabId) {
        // Quitar clase active de todos
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));

        // Seleccionar elementos destino
        const targetBtn = document.querySelector(`.tab-btn[data-target="${tabId}"]`);
        const targetContent = document.getElementById(tabId);

        // Activar si existen, sino activar General por defecto
        if (targetBtn && targetContent) {
            targetBtn.classList.add('active');
            targetContent.classList.add('active');
            
            // Scroll suave hacia el contenido en móvil
            if (window.innerWidth < 768) {
                targetContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        } else {
            // Default: General
            document.querySelector('.tab-btn[data-target="general"]').classList.add('active');
            document.getElementById('general').classList.add('active');
        }
    }

    // 3. INICIALIZAR
    if (activeTab) {
        switchTab(activeTab);
    }

    // 4. EVENT LISTENER PARA BOTONES
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            switchTab(target);
            
            // Actualizar URL sin recargar (opcional, para compartir links)
            const newUrl = new URL(window.location);
            newUrl.searchParams.set('tab', target);
            window.history.pushState({}, '', newUrl);
        });
    });

    // 5. MANEJO DE LINKS DEL NAVBAR DENTRO DE LA MISMA PÁGINA
    // Si el usuario ya está en titulacion.html y hace clic en el navbar, 
    // necesitamos interceptar ese clic para no recargar.
    const navLinks = document.querySelectorAll('.dropdown-item');
    navLinks.forEach(link => {
        if(link.href.includes('titulacion.html?tab=')) {
            link.addEventListener('click', (e) => {
                // Solo si ya estamos en la página de titulación
                if(window.location.pathname.includes('titulacion.html')) {
                    e.preventDefault();
                    const tabParam = link.href.split('tab=')[1];
                    switchTab(tabParam);
                    
                    // Cerrar menú móvil si está abierto
                    const navMenu = document.querySelector('.nav-menu');
                    if(navMenu) navMenu.classList.remove('active');
                }
            });
        }
    });
});