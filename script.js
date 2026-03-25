// 0. Loader Logic
window.addEventListener('load', () => {
    const loader = document.getElementById('loader');
    if (loader) {
        setTimeout(() => {
            loader.classList.add('fade-out');
            document.body.classList.remove('loading');
        }, 2500);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            hamburger.querySelector('i').classList.remove('fa-times');
            hamburger.querySelector('i').classList.add('fa-bars');
        });
    });

    // 2. Typing Effect
    const typingText = document.querySelector('.typing-text');
    const words = ['Aspiring Machine Learning Engineer'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingDelay = 100;

    function type() {
        if (!typingText) return;
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typingText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingDelay = 50;
        } else {
            typingText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingDelay = 120;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingDelay = 1500; // Pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingDelay = 400; // Pause before new word
        }

        setTimeout(type, typingDelay);
    }

    // Start typing effect after loader and hero reveal
    setTimeout(type, 3500); 

    // 3. Update copyright year
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // 4. Navbar active state on scroll & Reveal Animation
    const sections = document.querySelectorAll('section');
    const navButtons = document.querySelectorAll('.nav-links a');

    // Add reveal class to all sections and cards
    const revealElements = document.querySelectorAll('.section-header, .glass-card');
    revealElements.forEach(el => el.classList.add('reveal'));

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => revealOnScroll.observe(el));

    // Scroll active link updating
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navButtons.forEach(a => {
            a.classList.remove('active');
            if (a.getAttribute('href').includes(current)) {
                a.classList.add('active');
            }
        });

        // Navbar scroll effects
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px var(--glass-border)';
        } else {
            navbar.style.boxShadow = 'none';
        }
    });

    // 5. Contact Form Submit (Prevent default for demo)
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('.initialize-btn');
            if (!btn) return;

            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Initializing...';
            btn.disabled = true;

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            // 1. Dual-Delivery Log (Discord - Non-blocking)
            const webhookUrl = "https://discord.com/api/webhooks/2965503428668686009/6c2c462048a642ffba0a1a6675854019";
            fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    embeds: [{
                        title: "🚀 Mission Control: New Discovery",
                        color: 3447003,
                        fields: [
                            { name: "Sender", value: name, inline: true },
                            { name: "Email", value: email, inline: true },
                            { name: "Message", value: message }
                        ]
                    }]
                })
            }).catch(e => console.warn("Background notification skipped."));

            // 2. Official EmailJS Delivery (REST API - High Reliability)
            const emailData = {
                service_id: 'service_nlo5owh',
                template_id: 'template_tmdr2w4',
                user_id: '2o89jxQj_7RHlJ8rw',
                accessToken: '2pzovmVrPPMDmsSQ-TEgS',
                template_params: {
                    from_name: name,
                    from_email: email,
                    message: message,
                    reply_to: email,
                    // Parameters for redundancy
                    to_name: "Shantanu Chahar",
                    to_email: "shantanuchahar01@gmail.com",
                    recipient: "shantanuchahar01@gmail.com"
                }
            };

            try {
                const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(emailData)
                });

                if (response.ok) {
                    btn.innerHTML = '<i class="fas fa-check-circle"></i> Connection Initialized!';
                    btn.style.background = '#10b981';
                    btn.style.boxShadow = '0 10px 25px rgba(16, 185, 129, 0.4)';
                    contactForm.reset();
                } else {
                    const errorText = await response.text();
                    console.error("EmailJS REST Error:", errorText);
                    throw new Error('Delivery Service Error');
                }
            } catch (error) {
                console.error("Critical Failure:", error);
                btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Retry Connection';
                btn.style.background = '#ef4444';
            }

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.style.background = '';
                btn.style.boxShadow = '';
                btn.disabled = false;
            }, 4000);
        });
    }
    // 6. Theme Toggle Logic
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

    function updateTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (themeIcon) themeIcon.className = 'fas fa-sun';
        } else {
            document.documentElement.removeAttribute('data-theme');
            if (themeIcon) themeIcon.className = 'fas fa-moon';
        }
    }

    const savedTheme = localStorage.getItem('theme') || 'light';
    updateTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.hasAttribute('data-theme');
            const nextTheme = isDark ? 'light' : 'dark';
            updateTheme(nextTheme);
            localStorage.setItem('theme', nextTheme);
        });
    }

    // 7. Particle Background Animation
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 80;

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        }

        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.size = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
                if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                const isDark = document.documentElement.hasAttribute('data-theme');
                ctx.fillStyle = isDark ? 'rgba(16, 185, 129, 0.4)' : 'rgba(16, 185, 129, 0.2)';
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        ctx.beginPath();
                        const isDark = document.documentElement.hasAttribute('data-theme');
                        const opacity = (1 - distance / 150) * (isDark ? 0.2 : 0.1);
                        ctx.strokeStyle = `rgba(16, 185, 129, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animate);
        }

        animate();
    }
    // 7. Scroll Progress Bar
    window.addEventListener('scroll', () => {
        const scrollProgress = document.getElementById('scroll-progress');
        if (scrollProgress) {
            const h = document.documentElement, 
                  b = document.body,
                  st = 'scrollTop',
                  sh = 'scrollHeight';
            const percent = (h[st] || b[st]) / ((h[sh] || b[sh]) - h.clientHeight) * 100;
            scrollProgress.style.width = percent + '%';
        }
    });

    // 8. Staggered Intersection Observer Reveal
    const observerOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add short stagger based on index if multiple visible
                setTimeout(() => {
                    entry.target.classList.add('active');
                }, index * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply reveal class to all major sections and cards
    const elementsToReveal = document.querySelectorAll('.project-card, .cert-card, .accomplishment-item, .skill-group, .experience-card');
    elementsToReveal.forEach(el => {
        el.classList.add('reveal-item');
        revealObserver.observe(el);
    });
});

// Certificate Modal Logic
function openCertModal(imgSrc, title, verifyUrl) {
    const modal = document.getElementById('cert-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const verifyBtn = document.getElementById('modal-verify');

    if (!modal || !modalImg || !modalTitle || !verifyBtn) return;

    modalImg.src = imgSrc;
    modalTitle.innerText = title;
    verifyBtn.href = verifyUrl;

    if (!verifyUrl || verifyUrl === '#') {
        verifyBtn.style.display = 'none';
    } else {
        verifyBtn.style.display = 'inline-flex';
    }

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Global modal close listeners
document.addEventListener('click', (e) => {
    const modal = document.getElementById('cert-modal');
    if (!modal) return;
    if (e.target.classList.contains('close-modal') || e.target === modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const modal = document.getElementById('cert-modal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    }
});
