function initializePlatformScripts() {
    // --- LANGUAGE SWITCHER INTEGRATION ---
    const style = document.createElement('style');
    style.innerHTML = `
        .goog-te-banner-frame { display: none !important; }
        .goog-tooltip { display: none !important; }
        .goog-tooltip:hover { display: none !important; }
        .goog-text-highlight { background-color: transparent !important; border: none !important; box-shadow: none !important; }
        body { top: 0 !important; }
        #google_translate_element { display: none !important; }
    `;
    document.head.appendChild(style);

    const gtDiv = document.createElement('div');
    gtDiv.id = 'google_translate_element';
    document.body.appendChild(gtDiv);

    window.googleTranslateElementInit = function() {
        new google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,ne',
            autoDisplay: false
        }, 'google_translate_element');
    };

    const gtScript = document.createElement('script');
    gtScript.type = 'text/javascript';
    gtScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(gtScript);

    const langSelects = document.querySelectorAll('.lang-switch');
    const currentLangCookie = document.cookie.split('; ').find(row => row.startsWith('googtrans='));
    let activeLang = 'en';
    if(currentLangCookie) {
        const langStr = currentLangCookie.split('=')[1];
        if(langStr.includes('/ne')) activeLang = 'np';
    }

    langSelects.forEach(select => {
        select.value = activeLang;
        select.addEventListener('change', function(e) {
            const val = e.target.value === 'np' ? 'ne' : 'en';
            document.cookie = `googtrans=/en/${val}; path=/`;
            window.location.reload();
        });
    });
    // --- END LANGUAGE SWITCHER ---

    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    // Create overlay if it doesn't exist
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);
    }
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function() {
            const isOpen = navLinks.classList.toggle('active');
            mobileToggle.classList.toggle('active');
            overlay.classList.toggle('active');
            
            // Toggle icon between bars and times
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                if (isOpen) {
                    icon.classList.remove('fa-bars');
                    icon.classList.add('fa-times');
                    document.body.style.overflow = 'hidden'; // Prevent scroll
                } else {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                    document.body.style.overflow = ''; // Restore scroll
                }
            }
        });

        // Close menu when clicking overlay
        overlay.addEventListener('click', function() {
            navLinks.classList.remove('active');
            mobileToggle.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
            
            const icon = mobileToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });

        // Close menu when clicking a link
        const links = navLinks.querySelectorAll('a');
        links.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileToggle.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
                
                const icon = mobileToggle.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // --- SEARCH FUNCTIONALITY ---
    const searchInputs = document.querySelectorAll('.search-input');
    searchInputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (window.location.pathname.includes('product.html')) {
                    // Already on store page, just ensure it's filtered (live filter handles this but Enter is fine)
                    filterProducts(); 
                } else {
                    // Redirect from home/other pages to store
                    window.location.href = `product.html?search=${encodeURIComponent(query)}`;
                }
            }
        });
    });

    // If on product page, handle search query from URL
    if (window.location.pathname.includes('product.html')) {
        const urlParams = new URLSearchParams(window.location.search);
        const searchQuery = urlParams.get('search');
        if (searchQuery) {
            searchInputs.forEach(input => input.value = searchQuery);
        }
    }
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        const navbar = document.getElementById('navbar');
        if (navbar) {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        }
    });

    // Checkout script 
    const checkoutForm = document.querySelector('.checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const btn = this.querySelector('.btn');
            const form = this;
            
            btn.textContent = 'Processing...';
            form.classList.add('submitting');
            
            // Simulate API call
            setTimeout(() => {
                alert('Order placed successfully! 🎉');
                form.reset();
                btn.textContent = 'Place Order';
                form.classList.remove('submitting');
            }, 2000);
        });
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePlatformScripts);
} else {
    initializePlatformScripts();
}

// Global cart logic
function updateGlobalCartBadge() {
    let craftCart = [];
    try {
        const stored = localStorage.getItem('craftCart');
        if (stored) craftCart = JSON.parse(stored);
    } catch(e) {
        console.warn("Could not parse craftCart, resetting error.", e);
        craftCart = [];
    }
    if (!Array.isArray(craftCart)) craftCart = [];
    
    const count = craftCart.length;
    
    // Update all badges
    const badges = document.querySelectorAll('.badge, .craft-count');
    badges.forEach(badge => {
        if(badge) {
            badge.textContent = count;
            // Simple animation to show update
            badge.style.transform = 'scale(1.2)';
            setTimeout(() => badge.style.transform = 'scale(1)', 200);
        }
    });
}

function addToCart(button) {
    if (!button) return;
    button.classList.add('added-to-cart');
    const originalText = button.innerHTML;
    button.innerHTML = '<i class="fas fa-check"></i> Added';
    button.style.background = 'var(--color-primary)';
    button.style.color = '#fff';
    setTimeout(() => {
        button.classList.remove('added-to-cart');
        button.innerHTML = originalText;
        button.style.background = '';
        button.style.color = '';
    }, 1500);
}

// Handle function mappings for compatibility
window.updateCartBadge = updateGlobalCartBadge;

// Ensure update on load
function initCartBadge() {
    updateGlobalCartBadge();
    
    // Cross-tab syncing
    window.addEventListener('storage', (e) => {
        if(e.key === 'craftCart') updateGlobalCartBadge();
    });
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        initCartBadge();
        initImageZoom();
    });
} else {
    initCartBadge();
    initImageZoom();
}

function initImageZoom() {
    // Create lightbox if not exists
    if (!document.getElementById('lightboxOverlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'lightboxOverlay';
        overlay.className = 'lightbox-overlay';
        overlay.innerHTML = `
            <span class="lightbox-close">&times;</span>
            <img src="" alt="Zoomed view" class="lightbox-image">
        `;
        document.body.appendChild(overlay);

        const img = overlay.querySelector('img');
        const closeBtn = overlay.querySelector('.lightbox-close');

        // Use event delegation for dynamic images
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('product-image')) {
                img.src = e.target.src;
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay || e.target === closeBtn) {
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    }
}

// Advanced Reveal on Scroll Logic
const initRevealAnimations = () => {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const sections = document.querySelectorAll('section, .product-card, footer, .category-grid, .testimonial-grid');
    sections.forEach(el => {
        el.classList.add('reveal-on-scroll');
        observer.observe(el);
    });
};

document.addEventListener('DOMContentLoaded', initRevealAnimations);


