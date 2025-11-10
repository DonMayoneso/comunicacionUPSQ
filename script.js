// Toggle mobile menu
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});

// Toggle dropdowns on mobile
document.querySelectorAll('.dropdown-toggle').forEach(item => {
    item.addEventListener('click', event => {
        if (window.innerWidth <= 768) {
            event.preventDefault();
            const dropdown = item.nextElementSibling;
            dropdown.classList.toggle('active');
            
            // Close other dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(otherDropdown => {
                if (otherDropdown !== dropdown) {
                    otherDropdown.classList.remove('active');
                }
            });
        }
    });
});

// Close menu when clicking outside on mobile
document.addEventListener('click', (event) => {
    if (window.innerWidth <= 768) {
        const isClickInsideNav = navMenu.contains(event.target) || hamburger.contains(event.target);
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            
            // Close all dropdowns
            document.querySelectorAll('.dropdown-menu').forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    }
});

// Header scroll effect
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Video Popup functionality
const videoPopup = document.getElementById('videoPopup');
const closePopup = document.getElementById('closePopup');
const spotVideo = document.getElementById('spotVideo');

// Close popup when clicking the X
closePopup.addEventListener('click', () => {
    videoPopup.style.display = 'none';
    spotVideo.pause();
});

// Show popup after a short delay when page loads
window.addEventListener('load', () => {
    setTimeout(() => {
        videoPopup.style.display = 'block';
        spotVideo.play();
    }, 2000);
});

// Close popup when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target === videoPopup) {
        videoPopup.style.display = 'none';
        spotVideo.pause();
    }
});

// CARRUSEL MEJORADO - Maneja múltiples carruseles
let carouselIntervals = {};

function initializeCarousel(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const carousel = section.querySelector('.hero-carousel');
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
    // Detener intervalo anterior si existe
    if (carouselIntervals[sectionId]) {
        clearInterval(carouselIntervals[sectionId]);
    }
    
    function showSlide(n) {
        slides.forEach(slide => slide.classList.remove('active'));
        currentSlide = (n + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
    }
    
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    // Inicializar primer slide
    showSlide(0);
    
    // Configurar intervalo
    carouselIntervals[sectionId] = setInterval(nextSlide, 5000);
    
    return carouselIntervals[sectionId];
}

// CONTENIDO DINÁMICO - Cambio entre secciones
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.career-button');
    const contentSections = document.querySelectorAll('.content-section');
    
    // Función para cambiar de sección
    function switchContent(targetId) {
        // Remover clase active de todos los botones y secciones
        buttons.forEach(btn => btn.classList.remove('active'));
        contentSections.forEach(section => section.classList.remove('active'));
        
        // Agregar clase active al botón clickeado y a la sección objetivo
        document.querySelector(`[data-target="${targetId}"]`).classList.add('active');
        document.getElementById(targetId).classList.add('active');
        
        // Reinicializar carrusel para la nueva sección
        initializeCarousel(targetId);
    }
    
    // Event listeners para los botones
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            switchContent(targetId);
        });
    });
    
    // Inicializar con Comunicación activa
    switchContent('comunicacion-content');
});