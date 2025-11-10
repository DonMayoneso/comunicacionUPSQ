// Funcionalidades para páginas secundarias

// Carrusel para Sobre Nosotros
document.addEventListener('DOMContentLoaded', function() {
    initializeAboutCarousel();
    initializeTeachers();
});

// Carrusel de Sobre Nosotros
function initializeAboutCarousel() {
    const carouselContainer = document.querySelector('.carousel-container');
    if (!carouselContainer) return;
    
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    let currentSlide = 0;
    let carouselInterval;
    
    function showSlide(n) {
        // Ocultar todas las slides
        slides.forEach(slide => slide.classList.remove('active'));
        indicators.forEach(indicator => indicator.classList.remove('active'));
        
        // Mostrar slide actual
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        indicators[currentSlide].classList.add('active');
    }
    
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    // Inicializar primer slide
    showSlide(0);
    
    // Configurar intervalo automático
    carouselInterval = setInterval(nextSlide, 5000);
    
    // Event listeners para indicadores
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            clearInterval(carouselInterval);
            showSlide(index);
            carouselInterval = setInterval(nextSlide, 5000);
        });
    });
    
    // Pausar al interactuar
    carouselContainer.addEventListener('mouseenter', () => {
        clearInterval(carouselInterval);
    });
    
    carouselContainer.addEventListener('mouseleave', () => {
        carouselInterval = setInterval(nextSlide, 5000);
    });
}

// Funcionalidad para Docentes
function initializeTeachers() {
    const teachersGrid = document.getElementById('teachersGrid');
    if (!teachersGrid) return;
    
    const modal = document.getElementById('teacherModal');
    const modalBody = document.getElementById('modalBody');
    const closeModal = document.querySelector('.close-modal');
    
    // Cargar datos de docentes desde JSON
    fetch('js/docentes.json')
        .then(response => response.json())
        .then(docentes => {
            renderTeachers(docentes);
            setupTeacherModals(docentes);
        })
        .catch(error => {
            console.error('Error cargando datos de docentes:', error);
            teachersGrid.innerHTML = '<p>Error cargando la información de docentes.</p>';
        });
    
    function renderTeachers(docentes) {
        teachersGrid.innerHTML = docentes.map(docente => `
            <div class="teacher-card" data-teacher-id="${docente.id}">
                <div class="teacher-image">
                    <img src="${docente.foto}" alt="${docente.nombre}">
                </div>
                <div class="teacher-info">
                    <h3>${docente.nombre}</h3>
                    <div class="teacher-position">${docente.cargo}</div>
                    <div class="teacher-subjects">${docente.materias.slice(0, 2).join(', ')}${docente.materias.length > 2 ? '...' : ''}</div>
                </div>
            </div>
        `).join('');
    }
    
    function setupTeacherModals(docentes) {
        const teacherCards = document.querySelectorAll('.teacher-card');
        
        teacherCards.forEach(card => {
            card.addEventListener('click', function() {
                const teacherId = this.getAttribute('data-teacher-id');
                const docente = docentes.find(d => d.id == teacherId);
                
                if (docente) {
                    showTeacherModal(docente);
                }
            });
        });
        
        // Cerrar modal
        closeModal.addEventListener('click', closeTeacherModal);
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeTeacherModal();
            }
        });
        
        // Cerrar con tecla ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal.style.display === 'block') {
                closeTeacherModal();
            }
        });
    }
    
    function showTeacherModal(docente) {
        modalBody.innerHTML = `
            <div class="teacher-modal-header">
                <div class="teacher-modal-image">
                    <img src="${docente.foto}" alt="${docente.nombre}">
                </div>
                <div class="teacher-modal-basic-info">
                    <h2>${docente.nombre}</h2>
                    <div class="teacher-modal-position">${docente.cargo}</div>
                    <div class="teacher-modal-specialty"><strong>Especialidad:</strong> ${docente.especialidad}</div>
                    <div class="teacher-modal-contact">
                        <i class="fas fa-envelope"></i> ${docente.correo}
                    </div>
                </div>
            </div>
            
            <div class="teacher-modal-details">
                <h3>Materias que imparte</h3>
                <ul class="teacher-modal-subjects">
                    ${docente.materias.map(materia => `<li>${materia}</li>`).join('')}
                </ul>
                
                ${docente.cargo_administrativo ? `
                <h3>Cargo Administrativo</h3>
                <p>${docente.cargo_administrativo}</p>
                ` : ''}
                
                <h3>Información Adicional</h3>
                <p>${docente.descripcion}</p>
            </div>
        `;
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    function closeTeacherModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// Smooth scroll para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});