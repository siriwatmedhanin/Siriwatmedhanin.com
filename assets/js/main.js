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

  // ---- Portrait photo: exec card 1 ----
  const exec1Portrait = document.querySelector('.exec-card:first-child .exec-card__portrait');
  if (exec1Portrait) {
    exec1Portrait.innerHTML = '<img src="assets/images/profile-01.png" alt="Natchathon Sirivaddhamedhanin" class="exec-card__portrait-img" />';
  }

  // ---- Portrait photo: exec card 2 ----
  const exec2Portrait = document.querySelector('.exec-team__grid .exec-card:last-child .exec-card__portrait');
  if (exec2Portrait) {
    exec2Portrait.innerHTML = '<img src="assets/images/profile-mom-01.png" alt="Wilailuk Phetkong" class="exec-card__portrait-img" />';
  }

  // ---- Build About Slider (Desktop - inside about__img-wrap) ----
  const aboutImgWrap = document.querySelector('.about__img-wrap');
  if (aboutImgWrap) {
    const slides = [
      'assets/images/photo-slide-01.png',
      'assets/images/photo-slide-02.png',
      'assets/images/photo-slide-03.png',
      'assets/images/photo-slide-04.png',
      'assets/images/photo-slide-05.png',
    ];

    const trackHTML = slides.map(src =>
      `<div class="about-slider__slide"><img src="${src}" alt="Company Photo" loading="lazy" /></div>`
    ).join('');

    const dotsHTML = slides.map((_, i) =>
      `<button class="about-slider__dot${i === 0 ? ' active' : ''}" aria-label="Slide ${i+1}"></button>`
    ).join('');

    aboutImgWrap.className = 'about-slider';
    aboutImgWrap.innerHTML = `
      <div class="about-slider__track">${trackHTML}</div>
      <div class="about-slider__dots">${dotsHTML}</div>
    `;
  }

  // ---- Build About Slider Mobile (standalone below about section) ----
  const aboutSection = document.getElementById('about');
  if (aboutSection && window.innerWidth <= 768) {
    const mobileSlides = [
      'assets/images/photo-slide-01.png',
      'assets/images/photo-slide-02.png',
      'assets/images/photo-slide-03.png',
      'assets/images/photo-slide-04.png',
      'assets/images/photo-slide-05.png',
    ];

    const mTrack = mobileSlides.map(src =>
      `<div class="about-slider__slide"><img src="${src}" alt="Company Photo" loading="lazy" /></div>`
    ).join('');

    const mDots = mobileSlides.map((_, i) =>
      `<button class="about-slider-m__dot${i === 0 ? ' active' : ''}" aria-label="Slide ${i+1}"></button>`
    ).join('');

    const mobileSliderEl = document.createElement('div');
    mobileSliderEl.className = 'about-slider-mobile';
    mobileSliderEl.innerHTML = `
      <div class="about-slider-mobile__track">${mTrack}</div>
      <div class="about-slider-mobile__dots">${mDots}</div>
    `;

    // แทรกหลัง about__grid
    const aboutGrid = aboutSection.querySelector('.about__grid');
    if (aboutGrid) {
      aboutGrid.insertAdjacentElement('afterend', mobileSliderEl);
    }
  }

  // ---- About Photo Slider (Desktop) ----
  const sliderTrack = document.querySelector('.about-slider__track');
  const sliderDots  = document.querySelectorAll('.about-slider__dot');
  let currentSlide  = 0;
  const totalSlides = 5;
  let sliderTimer;

  function goToSlide(index) {
    currentSlide = (index + totalSlides) % totalSlides;
    if (sliderTrack) sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    sliderDots.forEach((dot, i) => dot.classList.toggle('active', i === currentSlide));
  }

  function startSlider() {
    sliderTimer = setInterval(() => goToSlide(currentSlide + 1), 3000);
  }

  function resetSlider() {
    clearInterval(sliderTimer);
    startSlider();
  }

  if (sliderTrack) {
    sliderDots.forEach((dot, i) => {
      dot.addEventListener('click', () => { goToSlide(i); resetSlider(); });
    });
    goToSlide(0);
    startSlider();
  }

  // ---- About Photo Slider (Mobile) ----
  const mTrackEl = document.querySelector('.about-slider-mobile__track');
  const mDotEls  = document.querySelectorAll('.about-slider-m__dot');
  let mCurrent = 0;
  let mTimer;

  function mGoTo(index) {
    mCurrent = (index + totalSlides) % totalSlides;
    if (mTrackEl) mTrackEl.style.transform = `translateX(-${mCurrent * 100}%)`;
    mDotEls.forEach((dot, i) => dot.classList.toggle('active', i === mCurrent));
  }

  function mStart() {
    mTimer = setInterval(() => mGoTo(mCurrent + 1), 3000);
  }

  if (mTrackEl) {
    mDotEls.forEach((dot, i) => {
      dot.addEventListener('click', () => { mGoTo(i); clearInterval(mTimer); mStart(); });
    });
    mGoTo(0);
    mStart();
  }
