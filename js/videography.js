document.addEventListener('DOMContentLoaded', function() {

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(element => {
        observer.observe(element);
    });
    
    const galleryItems = document.querySelectorAll('.gallery-grid .gallery-item');
    galleryItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 120}ms`;
    });

    const lightbox = document.getElementById('lightbox');
    const lightboxVideo = document.getElementById('lightbox-video');
    const galleryItemElements = document.querySelectorAll('.gallery-item');
    const closeBtn = document.querySelector('.lightbox-close');

    galleryItemElements.forEach(item => {
        item.addEventListener('click', () => {
            const videoSrc = item.dataset.videoSrc;
            if (videoSrc) {
                lightboxVideo.src = videoSrc;
                lightbox.style.display = 'flex';
                lightboxVideo.play();
            }
        });
    });

    function closeLightbox() {
        lightbox.style.display = 'none';
        lightboxVideo.pause();
        lightboxVideo.src = '';
    }

    if(closeBtn) {
        closeBtn.addEventListener('click', closeLightbox);
    }
    
    if(lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

});