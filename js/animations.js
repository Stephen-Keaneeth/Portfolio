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

/**
 * Initializes scroll-reveal for all .reveal elements on the page.
 * Call this after the DOM is ready.
 */
function initScrollReveal() {
  // Select all elements that should animate in on scroll
  const revealElements = document.querySelectorAll('.reveal');

  // If there are none on this page, do nothing
  if (revealElements.length === 0) return;

  /**
   * Create the observer.
   * `threshold: 0.1` means the callback fires when 10% of the
   * element is visible — a small peek triggers the animation.
   * `rootMargin: '0px 0px -50px 0px'` offsets the trigger
   * point 50px above the bottom — so elements animate slightly
   * before fully entering the viewport.
   */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // `isIntersecting` is true when the element is in view
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');

          // Unobserve after animating — each element only needs to animate once
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );

  // Assign staggered delays based on sibling position
  // (only within grid/flex containers)
  document.querySelectorAll('.reveal-group').forEach((group) => {
    group.querySelectorAll('.reveal').forEach((child, index) => {
      // Cap at 5 delays to avoid very long waits
      const delay = Math.min(index, 4);
      child.classList.add(`reveal--delay-${delay + 1}`);
    });
  });

  // Start observing every .reveal element
  revealElements.forEach((el) => observer.observe(el));
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

  // Initialize typing effect on the hero element if it exists
  const typingEl = document.querySelector('.typing');
  if (typingEl) initTypingEffect(typingEl);
});
