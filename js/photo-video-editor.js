document.addEventListener('DOMContentLoaded', function() {

    function initializePage() {
        const filterButtons = document.querySelectorAll('.filters .filter-btn');
        const landscapeGallery = document.getElementById('landscape-gallery');
        const portraitGallery = document.getElementById('portrait-gallery');

        // Atur kondisi awal saat halaman dimuat
        landscapeGallery.classList.add('active');
        portraitGallery.classList.remove('active');

        if (filterButtons.length && landscapeGallery && portraitGallery) {
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    const filter = button.getAttribute('data-filter');

                    if (filter === 'landscape') {
                        landscapeGallery.classList.add('active');
                        portraitGallery.classList.remove('active');
                    } else {
                        portraitGallery.classList.add('active');
                        landscapeGallery.classList.remove('active');
                    }
                });
            });
        }

        const animatedElements = document.querySelectorAll('.animate-on-scroll, .animate-on-load');
        const lightbox = document.getElementById('lightbox');
        const lightboxContainer = document.getElementById('lightbox-container');
        const lightboxClose = document.getElementById('lightbox-close');
        const allVideoItems = document.querySelectorAll('.video-gallery .gallery-item');

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const delay = parseFloat(entry.target.style.getPropertyValue('--animation-delay') || '0') * 1000;
                    setTimeout(() => { entry.target.classList.add('is-visible'); }, delay);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        animatedElements.forEach(el => {
            if (el.classList.contains('animate-on-load')) {
                const delay = parseFloat(el.style.getPropertyValue('--animation-delay') || '0') * 1000;
                setTimeout(() => { el.classList.add('is-visible'); }, delay);
            } else {
                observer.observe(el);
            }
        });

        initComparisonSlider();
        initLightbox(allVideoItems, lightbox, lightboxContainer, lightboxClose);

        if (document.getElementById('current-year')) {
            document.getElementById('current-year').textContent = new Date().getFullYear();
        }
    }

    function initComparisonSlider() {
        const sliders = document.querySelectorAll('.comparison-slider');
        sliders.forEach(slider => {
            const after = slider.querySelector('.comparison-after');
            const handle = slider.querySelector('.comparison-handle');
            if (!after || !handle) return;
            let isDragging = false;
            function move(e) {
                if (!isDragging) return;
                let x = e.clientX || e.touches[0].clientX;
                const rect = slider.getBoundingClientRect();
                let p = ((x - rect.left) / rect.width) * 100;
                p = Math.max(0, Math.min(100, p));
                after.style.width = p + '%';
                handle.style.left = p + '%';
            }
            slider.addEventListener('mousedown', () => isDragging = true);
            slider.addEventListener('touchstart', () => isDragging = true, { passive: true });
            window.addEventListener('mouseup', () => isDragging = false);
            window.addEventListener('touchend', () => isDragging = false);
            window.addEventListener('mousemove', move);
            window.addEventListener('touchmove', move, { passive: true });
            slider.parentElement.addEventListener('click', (e) => {
                if (e.target.closest('.comparison-handle')) return;
                const afterImgSrc = slider.querySelector('.comparison-after img')?.src;
                if (afterImgSrc) openLightboxImage(afterImgSrc);
            });
        });
    }

    function initLightbox(videoItems, lightbox, container, closeBtn) {
        if (!lightbox || !container || !closeBtn) return;
        
        videoItems.forEach(item => {
            item.addEventListener('click', () => {
                const videoSrc = item.getAttribute('data-video-src');
                if (videoSrc) openLightboxVideo(videoSrc, container, lightbox);
            });
        });

        closeBtn.addEventListener('click', () => closeLightbox(lightbox, container));
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox(lightbox, container);
        });
    }

    function openLightboxImage(src) {
        const lightbox = document.getElementById('lightbox');
        const container = document.getElementById('lightbox-container');
        if (!lightbox || !container) return;
        container.innerHTML = `<img src="${src}" class="lightbox-image">`;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function openLightboxVideo(src, container, lightbox) {
        container.innerHTML = `<video class="lightbox-video" src="${src}" controls autoplay loop playsinline></video>`;
        lightbox.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }

    function closeLightbox(lightbox, container) {
        lightbox.style.display = 'none';
        container.innerHTML = '';
        document.body.style.overflow = 'auto';
    }

    initializePage();
});