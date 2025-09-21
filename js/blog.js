document.addEventListener('DOMContentLoaded', function() {
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('.animate-on-scroll');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1 
        });
        elements.forEach(element => {
            observer.observe(element);
        });
    };

    const setCurrentYear = () => {
        const yearElement = document.getElementById('current-year');
        if (yearElement) {
            yearElement.textContent = new Date().getFullYear();
        }
    };

    const setShareLinks = () => {
        const pageUrl = encodeURIComponent(window.location.href);
        const pageTitle = encodeURIComponent(document.title);
        const fb = document.querySelector('.facebook-share');
        const tw = document.querySelector('.twitter-share');
        const li = document.querySelector('.linkedin-share');
        const wa = document.querySelector('.whatsapp-share');
        if (fb) fb.href = `https://www.facebook.com/sharer/sharer.php?u=${pageUrl}`;
        if (tw) tw.href = `https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}`;
        if (li) li.href = `https://www.linkedin.com/shareArticle?mini=true&url=${pageUrl}&title=${pageTitle}`;
        if (wa) wa.href = `https://api.whatsapp.com/send?text=${pageTitle}%20${pageUrl}`;
    };

    animateOnScroll();
    setCurrentYear();
    setShareLinks();
});