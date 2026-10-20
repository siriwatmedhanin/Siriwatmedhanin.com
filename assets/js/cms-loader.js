/**
 * SIRIWATMEDHANIN GROUP — CMS Content Loader
 * Dynamically loads content edited via Decap CMS from content/*.json
 * With graceful fallback to existing hardcoded markup.
 */

(function () {
  'use strict';

  // Helper for safe fetch with error handling
  async function fetchJson(url) {
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      // Silently fall back to default HTML on file:// or network error
      return null;
    }
  }

  // ---- 1. Load Contact & Shop Info ----
  async function loadContactData() {
    const data = await fetchJson('content/contact.json');
    if (!data) return;

    // Update Phone
    if (data.phone) {
      document.querySelectorAll('a[href^="tel:"]').forEach(el => {
        el.href = 'tel:' + (data.phone_raw || data.phone.replace(/[^0-9+]/g, ''));
        const tooltip = el.querySelector('.float-item__tooltip');
        if (tooltip) tooltip.textContent = data.phone;
      });
      // Contact card & footer text
      document.querySelectorAll('.contact-card, .footer__contact-col').forEach(parent => {
        parent.querySelectorAll('p').forEach(p => {
          if (p.textContent.includes('091-909-8902') || p.querySelector('.fa-phone')) {
            p.innerHTML = '<i class="fas fa-phone"></i> ' + data.phone;
          }
        });
      });
    }

    // Update Email
    if (data.email) {
      document.querySelectorAll('a[href^="mailto:"]').forEach(el => {
        el.href = 'mailto:' + data.email;
        const tooltip = el.querySelector('.float-item__tooltip');
        if (tooltip) tooltip.textContent = data.email;
      });
      document.querySelectorAll('.contact-card, .footer__contact-col').forEach(parent => {
        parent.querySelectorAll('p').forEach(p => {
          if (p.textContent.includes('@siriwatmedhanin') || p.querySelector('.fa-envelope')) {
            p.innerHTML = '<i class="fas fa-envelope"></i> ' + data.email;
          }
        });
      });
    }

    // Update Facebook & Messenger
    if (data.facebook_url) {
      document.querySelectorAll('a.float-item--fb, a.footer__social-link, .contact-link').forEach(el => {
        if (el.classList.contains('float-item--fb') || el.textContent.includes('Siriwatmedhanin')) {
          el.href = data.facebook_url;
        }
      });
    }
    if (data.messenger_url) {
      document.querySelectorAll('a.float-item--messenger').forEach(el => {
        el.href = data.messenger_url;
      });
    }

    // Update Tax ID
    if (data.tax_id) {
      document.querySelectorAll('.contact-card').forEach(card => {
        if (card.querySelector('.fa-file-invoice')) {
          const p = card.querySelector('p');
          if (p) p.textContent = data.tax_id;
        }
      });
      const footerTax = document.querySelector('.footer__contact-col');
      if (footerTax) {
        footerTax.querySelectorAll('p').forEach(p => {
          if (p.querySelector('.fa-file-invoice')) {
            const labelSpan = p.querySelector('[data-i18n="footerTaxLabel"]');
            const label = labelSpan ? labelSpan.outerHTML : 'เลขภาษี:';
            p.innerHTML = '<i class="fas fa-file-invoice"></i> ' + label + ' ' + data.tax_id;
          }
        });
      }
    }

    // Update Address if provided
    if (data.address_th) {
      document.querySelectorAll('[data-i18n="contactAddrVal"]').forEach(el => {
        el.innerHTML = data.address_th;
      });
    }

    // Update Shop Links
    if (data.shop_links) {
      const links = data.shop_links;
      if (links.maechawi_shopee) {
        document.querySelectorAll('a.shop-btn--shopee').forEach(a => a.href = links.maechawi_shopee);
      }
      if (links.maechawi_tiktok) {
        const mcTiktok = document.querySelector('.shop-online-brand:first-of-type a.shop-btn--tiktok, .service-card:first-of-type a.shop-btn--tiktok');
        if (mcTiktok) mcTiktok.href = links.maechawi_tiktok;
      }
      if (links.maechawi_thaimart) {
        document.querySelectorAll('a.shop-btn--thaimart').forEach(a => a.href = links.maechawi_thaimart);
      }
      if (links.maechawi_facebook) {
        document.querySelectorAll('a.shop-btn--fb-shop').forEach(a => a.href = links.maechawi_facebook);
      }
      if (links.sunnygrove_tiktok) {
        const sgTiktok = document.querySelector('.shop-online-brand:last-of-type a.shop-btn--tiktok');
        if (sgTiktok) sgTiktok.href = links.sunnygrove_tiktok;
      }
    }
  }

  // ---- 2. Load Executive Team Info ----
  async function loadTeamData() {
    const data = await fetchJson('content/team.json');
    if (!data) return;

    if (data.exec1) {
      const card1 = document.querySelector('.exec-team__grid .exec-card:first-child');
      if (card1) {
        if (data.exec1.photo) {
          const img = card1.querySelector('.exec-card__portrait-img');
          if (img) img.src = data.exec1.photo;
        }
        if (data.exec1.quote_th) {
          const quote = card1.querySelector('.exec-card__quote');
          if (quote) quote.innerHTML = '&ldquo;' + data.exec1.quote_th + '&rdquo;';
        }
        if (data.exec1.name_th) {
          const name = card1.querySelector('.exec-card__name');
          if (name) name.textContent = data.exec1.name_th;
        }
        if (data.exec1.vision_th) {
          const vision = card1.querySelector('.exec-card__vision');
          if (vision) vision.textContent = data.exec1.vision_th;
        }
      }
    }

    if (data.exec2) {
      const card2 = document.querySelector('.exec-team__grid .exec-card:last-child');
      if (card2) {
        if (data.exec2.photo) {
          const img = card2.querySelector('.exec-card__portrait-img');
          if (img) img.src = data.exec2.photo;
        }
        if (data.exec2.quote_th) {
          const quote = card2.querySelector('.exec-card__quote');
          if (quote) quote.innerHTML = '&ldquo;' + data.exec2.quote_th + '&rdquo;';
        }
        if (data.exec2.name_th) {
          const name = card2.querySelector('.exec-card__name');
          if (name) name.textContent = data.exec2.name_th;
        }
        if (data.exec2.vision_th) {
          const vision = card2.querySelector('.exec-card__vision');
          if (vision) vision.textContent = data.exec2.vision_th;
        }
      }
    }
  }

  // ---- 3. Load Slideshow Images ----
  async function loadSlidesData() {
    const data = await fetchJson('content/slides.json');
    if (!data || !Array.isArray(data.slides) || data.slides.length === 0) return;

    const slides = data.slides;

    // Desktop slider
    const desktopTrack = document.querySelector('.asd__track');
    if (desktopTrack) {
      desktopTrack.innerHTML = slides.map(s =>
        `<div class="asd__slide"><img src="${s.image}" alt="${s.alt || 'Company Photo'}" loading="lazy" /></div>`
      ).join('');
    }

    // Mobile slider
    const mobileTrack = document.querySelector('.asm__track');
    if (mobileTrack) {
      mobileTrack.innerHTML = slides.map(s =>
        `<div class="asm__slide"><img src="${s.image}" alt="${s.alt || 'Company Photo'}" loading="lazy" /></div>`
      ).join('');
    }
  }

  // Initialize after DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    loadContactData();
    loadTeamData();
    loadSlidesData();
  }
})();
