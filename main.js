/* ════════════════════════════════════════════════════════════
   TOMAS STUTZ — PORTFOLIO
   main.js — Vanilla JS interactions
   ════════════════════════════════════════════════════════════ */

'use strict';

/* ─── CURSOR GLOW ───────────────────────────────────────── */
const cursorGlow = document.getElementById('cursorGlow');

// Throttled: solo actualizar cada ~32ms (30fps) en vez de cada frame del mouse
let cursorThrottle = null;

document.addEventListener('mousemove', (e) => {
  if (cursorThrottle) return;
  cursorThrottle = setTimeout(() => {
    cursorGlow.style.left = `${e.clientX}px`;
    cursorGlow.style.top  = `${e.clientY}px`;
    cursorThrottle = null;
  }, 32);
});

document.addEventListener('mouseleave', () => {
  cursorGlow.style.opacity = '0';
});

document.addEventListener('mouseenter', () => {
  cursorGlow.style.opacity = '1';
});

/* ─── NAV SCROLL STATE ──────────────────────────────────── */
const nav = document.getElementById('mainNav');

const navObserver = new IntersectionObserver(
  ([entry]) => {
    nav.classList.toggle('scrolled', !entry.isIntersecting);
  },
  { rootMargin: '-80px 0px 0px 0px' }
);

// Observe the hero section
const hero = document.getElementById('hero');
if (hero) navObserver.observe(hero);

/* ─── ACTIVE NAV LINK ───────────────────────────────────── */
const sections   = document.querySelectorAll('section[id]');
const navLinks   = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === `#${entry.target.id}`
          );
        });
      }
    });
  },
  { rootMargin: '-40% 0px -40% 0px' }
);

sections.forEach((s) => sectionObserver.observe(s));

/* ─── HAMBURGER MENU ────────────────────────────────────── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  mobileMenu.setAttribute('aria-hidden', !isOpen);
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
  });
});

/* ─── REVEAL ON SCROLL ──────────────────────────────────── */
const revealItems = document.querySelectorAll('.reveal-item');

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // Stagger delay based on sibling index
        const siblings = Array.from(entry.target.parentElement.children);
        const idx = siblings.indexOf(entry.target);
        const delay = idx * 80;

        setTimeout(() => {
          entry.target.classList.add('revealed');
        }, delay);

        revealObserver.unobserve(entry.target);
      }
    });
  },
  { rootMargin: '0px 0px -60px 0px', threshold: 0.1 }
);

revealItems.forEach((el) => revealObserver.observe(el));

/* ─── 3D TILT CARDS ─────────────────────────────────────── */
const tiltCards = document.querySelectorAll('.tilt-card');

tiltCards.forEach((card) => {
  const shine = card.querySelector('.card-shine');

  card.addEventListener('mousemove', (e) => {
    const rect   = card.getBoundingClientRect();
    const x      = e.clientX - rect.left;
    const y      = e.clientY - rect.top;
    const cx     = rect.width  / 2;
    const cy     = rect.height / 2;
    const dx     = (x - cx) / cx;
    const dy     = (y - cy) / cy;

    const rotX   = -dy * 10;
    const rotY   =  dx * 10;

    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;

    // Move shine to follow mouse
    if (shine) {
      const pctX = ((x / rect.width)  * 100).toFixed(1);
      const pctY = ((y / rect.height) * 100).toFixed(1);
      shine.style.setProperty('--x', `${pctX}%`);
      shine.style.setProperty('--y', `${pctY}%`);
    }
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
});

/* ─── COUNTER ANIMATION ─────────────────────────────────── */
const counters = document.querySelectorAll('.stat-number[data-target]');

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1200;
      const startTime = performance.now();

      const update = (now) => {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // ease out cubic
        const eased    = 1 - Math.pow(1 - progress, 3);
        const current  = Math.round(eased * target);

        el.textContent = current + suffix;

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target + suffix;
        }
      };

      requestAnimationFrame(update);
      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);

counters.forEach((c) => counterObserver.observe(c));

/* ─── SMOOTH SCROLL ─────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

/* ─── HERO ENTRANCE ANIMATION ───────────────────────────── */
// Wait for page load, then animate hero elements in
window.addEventListener('load', () => {
  const heroText   = document.getElementById('heroText');
  const heroCard   = document.getElementById('heroCard');

  if (heroText) {
    heroText.style.transition = 'none';
    heroText.style.opacity    = '0';
    heroText.style.transform  = 'translateY(30px)';

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        heroText.style.transition = 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1), transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)';
        heroText.style.opacity    = '1';
        heroText.style.transform  = 'translateY(0)';
      });
    });
  }

  if (heroCard) {
    heroCard.style.transition = 'none';
    heroCard.style.opacity    = '0';
    heroCard.style.transform  = 'translateY(40px) scale(0.97)';

    setTimeout(() => {
      heroCard.style.transition = 'opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s, transform 0.9s cubic-bezier(0.16, 1, 0.3, 1) 0.15s';
      heroCard.style.opacity    = '1';
      heroCard.style.transform  = 'translateY(0) scale(1)';
    }, 100);
  }
});

/* ─── SKILL ICON HOVER RIPPLE ───────────────────────────── */
document.querySelectorAll('.skill-item').forEach((item) => {
  item.addEventListener('mouseenter', () => {
    item.style.setProperty('--glow-color', getComputedStyle(item.querySelector('i')).color);
  });
});

/* ─── MARQUEE DUPLICATE for seamless loop ───────────────── */
const marqueeSpan = document.querySelector('.learning-scroll span');
if (marqueeSpan) {
  marqueeSpan.textContent += marqueeSpan.textContent;
}

/* ─── KEYBOARD NAV: ESC closes mobile menu ──────────────── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
    mobileMenu.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    mobileMenu.setAttribute('aria-hidden', 'true');
    hamburger.focus();
  }
});

console.log(
  '%c🚀 Tomas Stutz Portfolio%c\nBuilt with vanilla HTML, CSS & JS\nGitHub: github.com/',
  'color: #a78bfa; font-size: 16px; font-weight: bold;',
  'color: #67e8f9; font-size: 12px;'
);

/* ─── FPS MONITOR: activa perf-mode si FPS baja de 40 ────── */
(function initPerfMonitor() {
  let frames     = 0;
  let lastTime   = performance.now();
  let lowFPSHits = 0;

  const measureFPS = (now) => {
    frames++;
    const delta = now - lastTime;

    if (delta >= 1000) {
      const fps    = Math.round((frames * 1000) / delta);
      frames       = 0;
      lastTime     = now;

      if (fps < 40) {
        lowFPSHits++;
      } else {
        lowFPSHits = Math.max(0, lowFPSHits - 1);
      }

      // 3 segundos seguidos con FPS bajo => activar modo performance
      if (lowFPSHits >= 3 && !document.body.classList.contains('perf-mode')) {
        document.body.classList.add('perf-mode');
        console.warn('[PerfMode] FPS bajo detectado — efectos reducidos automáticamente.');
        // Dejar de medir una vez activado
        return;
      }
    }

    requestAnimationFrame(measureFPS);
  };

  requestAnimationFrame(measureFPS);
})();
