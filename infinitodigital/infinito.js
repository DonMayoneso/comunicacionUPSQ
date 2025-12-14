/* INFINITO DIGITAL - LÓGICA CON CACHÉ Y MULTICATEGORÍAS */

const API_URL = 'https://script.google.com/macros/s/AKfycbzmT5VvLykwYYAXXjuto4hdpabTwvjEUgFbilxezAp01Ywz-QDy-os9xy6blDMXcWgJ/exec'; 
const CACHE_KEY = 'infinito_data_v1';
const CACHE_TIME = 10 * 60 * 1000; // 10 minutos

let projectsData = []; 

document.addEventListener('DOMContentLoaded', function() {
    initializeProjects();
    setupScrollTop();
});

async function initializeProjects() {
    const grid = document.getElementById('projectsGrid');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // 1. SISTEMA DE CACHÉ
    const cachedData = localStorage.getItem(CACHE_KEY);
    const cachedTimestamp = localStorage.getItem(CACHE_KEY + '_time');
    const now = new Date().getTime();

    if (cachedData && cachedTimestamp && (now - cachedTimestamp < CACHE_TIME)) {
        console.log("Usando caché local");
        projectsData = JSON.parse(cachedData);
        renderProjects(projectsData);
    } else {
        console.log("Descargando de Google...");
        grid.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 50px;"><i class="fas fa-spinner fa-spin fa-2x" style="color:white;"></i></div>';
        
        try {
            const response = await fetch(API_URL);
            const data = await response.json();
            
            projectsData = data;
            localStorage.setItem(CACHE_KEY, JSON.stringify(data));
            localStorage.setItem(CACHE_KEY + '_time', now);
            
            renderProjects(projectsData);
        } catch (error) {
            console.error('Error:', error);
            grid.innerHTML = '<p style="text-align:center; color:white; grid-column: 1/-1;">Error de conexión.</p>';
        }
    }

    // 2. Lógica de Filtrado (AHORA SOPORTA MULTICATEGORÍAS)
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Estilos botones
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Valor del filtro (ej: "sonora")
            const filterValue = btn.getAttribute('data-filter').toLowerCase().trim();
            
            grid.style.opacity = '0';
            setTimeout(() => {
                if (filterValue === 'all') {
                    renderProjects(projectsData);
                } else {
                    // FILTRO INTELIGENTE:
                    // 1. Toma la celda "audiovisual, sonora"
                    // 2. La separa por comas -> ["audiovisual", "sonora"]
                    // 3. Revisa si el filtro está en esa lista
                    const filtered = projectsData.filter(p => {
                        if (!p.categoria) return false;
                        const cats = p.categoria.toLowerCase().split(',').map(c => c.trim());
                        return cats.includes(filterValue);
                    });
                    renderProjects(filtered);
                }
                grid.style.opacity = '1';
            }, 300);
        });
    });

    // 3. Renderizado
    function renderProjects(projects) {
        if (!projects || projects.length === 0) {
            grid.innerHTML = '<p style="text-align:center; width:100%; padding: 40px; color:#666; grid-column: 1/-1;">No hay proyectos en esta categoría.</p>';
            return;
        }

        grid.innerHTML = projects.map(project => `
            <div class="project-card animate-up" onclick="window.location.href='infinito_art.html?id=${project.id}'">
                <div class="project-thumb">
                    <img src="${project.imagen || '../assets/upscomunicacionlogo.png'}" alt="${project.titulo}" onerror="this.src='../assets/upscomunicacionlogo.png'">
                    <div class="project-overlay">
                        <i class="fas fa-${project.youtube ? 'play-circle' : 'plus-circle'}"></i>
                    </div>
                </div>
                <div class="project-info">
                    <div class="project-category">${project.categoria.replace(/,/g, ' • ')}</div>
                    <h3 class="project-title">${project.titulo}</h3>
                    <div class="project-author">
                        <i class="fas fa-user-circle"></i> ${project.autor}
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function setupScrollTop() {
    const scrollBtn = document.getElementById('scrollTopBtn');
    if(!scrollBtn) return;
    window.addEventListener('scroll', () => {
        scrollBtn.classList.toggle('show', window.pageYOffset > 300);
    });
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}