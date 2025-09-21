document.addEventListener('DOMContentLoaded', function() {

    const animatedElements = document.querySelectorAll('.animate-on-scroll, .animate-on-load');
    const lightbox = document.getElementById('lightbox');
    const lightboxContainer = document.getElementById('lightbox-container');
    const lightboxClose = document.getElementById('lightbox-close');
    const videoItems = document.querySelectorAll('.video-gallery .gallery-item');
    const comparisonSliders = document.querySelectorAll('.comparison-slider');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = parseFloat(entry.target.style.getPropertyValue('--animation-delay') || '0') * 1000;
                setTimeout(() => {
                    entry.target.classList.add('is-visible');
                }, delay);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    animatedElements.forEach(el => {
        if (!el.classList.contains('animate-on-load')) {
            observer.observe(el);
        }
    });
    
    function initComparisonSlider(slider) {
        const after = slider.querySelector('.comparison-after');
        const handle = slider.querySelector('.comparison-handle');
        let isDragging = false;

        function move(e) {
            if (!isDragging) return;
            let x = e.clientX || e.touches[0].clientX;
            const rect = slider.getBoundingClientRect();
            let percentage = ((x - rect.left) / rect.width) * 100;
            if (percentage < 0) percentage = 0;
            if (percentage > 100) percentage = 100;
            after.style.width = percentage + '%';
            handle.style.left = percentage + '%';
        }

        slider.addEventListener('mousedown', () => isDragging = true);
        slider.addEventListener('touchstart', () => isDragging = true);
        window.addEventListener('mouseup', () => isDragging = false);
        window.addEventListener('touchend', () => isDragging = false);
        window.addEventListener('mousemove', move);
        window.addEventListener('touchmove', move);

        slider.parentElement.addEventListener('click', (e) => {
            if (e.target.closest('.comparison-handle')) return;
            const afterImgSrc = slider.querySelector('.comparison-after img').src;
            openLightboxImage(afterImgSrc);
        });
    }

    comparisonSliders.forEach(initComparisonSlider);

    videoItems.forEach(item => {
        item.addEventListener('click', () => {
            const videoSrc = item.getAttribute('data-video-src');
            if (videoSrc) {
                openLightboxVideo(videoSrc);
            }
        });
    });
    
    function openLightboxImage(src) {
        lightboxContainer.innerHTML = `<img src="${src}" style="max-width:100%; max-height:90vh;">`;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function openLightboxVideo(src) {
        lightboxContainer.innerHTML = `
            <div class="lightbox-video-wrapper">
                <iframe src="${src}" frameborder="0" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen></iframe>
            </div>`;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
        lightbox.style.display = 'none';
        lightboxContainer.innerHTML = '';
        document.body.style.overflow = 'auto';
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });

    document.getElementById('current-year').textContent = new Date().getFullYear();
});