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

// Carousel functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[n].classList.add('active');
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
}

// Change slide every 5 seconds
setInterval(nextSlide, 5000);

// Initialize first slide
showSlide(currentSlide);

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
    }, 2000); // Show after 2 seconds
});

// Close popup when clicking outside of it
window.addEventListener('click', (event) => {
    if (event.target === videoPopup) {
        videoPopup.style.display = 'none';
        spotVideo.pause();
    }
});