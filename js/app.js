document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // 1. Handle Navbar Scroll Effect & Mobile Menu
    const navbar = document.querySelector('.navbar');
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // Close mobile menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                navLinks.classList.remove('active');
            }
        });
    });
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 2. Fetch and Render Newsletters
    const newslettersGrid = document.getElementById('newsletters-grid');

    async function fetchNewsletters() {
        // ... (existing code replaced below for brevity in multi-step but I'll update the whole section)
    }

    // --- New Logic for Events Banner ---
    const newsTrigger = document.getElementById('news-trigger-container');
    const newsOverlay = document.getElementById('news-overlay');
    const closeNewsBtn = document.getElementById('close-news');
    const newsTriggerBtn = document.getElementById('news-trigger-btn');

    async function fetchEvents() {
        try {
            const response = await fetch('data/events.json');
            if (!response.ok) return;
            const events = await response.json();
            
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            // Find the first active future event
            const nextEvent = events.find(e => {
                const eventDate = new Date(e.date);
                return e.active && eventDate >= today;
            });

            if (nextEvent) {
                renderEventBanner(nextEvent);
            } else {
                newsTrigger.classList.add('hidden');
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            newsTrigger.classList.add('hidden');
        }
    }

    function renderEventBanner(event) {
        document.getElementById('news-title').textContent = event.title;
        document.getElementById('news-subtitle').textContent = event.subtitle || '';
        document.getElementById('news-date').textContent = `${formatDate(event.date)} - ${event.time}`;
        document.getElementById('news-location').textContent = event.location;
        document.getElementById('news-description').textContent = event.description;
        document.getElementById('news-image').src = event.image || 'logo.png';
        
        const link = document.getElementById('news-link');
        link.href = event.link;
        link.textContent = event.linkText || 'Más información';

        document.getElementById('news-trigger-text').textContent = `Próxima actividad: ${formatDateShort(event.date)}`;
        
        newsTrigger.classList.remove('hidden');

        newsTriggerBtn.addEventListener('click', () => {
            newsOverlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scroll
        });

        closeNewsBtn.addEventListener('click', () => {
            newsOverlay.classList.remove('active');
            document.body.style.overflow = '';
        });

        newsOverlay.addEventListener('click', (e) => {
            if (e.target === newsOverlay) {
                newsOverlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }

    function formatDateShort(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    }

    // Helper to format date (moved outside to be shared)
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', options);
    };

    // Update fetchNewsletters to use shared formatDate
    async function fetchNewsletters() {
        try {
            const response = await fetch('data/newsletters.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const newsletters = await response.json();
            renderNewsletters(newsletters);
        } catch (error) {
            console.error('Error fetching newsletters:', error);
            if (newslettersGrid) newslettersGrid.innerHTML = `<div class="error-state"><p>No se pudieron cargar los boletines.</p></div>`;
        }
    }

    function renderNewsletters(newsletters) {
        if (!newslettersGrid) return;
        newslettersGrid.innerHTML = '';
        if (newsletters.length === 0) {
            newslettersGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Aún no hay boletines disponibles.</p>';
            return;
        }

        newsletters.forEach(newsletter => {
            const card = document.createElement('article');
            card.classList.add('newsletter-card');
            const bgImage = newsletter.coverImage || 'logo.png';
            const bgStyle = newsletter.coverImage
                ? `background-image: url('${bgImage}'); background-size: cover; background-position: center;`
                : `background-image: url('${bgImage}'); background-size: 55%; background-repeat: no-repeat; background-position: center; background-color: #F5EAE1;`;

            card.innerHTML = `
                <div class="card-image" style="${bgStyle}" aria-hidden="true"></div>
                <div class="card-content">
                    <span class="card-date">${formatDate(newsletter.date)}</span>
                    <h3 class="card-title">${newsletter.title}</h3>
                    <p class="card-excerpt">${newsletter.excerpt}</p>
                    <a href="${newsletter.link}" class="read-more" aria-label="Leer más sobre ${newsletter.title}">Leer Boletín</a>
                </div>
            `;
            newslettersGrid.appendChild(card);
        });
    }

    // Initialize
    fetchNewsletters();
    fetchEvents();
});
