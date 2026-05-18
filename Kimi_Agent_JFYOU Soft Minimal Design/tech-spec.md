# JFYOU — Technical Specification

## Dependencies

### Production

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.3.0 | UI framework |
| react-dom | ^18.3.0 | React DOM renderer |
| react-router-dom | ^6.26.0 | Client-side routing (Home `/`, Product `/product`) |
| three | ^0.160.0 | WebGL globe geometry and rendering (fluid-touch-icosahedron) |
| gsap | ^3.12.0 | Scroll-triggered animations, scroll-scrubbed timelines, text reveals |
| lenis | ^1.1.0 | Smooth scroll interpolation, feeds velocity to GSAP and WebGL |
| imagesloaded | ^5.0.0 | Ensures gallery images loaded before ScrollTrigger initialization |
| lucide-react | ^0.400.0 | Search, cart bag, arrow icons in navigation and footer |
| clsx | ^2.1.0 | Conditional class composition |
| tailwind-merge | ^2.5.0 | Tailwind class deduplication |

### Development

| Package | Version | Purpose |
|---------|---------|---------|
| typescript | ^5.5.0 | Type safety |
| vite | ^5.4.0 | Build tool |
| @vitejs/plugin-react | ^4.3.0 | React support for Vite |
| tailwindcss | ^3.4.0 | Utility-first CSS |
| postcss | ^8.4.0 | CSS processing |
| autoprefixer | ^10.4.0 | Vendor prefixing |
| @types/react | ^18.3.0 | React type definitions |
| @types/react-dom | ^18.3.0 | ReactDOM type definitions |
| @types/three | ^0.160.0 | Three.js type definitions |

### External (CDN)

| Resource | Source | Usage |
|----------|--------|-------|
| Google Fonts | `fonts.googleapis.com` | Outfit (300, 400), Playfair Display (400, 400i, 500), Space Mono (400) |

---

## Component Inventory

### Layout

| Component | Source | Reuse | Notes |
|-----------|--------|-------|-------|
| Navigation | Custom | Both pages | Sticky header with scroll-aware frosted glass transition |
| Footer | Custom | Both pages | WebGL canvas + overlaid UI content |

### Sections (Home)

| Component | Source | Notes |
|-----------|--------|-------|
| HeroSection | Custom | Fullscreen video background + centered typography |
| LifestyleSection | Custom | Split-screen with sticky text block |
| CollectionSection | Custom | 3-column grid implementing scroll-spread-gallery effect |

### Sections (Product)

| Component | Source | Notes |
|-----------|--------|-------|
| ProductHeroSection | Custom | 60/40 split with accordion, color/size selectors |
| CompleteTheLookSection | Custom | 3-card horizontal row |

### Reusable Components

| Component | Source | Used By | Notes |
|-----------|--------|---------|-------|
| ScrollReveal | Custom | LifestyleSection, ProductHeroSection, CompleteTheLookSection | GSAP ScrollTrigger wrapper for translateY + opacity entrance animations. Accepts delay and stagger props. |
| FrostedHeader | Custom | Navigation | Scroll-aware glassmorphism transition logic extracted for reuse |

### Hooks

| Hook | Purpose |
|------|---------|
| useLenis | Initializes Lenis, wires it to GSAP ticker and ScrollTrigger |
| useFluidIcosahedron | Manages Three.js scene lifecycle: geometry, shader material, render loop, mouse/click interaction handlers, cleanup |
| useScrollSpreadGallery | GSAP ScrollTrigger timeline creation for the 3D flip gallery. Runs after imagesLoaded resolves. |

---

## Animation Implementation

| Animation | Library | Implementation Approach | Complexity |
|-----------|---------|------------------------|------------|
| Scroll-spread gallery (3D flip + brightness scrub) | GSAP + ScrollTrigger + Lenis | Two alternating `fromTo` timelines per image parity: even items rotate 70°→-50° on X-axis with brightness 200%→0%, odd items reverse. Lenis feeds `ScrollTrigger.update`. `imagesloaded` gates initialization. Container has `perspective: 1000px`. | 🔒 High |
| Fluid touch icosahedron | Three.js (raw) | Custom `ShaderMaterial` with vertex deformation (FBM noise + elastic waves + mouse bulge + click shockwave) and fragment Fresnel glow with 4-color animated mixing. Additive blending, `depthWrite: false`. Mouse drives rotation target + wheel velocity. Raycaster computes `uMouse3D` on sphere surface. | 🔒 High |
| Mono font lag reveal | Canvas 2D | Custom `<canvas>` at 20 FPS (RAF throttled). Trail array of `{x, y, text, delay}` decays per frame. Characters cycle through Latin + Cyrillic lowercase. Canvas overlaid at `pointer-events: none`. | Medium |
| Navigation frosted transition | CSS + Scroll listener | Toggle class on scroll past hero threshold. CSS handles `backdrop-filter` + `background` transition. | Low |
| Hero text stagger entrance | GSAP | Single timeline: heading 0.3s delay, subtitle 0.6s, CTA 0.9s, indicator 1.5s. `translateY(30px)` → 0, `opacity` 0 → 1. | Low |
| Scroll indicator pulse | CSS keyframes | `opacity` oscillation 0.3↔0.7 over 2s infinite. | Low |
| Lifestyle section entrance | GSAP + ScrollTrigger | Image scale 1.05→1.0 + opacity. Text blocks translateY(40px)→0 with 0.2s stagger. | Low |
| Footer content stagger | GSAP + ScrollTrigger | Fade + translateY(20px) with 0.1s stagger per element group. | Low |
| Product image entrance | GSAP | translateX(-40px)→0, opacity 0→1 on mount. | Low |
| Product data stagger | GSAP | translateY(30px)→0 with 0.1s stagger per element. | Low |
| Complete the look cards | GSAP + ScrollTrigger | translateY(40px)→0 with 0.15s stagger. | Low |
| Liquid fill CTA hover | CSS + JS | Radial gradient `--x`/`--y` CSS custom properties updated via `onMouseMove` percentages. | Low |

---

## State & Logic

### Lenis ↔ GSAP ↔ ScrollTrigger Bridge

Lenis must be initialized once at app root and wired into GSAP's ticker: `lenis.on('scroll', ScrollTrigger.update)` and `gsap.ticker.add((time) => lenis.raf(time * 1000))`. This single integration point enables both the scroll-scrubbed gallery and the scroll-velocity input to the WebGL globe. Implemented in `useLenis` hook, called once in App component.

### Three.js Lifecycle in React

The fluid icosahedron runs outside React's render cycle. `useFluidIcosahedron` creates the renderer, scene, camera, and mesh on mount, stores them in refs, and manages the RAF loop internally. Cleanup disposes geometry, material, renderer, and cancels RAF. Mouse/click/wheel event listeners attach directly to the canvas container DOM element, not React synthetic events.

### Gallery ScrollTrigger Gating

ScrollTrigger instances for the collection grid must not be created until all 9 images report `loaded` via `imagesloaded`. The `useScrollSpreadGallery` hook accepts a container ref, runs `imagesLoaded` on it, and only then creates the alternating GSAP timelines. This prevents incorrect trigger position calculations.

### Routing

Two routes: `/` (Home) and `/product` (Product Detail). React Router `BrowserRouter` with route-level component mounting. On route change, Lenis must call `scrollTo(0, { immediate: true })` to reset scroll position.

---

## Other Key Decisions

### Raw Three.js over R3F

The `fluid-touch-icosahedron` uses fully custom GLSL vertex/fragment shaders with no standard material features. R3F's declarative abstraction adds overhead with no benefit here. Raw Three.js via `useRef` + `useEffect` keeps shader code intact and avoids R3F's reconciler indirection.

### No shadcn/ui Components

The design is entirely bespoke editorial UI with no standard form patterns (no dialogs, tables, dropdowns). The accordion on the product page is a simple custom expand/collapse. shadcn/ui would add unused infrastructure.

### Canvas 2D for Mono Font Lag (not p5.js)

The lag-reveal effect is a lightweight trail renderer. Native Canvas 2D with throttled RAF avoids pulling in the full p5.js runtime (~800KB) for a single decorative effect. Implementation: 20 FPS via `requestAnimationFrame` with frame-skipping logic.

### Video Asset Strategy

The hero video (5s loop) is the only video asset. Deliver as MP4 with `autoplay muted playsinline loop`. Use a static poster frame (first frame of the lifestyle image) as fallback for browsers that block autoplay.
