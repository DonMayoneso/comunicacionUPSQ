/* INFINITO DIGITAL - LÓGICA PRO: CARRUSEL INFINITO & CONTROLES MODERNOS */

const API_URL = 'https://script.google.com/macros/s/AKfycbzmT5VvLykwYYAXXjuto4hdpabTwvjEUgFbilxezAp01Ywz-QDy-os9xy6blDMXcWgJ/exec'; 
const CACHE_KEY = 'infinito_data_v1';
const CACHE_TIME = 10 * 60 * 1000; // 10 minutos

// Estado global de la aplicación
let projectsData = []; 
let isNewestFirst = true; // Estado del toggle de ordenamiento

document.addEventListener('DOMContentLoaded', function() {
    initializeProjects();
    setupScrollTop();
});

async function initializeProjects() {
    const grid = document.getElementById('projectsGrid');
    const track = document.getElementById('featuredCarouselTrack'); // ID actualizado
    
    // Controles
    const filterBtns = document.querySelectorAll('.filter-btn');
    const sortBtn = document.getElementById('sortToggleBtn'); // ID actualizado
    const sortLabel = document.getElementById('sortLabel');
    const sortIcon = document.getElementById('sortIcon');

    // 1. OBTENCIÓN DE DATOS (Con Caché)
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedTimestamp = localStorage.getItem(CACHE_KEY + '_time');
    const now = new Date().getTime();

    if (cachedData && cachedTimestamp && (now - cachedTimestamp < CACHE_TIME)) {
        console.log("Infinito Digital: Usando datos en caché");
        projectsData = JSON.parse(cachedData);
        processData();
    } else {
        console.log("Infinito Digital: Sincronizando con Google Sheets...");
        
        // Loader visual minimalista en el grid
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px;"><i class="fas fa-circle-notch fa-spin fa-2x" style="color:var(--indi-purple);"></i></div>';
        
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            
            projectsData = data;
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
            localStorage.setItem(CACHE_KEY + '_time', now);
            
            processData();
        } catch (error) {
            console.error('Error crítico:', error);
            grid.innerHTML = '<p style="text-align:center; width:100%; grid-column: 1/-1;">Error de conexión con la base de datos.</p>';
        }
    }

    // FUNCIÓN CENTRAL DE PROCESAMIENTO
    function processData() {
        // 1. Renderizar Carrusel Infinito
        // Tomamos los últimos 6 proyectos para destacados
        const latestProjects = [...projectsData].reverse().slice(0, 6);
        renderInfiniteCarousel(latestProjects);

        // 2. Renderizar Grid Inicial
        applyFiltersAndSort();
    }

    // --- RENDERIZADO DEL CARRUSEL INFINITO ---
    function renderInfiniteCarousel(projects) {
        if (!projects || projects.length === 0 || !track) return;

        // Función helper para crear el HTML de una tarjeta
        const createCardHTML = (project) => `
            <div class="carousel-card" onclick="window.location.href='infinito_art.html?id=${project.id}'">
                <img src="${project.imagen || '../assets/upscomunicacionlogo.png'}" 
                     alt="${project.titulo}" 
                     onerror="this.src='../assets/upscomunicacionlogo.png'">
                <div class="card-overlay">
                    <h3>${project.titulo}</h3>
                </div>
            </div>
        `;

        // Limpiamos el track
        track.innerHTML = '';

        // ESTRATEGIA INFINITA:
        // Inyectamos el set de tarjetas DOS VECES.
        // CSS animará el track hasta el 50% y luego saltará al 0% instantáneamente,
        // creando la ilusión de un bucle perfecto.
        
        // Set 1 (Original)
        const cardsHTML = projects.map(p => createCardHTML(p)).join('');
        
        // Inyectamos Set 1 + Set 2 (Duplicado)
        track.innerHTML = cardsHTML + cardsHTML;
    }

    // --- LÓGICA DE FILTRADO ---
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Gestión visual de la clase activa
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Aplicar lógica
            applyFiltersAndSort();
        });
    });

    // --- LÓGICA DE ORDENAMIENTO (TOGGLE) ---
    if(sortBtn) {
        sortBtn.addEventListener('click', () => {
            // 1. Invertir estado
            isNewestFirst = !isNewestFirst;

            // 2. Actualizar UI del botón
            if (isNewestFirst) {
                sortLabel.textContent = "Más Nuevos";
                sortIcon.className = "fas fa-sort-amount-down"; // Icono descendente
            } else {
                sortLabel.textContent = "Más Antiguos";
                sortIcon.className = "fas fa-sort-amount-up"; // Icono ascendente
            }

            // 3. Reordenar Grid
            applyFiltersAndSort();
        });
    }

    // --- MOTOR DE ACTUALIZACIÓN DEL GRID ---
    function applyFiltersAndSort() {
        const activeBtn = document.querySelector('.filter-btn.active');
        const filterValue = activeBtn ? activeBtn.getAttribute('data-filter').toLowerCase().trim() : 'all';

        // 1. Filtrado
        let filtered = [];
        if (filterValue === 'all') {
            filtered = [...projectsData];
        } else {
            filtered = projectsData.filter(p => {
                if (!p.categoria) return false;
                const cats = p.categoria.toLowerCase().split(',').map(c => c.trim());
                return cats.includes(filterValue);
            });
        }

        // 2. Ordenamiento
        // Asumiendo que Google Sheets envía los datos cronológicamente (antiguos arriba, nuevos abajo)
        if (isNewestFirst) {
            filtered.reverse(); // Invertimos para ver los nuevos primero
        } 
        // Si es false (Más Antiguos), dejamos el array original

        // 3. Renderizado con pequeña animación
        grid.style.opacity = '0';
        grid.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            renderGrid(filtered);
            grid.style.opacity = '1';
            grid.style.transform = 'translateY(0)';
        }, 200);
    }

    // --- RENDERIZADO DE TARJETAS DEL GRID ---
    function renderGrid(projects) {
        if (!projects || projects.length === 0) {
            grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 40px; color:#666;">No se encontraron proyectos en esta categoría.</div>';
            return;
        }

        grid.innerHTML = projects.map(project => `
            <div class="project-card animate-up" onclick="window.location.href='infinito_art.html?id=${project.id}'">
                <div class="project-thumb">
                    <img src="${project.imagen || '../assets/upscomunicacionlogo.png'}" 
                         alt="${project.titulo}" 
                         onerror="this.src='../assets/upscomunicacionlogo.png'">
                    <div class="project-overlay">
                        <i class="fas fa-${project.youtube ? 'play-circle' : 'plus-circle'}"></i>
                    </div>
                </div>
                <div class="project-info">
                    <div class="project-category">${project.categoria ? project.categoria.split(',')[0] : 'General'}</div>
                    <h3 class="project-title">${project.titulo}</h3>
                    <div class="project-author">
                        <i class="fas fa-user-circle"></i> ${project.autor || 'Redacción'}
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Botón "Volver Arriba"
function setupScrollTop() {
    const scrollBtn = document.getElementById('scrollTopBtn');
    if(!scrollBtn) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollBtn.classList.add('show');
            scrollBtn.style.opacity = '1';
            scrollBtn.style.pointerEvents = 'all';
        } else {
            scrollBtn.classList.remove('show');
            scrollBtn.style.opacity = '0';
            scrollBtn.style.pointerEvents = 'none';
        }
    });
    
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}