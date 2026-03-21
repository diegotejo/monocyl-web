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
        try {
            // Fetching from the local JSON file
            const response = await fetch('data/newsletters.json');
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const newsletters = await response.json();
            renderNewsletters(newsletters);
        } catch (error) {
            console.error('Error fetching newsletters:', error);
            newslettersGrid.innerHTML = `
                <div class="error-state" style="text-align:center; padding: 2rem; color: #706870;">
                    <p>No se pudieron cargar los boletines en este momento. Por favor, inténtalo más tarde.</p>
                </div>
            `;
        }
    }

    function renderNewsletters(newsletters) {
        // Clear the loading message
        newslettersGrid.innerHTML = '';

        if (newsletters.length === 0) {
            newslettersGrid.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">Aún no hay boletines disponibles.</p>';
            return;
        }

        // Helper to format date
        const formatDate = (dateString) => {
            const options = { year: 'numeric', month: 'long', day: 'numeric' };
            const date = new Date(dateString);
            return date.toLocaleDateString('es-ES', options);
        };

        newsletters.forEach(newsletter => {
            const card = document.createElement('article');
            card.classList.add('newsletter-card');

            // Setting logo as fallback image when coverImage is not provided
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
});
