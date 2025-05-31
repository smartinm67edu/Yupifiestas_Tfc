document.addEventListener('DOMContentLoaded', () => {
    const blogPosts = document.querySelectorAll('.blog-post');

    blogPosts.forEach(post => {
        const expandBtn = post.querySelector('.expand-btn');
        const content = post.querySelector('.blog-content');
        const closeBtn = post.querySelector('.close-btn');
        
        expandBtn.addEventListener('click', () => {
            // Scroll to top before showing content
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            content.classList.remove('hidden');
            setTimeout(() => {
                content.classList.add('active');
            }, 10);
            document.body.style.overflow = 'hidden';
        });

        closeBtn.addEventListener('click', () => {
            content.classList.remove('active');
            setTimeout(() => {
                content.classList.add('hidden');
            }, 300);
            document.body.style.overflow = 'auto';
        });

        // Close on background click
        content.addEventListener('click', (e) => {
            if (e.target === content) {
                closeBtn.click();
            }
        });

        // Add keyboard support for closing (Escape key)
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !content.classList.contains('hidden')) {
                closeBtn.click();
            }
        });

        // Handle image gallery clicks
        const galleryImages = post.querySelectorAll('.post-gallery img');
        galleryImages.forEach(img => {
            img.addEventListener('click', () => {
                // Create fullscreen image view
                const fullscreen = document.createElement('div');
                fullscreen.className = 'fullscreen-image';
                fullscreen.innerHTML = `
                    <img src="${img.src}" alt="${img.alt}">
                    <button class="close-fullscreen">✕</button>
                `;
                document.body.appendChild(fullscreen);

                // Handle closing fullscreen view
                fullscreen.addEventListener('click', () => {
                    fullscreen.remove();
                });
            });
        });
    });
});

// CSS styles for fullscreen image view
const style = document.createElement('style');
style.textContent = `
    .fullscreen-image {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
    }

    .fullscreen-image img {
        max-width: 90%;
        max-height: 90vh;
        object-fit: contain;
    }

    .close-fullscreen {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        color: white;
        font-size: 2rem;
        cursor: pointer;
    }
`;
document.head.appendChild(style);