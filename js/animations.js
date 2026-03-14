/**
 * animations.js — Scroll-Reveal via IntersectionObserver
 * ========================================================
 * This module watches elements with the class `.reveal`
 * and adds `.visible` when they enter the viewport,
 * triggering the CSS transition animations defined in
 * animations.css.
 *
 * HOW INTERSECTIONOBSERVER WORKS:
 * Instead of listening to the scroll event (which fires
 * hundreds of times per second), IntersectionObserver
 * is told to call a function only when a specific element
 * crosses into or out of the viewport. This is very
 * efficient and is the modern standard way to do this.
 */

'use strict';

let revealObserver;

/**
 * Initializes scroll-reveal for all unobserved .reveal elements.
 * Can be called multiple times safely.
 */
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
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );
  }

  // Assign staggered delays inside reveal-groups
  document.querySelectorAll('.reveal-group').forEach((group) => {
    group.querySelectorAll('.reveal').forEach((child, index) => {
      const delay = Math.min(index, 4);
      child.classList.add(`reveal--delay-${delay + 1}`);
    });
  });

  // Start observing
  unobserved.forEach((el) => {
    el.classList.add('observed');
    revealObserver.observe(el);
  });
}

/**
 * Watches the DOM for newly added elements so that 
 * dynamically fetched JSON content automatically fades in.
 */
function setupDynamicReveal() {
  const mutObserver = new MutationObserver((mutations) => {
    let hasNewReveals = false;
    for (const mut of mutations) {
      for (const node of mut.addedNodes) {
        if (node.nodeType === 1) { // Element node
          if (node.classList.contains('reveal') || node.querySelector('.reveal')) {
            hasNewReveals = true;
          }
        }
      }
    }
    if (hasNewReveals) {
      initScrollReveal();
    }
  });

  mutObserver.observe(document.body, { childList: true, subtree: true });
}

/**
 * Initializes the typing effect for an element.
 * The element must have a `data-words` attribute with
 * comma-separated words to cycle through.
 *
 * USAGE IN HTML:
 *   <span class="typing" data-words="Developer,Builder,Student"></span>
 *
 * @param {HTMLElement} el - The element to apply the effect to
 */
function initTypingEffect(el) {
  if (!el) return;

  const words = (el.dataset.words || '').split(',').map((w) => w.trim());
  if (words.length === 0) return;

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typingSpeed = 100;  // ms per character when typing
  const deletingSpeed = 60; // ms per character when deleting
  const pauseDuration = 2000; // ms to pause before deleting

  function type() {
    const currentWord = words[wordIndex];

    if (isDeleting) {
      // Remove one character
      el.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      // Add one character
      el.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let delay = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentWord.length) {
      // Word fully typed — pause, then start deleting
      delay = pauseDuration;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      // Word fully deleted — move to next word
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
    }

    setTimeout(type, delay);
  }

  type(); // Kick off the loop
}

// ── Initialize on DOM ready ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  setupDynamicReveal();

  // Initialize typing effect on the hero element if it exists
  const typingEl = document.querySelector('.typing');
  if (typingEl) initTypingEffect(typingEl);
});
