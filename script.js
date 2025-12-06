// Toggle mobile menu
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Toggle dropdowns on mobile
document.querySelectorAll('.dropdown-toggle').forEach(item => {
    item.addEventListener('click', event => {
        if (window.innerWidth <= 768) {
            event.preventDefault();
            const dropdown = item.nextElementSibling;
            
            // Si el dropdown existe
            if (dropdown) {
                dropdown.classList.toggle('active');
                
                // Close other dropdowns
                document.querySelectorAll('.dropdown-menu').forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        otherDropdown.classList.remove('active');
                    }
                });
            }
        }
    });
});

// Close menu when clicking outside on mobile
document.addEventListener('click', (event) => {
    if (window.innerWidth <= 768 && navMenu) {
        const isClickInsideNav = navMenu.contains(event.target) || (hamburger && hamburger.contains(event.target));
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
const header = document.querySelector('header');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/*
   VIDEO POPUP (SOLO HOME)
   Se ejecuta solo si existe el popup
 */
const videoPopup = document.getElementById('videoPopup');

if (videoPopup) {
    const closePopup = document.getElementById('closePopup');
    const spotVideo = document.getElementById('spotVideo');

    // Close popup
    if (closePopup) {
        closePopup.addEventListener('click', () => {
            videoPopup.style.display = 'none';
            if (spotVideo) spotVideo.pause();
        });
    }

    // Show popup after delay
    window.addEventListener('load', () => {
        setTimeout(() => {
            videoPopup.style.display = 'block';
            if (spotVideo) spotVideo.play();
        }, 2000);
    });

    // Close popup when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target === videoPopup) {
            videoPopup.style.display = 'none';
            if (spotVideo) spotVideo.pause();
        }
    });
}

/* CARRUSEL Y TABS */
let carouselIntervals = {};

function initializeCarousel(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    
    const carousel = section.querySelector('.hero-carousel');
    if (!carousel) return;
    
    const slides = carousel.querySelectorAll('.carousel-slide');
    if (slides.length === 0) return;
    
    let currentSlide = 0;
    
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
    
    showSlide(0);
    carouselIntervals[sectionId] = setInterval(nextSlide, 5000);
    return carouselIntervals[sectionId];
}

// Inicialización de Tabs
const careerButtons = document.querySelectorAll('.career-button');
if (careerButtons.length > 0) {
    const contentSections = document.querySelectorAll('.content-section');
    
    function switchContent(targetId) {
        careerButtons.forEach(btn => btn.classList.remove('active'));
        contentSections.forEach(section => section.classList.remove('active'));
        
        const targetBtn = document.querySelector(`[data-target="${targetId}"]`);
        const targetSection = document.getElementById(targetId);
        
        if (targetBtn) targetBtn.classList.add('active');
        if (targetSection) {
            targetSection.classList.add('active');
            initializeCarousel(targetId);
        }
    }
    
    careerButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetId = this.getAttribute('data-target');
            switchContent(targetId);
        });
    });
    
    // Inicializar por defecto si estamos en el Home
    if (document.getElementById('comunicacion-content')) {
        switchContent('comunicacion-content');
    }
}

/*
   BOTÓN SCROLL TO TOP */
const scrollTopBtn = document.getElementById("scrollTopBtn");

if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
        if (document.body.scrollTop > 300 || document.documentElement.scrollTop > 300) {
            scrollTopBtn.classList.add("show");
        } else {
            scrollTopBtn.classList.remove("show");
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}