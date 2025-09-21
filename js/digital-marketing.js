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
        } else {
            setTimeout(() => {
                el.classList.add('is-visible');
            }, 100);
        }
    });

    document.getElementById('current-year').textContent = new Date().getFullYear();
});