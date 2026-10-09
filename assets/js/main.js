/* ===================================================
   SIRIWATMEDHANIN GROUP — Main JavaScript
   =================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Navbar: scroll effect ----
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // ---- Navbar: mobile toggle ----
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  // Mobile overlay
  const navOverlay = document.getElementById('navOverlay');

  const openMenu = () => {
    navMenu.classList.add('open');
    navOverlay.classList.add('visible');
    navToggle.classList.add('active');
    navToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    navMenu.classList.remove('open');
    navOverlay.classList.remove('visible');
    navToggle.classList.remove('active');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  navToggle.removeEventListener('click', null);
  navToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    navMenu.classList.contains('open') ? closeMenu() : openMenu();
  });

  // Close menu when a link is clicked
  document.querySelectorAll('.navbar__links a').forEach(link => {
    link.addEventListener('click', closeMenu);
  });

  // Close menu when overlay clicked
  navOverlay.addEventListener('click', closeMenu);

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navbar.contains(e.target) && navMenu.classList.contains('open')) {
      closeMenu();
    }
  });

  // ---- Active nav link on scroll ----
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.navbar__links a');

  const activateLink = () => {
    let currentSection = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      if (window.scrollY >= sectionTop) {
        currentSection = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', activateLink, { passive: true });

  // ---- Fade-in on scroll (Intersection Observer) ----
  const fadeElements = document.querySelectorAll(
    '.service-card, .benefit-item, .why-card, .step, .contact-card, .about__text, .about__visual, .section__header'
  );

  fadeElements.forEach((el, index) => {
    el.classList.add('fade-in');
    // Stagger delay for grid children
    const parent = el.parentElement;
    const siblings = Array.from(parent.children).filter(c => c.classList.contains(el.classList[0]));
    const delayIndex = siblings.indexOf(el);
    if (delayIndex > 0 && delayIndex <= 4) {
      el.classList.add(`fade-in-delay-${delayIndex}`);
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  fadeElements.forEach(el => observer.observe(el));

  // ---- Smooth scroll for anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (targetId === '#') return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const offset = navbar.offsetHeight + 16;
        const targetTop = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });

  // ---- Counter animation for stats ----
  const stats = document.querySelectorAll('.stat__number');

  const animateCounter = (el) => {
    const target = el.textContent;
    const isPercent = target.includes('%');
    const num = parseInt(target);
    if (isNaN(num)) return;

    let start = 0;
    const duration = 1500;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.floor(eased * num) + (isPercent ? '%' : '');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(stat => counterObserver.observe(stat));

});

  // ---- Floating Contact — always visible ----
