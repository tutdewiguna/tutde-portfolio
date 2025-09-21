document.addEventListener('DOMContentLoaded', function() {

    const photoCache = {};
    let currentLightboxImages = [];
    let currentIndex = 0;

    const htmlEl = document.documentElement;
    const bodyEl = document.body;
    const detailModal = document.getElementById('detail-gallery-modal');
    const lightbox = document.getElementById('lightbox');
    const galleryItems = document.querySelectorAll('.photography-page .gallery-item');
    const filterContainer = document.querySelector('.photography-page .portfolio-filters');

    if (!detailModal || !lightbox || !galleryItems.length) {
        console.error('Elemen penting untuk halaman fotografi tidak ditemukan. Skrip dihentikan.');
        return;
    }

    const detailModalTitle = document.getElementById('detail-modal-title');
    const detailModalFilters = document.getElementById('detail-modal-filters');
    const detailGrid = document.getElementById('detail-modal-grid');
    const detailModalCloseBtn = detailModal.querySelector('.detail-modal-close');

    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCloseBtn = lightbox.querySelector('.lightbox-close');
    const lightboxPrevBtn = document.getElementById('lightbox-prev');
    const lightboxNextBtn = document.getElementById('lightbox-next');
    const lightboxCounter = document.getElementById('lightbox-counter');
    const lightboxWrapper = lightbox.querySelector('.lightbox-content-wrapper');

    const preventDefaultScroll = (e) => e.preventDefault();

    function lockScroll() {
        htmlEl.classList.add('modal-open');
        bodyEl.classList.add('modal-open');
    }

    function unlockScroll() {
        htmlEl.classList.remove('modal-open');
        bodyEl.classList.remove('modal-open');
    }

    function initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        animatedElements.forEach(element => observer.observe(element));
    }

    async function fetchAllImagesFromFolder(basePath, className, noSubfolder, photoCount) {
        const images = [];
        for (let i = 1; i <= photoCount; i++) {
            const src = noSubfolder ?
                `${basePath}${className}-${i}.jpg` :
                `${basePath}${className}/${className}-${i}.jpg`;
            try {
                await new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => {
                        images.push({
                            src,
                            class: className
                        });
                        resolve();
                    };
                    img.onerror = () => reject();
                    img.src = src;
                });
            } catch (error) {
                break;
            }
        }
        return images;
    }

    async function getPhotoData(basePath, classCountsJSON, noSubfolder) {
        if (photoCache[basePath]) {
            return photoCache[basePath];
        }

        try {
            const classCounts = JSON.parse(classCountsJSON);
            const imagePromises = Object.entries(classCounts).map(([className, count]) =>
                fetchAllImagesFromFolder(basePath, className, noSubfolder, count)
            );

            const imagesPerClass = await Promise.all(imagePromises);
            const allImages = imagesPerClass.flat();

            const data = {
                images: allImages,
                hasSubClasses: true
            };
            photoCache[basePath] = data;
            return data;

        } catch (error) {
            console.error('Gagal mem-parsing data-class-counts atau membuat daftar foto:', error);
            return {
                images: [],
                hasSubClasses: false
            };
        }
    }

    async function openDetailModal(title, basePath, classCounts, staticImages, noSubfolder) {
        if (staticImages) {
            try {
                const images = JSON.parse(staticImages);
                openLightbox(images, 0);
            } catch (e) {
                console.error("Gagal mem-parsing JSON gambar statis:", e);
            }
            return;
        }

        detailModalTitle.textContent = "Loading...";
        detailGrid.innerHTML = '';
        detailModalFilters.innerHTML = '';

        lockScroll();
        detailModal.style.display = 'block';

        const data = await getPhotoData(basePath, classCounts, noSubfolder);

        if (!data || data.images.length === 0) {
            detailModalTitle.textContent = "Gagal memuat foto.";
            return;
        }

        detailModalTitle.textContent = title;

        const classKeys = Object.keys(JSON.parse(classCounts));

        if (data.hasSubClasses && classKeys.length > 1) {
            detailModalFilters.style.display = 'flex';
            const sortedClassKeys = classKeys.sort((a, b) => {
                const numA = parseInt(a.split('-')[1]);
                const numB = parseInt(b.split('-')[1]);
                if (!isNaN(numA) && !isNaN(numB)) {
                    return numA - numB;
                }
                return a.localeCompare(b);
            });

            let filterButtonsHTML = `<button class="detail-filter-btn active" data-filter="all">ALL</button>`;

            filterButtonsHTML += sortedClassKeys.map(cls =>
                `<button class="detail-filter-btn" data-filter="${cls}">
                    ${cls.replace(/-/g, ' ').toUpperCase()}
                </button>`
            ).join('');

            detailModalFilters.innerHTML = filterButtonsHTML;

        } else {
            detailModalFilters.style.display = 'none';
        }

        detailGrid.innerHTML = data.images.map(imgData => `
            <div class="detail-thumbnail-wrapper" data-class="${imgData.class}" data-full-src="${imgData.src}">
                <img src="${imgData.src}" alt="Thumbnail for ${imgData.class}" class="detail-thumbnail" loading="lazy">
            </div>
        `).join('');

        handleDetailFilter({
            target: detailModalFilters.querySelector('[data-filter="all"]')
        });
    }

    function openLightbox(images, index) {
        // Kunci scroll di lightbox, bukan di grid lagi
        lightbox.addEventListener('touchmove', preventDefaultScroll, { passive: false });
        
        currentLightboxImages = images;
        const isGallery = images.length > 1;

        lightboxPrevBtn.style.display = isGallery ? 'flex' : 'none';
        lightboxNextBtn.style.display = isGallery ? 'flex' : 'none';
        lightboxCounter.style.display = isGallery ? 'block' : 'none';

        showImage(index);

        lockScroll();
        lightbox.style.display = 'flex';
    }

    function showImage(index) {
        if (index < 0 || index >= currentLightboxImages.length) return;
        currentIndex = index;
        lightboxImg.src = currentLightboxImages[currentIndex];
        lightboxCounter.textContent = `${currentIndex + 1} / ${currentLightboxImages.length}`;
    }

    function handleMainFilter(e) {
        if (!e.target.classList.contains('filter-btn')) return;

        filterContainer.querySelector('.active')?.classList.remove('active');
        e.target.classList.add('active');

        const filter = e.target.dataset.filter;
        galleryItems.forEach(item => {
            item.style.display = (filter === 'all' || item.dataset.category === filter) ? 'block' : 'none';
        });
    }

    function handleDetailFilter(e) {
        if (!e || !e.target || !e.target.classList.contains('detail-filter-btn')) return;

        detailModalFilters.querySelector('.active')?.classList.remove('active');
        e.target.classList.add('active');

        const filter = e.target.dataset.filter;
        detailGrid.querySelectorAll('.detail-thumbnail-wrapper').forEach(item => {
            item.style.display = (filter === 'all' || item.dataset.class === filter) ? 'block' : 'none';
        });
    }

    function handleThumbnailClick(e) {
        const wrapper = e.target.closest('.detail-thumbnail-wrapper');
        if (!wrapper) return;

        const visibleThumbnails = [...detailGrid.querySelectorAll('.detail-thumbnail-wrapper')]
            .filter(t => t.style.display !== 'none');

        const visibleImages = visibleThumbnails.map(t => t.dataset.fullSrc);
        const clickedIndex = visibleThumbnails.indexOf(wrapper);

        if (clickedIndex > -1) {
            openLightbox(visibleImages, clickedIndex);
        }
    }

    initScrollAnimations();

    if (filterContainer) {
        filterContainer.addEventListener('click', handleMainFilter);
    }

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const {
                title,
                basePath,
                classCounts,
                images
            } = item.dataset;
            const noSubfolder = item.dataset.noSubfolder === 'true';
            openDetailModal(title, basePath, classCounts, images, noSubfolder);
        });
    });

    function closeModal() {
        unlockScroll();
        detailModal.style.display = 'none';
    }

    function closeLightbox() {
        // Hapus kunci scroll dari lightbox
        lightbox.removeEventListener('touchmove', preventDefaultScroll, { passive: false });
        
        lightbox.style.display = 'none';
        if (detailModal.style.display !== 'block') {
            unlockScroll();
        }
    }

    detailModalCloseBtn.addEventListener('click', closeModal);
    detailModal.addEventListener('click', (e) => {
        if (e.target === detailModal) {
            closeModal();
        }
    });
    detailModalFilters.addEventListener('click', handleDetailFilter);
    detailGrid.addEventListener('click', handleThumbnailClick);

    lightboxCloseBtn.addEventListener('click', closeLightbox);
    lightboxNextBtn.addEventListener('click', () => showImage((currentIndex + 1) % currentLightboxImages.length));
    lightboxPrevBtn.addEventListener('click', () => showImage((currentIndex - 1 + currentLightboxImages.length) % currentLightboxImages.length));

    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'ArrowRight') lightboxNextBtn.click();
            if (e.key === 'ArrowLeft') lightboxPrevBtn.click();
            if (e.key === 'Escape') closeLightbox();
        } else if (detailModal.style.display === 'block' && e.key === 'Escape') {
            closeModal();
        }
    });

    let touchStartX = 0;
    lightboxWrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.touches[0].clientX;
    }, {
        passive: true
    });
    lightboxWrapper.addEventListener('touchend', (e) => {
        let touchEndX = e.changedTouches[0].clientX;
        if (touchStartX - touchEndX > 50) {
            lightboxNextBtn.click();
        } else if (touchEndX - touchStartX > 50) {
            lightboxPrevBtn.click();
        }
    }, {
        passive: true
    });

    const initialActiveMainFilter = filterContainer.querySelector('.filter-btn[data-filter="all"]');
    if (initialActiveMainFilter) {
        handleMainFilter({
            target: initialActiveMainFilter
        });
    }

    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
});