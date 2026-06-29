
document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 1. SYSTEM THEMING (Dark & Light Mode Toggle)
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme') || 'light';

    // Apply default loaded theme
    if (currentTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        updateThemeIcon(true);
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        updateThemeIcon(false);
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            let theme = document.documentElement.getAttribute('data-theme');
            if (theme === 'dark') {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                updateThemeIcon(false);
            } else {
                document.documentElement.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                updateThemeIcon(true);
            }
        });
    }

    // Helper to toggle FontAwesome classes on the theme switch button
    function updateThemeIcon(isDark) {
        if (!themeToggleBtn) return;
        const icon = themeToggleBtn.querySelector('i');
        if (isDark) {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    }


    // ==========================================================================
    // 2. MOBILE MENU NAVIGATION
    // ==========================================================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Toggle hamburger icon between bars and close X icon
            const icon = mobileToggle.querySelector('i');
            if (navMenu.classList.contains('active')) {
                icon.className = 'fa-solid fa-xmark';
            } else {
                icon.className = 'fa-solid fa-bars';
            }
        });

        // Close menu if a user clicks outside the menu container
        document.addEventListener('click', (event) => {
            if (!navMenu.contains(event.target) && !mobileToggle.contains(event.target)) {
                navMenu.classList.remove('active');
                mobileToggle.querySelector('i').className = 'fa-solid fa-bars';
            }
        });
    }


    // ==========================================================================
    // 3. SCROLL-TO-TOP BUTTON BEHAVIOR
    // ==========================================================================
    const scrollToTopBtn = document.getElementById('scroll-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    if (scrollToTopBtn) {
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }


    // ==========================================================================
    // 4. PLACEMENT STATISTICS COUNT-UP EFFECT (Home Page Only)
    // ==========================================================================
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length > 0) {
        const runCounter = () => {
            counters.forEach(counter => {
                const target = parseInt(counter.getAttribute('data-target'), 10);
                const duration = 2000; // Animation duration in milliseconds
                const increment = target / (duration / 16); // 16ms per frame (~60fps)
                let current = 0;

                const updateCount = () => {
                    current += increment;
                    if (current < target) {
                        counter.innerText = Math.ceil(current) + (counter.getAttribute('data-target') === '95' ? '%' : '+');
                        if (counter.getAttribute('data-target') === '42') {
                            counter.innerText = Math.ceil(current) + ' LPA';
                        }
                        setTimeout(updateCount, 16);
                    } else {
                        counter.innerText = target + (counter.getAttribute('data-target') === '95' ? '%' : '+');
                        if (counter.getAttribute('data-target') === '42') {
                            counter.innerText = target + ' LPA';
                        }
                    }
                };
                updateCount();
            });
        };

        // Trigger animation when the stats section enters the screen viewport
        const statsSection = document.querySelector('.stats-section');
        if (statsSection && 'IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    runCounter();
                    observer.disconnect(); // Fire only once
                }
            }, { threshold: 0.2 });
            observer.observe(statsSection);
        } else {
            runCounter(); // Fallback if IntersectionObserver isn't supported
        }
    }


    // ==========================================================================
    // 5. ACCORDION / COLLAPSIBLE DRAWER CONTROLLER
    // ==========================================================================
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // Toggle active styling class on header
            this.classList.toggle('active');
            
            // Toggle opening class on adjacent content panel
            const content = this.nextElementSibling;
            content.classList.toggle('open');

            // Handle transition limits
            if (content.classList.contains('open')) {
                content.style.maxHeight = content.scrollHeight + 100 + 'px';
            } else {
                content.style.maxHeight = '0px';
            }
        });
    });


    // ==========================================================================
    // 6. PRACTICE QUESTIONS: REVEAL / CONCEAL ANSWERS
    // ==========================================================================
    const revealBtns = document.querySelectorAll('.btn-reveal');

    revealBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const revealContent = this.nextElementSibling;
            revealContent.classList.toggle('show');
            
            // Determine custom toggle names based on page context
            const isDsa = document.getElementById('dsa-grid') !== null;
            const openText = isDsa ? 'Hide Solution Guide' : 'Hide Answer';
            const closedText = isDsa ? 'View Solution Guide' : 'Reveal Answer';

            if (revealContent.classList.contains('show')) {
                this.textContent = openText;
            } else {
                this.textContent = closedText;
            }
        });
    });


    // ==========================================================================
    // 7. CARD FILTERING & SEARCH CONTROLLER
    // ==========================================================================
    
    // Generic filter function to hide/reveal DOM cards
    const filterCards = (searchInputId, gridCardsClass) => {
        const searchInput = document.getElementById(searchInputId);
        if (!searchInput) return;

        const cards = document.querySelectorAll(gridCardsClass);
        const searchBtn = document.getElementById('search-btn');

        const performSearch = () => {
            const query = searchInput.value.toLowerCase().trim();

            cards.forEach(card => {
                let searchableText = '';
                // Gather search keywords depending on content target
                if (card.hasAttribute('data-topic')) {
                    searchableText = card.getAttribute('data-topic');
                } else if (card.hasAttribute('data-company')) {
                    searchableText = card.getAttribute('data-company');
                }
                
                // Add inner content words to enhance search results
                searchableText += ' ' + card.innerText.toLowerCase();

                if (searchableText.includes(query)) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.4s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        };

        // Perform search dynamically as user types
        searchInput.addEventListener('input', performSearch);
        
        // Handle search button click
        if (searchBtn) {
            searchBtn.addEventListener('click', performSearch);
        }
    };

    // Initialize search on appropriate pages
    filterCards('aptitude-search', '#aptitude-grid .topic-card');
    filterCards('dsa-search', '#dsa-grid .topic-card');
    filterCards('company-search', '#company-grid .company-card');


    // ==========================================================================
    // 8. CONTACT FORM CLIENT-SIDE VALIDATION
    // ==========================================================================
    const contactForm = document.getElementById('contact-form');
    const successBanner = document.getElementById('success-banner');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Select inputs & error blocks
            const nameInput = document.getElementById('user-name');
            const emailInput = document.getElementById('user-email');
            const phoneInput = document.getElementById('user-phone');
            const messageInput = document.getElementById('user-message');

            const nameError = document.getElementById('name-error');
            const emailError = document.getElementById('email-error');
            const phoneError = document.getElementById('phone-error');
            const messageError = document.getElementById('message-error');

            // Reset errors initially
            nameError.innerText = '';
            emailError.innerText = '';
            phoneError.innerText = '';
            messageError.innerText = '';

            let isValid = true;

            // Name validation (Not empty)
            if (nameInput.value.trim() === '') {
                nameError.innerText = 'Name is required';
                isValid = false;
            }

            // Email validation (Pattern verification)
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailInput.value.trim() === '') {
                emailError.innerText = 'Email is required';
                isValid = false;
            } else if (!emailRegex.test(emailInput.value.trim())) {
                emailError.innerText = 'Please enter a valid email address';
                isValid = false;
            }

            // Phone validation (10 digits check)
            const phoneRegex = /^[0-9]{10}$/;
            if (phoneInput.value.trim() === '') {
                phoneError.innerText = 'Phone number is required';
                isValid = false;
            } else if (!phoneRegex.test(phoneInput.value.trim().replace(/\s/g, ''))) {
                phoneError.innerText = 'Please enter a valid 10-digit mobile number';
                isValid = false;
            }

            // Message validation (min 10 characters)
            if (messageInput.value.trim() === '') {
                messageError.innerText = 'Message is required';
                isValid = false;
            } else if (messageInput.value.trim().length < 10) {
                messageError.innerText = 'Message must be at least 10 characters long';
                isValid = false;
            }

            // If all fields are valid
            if (isValid) {
                // Hide the form fields
                contactForm.style.display = 'none';
                
                // Show the success confirmation message
                if (successBanner) {
                    successBanner.style.display = 'flex';
                    successBanner.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }

                // Log values to represent backend storage mock
                console.log('--- Placement Query Submission ---');
                console.log('Name:', nameInput.value.trim());
                console.log('Email:', emailInput.value.trim());
                console.log('Phone:', phoneInput.value.trim());
                console.log('Message:', messageInput.value.trim());
                console.log('----------------------------------');
            }
        });

        // Event listener to clear errors instantly when inputs change
        const clearErrorOnInput = (inputEl, errorEl) => {
            inputEl.addEventListener('input', () => {
                errorEl.innerText = '';
            });
        };

        clearErrorOnInput(document.getElementById('user-name'), document.getElementById('name-error'));
        clearErrorOnInput(document.getElementById('user-email'), document.getElementById('email-error'));
        clearErrorOnInput(document.getElementById('user-phone'), document.getElementById('phone-error'));
        clearErrorOnInput(document.getElementById('user-message'), document.getElementById('message-error'));
    }

});
