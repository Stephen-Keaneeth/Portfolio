/**
 * hero-scene.js — WebGL Cinematic Background
 * =============================================
 * Three.js particle topology mesh for the hero section.
 *
 * ADAPTIVE RENDERING — Progressive Enhancement:
 * Before loading any WebGL content, we detect device capability
 * using multiple signals. If the device scores too low, we
 * gracefully render a static CSS fallback instead.
 *
 * Detection signals:
 *  1. navigator.hardwareConcurrency  — logical CPU cores
 *  2. navigator.deviceMemory         — GB of RAM (where available)
 *  3. window.matchMedia prefers-reduced-motion
 *  4. WebGL context availability     — can the GPU even do this?
 *  5. Screen width < 768px           — mobile: skip WebGL by default
 */

'use strict';

/* ─────────────────────────────────────────────────
   CAPABILITY DETECTION
───────────────────────────────────────────────── */
function assessDeviceCapability() {
  const signals = {
    // prefers-reduced-motion = hard no
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,

    // Mobile screen — skip WebGL, save battery
    isMobile: window.innerWidth < 900,

    // CPU cores — >= 4 is "capable"
    cpuCores: navigator.hardwareConcurrency || 2,

    // RAM — >= 4GB is "capable" (undefined = assume medium)
    ram: navigator.deviceMemory || 4,
  };

  // Hard stops
  if (signals.reducedMotion) return { load: false, reason: 'reduced-motion' };
  if (signals.isMobile)      return { load: false, reason: 'mobile' };

  // Score-based check
  const cpuOk = signals.cpuCores >= 4;
  const ramOk = signals.ram >= 4;

  if (!cpuOk && !ramOk) return { load: false, reason: 'low-spec' };

  // Check WebGL support
  try {
    const testCanvas = document.createElement('canvas');
    const gl = testCanvas.getContext('webgl2') || testCanvas.getContext('webgl');
    if (!gl) return { load: false, reason: 'no-webgl' };
  } catch (e) {
    return { load: false, reason: 'webgl-error' };
  }

  return { load: true, reason: 'capable' };
}

/* ─────────────────────────────────────────────────
   FALLBACK — Static atmospheric gradient
   Used when WebGL is skipped.
───────────────────────────────────────────────── */
function showFallbackBackground(canvas) {
  if (!canvas) return;

  // Replace canvas with a styled div
  const fallback = document.createElement('div');
  fallback.id = 'hero-canvas';
  fallback.style.cssText = `
    position: absolute;
    inset: 0;
    z-index: 0;
    background:
      radial-gradient(ellipse 60% 50% at 20% 30%, hsla(172, 85%, 44%, 0.08) 0%, transparent 70%),
      radial-gradient(ellipse 40% 40% at 80% 70%, hsla(185, 80%, 40%, 0.05) 0%, transparent 70%),
      hsl(0, 0%, 5%);
  `;
  canvas.replaceWith(fallback);
  console.info('[hero-scene] WebGL skipped — using CSS fallback gradient.');
}

/* ─────────────────────────────────────────────────
   THREE.JS SCENE
───────────────────────────────────────────────── */
function initThreeScene(canvas) {
  if (typeof THREE === 'undefined') {
    console.warn('[hero-scene] Three.js not loaded — check CDN.');
    showFallbackBackground(canvas);
    return;
  }

  // ── Renderer ──
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: false, // Off for performance — particles don't need it
    alpha: true,      // Transparent background so CSS void shows through
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(canvas.clientWidth, canvas.clientHeight);
  renderer.setClearColor(0x000000, 0); // Fully transparent

  // ── Scene & Camera ──
  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    canvas.clientWidth / canvas.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 0, 5);

  // ── Particle Topology Mesh ──
  // Creates a flowing grid of points arranged like a topographic map
  // viewed from slightly above and angled.
  const GRID_SIZE   = 80;   // 80×80 = 6400 particles
  const GRID_SPREAD = 20;   // World-space spread of the grid

  const positions = new Float32Array(GRID_SIZE * GRID_SIZE * 3);
  const sizes     = new Float32Array(GRID_SIZE * GRID_SIZE);
  const opacities = new Float32Array(GRID_SIZE * GRID_SIZE);

  let index = 0;
  for (let i = 0; i < GRID_SIZE; i++) {
    for (let j = 0; j < GRID_SIZE; j++) {
      const x = (i / GRID_SIZE - 0.5) * GRID_SPREAD;
      const z = (j / GRID_SIZE - 0.5) * GRID_SPREAD;
      // Y: layered sine/cosine waves for the topographic effect
      const y =
        Math.sin(i * 0.3) * 0.6 +
        Math.cos(j * 0.2) * 0.8 +
        Math.sin((i + j) * 0.15) * 0.4;

      positions[index * 3]     = x;
      positions[index * 3 + 1] = y - 2.5; // Offset downward slightly
      positions[index * 3 + 2] = z;

      // Particles near the edges are smaller and more transparent
      const edge = Math.min(i, GRID_SIZE - i, j, GRID_SIZE - j) / (GRID_SIZE * 0.15);
      sizes[index]     = Math.min(edge, 1) * 2.5 + 0.5;
      opacities[index] = Math.min(edge, 1);

      index++;
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('aSize',    new THREE.BufferAttribute(sizes,     1));
  geometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));

  // Custom shader material for precise control over particle appearance
  const material = new THREE.ShaderMaterial({
    uniforms: {
      uTime:    { value: 0 },
      uMouse:   { value: new THREE.Vector2(0, 0) },
      uScroll:  { value: 0 },
      uColor:   { value: new THREE.Color(0x0fc8a8) }, // Electric teal
      uColor2:  { value: new THREE.Color(0x30e8d0) }, // Lighter teal
    },
    vertexShader: `
      attribute float aSize;
      attribute float aOpacity;
      uniform float uTime;
      uniform vec2  uMouse;
      uniform float uScroll;
      varying float vOpacity;

      void main() {
        vOpacity = aOpacity;
        vec3 pos = position;

        // Slow wave animation — topology breathes
        pos.y += sin(pos.x * 0.4 + uTime * 0.4) * 0.15;
        pos.y += cos(pos.z * 0.3 + uTime * 0.3) * 0.12;

        // Scroll: camera moves forward into the mesh
        pos.z += uScroll * 2.0;

        // Mouse parallax — tilts the whole field very subtly
        pos.x += uMouse.x * 0.8;
        pos.y += uMouse.y * 0.4;

        vec4 mvPos = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = aSize * (250.0 / -mvPos.z);
        gl_Position  = projectionMatrix * mvPos;
      }
    `,
    fragmentShader: `
      uniform vec3  uColor;
      uniform vec3  uColor2;
      varying float vOpacity;

      void main() {
        // Soft circular particle
        float dist = length(gl_PointCoord - vec2(0.5));
        if (dist > 0.5) discard;
        float alpha = (1.0 - dist * 2.0) * vOpacity * 0.85;
        gl_FragColor = vec4(mix(uColor, uColor2, dist * 1.5), alpha);
      }
    `,
    transparent: true,
    depthWrite:  false,
    blending:    THREE.AdditiveBlending,
  });

  const particles = new THREE.Points(geometry, material);
  // Tilt the whole grid — viewed from slightly above, like a landscape
  particles.rotation.x = -0.35;
  scene.add(particles);

  // ── Mouse tracking ──
  let targetMouse = new THREE.Vector2(0, 0);
  let currentMouse = new THREE.Vector2(0, 0);

  document.addEventListener('mousemove', (e) => {
    targetMouse.x = (e.clientX / window.innerWidth  - 0.5) * 0.6;
    targetMouse.y = (e.clientY / window.innerHeight - 0.5) * -0.4;
  });

  // ── Scroll tracking ──
  let scrollProgress = 0;

  function onScroll() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    const heroH = hero.offsetHeight;
    scrollProgress = Math.min(window.scrollY / heroH, 1);
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // ── Resize handler ──
  function onResize() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h, false);
  }
  window.addEventListener('resize', onResize);

  // ── Animation Loop ──
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsed = clock.getElapsedTime();

    // Lerp mouse for smooth parallax
    currentMouse.x += (targetMouse.x - currentMouse.x) * 0.05;
    currentMouse.y += (targetMouse.y - currentMouse.y) * 0.05;

    material.uniforms.uTime.value   = elapsed;
    material.uniforms.uMouse.value  = currentMouse;
    material.uniforms.uScroll.value = scrollProgress;

    // Very slow auto-rotation
    particles.rotation.y = elapsed * 0.02;

    renderer.render(scene, camera);
  }

  animate();

  console.info('[hero-scene] WebGL scene initialised. 🟢');
}

/* ─────────────────────────────────────────────────
   ENTRY POINT
───────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || canvas.tagName !== 'CANVAS') return;

  const { load, reason } = assessDeviceCapability();
  console.info(`[hero-scene] Capability check: load=${load}, reason=${reason}`);

  if (!load) {
    showFallbackBackground(canvas);
  } else {
    initThreeScene(canvas);
  }
});
