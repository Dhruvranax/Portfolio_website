// ========================================
// Dhruv Rana - Cybersecurity Portfolio
// Enhanced JavaScript with Advanced Animations
// ========================================

// Project Data - Fetched from GitHub + Custom Security Projects
const projectsData = [
    {
        id: 1,
        title: "Network Vulnerability Scanner",
        description: "Automated network scanning tool built with Python using Nmap library. Performs host discovery, port scanning, service enumeration, and vulnerability detection with customizable scan profiles. Generates detailed HTML/JSON reports with risk ratings.",
        type: "security",
        tech: ["Python", "Nmap", "Threading", "ReportLab", "JSON"],
        icon: "fa-search",
        github: "https://github.com/Dhruvranax",
        live: null,
        featured: true
    },
    {
        id: 2,
        title: "SIEM Log Analysis Dashboard",
        description: "Real-time security event monitoring dashboard using ELK Stack (Elasticsearch, Logstash, Kibana). Ingests syslog/firewall logs, correlates events using custom rules, and provides alerting for suspicious activities like brute force, port scans, and malware C2 traffic.",
        type: "security",
        tech: ["ELK Stack", "Logstash", "Kibana", "Elasticsearch", "Regex"],
        icon: "fa-chart-line",
        github: "https://github.com/Dhruvranax",
        live: null,
        featured: true
    },
    {
        id: 3,
        title: "Web Application Penetration Testing Lab",
        description: "Dockerized vulnerable web application environment (DVWA, bWAPP, Mutillidae) for practicing OWASP Top 10 vulnerabilities. Includes automated setup scripts, exploitation guides, and remediation documentation for SQLi, XSS, CSRF, File Upload, and Auth bypass.",
        type: "security",
        tech: ["Docker", "DVWA", "bWAPP", "Burp Suite", "SQLMap", "OWASP"],
        icon: "fa-bug",
        github: "https://github.com/Dhruvranax",
        live: null,
        featured: true
    },
    {
        id: 4,
        title: "Password Strength Analyzer",
        description: "Entropy-based password strength checker with real-time feedback. Implements zxcvbn algorithm, checks against common password lists (rockyou.txt), detects patterns (keyboard walks, dates, repeats), and suggests improvements. Built as both CLI tool and web interface.",
        type: "security",
        tech: ["Python", "JavaScript", "zxcvbn", "Flask", "Entropy Calculation"],
        icon: "fa-lock",
        github: "https://github.com/Dhruvranax",
        live: null,
        featured: false
    },
    {
        id: 5,
        title: "Automated Vulnerability Report Generator",
        description: "Python script that parses Nessus/OpenVAS XML outputs and generates professional penetration test reports. Includes executive summary, risk matrix, affected hosts, remediation tracking, and compliance mapping (PCI-DSS, ISO 27001).",
        type: "security",
        tech: ["Python", "XML Parsing", "Jinja2", "ReportLab", "Nessus API"],
        icon: "fa-file-alt",
        github: "https://github.com/Dhruvranax",
        live: null,
        featured: false
    }
];

// ========================================
// Global State
// ========================================
let mouseX = 0, mouseY = 0;
let particleSystem = null;
let scrollProgress = null;
let theme = localStorage.getItem('theme') || 'dark';
let reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ========================================
// DOM Elements
// ========================================
const elements = {
    navToggle: null,
    navMenu: null,
    navLinks: null,
    navbar: null,
    projectsGrid: null,
    filterBtns: null,
    contactForm: null,
    scrollIndicator: null,
    themeToggle: null,
    terminalLines: null,
    proficiencyBars: null,
    scrollProgressBar: null
};

// ========================================
// Initialize
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    cacheElements();
    initTheme();
    initParticles();
    initScrollProgress();
    initNavigation();
    initProjects();
    initContactForm();
    initHeroAnimations();      // Must run BEFORE initScrollAnimations to add .reveal classes
    initScrollAnimations();    // Now observes the .reveal elements
    initTerminalTyping();
    initMagneticEffects();
    init3DTilt();
    initCursorTrail();
    initTextScramble();
    initProficiencyAnimations();
    initThemeToggle();
    handleScrollIndicator();
    setupEventListeners();
    initSkillTagColors();      // Apply dynamic colors to skill tags
    consoleEasterEgg();
});

// ========================================
// Cache DOM Elements
// ========================================
function cacheElements() {
    elements.navToggle = document.getElementById('nav-toggle');
    elements.navMenu = document.getElementById('nav-menu');
    elements.navLinks = document.querySelectorAll('.nav-link');
    elements.navbar = document.getElementById('navbar');
    elements.projectsGrid = document.getElementById('projects-grid');
    elements.filterBtns = document.querySelectorAll('.filter-btn');
    elements.contactForm = document.getElementById('contact-form');
    elements.scrollIndicator = document.querySelector('.scroll-indicator');
    elements.themeToggle = document.querySelector('.theme-toggle');
    elements.terminalLines = document.querySelectorAll('.terminal-line');
    elements.proficiencyBars = document.querySelector('.proficiency-bars');
    elements.scrollProgressBar = document.querySelector('.scroll-progress');

    }

// ========================================
// Theme Management
// ========================================
function initTheme() {
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon();
}

function toggleTheme() {
    theme = theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon();

    // Animate theme transition
    document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
    setTimeout(() => { document.body.style.transition = ''; }, 500);
}

function updateThemeIcon() {
    if (!elements.themeToggle) return;
    const sunIcon = elements.themeToggle.querySelector('.fa-sun');
    const moonIcon = elements.themeToggle.querySelector('.fa-moon');
    if (theme === 'dark') {
        sunIcon?.style.setProperty('display', 'block', 'important');
        moonIcon?.style.setProperty('display', 'none', 'important');
    } else {
        sunIcon?.style.setProperty('display', 'none', 'important');
        moonIcon?.style.setProperty('display', 'block', 'important');
    }
}

function initThemeToggle() {
    if (elements.themeToggle) {
        elements.themeToggle.addEventListener('click', toggleTheme);
    }
}

// ========================================
// Particle System (Hero Background)
// ========================================
function initParticles() {
    if (reducedMotion) return;

    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';

    const heroBg = document.querySelector('.hero-background');
    if (heroBg) {
        heroBg.appendChild(canvas);
        particleSystem = new ParticleSystem(canvas);
        particleSystem.start();
    }
}

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0, radius: 150 };
        this.animationId = null;
        this.resize();
        this.initParticles();
        this.bindEvents();
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth * window.devicePixelRatio;
        this.canvas.height = this.canvas.offsetHeight * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.width = this.canvas.offsetWidth;
        this.height = this.canvas.offsetHeight;
    }

    initParticles() {
        const count = Math.min(80, Math.floor((this.width * this.height) / 15000));
        this.particles = [];
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(this.width, this.height));
        }
    }

    bindEvents() {
        window.addEventListener('resize', debounce(() => this.resize(), 250));
        document.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
    }

    start() {
        this.animate();
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Update and draw particles
        this.particles.forEach(p => {
            p.update(this.mouse);
            p.draw(this.ctx);
        });

        // Draw connections
        this.drawConnections();

        this.animationId = requestAnimationFrame(() => this.animate());
    }

    drawConnections() {
        const maxDist = 120;
        const rainbowColors = [
            'rgba(255, 0, 110,',
            'rgba(251, 86, 7,',
            'rgba(255, 190, 11,',
            'rgba(6, 255, 165,',
            'rgba(58, 134, 255,',
            'rgba(131, 56, 236,',
            'rgba(255, 0, 110,'
        ];

        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    const opacity = (1 - dist / maxDist) * 0.15;
                    // Use a rainbow color based on particle position
                    const colorIndex = Math.floor((this.particles[i].x + this.particles[i].y) / 100) % rainbowColors.length;
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.strokeStyle = `${rainbowColors[colorIndex]} ${opacity})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                }
            }
        }
    }
}

class Particle {
    constructor(width, height) {
        this.reset(width, height);
    }

    reset(width, height) {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.3;
        this.vy = (Math.random() - 0.5) * 0.3;
        this.radius = Math.random() * 2.5 + 0.5;
        this.baseRadius = this.radius;
        this.opacity = Math.random() * 0.6 + 0.15;

        // Rainbow colors - full spectrum
        const colors = [
            '#ff006e',  // Magenta
            '#fb5607',  // Red-Orange
            '#ffbe0b',  // Gold
            '#06ffa5',  // Mint Green
            '#3a86ff',  // Blue
            '#8338ec',  // Violet
            '#ff006e'   // Magenta (wrap)
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    update(mouse) {
        // Mouse attraction
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius && dist > 0) {
            const force = (mouse.radius - dist) / mouse.radius * 0.02;
            this.vx += (dx / dist) * force;
            this.vy += (dy / dist) * force;
            this.radius = this.baseRadius * 1.8;
            this.opacity = 0.9;
        } else {
            this.radius = this.baseRadius;
            this.opacity = Math.random() * 0.6 + 0.15;
        }

        // Apply velocity
        this.x += this.vx;
        this.y += this.vy;

        // Damping
        this.vx *= 0.99;
        this.vy *= 0.99;

        // Boundary check
        if (this.x < 0 || this.x > window.innerWidth || this.y < 0 || this.y > window.innerHeight) {
            this.reset(window.innerWidth, window.innerHeight);
        }
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // Add glow effect
        ctx.shadowColor = this.color;
        ctx.shadowBlur = this.radius * 3;
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }
}

// ========================================
// Scroll Progress Bar
// ========================================
function initScrollProgress() {
    if (reducedMotion) return;

    scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);

    window.addEventListener('scroll', throttle(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = scrollTop / docHeight;
        scrollProgress.style.transform = `scaleX(${scrollPercent})`;
    }, 16));
}

// ========================================
// Navigation
// ========================================
function initNavigation() {
    // Mobile menu toggle
    elements.navToggle?.addEventListener('click', () => {
        elements.navToggle.classList.toggle('active');
        elements.navMenu?.classList.toggle('active');
        document.body.style.overflow = elements.navMenu?.classList.contains('active') ? 'hidden' : '';
        elements.navToggle.setAttribute('aria-expanded', elements.navToggle.classList.contains('active'));
    });

    // Close menu on link click
    elements.navLinks.forEach(link => {
        link.addEventListener('click', () => {
            elements.navToggle?.classList.remove('active');
            elements.navMenu?.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 50) {
            elements.navbar?.classList.add('scrolled');
        } else {
            elements.navbar?.classList.remove('scrolled');
        }
    }, 50));

    // Active link highlighting
    window.addEventListener('scroll', throttle(() => {
        const sections = document.querySelectorAll('section[id]');
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                elements.navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, 100));
}

// ========================================
// Projects Rendering & Filtering
// ========================================
function initProjects() {
    renderProjects('all');

    elements.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            elements.filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            renderProjects(btn.dataset.filter);
        });
    });
}

function renderProjects(filter) {
    const filtered = filter === 'all'
        ? projectsData
        : projectsData.filter(p => p.type === filter);

    elements.projectsGrid.innerHTML = filtered.map((project, index) => `
        <article class="project-card reveal stagger-${(index % 8) + 1}" data-type="${project.type}" style="transform-style: preserve-3d;">
            <div class="project-header">
                <div class="project-icon-wrapper">
                    <div class="project-icon">
                        <i class="fas ${project.icon}"></i>
                    </div>
                    <div class="project-icon-ring"></div>
                </div>
                <span class="project-type ${project.type}">${project.type}</span>
            </div>
            <div class="project-body">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-description">${project.description}</p>
                <div class="project-tech">
                    ${project.tech.map(t => `<span>${t}</span>`).join('')}
                </div>
                <div class="project-links">
                    ${project.github ? `
                        <a href="${project.github}" target="_blank" class="project-link magnetic" rel="noopener noreferrer">
                            <i class="fab fa-github"></i> Code
                        </a>
                    ` : ''}
                    ${project.live ? `
                        <a href="${project.live}" target="_blank" class="project-link magnetic" rel="noopener noreferrer">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>
                    ` : ''}
                </div>
            </div>
        </article>
    `).join('');

    // Initialize 3D tilt for new cards
    init3DTilt();
    observeElements();
}

// ========================================
// Scroll Animations (Intersection Observer)
// ========================================
let scrollObserver = null;

function initScrollAnimations() {
    // Create observer if not exists
    if (!scrollObserver) {
        createScrollObserver();
    }

    // Re-observe all reveal elements (including newly added .reveal classes)
    observeElements();

    // Parallax for hero background
    window.addEventListener('scroll', throttle(() => {
        if (reducedMotion) return;
        const scrolled = window.pageYOffset;
        const heroBg = document.querySelector('.hero-background');
        if (heroBg && scrolled < window.innerHeight) {
            heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
        }

        // Parallax for orbs
        document.querySelectorAll('.orb').forEach((orb, i) => {
            const speed = 0.15 + i * 0.05;
            orb.style.transform = `translateY(${scrolled * speed}px)`;
        });
    }, 16));
}

function createScrollObserver() {
    scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');

                // Trigger proficiency bars animation
                if (entry.target.classList.contains('proficiency-bars') ||
                    entry.target.closest('.proficiency-section')) {
                    animateProficiencyBars();
                }

                // Trigger timeline items
                if (entry.target.classList.contains('timeline-item')) {
                    entry.target.classList.add('visible');
                }

                // Trigger text reveal
                if (entry.target.classList.contains('text-reveal')) {
                    entry.target.classList.add('active');
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
}

function observeElements() {
    if (!scrollObserver) {
        createScrollObserver();
    }

    // Observe all reveal elements
    const revealSelectors = [
        '.reveal', '.project-card', '.skill-category', '.cert-card',
        '.exp-card', '.info-card', '.highlight', '.stat',
        '.timeline-item', '.proficiency-item', '.proficiency-bars',
        '.text-reveal'
    ];

    document.querySelectorAll(revealSelectors.join(', ')).forEach(el => {
        scrollObserver.observe(el);
    });
}

// ========================================
// Hero Animations
// ========================================
function initHeroAnimations() {
    // Stagger animations for hero elements
    const heroElements = [
        { selector: '.hero-greeting', delay: 0 },
        { selector: '.hero-name', delay: 100 },
        { selector: '.hero-titles', delay: 200 },
        { selector: '.hero-description', delay: 300 },
        { selector: '.hero-stats', delay: 400 },
        { selector: '.hero-actions', delay: 500 },
        { selector: '.hero-social', delay: 600 },
        { selector: '.hero-visual', delay: 200 }
    ];

    heroElements.forEach(({ selector, delay }) => {
        const el = document.querySelector(selector);
        if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(40px)';
            el.style.transition = 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, delay);
        }
    });

    // Add reveal classes to sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.add('reveal');
    });

    // Add reveal to cards with stagger
    const cardSelectors = [
        '.skill-category', '.cert-card', '.exp-card',
        '.info-card', '.highlight', '.stat', '.timeline-item'
    ];

    cardSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach((el, i) => {
            el.classList.add('reveal', `stagger-${(i % 8) + 1}`);
        });
    });

    // Add text-reveal to section titles
    document.querySelectorAll('.section-title').forEach(title => {
        title.classList.add('text-reveal');
        title.innerHTML = `<span>${title.textContent}</span>`;
    });
}

// ========================================
// Terminal Typing Animation
// ========================================
function initTerminalTyping() {
    if (reducedMotion) return;

    const lines = document.querySelectorAll('.terminal-line:not(.output) .command:not(.blinking)');

    lines.forEach((line, index) => {
        const text = line.textContent;
        line.textContent = '';
        line.style.opacity = '1';

        setTimeout(() => {
            typeText(line, text, 30);
        }, 500 + index * 600);
    });

    // Animate output lines
    const outputs = document.querySelectorAll('.terminal-line.output');
    outputs.forEach((output, index) => {
        output.style.opacity = '0';
        output.style.transform = 'translateX(-20px)';
        output.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        setTimeout(() => {
            output.style.opacity = '1';
            output.style.transform = 'translateX(0)';
        }, 2000 + index * 300);
    });
}

function typeText(element, text, speed) {
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
            // Add blinking cursor after typing
            const cursor = document.createElement('span');
            cursor.className = 'command blinking';
            cursor.textContent = '_';
            element.parentNode.appendChild(cursor);
        }
    }, speed);
}

// ========================================
// Magnetic Effect
// ========================================
function initMagneticEffects() {
    if (reducedMotion) return;

    const magneticElements = document.querySelectorAll('.magnetic, .btn, .social-link, .project-link, .filter-btn, .nav-link, .footer-links a, .theme-toggle, .skill-tag, .goal-tag');

    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const strength = el.classList.contains('btn') ? 0.3 : 0.15;
            el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
            el.style.transition = 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
    });
}

// ========================================
// 3D Tilt Effect
// ========================================
function init3DTilt() {
    if (reducedMotion) return;

    const tiltElements = document.querySelectorAll('.project-card, .skill-category, .cert-card, .exp-card, .info-card');

    tiltElements.forEach(el => {
        // Remove existing listeners
        el.removeEventListener('mousemove', handleTilt);
        el.removeEventListener('mouseleave', handleTiltLeave);

        // Add new listeners
        el.addEventListener('mousemove', handleTilt);
        el.addEventListener('mouseleave', handleTiltLeave);
    });
}

function handleTilt(e) {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = (y - centerY) / centerY * -8;
    const rotateY = (x - centerX) / centerX * 8;

    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    el.style.transition = 'transform 0.1s ease-out';

    // Move child elements for depth
    const depth = el.querySelectorAll('[style*="transform-style"]');
    depth.forEach((child, i) => {
        const factor = (i + 1) * 5;
        child.style.transform = `translateZ(${factor}px) rotateX(${rotateX * 0.5}deg) rotateY(${rotateY * 0.5}deg)`;
    });
}

function handleTiltLeave(e) {
    const el = e.currentTarget;
    el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
    el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';

    const depth = el.querySelectorAll('[style*="transform-style"]');
    depth.forEach(child => {
        child.style.transform = 'translateZ(0)';
        child.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
    });
}

// ========================================
// Cursor Trail Effect
// ========================================
function initCursorTrail() {
    if (reducedMotion || window.innerWidth < 768) return;

    const trail = [];
    const trailLength = 20;
    const rainbowColors = [
        'linear-gradient(135deg, #ff006e, #fb5607)',
        'linear-gradient(135deg, #fb5607, #ffbe0b)',
        'linear-gradient(135deg, #ffbe0b, #06ffa5)',
        'linear-gradient(135deg, #06ffa5, #3a86ff)',
        'linear-gradient(135deg, #3a86ff, #8338ec)',
        'linear-gradient(135deg, #8338ec, #ff006e)',
        'linear-gradient(135deg, #ff006e, #fb5607)',
    ];
    const rainbowShadows = [
        '#ff006e', '#fb5607', '#ffbe0b', '#06ffa5', '#3a86ff', '#8338ec', '#ff006e'
    ];

    for (let i = 0; i < trailLength; i++) {
        const colorIndex = i % rainbowColors.length;
        const dot = document.createElement('div');
        dot.style.cssText = `
            position: fixed;
            width: ${8 - i * 0.3}px;
            height: ${8 - i * 0.3}px;
            border-radius: 50%;
            background: ${rainbowColors[colorIndex]};
            pointer-events: none;
            z-index: 9999;
            opacity: ${1 - i / trailLength};
            transform: translate(-50%, -50%);
            transition: transform 0.05s ease-out, opacity 0.1s ease;
            box-shadow: 0 0 ${10 - i * 0.4}px ${rainbowShadows[colorIndex]};
        `;
        document.body.appendChild(dot);
        trail.push({ element: dot, x: 0, y: 0 });
    }

    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateTrail() {
        trail[0].x = mouseX;
        trail[0].y = mouseY;
        trail[0].element.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;

        for (let i = 1; i < trailLength; i++) {
            const prev = trail[i - 1];
            const curr = trail[i];

            curr.x += (prev.x - curr.x) * 0.3;
            curr.y += (prev.y - curr.y) * 0.3;

            curr.element.style.transform = `translate(${curr.x}px, ${curr.y}px) translate(-50%, -50%)`;
            curr.element.style.opacity = (1 - i / trailLength) * 0.6;
        }

        requestAnimationFrame(animateTrail);
    }

    animateTrail();

    // Hide trail when mouse leaves window
    document.addEventListener('mouseleave', () => {
        trail.forEach(t => t.element.style.opacity = '0');
    });

    document.addEventListener('mouseenter', () => {
        trail.forEach((t, i) => t.element.style.opacity = (1 - i / trailLength) * 0.6);
    });
}

// ========================================
// Text Scramble Effect
// ========================================
function initTextScramble() {
    const scrambleElements = document.querySelectorAll('.section-title, .hero-name');

    scrambleElements.forEach(el => {
        const originalText = el.textContent;
        let isScrambling = false;

        el.addEventListener('mouseenter', () => {
            if (isScrambling || reducedMotion) return;
            isScrambling = true;
            scrambleText(el, originalText);
        });
    });
}

function scrambleText(element, targetText) {
    const chars = '!<>-_\\/[]{}—=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const originalText = targetText;
    let iteration = 0;
    const maxIterations = 30;

    const interval = setInterval(() => {
        element.textContent = originalText
            .split('')
            .map((char, index) => {
                if (index < iteration) return originalText[index];
                if (char === ' ') return ' ';
                return chars[Math.floor(Math.random() * chars.length)];
            })
            .join('');

        iteration += 1;

        if (iteration >= maxIterations) {
            clearInterval(interval);
            element.textContent = originalText;
            // Reset flag after animation
            setTimeout(() => {
                element.removeAttribute('data-scrambling');
            }, 100);
        }
    }, 80);
}

// ========================================
// Proficiency Bars Animation
// ========================================
function initProficiencyAnimations() {
    const proficiencySection = document.querySelector('.proficiency-section');
    if (!proficiencySection) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateProficiencyBars();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    observer.observe(proficiencySection);
}

function animateProficiencyBars() {
    const fills = document.querySelectorAll('.proficiency-fill');
    const labels = document.querySelectorAll('.proficiency-label i');

    fills.forEach((fill, index) => {
        const targetWidth = fill.style.width || '0%';
        fill.style.width = '0%';

        setTimeout(() => {
            fill.style.transition = 'width 1.8s cubic-bezier(0.16, 1, 0.3, 1)';
            fill.style.width = targetWidth;
        }, index * 150);
    });

    labels.forEach((label, index) => {
        label.style.opacity = '0';
        label.style.transform = 'translateX(-10px)';
        label.style.transition = 'opacity 0.5s ease, transform 0.5s ease';

        setTimeout(() => {
            label.style.opacity = '1';
            label.style.transform = 'translateX(0)';
        }, 300 + index * 100);
    });

    // Mark proficiency section as visible for label animations
    document.querySelector('.proficiency-bars')?.classList.add('visible');
}

// ========================================
// Contact Form
// ========================================
function initContactForm() {
    if (!elements.contactForm) return;

    // Add character counter for textarea
    const textarea = elements.contactForm.querySelector('textarea');
    if (textarea) {
        const counter = document.createElement('div');
        counter.className = 'char-count';
        counter.textContent = `0 / 5000`;
        textarea.parentNode.appendChild(counter);
        textarea.setAttribute('maxlength', '5000');

        textarea.addEventListener('input', () => {
            counter.textContent = `${textarea.value.length} / 5000`;
        });
    }

    // Add field underline elements
    elements.contactForm.querySelectorAll('.form-group').forEach(group => {
        const underline = document.createElement('div');
        underline.className = 'field-underline';
        group.appendChild(underline);
    });

    // Form submission
    elements.contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = elements.contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        const statusEl = elements.contactForm.querySelector('.form-status') || createStatusElement();

        // Get form data
        const formData = new FormData(elements.contactForm);
        const data = Object.fromEntries(formData);

        // Validate
        if (!validateForm(data)) return;

        // Show loading
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        statusEl.style.display = 'none';

        try {
            await simulateSendEmail(data);

            // Success
            showStatus(statusEl, 'success', 'Message sent successfully! I\'ll get back to you soon.');
            elements.contactForm.reset();

            // Reset char counter
            if (textarea) {
                counter.textContent = `0 / 5000`;
            }
        } catch (error) {
            showStatus(statusEl, 'error', 'Failed to send message. Please try again or email directly.');
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    });
}

function createStatusElement() {
    const status = document.createElement('div');
    status.className = 'form-status';
    elements.contactForm.appendChild(status);
    return status;
}

function showStatus(element, type, message) {
    element.className = `form-status ${type}`;
    element.textContent = message;
    element.style.display = 'block';
}

function validateForm(data) {
    const errors = [];

    if (!data.name?.trim()) errors.push('Name is required');
    if (!data.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push('Valid email is required');
    }
    if (!data.subject?.trim()) errors.push('Subject is required');
    if (!data.message?.trim()) errors.push('Message is required');

    if (errors.length > 0) {
        showNotification(errors.join('\n'), 'error');
        return false;
    }
    return true;
}

function simulateSendEmail(data) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log('Form submitted:', data);
            resolve();
        }, 1500);
    });
}

// ========================================
// Notifications
// ========================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;

    Object.assign(notification.style, {
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        padding: '16px 24px',
        background: 'var(--bg-card)',
        border: `1px solid ${type === 'success' ? 'var(--accent-primary)' : type === 'error' ? 'var(--accent-danger)' : 'var(--accent-secondary)'}`,
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-lg), var(--shadow-glow)',
        zIndex: '2000',
        transform: 'translateX(120%)',
        transition: 'transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
    });

    const content = notification.querySelector('.notification-content');
    Object.assign(content.style, {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: type === 'success' ? 'var(--accent-primary)' : type === 'error' ? 'var(--accent-danger)' : 'var(--accent-secondary)',
        fontWeight: '500'
    });

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });

    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(120%)';
        setTimeout(() => notification.remove(), 400);
    }, 5000);
}

// ========================================
// Scroll Indicator
// ========================================
function handleScrollIndicator() {
    if (!elements.scrollIndicator) return;

    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 100) {
            elements.scrollIndicator.classList.add('hidden');
        } else {
            elements.scrollIndicator.classList.remove('hidden');
        }
    }, 100));

    elements.scrollIndicator.addEventListener('click', () => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
    });
}

// ========================================
// Event Listeners
// ========================================
function setupEventListeners() {
    // Smooth scroll for anchor links - using event delegation for dynamic content
    document.addEventListener('click', function(e) {
        const anchor = e.target.closest('a[href^="#"]');
        if (anchor) {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                const offsetTop = target.offsetTop - 76;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });

                // Close mobile menu if open
                elements.navMenu?.classList.remove('active');
                elements.navToggle?.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && elements.navMenu?.classList.contains('active')) {
            elements.navToggle?.classList.remove('active');
            elements.navMenu?.classList.remove('active');
            document.body.style.overflow = '';
            elements.navToggle?.focus();
        }
    });

    // Reduce motion handling
    if (reducedMotion) {
        document.documentElement.style.setProperty('--transition-fast', '0ms');
        document.documentElement.style.setProperty('--transition-normal', '0ms');
        document.documentElement.style.setProperty('--transition-slow', '0ms');
    }

    // Listen for theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            theme = e.matches ? 'dark' : 'light';
            initTheme();
        }
    });
}

// ========================================
// Utility Functions
// ========================================
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// ========================================
// Console Easter Egg
// ========================================
function consoleEasterEgg() {
    const styles = [
        'font-size: 14px; font-weight: bold; color: #00ffc8;',
        'font-size: 12px; color: #8899b0;',
        'font-size: 12px; color: #00d4ff;',
        'font-size: 12px; color: #7c5cff;',
        'font-size: 12px; color: #8899b0;',
        'font-size: 12px; color: #00ffc8;',
        'font-size: 12px; color: #8899b0;'
    ];

    console.log('%c╔═══════════════════════════════════════════════════╗', styles[0]);
    console.log('%c║  Dhruv Rana - Cybersecurity Portfolio            ║', styles[0]);
    console.log('%c║  MSc Digital Forensics & Cyber Security          ║', styles[1]);
    console.log('%c║  Institute of Advanced Research, Gandhinagar     ║', styles[1]);
    console.log('%c║                                                  ║', styles[1]);
    console.log('%c║  Skills: Nmap | Metasploit | Wireshark | Nessus  ║', styles[2]);
    console.log('%c║  Python | Java | JavaScript | Kali Linux         ║', styles[3]);
    console.log('%c║                                                  ║', styles[1]);
    console.log('%c║  GitHub: github.com/Dhruvranax                   ║', styles[4]);
    console.log('%c║  LinkedIn: linkedin.com/in/dhruv-rana-1b35782a1  ║', styles[4]);
    console.log('%c╚═══════════════════════════════════════════════════╝', styles[0]);

    // Secret konami code
    let konami = [];
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];

    document.addEventListener('keydown', (e) => {
        konami.push(e.code);
        if (konami.length > konamiCode.length) konami.shift();

        if (konami.join(',') === konamiCode.join(',')) {
            activateHackerMode();
        }
    });
}

function activateHackerMode() {
    // Rainbow theme shift
    document.body.style.animation = 'hackerMode 2s infinite';
    const style = document.createElement('style');
    style.textContent = `
        @keyframes hackerMode {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
        }
    `;
    document.head.appendChild(style);

    showNotification('🎮 HACKER MODE ACTIVATED! Konami code detected!', 'success');

    setTimeout(() => {
        document.body.style.animation = '';
        style.remove();
    }, 10000);
}

// ========================================
// Skill Tag Dynamic Colors
// ========================================
function initSkillTagColors() {
    const skillTags = document.querySelectorAll('.skill-tag[data-color]');
    skillTags.forEach(tag => {
        const color = tag.getAttribute('data-color');
        if (color) {
            tag.style.setProperty('--tag-color', color);
            // Also apply to the icon
            const icon = tag.querySelector('i');
            if (icon) {
                icon.style.color = color;
            }
        }
    });

    // Also apply to skill category icons based on data-category
    const skillCategories = document.querySelectorAll('.skill-category[data-category]');
    const categoryColors = {
        'security': 'var(--color-security)',
        'development': 'var(--color-development)',
        'network': 'var(--color-network)',
        'forensics': 'var(--color-forensics)',
        'web': 'var(--color-web)',
        'academic': 'var(--color-academic)'
    };

    skillCategories.forEach(cat => {
        const category = cat.getAttribute('data-category');
        const color = categoryColors[category];
        if (color) {
            const icon = cat.querySelector('.category-header i');
            if (icon) {
                icon.style.color = color;
            }
        }
    });
}

// ========================================
// Performance Optimization
// ========================================
// Pause animations when tab is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (particleSystem) {
            cancelAnimationFrame(particleSystem.animationId);
        }
    } else {
        if (particleSystem) {
            particleSystem.animate();
        }
    }
});

// Clean up on unload
window.addEventListener('beforeunload', () => {
    if (particleSystem) {
        cancelAnimationFrame(particleSystem.animationId);
    }
});