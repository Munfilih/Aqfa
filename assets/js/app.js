/* ==========================================================================
   AQFA COMPANY - JAVASCRIPT APPLICATION CONTROLLER
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialize Lucide Icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Language Switcher State Management
    const langBtn = document.getElementById('lang-btn');
    let currentLang = localStorage.getItem('aqfa_lang') || 'en';

    // Apply language state to HTML element
    const applyLanguage = (lang) => {
        document.documentElement.setAttribute('lang', lang);
        document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        localStorage.setItem('aqfa_lang', lang);
        currentLang = lang;
        
        // Update form placeholders dynamically based on current language
        updateFormPlaceholders(lang);
        
        // Refresh icons just in case
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    };

    // Toggle Language handler
    langBtn.addEventListener('click', () => {
        const nextLang = currentLang === 'en' ? 'ar' : 'en';
        applyLanguage(nextLang);
    });

    // Function to dynamically update input placeholders based on language
    const updateFormPlaceholders = (lang) => {
        const nameInput = document.getElementById('form-name');
        const phoneInput = document.getElementById('form-phone');
        const emailInput = document.getElementById('form-email');
        const messageInput = document.getElementById('form-message');
        
        if (lang === 'ar') {
            if (nameInput) nameInput.placeholder = 'اكتب اسمك الكامل هنا';
            if (phoneInput) phoneInput.placeholder = 'مثال: 966555555555+';
            if (emailInput) emailInput.placeholder = 'اسمك@النطاق.com';
            if (messageInput) messageInput.placeholder = 'يرجى كتابة تفاصيل استفسارك أو طلبك هنا...';
        } else {
            if (nameInput) nameInput.placeholder = 'John Doe / الاسم الكامل';
            if (phoneInput) phoneInput.placeholder = '+966 55 555 5555';
            if (emailInput) emailInput.placeholder = 'example@domain.com';
            if (messageInput) messageInput.placeholder = 'Explain your inquiry detail / اكتب تفاصيل استفسارك هنا...';
        }
    };

    // Apply initial language state
    applyLanguage(currentLang);


    // 3. Hash-Based SPA Router
    const sections = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.nav-link');

    const handleRoute = () => {
        let rawHash = window.location.hash || '#home';
        
        // Split hash in case of query params (e.g. #contact?inquiry=MISA)
        let hashParts = rawHash.split('?');
        let hash = hashParts[0];
        let queryStr = hashParts[1] || '';

        // If target section exists, toggle active views
        const targetSection = document.querySelector(hash);
        if (targetSection) {
            // Remove active classes
            sections.forEach(sec => sec.classList.remove('active'));
            navLinks.forEach(link => link.classList.remove('active'));

            // Set active class on target section
            targetSection.classList.add('active');

            // Set active class on corresponding nav menu link
            const correspondingLink = document.querySelector(`.nav-link[data-hash="${hash.substring(1)}"]`);
            if (correspondingLink) {
                correspondingLink.classList.add('active');
            }

            // Scroll page to top smoothly
            window.scrollTo({ top: 0, behavior: 'instant' });
            
            // Close mobile menu if active
            const navMenu = document.getElementById('nav-menu');
            const mobileToggle = document.getElementById('mobile-toggle');
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                mobileToggle.classList.remove('active');
            }

            // Route-specific configurations (e.g., auto-filling the contact form query)
            if (hash === '#contact' && queryStr) {
                parseContactQueryParams(queryStr);
            }
        }
    };

    // Parse inquiry queries from URL (e.g. ?inquiry=MISA%20Foreign%20Company)
    const parseContactQueryParams = (queryStr) => {
        const params = new URLSearchParams(queryStr);
        const inquiryVal = params.get('inquiry');
        
        if (inquiryVal) {
            const selectDropdown = document.getElementById('form-inquiry');
            if (selectDropdown) {
                // Decode URI Component and match select options values
                const decodedVal = decodeURIComponent(inquiryVal);
                
                // Find matching option
                for (let option of selectDropdown.options) {
                    if (option.value === decodedVal) {
                        selectDropdown.value = decodedVal;
                        break;
                    }
                }
            }
        }
    };

    // Listen to hash shifts
    window.addEventListener('hashchange', handleRoute);
    
    // Trigger initial routing
    handleRoute();


    // 4. Mobile Menu Navigation Slider
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking outside of it on mobile
    document.addEventListener('click', (event) => {
        const isClickInsideMenu = navMenu.contains(event.target);
        const isClickToggle = mobileToggle.contains(event.target);
        
        if (!isClickInsideMenu && !isClickToggle && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            mobileToggle.classList.remove('active');
        }
    });


    // 5. Scroll Scrollbars & Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    const header = document.querySelector('.header');

    window.addEventListener('scroll', () => {
        // Sticky Header shrink
        if (window.scrollY > 80) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }

        // Back to top appearance threshold
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('active');
        } else {
            backToTopBtn.classList.remove('active');
        }
    });

    // Scroll to top click event
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    // 6. Inquiry Contact Form Submission Logic
    const inquiryForm = document.getElementById('inquiry-form');
    const toast = document.getElementById('toast-notification');

    if (inquiryForm) {
        inquiryForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Gather values for processing/validation
            const name = document.getElementById('form-name').value;
            const phone = document.getElementById('form-phone').value;
            const email = document.getElementById('form-email').value;
            const inquiry = document.getElementById('form-inquiry').value;
            const message = document.getElementById('form-message').value;

            // Log details (demonstrates processing)
            console.log("Form Submitted:", { name, phone, email, inquiry, message });

            // Trigger premium toast response
            if (toast) {
                toast.classList.add('active');
                
                // Hide toast after 4.5 seconds
                setTimeout(() => {
                    toast.classList.remove('active');
                }, 4500);
            }

            // Reset form details
            inquiryForm.reset();
        });
    }

    // 7. Dynamic WhatsApp Floating Widget Prefill Query
    const waFloat = document.getElementById('whatsapp-float-widget');
    if (waFloat) {
        waFloat.addEventListener('click', (e) => {
            // Pick a message template depending on selected language
            const textTemplate = currentLang === 'ar' 
                ? 'مرحباً شركة أقفى، أود الحصول على استشارة مجانية بخصوص تأسيس الشركات والمعاملات الحكومية.'
                : 'Hello AQFA, I would like to request a consultation regarding Saudi company incorporation and government services.';
            
            // Build direct chat URL dynamically
            const phoneNum = '966550190428'; // Primary WhatsApp number
            const encodedText = encodeURIComponent(textTemplate);
            
            waFloat.href = `https://wa.me/${phoneNum}?text=${encodedText}`;
        });
    }
});
