/**
 * main.js — Shared Initialization
 * ================================
 * This file runs on EVERY page. It handles:
 * 1. Loading the shared header and footer components
 * 2. Injecting page-specific SEO meta tags
 * 3. Smooth page entry animation
 *
 * HOW IT WORKS:
 * Each HTML page has empty <div id="header"> and <div id="footer"> elements.
 * This script fetches the header.html / footer.html files and injects them.
 * This way, you only edit the header/footer in one place.
 */

'use strict';

// ── Component Loader ────────────────────────────────────────────
/**
 * Fetches an HTML file and injects it into a container element.
 *
 * @param {string} containerId - The id of the element to inject into
 * @param {string} filePath    - Path to the HTML component file
 * @returns {Promise<void>}
 *
 * USAGE:
 *   await loadComponent('header', '/components/header.html');
 *
 * WHY async/await?
 * fetch() is asynchronous — it returns a Promise.
 * async/await makes async code read like normal sequential code.
 */
async function loadComponent(containerId, filePath) {
  try {
    const container = document.getElementById(containerId);
    if (!container) return; // Skip if element doesn't exist on this page

    const response = await fetch(filePath);

    // If the file wasn't found (404 etc.), throw an error
    if (!response.ok) {
      throw new Error(`Failed to load component: ${filePath} (${response.status})`);
    }

    const html = await response.text();

    // innerHTML inserts the HTML. Scripts inside it fire automatically.
    container.innerHTML = html;

  } catch (error) {
    // Log the error but don't crash the whole page
    console.error(`[loadComponent] ${error.message}`);
  }
}

// ── SEO Helper ──────────────────────────────────────────────────
/**
 * Sets page-specific meta tags for SEO and social media (OG tags).
 * Call this from individual page scripts to override defaults.
 *
 * @param {Object} opts
 * @param {string} opts.title       - Page title (shown in browser tab & Google)
 * @param {string} opts.description - Page description (shown in Google results)
 * @param {string} [opts.image]     - Absolute URL to OG image (for social previews)
 *
 * EXAMPLE USAGE (in a page's own <script>):
 *   setPageMeta({
 *     title: 'Projects — Stephen',
 *     description: 'Browse my projects in AI, Data Science and Cybersecurity.',
 *   });
 */
function setPageMeta({ title, description, image }) {
  // Update the <title> tag
  if (title) document.title = title;

  // Helper to set or create a <meta> tag
  function setMeta(attr, attrValue, content) {
    let el = document.querySelector(`meta[${attr}="${attrValue}"]`);
    if (!el) {
      el = document.createElement('meta');
      el.setAttribute(attr, attrValue);
      document.head.appendChild(el);
    }
    el.setAttribute('content', content);
  }

  if (description) {
    setMeta('name', 'description', description);
    setMeta('property', 'og:description', description);
    setMeta('name', 'twitter:description', description);
  }

  if (title) {
    setMeta('property', 'og:title', title);
    setMeta('name', 'twitter:title', title);
  }

  if (image) {
    setMeta('property', 'og:image', image);
    setMeta('name', 'twitter:image', image);
  }

  // Always set the canonical URL for SEO
  const canonical = window.location.href.split('?')[0]; // Remove query params
  setMeta('property', 'og:url', canonical);
}

// ── Page Entry Animation ─────────────────────────────────────────
/**
 * Fades the page in after components are loaded.
 * This prevents a flash of unstyled content.
 */
function animatePageEntry() {
  const content = document.querySelector('.page-content');
  if (!content) return;
  content.classList.add('page-enter');
}

function initHeader() {
  const header = document.getElementById('main-header');
  const hamburger = document.getElementById('hamburger-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!header || !hamburger || !mobileMenu) return;

  // ── Scroll effect: darken header when not at top ──
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 20);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // Run once on load

  // ── Hamburger toggle ──
  hamburger.addEventListener('click', function () {
    const isOpen = hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', isOpen);

    if (isOpen) {
      mobileMenu.removeAttribute('hidden');
    } else {
      mobileMenu.setAttribute('hidden', '');
    }
  });

  // ── Close mobile menu when a link is clicked ──
  mobileMenu.querySelectorAll('.mobile-menu__link').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.setAttribute('hidden', '');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // ── Active nav highlight ──
  // Gets the current page name from the URL (e.g., "about" from "about.html")
  const path = window.location.pathname;
  const currentPage = path === '/' || path.endsWith('index.html')
    ? 'index'
    : path.split('/').pop().replace('.html', '');

  document.querySelectorAll('[data-page]').forEach(link => {
    if (link.dataset.page === currentPage) {
      link.classList.add('active');
    }
  });
}

// ── Main Init Function ───────────────────────────────────────────
/**
 * Called when the DOM is ready.
 * Loads header and footer, then triggers the page animation.
 *
 * WHY DOMContentLoaded?
 * We wait for the HTML to be parsed before we try to find elements.
 * Without this, getElementById() might return null.
 */
document.addEventListener('DOMContentLoaded', async () => {
  // Load components in parallel using Promise.all (faster than sequential await)
  await Promise.all([
    loadComponent('header', '/components/header.html'),
    loadComponent('footer', '/components/footer.html'),
  ]);

  // After components are loaded, animate the page in
  animatePageEntry();
  initHeader();
});

// ── Exported helpers (available to page-specific scripts) ────────
// These are on window so they're accessible from inline <script> tags
window.loadComponent = loadComponent;
window.setPageMeta   = setPageMeta;
