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
    const docTypeFilter = document.getElementById('doc-type-filter');
    const docYearFilter = document.getElementById('doc-year-filter');
    const docFilterReset = document.getElementById('doc-filter-reset');
    const docNoResults = document.getElementById('documents-no-results');

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

    function getYearLabel(dateString, fallbackYear = '') {
        const date = new Date(dateString);
        if (Number.isNaN(date.getTime())) return fallbackYear;
        return String(date.getFullYear());
    }

    function refreshDocumentYearOptions() {
        if (!docYearFilter) return;

        const previousValue = docYearFilter.value;
        const years = [...new Set(
            Array.from(document.querySelectorAll('.document-card'))
                .map(card => card.dataset.docYear)
                .filter(Boolean)
        )].sort((a, b) => Number(b) - Number(a));

        docYearFilter.innerHTML = '<option value="all">Todos</option>';
        years.forEach(year => {
            const option = document.createElement('option');
            option.value = year;
            option.textContent = year;
            docYearFilter.appendChild(option);
        });

        if (years.includes(previousValue)) {
            docYearFilter.value = previousValue;
        }
    }

    function applyDocumentFilters() {
        const typeValue = docTypeFilter ? docTypeFilter.value : 'all';
        const yearValue = docYearFilter ? docYearFilter.value : 'all';
        let visibleCount = 0;

        document.querySelectorAll('.document-card').forEach(card => {
            const matchesType = typeValue === 'all' || card.dataset.docType === typeValue;
            const matchesYear = yearValue === 'all' || card.dataset.docYear === yearValue;
            const shouldShow = matchesType && matchesYear;
            card.style.display = shouldShow ? '' : 'none';
            if (shouldShow) visibleCount += 1;
        });

        if (docNoResults) {
            docNoResults.hidden = visibleCount > 0;
        }
    }

    function initializeDocumentFilters() {
        if (!docTypeFilter || !docYearFilter) return;

        docTypeFilter.addEventListener('change', applyDocumentFilters);
        docYearFilter.addEventListener('change', applyDocumentFilters);

        if (docFilterReset) {
            docFilterReset.addEventListener('click', () => {
                docTypeFilter.value = 'all';
                docYearFilter.value = 'all';
                applyDocumentFilters();
            });
        }
    }

    // Helper to format date (moved outside to be shared)
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', options);
    };

    const formatMonthLabel = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { month: 'long' });
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
            card.classList.add('newsletter-card', 'document-card');
            card.dataset.docType = 'boletines';
            card.dataset.docYear = getYearLabel(newsletter.date);
            const bgImage = newsletter.coverImage || 'logo.png';
            const monthLabel = formatMonthLabel(newsletter.date);
            const yearLabel = getYearLabel(newsletter.date);
            const cardImageMarkup = newsletter.coverImage
                ? `<div class="card-image newsletter-image-photo" style="background-image: url('${bgImage}');" aria-hidden="true"></div>`
                : `
                    <div class="card-image newsletter-image-art" aria-hidden="true">
                        <div class="newsletter-ribbon">Boletin MONOCYL</div>
                        <div class="newsletter-month">${monthLabel}</div>
                        <div class="newsletter-year">${yearLabel}</div>
                        <div class="newsletter-orb"></div>
                    </div>
                `;

            card.innerHTML = `
                ${cardImageMarkup}
                <div class="card-content">
                    <span class="card-date">${formatDate(newsletter.date)}</span>
                    <h3 class="card-title">${newsletter.title}</h3>
                    <p class="card-excerpt">${newsletter.excerpt}</p>
                    <a href="${newsletter.link}" class="read-more" aria-label="Leer más sobre ${newsletter.title}">Leer Boletín</a>
                </div>
            `;
            newslettersGrid.appendChild(card);
        });

        refreshDocumentYearOptions();
        applyDocumentFilters();
        lucide.createIcons();
    }

    // Initialize
    initializeDocumentFilters();
    fetchNewsletters();
    fetchEvents();
    fetchPressReleases();
    fetchMemorias();

    // 3. Fetch and Render Press Releases
    async function fetchPressReleases() {
        const pressGrid = document.getElementById('press-grid');
        if (!pressGrid) return;

        try {
            const response = await fetch('data/notas-prensa.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const pressItems = await response.json();
            renderPressReleases(pressItems, pressGrid);
        } catch (error) {
            console.error('Error fetching press releases:', error);
            pressGrid.innerHTML = `<div class="error-state"><p>No se pudieron cargar las notas de prensa.</p></div>`;
        }
    }

    function renderPressReleases(pressItems, container) {
        container.innerHTML = '';
        if (pressItems.length === 0) {
            container.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">No hay notas de prensa disponibles.</p>';
            return;
        }

        pressItems.forEach(item => {
            const card = document.createElement('article');
            card.classList.add('newsletter-card', 'press-card', 'document-card');
            card.dataset.docType = 'notas-prensa';
            card.dataset.docYear = getYearLabel(item.date);
            const pressHeadline = item.title.length > 60 ? `${item.title.slice(0, 57)}...` : item.title;

            card.innerHTML = `
                <div class="card-image press-image-art" aria-hidden="true">
                    <div class="press-ribbon">Nota de prensa</div>
                    <div class="press-main-title">${pressHeadline}</div>
                    <div class="press-date-label">${formatDate(item.date)}</div>
                    <div class="doc-placeholder"><i data-lucide="newspaper"></i></div>
                </div>
                <div class="card-content">
                    <span class="press-chip">Nota de prensa</span>
                    <span class="card-date">${formatDate(item.date)}</span>
                    <h3 class="card-title">${item.title}</h3>
                    <p class="card-excerpt">${item.excerpt}</p>
                    <a href="${item.link}" target="_blank" rel="noopener" class="read-more" aria-label="Abrir ${item.title}">Abrir PDF</a>
                </div>
            `;

            container.appendChild(card);
        });

        refreshDocumentYearOptions();
        applyDocumentFilters();
        lucide.createIcons();
    }

    // 4. Fetch and Render Memorias
    async function fetchMemorias() {
        const memoriasGrid = document.getElementById('memorias-grid');
        if (!memoriasGrid) return;

        try {
            const response = await fetch('data/memorias.json');
            if (!response.ok) throw new Error('Network response was not ok');
            const memorias = await response.json();
            renderMemorias(memorias, memoriasGrid);
        } catch (error) {
            console.error('Error fetching memorias:', error);
            memoriasGrid.innerHTML = `<div class="error-state"><p>No se pudieron cargar las memorias.</p></div>`;
        }
    }

    function renderMemorias(memorias, container) {
        container.innerHTML = '';
        if (memorias.length === 0) {
            container.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">No hay memorias disponibles.</p>';
            return;
        }

        memorias.forEach(memoria => {
            const card = document.createElement('article');
            card.classList.add('newsletter-card', 'memoria-card', 'document-card');
            card.dataset.docType = 'memorias';
            card.dataset.docYear = memoria.year || getYearLabel(memoria.date);

            // Creating a special background for Memorias: Logo + Year text
            // We use a CSS layout for this in the card innerHTML
            card.innerHTML = `
                <div class="card-image memoria-image" aria-hidden="true">
                    <img src="logo.png" alt="" class="memoria-logo-small">
                    <div class="memoria-year-label">MEMORIA DE ACTIVIDAD<br><span>${memoria.year}</span></div>
                </div>
                <div class="card-content">
                    <span class="card-date">${formatDate(memoria.date)}</span>
                    <h3 class="card-title">${memoria.title}</h3>
                    <p class="card-excerpt">${memoria.excerpt}</p>
                    <a href="${memoria.link}" target="_blank" class="read-more" aria-label="Leer ${memoria.title}">Leer Memoria</a>
                </div>
            `;
            container.appendChild(card);
        });

        refreshDocumentYearOptions();
        applyDocumentFilters();
        lucide.createIcons();
    }
});
