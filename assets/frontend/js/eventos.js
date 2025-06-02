class EventosManager {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.setupIntersectionObserver();
    }

    initializeElements() {
        this.eventos = document.querySelectorAll('.evento');
        this.videos = document.querySelectorAll('.evento-video');
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImg = this.lightbox?.querySelector('.lightbox-img');
        this.closeButton = this.lightbox?.querySelector('.close-lightbox');
        this.zoomableImages = document.querySelectorAll('.zoomable');
    }

    setupEventListeners() {
        // Video interactions
        this.videos.forEach(video => {
            video.addEventListener('mouseenter', () => this.handleVideoHover(video));
            video.addEventListener('mouseleave', () => this.handleVideoLeave(video));
            video.addEventListener('error', () => this.handleVideoError(video));
        });

        // Lightbox functionality
        if (this.lightbox && this.closeButton) {
            this.zoomableImages.forEach(img => {
                img.addEventListener('click', () => this.openLightbox(img.src));
            });
            
            this.closeButton.addEventListener('click', () => this.closeLightbox());
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.closeLightbox();
            });
        }

        // Image error handling
        this.zoomableImages.forEach(img => {
            img.addEventListener('error', () => this.handleImageError(img));
        });
    }

    setupIntersectionObserver() {
        const options = {
            threshold: 0.2,
            rootMargin: '0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, options);

        this.eventos.forEach(evento => observer.observe(evento));
    }

    handleVideoHover(video) {
        video.style.transform = 'scale(1.02)';
        if (video.paused) {
            video.play().catch(() => console.log('Autoplay blocked'));
        }
    }

    handleVideoLeave(video) {
        video.style.transform = 'scale(1)';
        if (!video.paused) {
            video.pause();
        }
    }

    handleVideoError(video) {
        const container = video.parentElement;
        if (container) {
            container.innerHTML = `
                <div class="media-error">
                    <p>⚠️ Video no disponible</p>
                    <small>Por favor, inténtelo más tarde</small>
                </div>
            `;
        }
    }

    handleImageError(img) {
        img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMThweCIgZmlsbD0iIzY2NiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBubyBkaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
        img.alt = 'Imagen no disponible';
    }

    openLightbox(imageSrc) {
        if (this.lightbox && this.lightboxImg) {
            this.lightboxImg.src = imageSrc;
            this.lightbox.classList.add('visible');
            document.body.style.overflow = 'hidden';
        }
    }

    closeLightbox() {
        if (this.lightbox) {
            this.lightbox.classList.remove('visible');
            document.body.style.overflow = '';
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new EventosManager();
});