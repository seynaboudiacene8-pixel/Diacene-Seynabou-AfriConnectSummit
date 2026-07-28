/* ==========================================================================
   AFRICONNECT SUMMIT 2026 — LOGIQUE JAVASCRIPT VANILLA
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    // --------------------------------------------------------------------------
    // 1. DARK MODE PERSISTANT (localStorage & data-theme)
    // --------------------------------------------------------------------------
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const currentTheme = localStorage.getItem('theme');

    // Applique le thème sauvegardé
    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            themeIcon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
        }
    }

    themeToggle.addEventListener('click', () => {
        let theme = 'light';
        if (document.documentElement.getAttribute('data-theme') !== 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            themeIcon.classList.replace('bi-moon-stars-fill', 'bi-sun-fill');
            theme = 'dark';
        } else {
            document.documentElement.removeAttribute('data-theme');
            themeIcon.classList.replace('bi-sun-fill', 'bi-moon-stars-fill');
        }
        localStorage.setItem('theme', theme);
    });

    // --------------------------------------------------------------------------
    // 2. NAVBAR DYNAMIQUE (Fond / Ombre au défilement > 80px) & HAMBURGER
    // --------------------------------------------------------------------------
    const navbar = document.querySelector('.navbar');
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navMenu = document.getElementById('navMenu');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 80) {
            navbar.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
            navbar.style.borderBottomColor = 'transparent';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.borderBottomColor = 'var(--border-color)';
        }
    });

    hamburgerBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        const isOpened = navMenu.classList.contains('active');
        hamburgerBtn.innerHTML = isOpened ? '<i class="bi bi-x-lg"></i>' : '<i class="bi bi-list"></i>';
    });

    // Ferme le menu mobile au clic sur un lien
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburgerBtn.innerHTML = '<i class="bi bi-list"></i>';
        });
    });

    // --------------------------------------------------------------------------
    // 3. COMPTE À REBOURS (Accueil)
    // --------------------------------------------------------------------------
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
        const targetDate = new Date(countdownElement.getAttribute('data-date')).getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const difference = targetDate - now;

            if (difference < 0) {
                countdownElement.innerHTML = "<p>L'événement a commencé !</p>";
                clearInterval(countdownInterval);
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((difference % (1000 * 60)) / 1000);

            document.getElementById('days').innerText = days < 10 ? '0' + days : days;
            document.getElementById('hours').innerText = hours < 10 ? '0' + hours : hours;
            document.getElementById('minutes').innerText = minutes < 10 ? '0' + minutes : minutes;
            document.getElementById('seconds').innerText = seconds < 10 ? '0' + seconds : seconds;
        };

        const countdownInterval = setInterval(updateCountdown, 1000);
        updateCountdown();
    }

    // --------------------------------------------------------------------------
    // 4. ANIMATIONS AU SCROLL (Fade-in, slide-in via IntersectionObserver)
    // --------------------------------------------------------------------------
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                // Si la section contient des compteurs, on les lance
                if (entry.target.classList.contains('stats-section')) {
                    startStatCounters();
                }
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.scroll-anim').forEach(el => {
        scrollObserver.observe(el);
    });

    // --------------------------------------------------------------------------
    // 5. ANIMATION DES CHIFFRES CLÉS (Statistiques)
    // --------------------------------------------------------------------------
    let statsAnimated = false;
    function startStatCounters() {
        if (statsAnimated) return;
        statsAnimated = true;

        document.querySelectorAll('.stat-number').forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = 2000; // 2 secondes pour s'animer
            const increment = target / (duration / 16); // 16ms approx par frame (60fps)

            let current = 0;
            const updateCounter = () => {
                current += increment;
                if (current < target) {
                    counter.innerText = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.innerText = target + (target === 1200 ? '+' : '');
                }
            };
            updateCounter();
        });
    }

    // --------------------------------------------------------------------------
    // 6. ONGLETS DYNAMIQUES DU PROGRAMME (programme.html)
    // --------------------------------------------------------------------------
    const tabButtons = document.querySelectorAll('.tab-btn');
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const targetTab = button.getAttribute('data-tab');

                // Retire la classe active des boutons
                tabButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Affiche le panneau ciblé et cache les autres
                document.querySelectorAll('.tab-pane').forEach(pane => {
                    pane.classList.remove('active');
                    if (pane.id === targetTab) {
                        pane.classList.add('active');
                    }
                });
            });
        });
    }

    // --------------------------------------------------------------------------
    // 7. FILTRAGE DYNAMIQUE DES INTERVENANTS (intervenants.html)
    // --------------------------------------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const speakerCards = document.querySelectorAll('.speaker-profile-card');

    if (filterButtons.length > 0) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.getAttribute('data-filter');

                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                speakerCards.forEach(card => {
                    if (category === 'all' || card.getAttribute('data-category') === category) {
                        card.style.display = 'block';
                        // Légère animation d'apparition
                        card.style.animation = 'fadeIn 0.4s ease';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // --------------------------------------------------------------------------
    // 8. VALIDATION FORMULAIRE D'INSCRIPTION (contact.html)
    // --------------------------------------------------------------------------
    const regForm = document.getElementById('registrationForm');
    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();
            let isValid = true;

            // Inputs
            const nameInput = document.getElementById('fullName');
            const emailInput = document.getElementById('email');
            const phoneInput = document.getElementById('phone');
            const ticketInput = document.getElementById('ticketType');
            const countryInput = document.getElementById('country');
            const messageInput = document.getElementById('message');

            // Regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const phoneRegex = /^[0-9]{8,}$/;

            // Validation Nom complet
            if (nameInput.value.trim() === '') {
                showError('errorName', nameInput, 'Le nom complet est obligatoire.');
                isValid = false;
            } else {
                clearError('errorName', nameInput);
            }

            // Validation Email
            if (!emailRegex.test(emailInput.value.trim())) {
                showError('errorEmail', emailInput, 'Veuillez saisir un email valide.');
                isValid = false;
            } else {
                clearError('errorEmail', emailInput);
            }

            // Validation Téléphone
            if (!phoneRegex.test(phoneInput.value.trim())) {
                showError('errorPhone', phoneInput, 'Le téléphone doit contenir au moins 8 chiffres.');
                isValid = false;
            } else {
                clearError('errorPhone', phoneInput);
            }

            // Validation Type Ticket
            if (ticketInput.value === '') {
                showError('errorTicket', ticketInput, 'Veuillez choisir un type de participation.');
                isValid = false;
            } else {
                clearError('errorTicket', ticketInput);
            }

            // Validation Pays
            if (countryInput.value === '') {
                showError('errorCountry', countryInput, 'Veuillez choisir un pays.');
                isValid = false;
            } else {
                clearError('errorCountry', countryInput);
            }

            // Validation Message / Motivation (min 20 caractères)
            if (messageInput.value.trim().length < 20) {
                showError('errorMessage', messageInput, 'Le message doit contenir au moins 20 caractères.');
                isValid = false;
            } else {
                clearError('errorMessage', messageInput);
            }

            // Si tout est ok, simulation de succès
            if (isValid) {
                const successAlert = document.getElementById('successAlert');
                successAlert.style.display = 'block';
                regForm.reset();
                
                // Masquer le message de succès au bout de 5 secondes
                setTimeout(() => {
                    successAlert.style.display = 'none';
                }, 5000);
            }
        });

        // Fonctions d'affichage des erreurs
        function showError(spanId, inputElement, message) {
            const errorSpan = document.getElementById(spanId);
            errorSpan.innerText = message;
            inputElement.style.borderColor = '#dc3545'; // Rouge d'erreur
        }

        function clearError(spanId, inputElement) {
            const errorSpan = document.getElementById(spanId);
            errorSpan.innerText = '';
            inputElement.style.borderColor = '#28a745'; // Vert de succès
        }
    }

    // --------------------------------------------------------------------------
    // 9. ANNÉE DYNAMIQUE DANS LE FOOTER & RETOUR EN HAUT DYNAMIQUE
    // --------------------------------------------------------------------------
    // Injection année en cours
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.innerText = new Date().getFullYear();
    }

    // Bouton de retour en haut
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});