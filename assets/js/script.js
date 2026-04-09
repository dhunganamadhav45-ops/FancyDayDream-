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
    
    if (mobileToggle && navLinks) {
        mobileToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
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
    document.addEventListener('DOMContentLoaded', initCartBadge);
} else {
    initCartBadge();
}

