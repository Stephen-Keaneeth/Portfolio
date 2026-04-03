/**
 * animations.js — Animation Engine v2.0
 * ========================================
 * Cinematic Terminal portfolio animation system.
 *
 * Initialises:
 * 1. Lenis smooth scroll (physics-based inertia)
 * 2. IntersectionObserver scroll-reveal
 * 3. Text decode effect (terminal character scramble)
 * 4. Typing effect (cycling words in hero)
 * 5. Custom cursor (dot + lagging ring)
 * 6. Magnetic button effect
 */

'use strict';

/* ─────────────────────────────────────────────────
   LENIS SMOOTH SCROLL
   Loaded via CDN in index.html. Falls back gracefully
   if not available (e.g., reduced-motion preference).
───────────────────────────────────────────────── */
function initLenis() {
  // Respect prefers-reduced-motion at the system level
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Lenis is loaded via CDN — check it's available
  if (typeof Lenis === 'undefined') return;

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Expo ease-out
    smooth: true,
    smoothTouch: false, // Keep native scroll on touch devices
  });

  // Tick Lenis on every animation frame
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // Expose globally so other scripts (e.g. hero-scene.js) can read scroll position
  window._lenis = lenis;
}

/* ─────────────────────────────────────────────────
   SCROLL REVEAL — IntersectionObserver
   Works alongside Lenis seamlessly.
───────────────────────────────────────────────── */
let revealObserver;

function initScrollReveal() {
  const unobserved = document.querySelectorAll('.reveal:not(.observed)');
  if (unobserved.length === 0) return;

  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px',
      }
    );
  }

  // Staggered delays inside reveal-groups
  document.querySelectorAll('.reveal-group').forEach((group) => {
    group.querySelectorAll('.reveal').forEach((child, index) => {
      const delay = Math.min(index, 5);
      child.classList.add(`reveal--delay-${delay + 1}`);
    });
  });

  unobserved.forEach((el) => {
    el.classList.add('observed');
    revealObserver.observe(el);
  });
}

function setupDynamicReveal() {
  const mutObserver = new MutationObserver((mutations) => {
    let hasNewReveals = false;
    for (const mut of mutations) {
      for (const node of mut.addedNodes) {
        if (node.nodeType === 1) {
          if (node.classList?.contains('reveal') || node.querySelector?.('.reveal')) {
            hasNewReveals = true;
          }
        }
      }
    }
    if (hasNewReveals) initScrollReveal();
  });
  mutObserver.observe(document.body, { childList: true, subtree: true });
}

/* ─────────────────────────────────────────────────
   TEXT DECODE EFFECT
   Elements with [data-decode] attribute will scramble
   through random characters before revealing final text.
   Usage: <h2 data-decode>Featured Projects</h2>
───────────────────────────────────────────────── */
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';

function decodeText(el, finalText, duration = 900) {
  if (!el || !finalText) return;

  let frame = 0;
  const totalFrames = Math.ceil(duration / 30); // ~30ms per frame
  const chars = CHARS;

  const interval = setInterval(() => {
    // As frames progress, more characters "lock" to final position
    const progress = frame / totalFrames;
    const lockedChars = Math.floor(progress * finalText.length);

    el.textContent = finalText
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' ';
        if (i < lockedChars) return char; // Locked in
        return chars[Math.floor(Math.random() * chars.length)]; // Still scrambling
      })
      .join('');

    frame++;
    if (frame >= totalFrames) {
      clearInterval(interval);
      el.textContent = finalText; // Guarantee final state
    }
  }, 30);
}

function initTextDecode() {
  // Watch for elements to enter the viewport, then trigger decode
  const decodeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const finalText = el.dataset.decode || el.textContent;
          el.dataset.decode = finalText; // Store original if not already set
          // Small delay so the user sees the scramble, not just the flash
          setTimeout(() => decodeText(el, finalText), 100);
          decodeObserver.unobserve(el);
        }
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll('[data-decode]').forEach((el) => {
    // Store the actual text as the data attribute value if not already
    if (!el.dataset.decode) el.dataset.decode = el.textContent.trim();
    decodeObserver.observe(el);
  });
}

/* ─────────────────────────────────────────────────
   TYPING EFFECT
   Cycles through words in the hero value statement.
   Element needs: data-words="Word1,Word2,Word3"
───────────────────────────────────────────────── */
function initTypingEffect(el) {
  if (!el) return;

  const words = (el.dataset.words || '').split(',').map((w) => w.trim());
  if (words.length === 0) return;

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed  = 90;
  const deletingSpeed = 50;
  const pauseDuration = 2200;

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      el.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentWord.length) {
      delay = pauseDuration;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }

    setTimeout(type, delay);
  }

  type();
}

/* ─────────────────────────────────────────────────
   CUSTOM CURSOR
   Two elements:
   - .cursor-dot  : the precise position marker (fast)
   - .cursor-ring : a larger ring that lags behind (lerped)

   Gracefully disabled on touch devices and when
   prefers-reduced-motion is set.
───────────────────────────────────────────────── */
function initCustomCursor() {
  // Skip cursor on touch/mobile — pointless there
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  // Create cursor elements
  const dot  = document.createElement('div');
  const ring = document.createElement('div');
  dot.className  = 'cursor-dot';
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  // Current and target positions for the ring (lerped for lag)
  let mouse  = { x: -100, y: -100 };
  let target = { x: -100, y: -100 };

  document.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    // Dot follows instantly
    dot.style.left = `${mouse.x}px`;
    dot.style.top  = `${mouse.y}px`;
  });

  // Ring lerps toward mouse position each frame
  function animateRing() {
    // Linear interpolation: target moves 12% toward mouse per frame
    target.x += (mouse.x - target.x) * 0.12;
    target.y += (mouse.y - target.y) * 0.12;
    ring.style.left = `${target.x}px`;
    ring.style.top  = `${target.y}px`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // State changes — add body classes so CSS handles the visual transitions
  function onMouseOver(e) {
    const el = e.target;
    if (el.matches('a, [role="link"]')) {
      document.body.classList.add('cursor-hover');
    } else if (el.matches('.btn, button')) {
      document.body.classList.add('cursor-btn');
    }
  }

  function onMouseOut(e) {
    const el = e.target;
    if (el.matches('a, [role="link"]')) {
      document.body.classList.remove('cursor-hover');
    } else if (el.matches('.btn, button')) {
      document.body.classList.remove('cursor-btn');
    }
  }

  document.addEventListener('mouseover', onMouseOver);
  document.addEventListener('mouseout', onMouseOut);

  // Hide cursor dot when leaving the window
  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
}

/* ─────────────────────────────────────────────────
   MAGNETIC BUTTONS
   Primary buttons slightly warp toward the cursor
   when within proximity. Snaps back on mouse leave.
───────────────────────────────────────────────── */
function initMagneticButtons() {
  // Skip on touch devices or reduced-motion
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.querySelectorAll('.btn-primary, .btn-magnetic').forEach((btn) => {
    btn.addEventListener('mousemove', (e) => {
      const rect   = btn.getBoundingClientRect();
      const cx     = rect.left + rect.width / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = e.clientX - cx;
      const dy     = e.clientY - cy;
      const strength = 0.3; // How much the button moves
      btn.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      // Spring back
      btn.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
      btn.style.transform  = 'translate(0, 0)';
      setTimeout(() => { btn.style.transition = ''; }, 500);
    });
  });
}

/* ─────────────────────────────────────────────────
   HERO DIVIDER LINE ANIMATION
   The thin horizontal line under the hero name
   expands from 0 → 100% width on page load.
───────────────────────────────────────────────── */
function initHeroDivider() {
  const divider = document.querySelector('.hero__divider');
  if (!divider) return;

  // Tiny delay so it animates in after the name appears
  setTimeout(() => {
    divider.style.width   = '100%';
    divider.style.opacity = '1';
  }, 800);
}

/* ─────────────────────────────────────────────────
   LIVE CLOCK (footer)
   Updates a .live-clock element every second.
───────────────────────────────────────────────── */
function initLiveClock() {
  const clockEl = document.querySelector('.live-clock');
  if (!clockEl) return;

  function update() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    clockEl.textContent = `${h}:${m}:${s}`;
  }
  update();
  setInterval(update, 1000);
}

/* ─────────────────────────────────────────────────
   MAIN INITIALISATION
───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initLenis();
  initScrollReveal();
  setupDynamicReveal();
  initTextDecode();
  initCustomCursor();
  initMagneticButtons();
  initHeroDivider();
  initLiveClock();

  // Typing effect on the hero element
  const typingEl = document.querySelector('.typing');
  if (typingEl) initTypingEffect(typingEl);
});
