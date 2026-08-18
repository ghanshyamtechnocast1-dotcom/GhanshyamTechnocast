/* 
   Ghanshyam Technocast - Interactive Scripts
   Features: Hero Slideshow, 3D Interactive Mouse Tilt, Scroll Progress, Scroll Reveals, Active Nav Highlight, Products Filter, RFQ Form
*/

document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. Dynamic Copyright Year ---
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- 2. Floating Header Scroll Adaptation ---
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // --- 3. Mobile Navigation Menu Toggle ---
    const mobileToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when a navigation link is clicked
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }

    // --- 4. Scroll Progress & Timeline Progress Indicators ---
    const scrollProgress = document.getElementById('scroll-progress');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineProgress = document.querySelector('.timeline-progress');
    const timeline = document.querySelector('.process-timeline');

    window.addEventListener('scroll', () => {
        // Page Scroll Progress
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrolledPercent = (window.scrollY / docHeight) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = scrolledPercent + '%';
        }

        // Process Timeline Animation
        if (timeline && timelineProgress && timelineItems.length > 0) {
            const rect = timeline.getBoundingClientRect();
            const viewHeight = window.innerHeight;
            
            // Calculate how far down the timeline we have scrolled in viewport
            const timelineStart = rect.top + window.scrollY - (viewHeight * 0.4);
            const timelineHeight = rect.height;
            const currentScroll = window.scrollY - timelineStart;
            
            let progressRatio = currentScroll / timelineHeight;
            progressRatio = Math.max(0, Math.min(1, progressRatio)); // clamp between 0 and 1
            
            timelineProgress.style.height = (progressRatio * 100) + '%';

            // Activate markers sequentially based on scrolling position
            timelineItems.forEach((item, index) => {
                const itemRect = item.getBoundingClientRect();
                const itemCenter = itemRect.top + itemRect.height / 2;
                
                if (itemCenter < viewHeight * 0.75) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });
        }
    });

    // --- 5. Hero Manual & Automatic Background Slider ---
    const slides = document.querySelectorAll('.hero-slider .slide');
    const dots = document.querySelectorAll('.slider-dots .dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    let slideTimer;
    const slideInterval = 6000; // 6 seconds

    function showSlide(index) {
        if (slides.length === 0) return;
        
        slides[currentSlide].classList.remove('active');
        if (dots.length > currentSlide) {
            dots[currentSlide].classList.remove('active');
        }

        currentSlide = (index + slides.length) % slides.length;

        slides[currentSlide].classList.add('active');
        if (dots.length > currentSlide) {
            dots[currentSlide].classList.add('active');
        }
    }

    function resetTimer() {
        clearInterval(slideTimer);
        slideTimer = setInterval(() => {
            showSlide(currentSlide + 1);
        }, slideInterval);
    }

    if (slides.length > 0) {
        resetTimer();

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                showSlide(currentSlide - 1);
                resetTimer();
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                showSlide(currentSlide + 1);
                resetTimer();
            });
        }

        dots.forEach((dot, idx) => {
            dot.addEventListener('click', () => {
                showSlide(idx);
                resetTimer();
            });
        });
    }

    // --- 6. Scroll Reveal Animation using IntersectionObserver ---
    const reveals = document.querySelectorAll('.scroll-reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                // Optional: Stop observing after reveal is done
                // revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(reveal => revealObserver.observe(reveal));

    // --- 7. Active Navigation Links Highlights ---
    const path = window.location.pathname.toLowerCase();
    let activePage = 'index.html';
    
    if (path.includes('about')) {
        activePage = 'about.html';
    } else if (path.includes('process')) {
        activePage = 'process.html';
    } else if (path.includes('products')) {
        activePage = 'products.html';
    } else if (path.includes('contact')) {
        activePage = 'contact.html';
    }
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (
            href === activePage || 
            href.includes(activePage) || 
            (activePage === 'index.html' && (href === '#home' || href === 'index.html#home' || href === 'index.html'))
        ) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // --- 8. Interactive 3D Card Hover-Tilt Effect ---
    const tiltCards = document.querySelectorAll('.tilt-target');
    
    tiltCards.forEach(card => {
        const glow = card.querySelector('.card-glow');

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            
            // Mouse position relative to the card dimensions
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Normalize center of the card as coordinate origin (0, 0)
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Calculate distance factor from center (-1 to 1)
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            // Maximum tilt angle (in degrees)
            const maxTilt = 8;
            
            // Rotate card: rotating around Y moves left/right, X moves up/down
            const rotateY = deltaX * maxTilt;
            const rotateX = -deltaY * maxTilt; // invert to match drag feel
            
            // Apply 3D rotation transforms
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            
            // Track radial light glow following the mouse pointer
            if (glow) {
                glow.style.left = `${x}px`;
                glow.style.top = `${y}px`;
            }
        });

        card.addEventListener('mouseleave', () => {
            // Restore original position smoothly
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });

    // --- 9. Products Filtering System ---
    const tabBtns = document.querySelectorAll('.tab-btn');
    const productItems = document.querySelectorAll('.product-item');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Set active class on button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            productItems.forEach(item => {
                if (filterValue === 'all') {
                    item.classList.remove('hide');
                } else {
                    const category = item.getAttribute('data-category');
                    if (category === filterValue) {
                        item.classList.remove('hide');
                    } else {
                        item.classList.add('hide');
                    }
                }
            });
        });
    });

    // --- 10. 3D Contact Form RFQ Handling ---
    const rfqForm = document.getElementById('rfq-form');
    const successAlert = document.getElementById('form-success-alert');
    const closeAlertBtn = document.getElementById('close-alert-btn');

    if (rfqForm) {
        rfqForm.addEventListener('submit', (e) => {
            // Simple validation check
            let isValid = true;
            const inputs = rfqForm.querySelectorAll('input[required], textarea[required], select[required]');
            
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    isValid = false;
                    input.style.borderColor = 'var(--color-primary)';
                } else {
                    input.style.borderColor = '';
                }
            });

            // Email format verification
            const emailInput = document.getElementById('email');
            if (emailInput && emailInput.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(emailInput.value.trim())) {
                    isValid = false;
                    emailInput.style.borderColor = 'var(--color-primary)';
                }
            }

            if (!isValid) {
                e.preventDefault(); // Stop submission if there are validation errors
            } else {
                e.preventDefault();

                // Change submit button to loading state
                const submitBtn = rfqForm.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<span>Sending Request...</span><i class="fa-solid fa-spinner fa-spin" style="margin-left: 8px;"></i>';

                const nameVal = document.getElementById('name').value.trim();
                const emailVal = document.getElementById('email').value.trim();
                const phoneVal = document.getElementById('phone').value.trim();
                const serviceVal = document.getElementById('service').value;
                const messageVal = document.getElementById('message').value.trim();

                let serviceText = "";
                if (serviceVal === "steel-casting") serviceText = "Steel Casting Supply";
                else if (serviceVal === "cnc-turning") serviceText = "CNC / VMC Turning Jobwork";
                else if (serviceVal === "joint-solution") serviceText = "Cast + Machined Complete Solution";
                else serviceText = "Other Inquiry";

                // FormSubmit Payload
                const payload = {
                    name: nameVal,
                    email: emailVal,
                    phone: phoneVal,
                    service: serviceText,
                    message: messageVal,
                    _subject: `New Casting Inquiry from ${nameVal}`,
                    _captcha: "false",
                    _template: "table"
                };

                // Send request securely in background
                fetch("https://formsubmit.co/ajax/ghanshyamtechnocast1@gmail.com", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(payload)
                })
                .then(response => response.json())
                .then(data => {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;

                    if (data.success === "true" || data.success === true) {
                        // Show success modal popup
                        if (successAlert) {
                            successAlert.classList.add('active');
                        } else {
                            alert("Thank you! Your request has been sent successfully.");
                        }
                        rfqForm.reset();
                    } else {
                        alert("Submission failed. Please try again or email us directly at ghanshyamtechnocast1@gmail.com");
                    }
                })
                .catch(error => {
                    console.error("Error submitting form:", error);
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalBtnText;
                    alert("Submission failed due to network error. Please try again or email us directly at ghanshyamtechnocast1@gmail.com");
                });
            }
        });
    }

    // Close form confirmation overlay if modal exists
    if (closeAlertBtn && successAlert) {
        closeAlertBtn.addEventListener('click', () => {
            successAlert.classList.remove('active');
        });
    }
});
