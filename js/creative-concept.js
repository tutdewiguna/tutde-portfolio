document.addEventListener('DOMContentLoaded', function() {

    const animatedElements = document.querySelectorAll('.animate-on-scroll, .animate-on-load');

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
    
    animatedElements.forEach(el => {
        if (!el.classList.contains('animate-on-load')) {
            observer.observe(el);
        } else {
            // Animate elements with animate-on-load immediately
            setTimeout(() => {
                el.classList.add('is-visible');
            }, 100);
        }
    });

    document.getElementById('current-year').textContent = new Date().getFullYear();
});