import { useEffect } from 'react';

export default function useScrollReveal() {
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

        document.querySelectorAll('.reveal, .reveal-left, .reveal-scale').forEach(el => {
            if (!el.classList.contains('visible')) {
                observer.observe(el);
            }
        });

        // Card Mouse Tracking
        const handleGlobalMouseMove = (e) => {
            document.querySelectorAll('.card').forEach(card => {
                const rect = card.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                card.style.setProperty('--mouse-x', x + '%');
                card.style.setProperty('--mouse-y', y + '%');
            });
        };
        document.addEventListener('mousemove', handleGlobalMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleGlobalMouseMove);
            observer.disconnect();
        };
    }, []);
}
