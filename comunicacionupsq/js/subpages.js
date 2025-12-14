// Funcionalidades para páginas secundarias

// Inicialización general
document.addEventListener('DOMContentLoaded', function() {
    initializeAboutCarousel();
    initializeTeachers();
    initializeStudents(); // AGREGO LA INICIALIZACIÓN DE ESTUDIANTES AQUÍ
});

// Carrusel de Sobre Nosotros
function initializeAboutCarousel() {
    const carouselContainer = document.querySelector('.carousel-container');
    if (!carouselContainer) return;
    
    const slides = document.querySelectorAll('.carousel-slide');
    const indicators = document.querySelectorAll('.indicator');
    
    if (slides.length === 0) return;

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
        
        // Usamos delegación de eventos
        teachersGrid.addEventListener('click', function(e) {
            const card = e.target.closest('.teacher-card');
            if (card) {
                const teacherId = card.getAttribute('data-teacher-id');
                const docente = docentes.find(d => d.id == teacherId);
                
                if (docente) {
                    showTeacherModal(docente);
                }
            }
        });
        
        // Cerrar modal con botón X
        if (closeModal) {
            closeModal.addEventListener('click', closeTeacherModal);
        }
        
        // Cerrar clickeando fuera
        if (modal) {
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    closeTeacherModal();
                }
            });
        }
        
        // Cerrar con tecla ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal && modal.style.display === 'block') {
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
                    
                    <div class="teacher-modal-contact" id="copyEmailBtn" title="Click para copiar">
                        <i class="fas fa-envelope"></i> <span>${docente.correo}</span>
                        <span class="copy-tooltip">¡Copiado!</span>
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
        
        // Lógica de copiado al portapapeles
        const copyBtn = document.getElementById('copyEmailBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', function() {
                navigator.clipboard.writeText(docente.correo).then(() => {
                    const tooltip = this.querySelector('.copy-tooltip');
                    tooltip.classList.add('show');
                    
                    // Ocultar después de 2 segundos
                    setTimeout(() => {
                        tooltip.classList.remove('show');
                    }, 2000);
                }).catch(err => {
                    console.error('Error al copiar: ', err);
                });
            });
        }
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
    
    function closeTeacherModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

/* =========================================
   FUNCIONALIDAD RUGECOM (ESTUDIANTES)
   ========================================= */

function initializeStudents() {
    const studentsGrid = document.getElementById('studentsGrid');
    if (!studentsGrid) return; // Si no estamos en la página de estudiantes, salimos
    
    // Reutilizamos el mismo modal o buscamos uno específico si creaste uno aparte
    // Según tu HTML anterior usaste ids específicos:
    const modal = document.getElementById('studentModal'); 
    const modalBody = document.getElementById('studentModalBody');
    // Buscamos el botón de cerrar DENTRO del modal específico
    const closeModal = modal ? modal.querySelector('.close-modal') : null;
    
    // Cargar datos desde JSON
    fetch('js/estudiantes.json')
        .then(response => response.json())
        .then(estudiantes => {
            renderStudents(estudiantes);
            setupStudentModals(estudiantes);
        })
        .catch(error => {
            console.error('Error cargando datos de estudiantes:', error);
            studentsGrid.innerHTML = '<p>Error cargando la información de RugeCom.</p>';
        });
    
    function renderStudents(estudiantes) {
        // Reutilizamos las clases CSS 'teacher-card' para mantener el diseño idéntico
        studentsGrid.innerHTML = estudiantes.map(est => `
            <div class="teacher-card" data-student-id="${est.id}">
                <div class="teacher-image">
                    <img src="${est.foto}" alt="${est.nombre}" onerror="this.src='../assets/user-placeholder.png'">
                </div>
                <div class="teacher-info">
                    <h3>${est.nombre}</h3>
                    <div class="teacher-position" style="color: #e67e22;">${est.cargo}</div>
                    <div class="teacher-subjects" style="font-weight: 500;">${est.semestre}</div>
                </div>
            </div>
        `).join('');
    }
    
    function setupStudentModals(estudiantes) {
        // Delegación de eventos para las tarjetas
        studentsGrid.addEventListener('click', function(e) {
            const card = e.target.closest('.teacher-card');
            if (card) {
                const studentId = card.getAttribute('data-student-id');
                const estudiante = estudiantes.find(e => e.id == studentId);
                
                if (estudiante) {
                    showStudentModal(estudiante);
                }
            }
        });
        
        // Cerrar modal
        if (closeModal) {
            closeModal.addEventListener('click', () => {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            });
        }
        
        // Cerrar clickeando fuera
        if (modal) {
            window.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.style.display = 'none';
                    document.body.style.overflow = 'auto';
                }
            });
        }

        // Cerrar con Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && modal && modal.style.display === 'block') {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    function showStudentModal(estudiante) {
        modalBody.innerHTML = `
            <div class="teacher-modal-header">
                <div class="teacher-modal-image">
                    <img src="${estudiante.foto}" alt="${estudiante.nombre}" onerror="this.src='../assets/user-placeholder.png'">
                </div>
                <div class="teacher-modal-basic-info">
                    <h2>${estudiante.nombre}</h2>
                    <div class="teacher-modal-position" style="color: #e67e22;">${estudiante.cargo}</div>
                    <div class="teacher-modal-specialty"><strong>Semestre actual:</strong> ${estudiante.semestre}</div>
                    
                    <div class="teacher-modal-contact" id="copyStudentEmailBtn" title="Click para copiar">
                        <i class="fas fa-envelope"></i> <span>${estudiante.correo}</span>
                        <span class="copy-tooltip">¡Copiado!</span>
                    </div>
                </div>
            </div>
            
            <div class="teacher-modal-details">
                <h3>Sobre mí</h3>
                <p>${estudiante.descripcion}</p>
            </div>
        `;
        
        // Lógica de copiado al portapapeles
        const copyBtn = document.getElementById('copyStudentEmailBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', function() {
                navigator.clipboard.writeText(estudiante.correo).then(() => {
                    const tooltip = this.querySelector('.copy-tooltip');
                    tooltip.classList.add('show');
                    setTimeout(() => tooltip.classList.remove('show'), 2000);
                }).catch(err => {
                    console.error('Error al copiar: ', err);
                });
            });
        }
        
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

// Smooth scroll para enlaces internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#' || href === '') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});