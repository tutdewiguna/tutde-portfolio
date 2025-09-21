document.addEventListener('DOMContentLoaded', function() {

    const animatedElements = document.querySelectorAll('.animate-on-scroll, .animate-on-load');
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
    }, {
        threshold: 0.1
    });

    animatedElements.forEach(el => {
        if (!el.classList.contains('animate-on-load')) {
            observer.observe(el);
        }
    });
    document.getElementById('current-year').textContent = new Date().getFullYear();

    const lightbox = document.getElementById('lightbox');
    const lightboxContent = document.getElementById('lightbox-content');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxWrapper = lightbox.querySelector('.lightbox-content-wrapper');
    
    const pdfModal = document.getElementById('pdf-modal');
    const pdfViewer = document.getElementById('pdf-viewer');
    const pdfModalClose = document.querySelector('.pdf-modal-close');

    const galleryItems = document.querySelectorAll('.gallery-item');
    let currentImages = [];
    let currentIndex = 0;
    let activeIntervals = [];

    function showImage(index) {
        if (index < 0 || index >= currentImages.length) return;
        currentIndex = index;
        lightboxContent.style.opacity = '0';
        setTimeout(() => {
            lightboxContent.src = currentImages[currentIndex];
            lightboxContent.style.opacity = '1';
        }, 300);
        lightboxCounter.textContent = `${currentIndex + 1} / ${currentImages.length}`;
        const isGallery = currentImages.length > 1;
        lightboxPrev.style.display = isGallery ? 'flex' : 'none';
        lightboxNext.style.display = isGallery ? 'flex' : 'none';
        lightboxCounter.style.display = isGallery ? 'block' : 'none';
    }

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            stopCoverAnimations();
            const imagesAttr = item.getAttribute('data-images');
            if (imagesAttr) {
                const allFiles = imagesAttr.split(',').map(s => s.trim());
                const firstFile = allFiles[0].toLowerCase();
                if (firstFile.endsWith('.pdf') || firstFile.includes('drive.google.com/file/')) {
                    const pdfUrl = allFiles[0];
                    pdfModal.classList.add('loading');
                    pdfModal.classList.add('visible');
                    document.body.style.overflow = 'hidden';
                    pdfViewer.onload = function() {
                        pdfModal.classList.remove('loading');
                    };
                    pdfViewer.src = pdfUrl;
                    return;
                }
                currentImages = allFiles.filter(file => !file.toLowerCase().endsWith('.pdf') && !file.toLowerCase().includes('drive.google.com/file/'));
                if (currentImages.length > 0) {
                    lightbox.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                    showImage(0);
                }
            }
        });
    });

    function closeLightbox() {
        lightbox.style.display = 'none';
        document.body.style.overflow = 'auto';
        startCoverAnimations();
    }
    
    function closePdfModal() {
        pdfModal.classList.remove('visible');
        pdfModal.classList.remove('loading');
        document.body.style.overflow = 'auto';
        
        setTimeout(() => {
            pdfViewer.src = '';
            pdfViewer.onload = null;
        }, 300);
        
        startCoverAnimations();
    }

    lightboxClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });
    
    pdfModalClose.addEventListener('click', closePdfModal);
    pdfModal.addEventListener('click', (e) => { if (e.target === pdfModal) closePdfModal(); });

    lightboxNext.addEventListener('click', () => showImage((currentIndex + 1) % currentImages.length));
    lightboxPrev.addEventListener('click', () => showImage((currentIndex - 1 + currentImages.length) % currentImages.length));

    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') lightboxNext.click();
            if (e.key === 'ArrowLeft') lightboxPrev.click();
        } else if (pdfModal.classList.contains('visible') && e.key === 'Escape') {
            closePdfModal();
        }
    });

    let touchStartX = 0;
    lightboxWrapper.addEventListener('touchstart', (e) => { touchStartX = e.touches[0].clientX; }, { passive: true });
    lightboxWrapper.addEventListener('touchend', (e) => { if (currentImages.length <= 1) return; let touchEndX = e.changedTouches[0].clientX; if (touchStartX - touchEndX > 50) { lightboxNext.click(); } else if (touchEndX - touchStartX > 50) { lightboxPrev.click(); } }, { passive: true });

    function stopCoverAnimations() { activeIntervals.forEach(id => clearInterval(id)); activeIntervals = []; }
    function startCoverAnimations() {
        stopCoverAnimations();
        galleryItems.forEach(item => {
            const imagesAttr = item.getAttribute('data-images');
            if (!imagesAttr) return;
            const imagesForAnimation = imagesAttr.split(',').map(s => s.trim()).filter(file => !file.toLowerCase().endsWith('.pdf'));
            if (imagesForAnimation.length > 1) {
                const coverImage = item.querySelector('img');
                let currentIndex = imagesForAnimation.findIndex(url => coverImage.src.endsWith(url));
                if (currentIndex === -1) currentIndex = 0;
                let nextIndex = (currentIndex + 1) % imagesForAnimation.length;
                const intervalId = setInterval(() => {
                    item.style.backgroundImage = `url('${coverImage.src}')`;
                    coverImage.style.opacity = '0';
                    setTimeout(() => {
                        coverImage.src = imagesForAnimation[nextIndex];
                        coverImage.style.opacity = '1';
                        nextIndex = (nextIndex + 1) % imagesForAnimation.length;
                    }, 500);
                }, 3000);
                activeIntervals.push(intervalId);
            }
        });
    }
    
    startCoverAnimations();
});