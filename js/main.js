document.addEventListener('DOMContentLoaded', () => {

    if (document.querySelector('.typing-animation')) {
        new Typed('.typing-animation', {
            strings: ['Photographer', 'Videographer', 'Graphic Designer', 'Photo/Video Editor', 'Digital Marketer', 'Creative Concept Developer'],
            typeSpeed: 80,
            backSpeed: 50,
            loop: true,
            backDelay: 1500,
        });
    }
    
    const header = document.getElementById('header');
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const underlineSlider = document.querySelector('.underline-slider');
    const hamburger = document.getElementById('hamburger-icon');
    const closeIcon = document.getElementById('close-icon');
    const contactBtnMobile = document.querySelector('.contact-btn-mobile');
    const sections = document.querySelectorAll('section[id]');

    const handleStickyHeader = () => {
        if (window.scrollY > 50) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    };

    const moveUnderline = (element) => {
        if (element && underlineSlider) {
            underlineSlider.style.width = `${element.offsetWidth}px`;
            underlineSlider.style.left = `${element.offsetLeft}px`;
        }
    };

    const closeMobileMenu = () => {
        navbar.classList.remove('active');
        hamburger.classList.remove('active');
    };

    const initialActiveLink = document.querySelector('.nav-link.active');
    if (initialActiveLink) {
        moveUnderline(initialActiveLink);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
            }
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            moveUnderline(link);

            if (navbar.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const sectionId = entry.target.getAttribute('id');
                navLinks.forEach(link => link.classList.remove('active'));

                if (sectionId === 'contact') {
                    if (underlineSlider) {
                        underlineSlider.style.width = '0px';
                    }
                } else {
                    const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                        moveUnderline(activeLink);
                    }
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    if (hamburger) {
        hamburger.addEventListener('click', (e) => {
            e.stopPropagation();
            navbar.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }

    document.addEventListener('click', () => {
        if (navbar.classList.contains('active')) {
            closeMobileMenu();
        }
    });

    navbar.addEventListener('click', (e) => {
        e.stopPropagation();
    });
    
    if (closeIcon) {
        closeIcon.addEventListener('click', closeMobileMenu);
    }
    
    if(contactBtnMobile) {
        contactBtnMobile.addEventListener('click', (e) => {
            const targetId = contactBtnMobile.getAttribute('href');
            if (targetId.startsWith('#')) {
                e.preventDefault();
                document.querySelector(targetId).scrollIntoView({ behavior: 'smooth' });
            }
            closeMobileMenu();
        });
    }

    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => scrollObserver.observe(el));
    
    const contactForm = document.getElementById('contact-form');
    const formNotification = document.getElementById('form-notification');

    if (contactForm) {
        contactForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            this.time.value = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Makassar' });

            const serviceID = 'service_9fwsqxn';
            const templateID = 'template_4arku3s';

            emailjs.sendForm(serviceID, templateID, this)
                .then(() => {
                    formNotification.textContent = 'Pesan berhasil terkirim! Terima kasih.';
                    formNotification.className = 'success';
                    contactForm.reset();
                }, (err) => {
                    formNotification.textContent = 'Gagal mengirim pesan. Silakan coba lagi. Error: ' + JSON.stringify(err);
                    formNotification.className = 'error';
                });
        });
    }

    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    window.addEventListener('scroll', handleStickyHeader);
    window.addEventListener('resize', () => {
        const activeLink = document.querySelector('.nav-link.active');
        if (activeLink && underlineSlider) {
             moveUnderline(activeLink);
        }
    });
});