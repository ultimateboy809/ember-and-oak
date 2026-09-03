# Ember & Oak — 3D Specialty Coffee Experience

A warm, moody, scroll-driven 3D web experience for **Ember & Oak**, an artisanal specialty coffee roastery and cafe. Built with **Three.js**, **GSAP ScrollTrigger**, and **Lenis** smooth scrolling.

---

## ✨ Features

- **Continuous 3D Flight**: Smooth camera trajectory driven by scroll position across 5 distinct zones:
  1. **The Pour (Hero)**: Procedural ceramic latte cup with custom GLSL liquid crema swirl & wave ripples, paired with a rising volumetric steam particle system.
  2. **The Bean (Product Reveal)**: Artisanal coffee pouch with dynamic canvas label and 75 realistic 3D roasted coffee beans (`THREE.InstancedMesh`) with signature creases, alongside an interactive roast level indicator.
  3. **The Space (Cafe Walkthrough)**: Architectural minimalist interior with fluted walnut bar counter, espresso machine silhouette, brass pendant lamps, floating dust motes, and a dynamic morning-to-afternoon daylight cycle (`07:30 AM` to `04:30 PM`).
  4. **The Menu**: Editorial 2D interactive menu overlay with category tabs (Espresso, Pour Over, Seasonal, Provisions) and micro-interactions.
  5. **Visit Us (Storefront)**: Exterior timber facade with glowing arched window, illuminated signage, bistro table, and interactive newsletter signup.
- **Dynamic Solar Lighting**: Directional and ambient light rig shifts color and angle according to scroll progress.
- **Smooth Momentum Scrolling**: Integrated Lenis virtual scroll synchronized with GSAP ScrollTrigger.
- **Pure Procedural 3D Geometry**: High-performance PBR materials with zero external 3D model asset overhead.
- **Atmospheric Polish**: Subtle SVG film grain overlay, magnetic custom cursor, and responsive mobile FOV adjustments.

---

## 🛠️ Tech Stack

- **Three.js** (`^0.162.0`) — 3D scene, materials, lighting, and custom GLSL shaders
- **GSAP & ScrollTrigger** (`^3.12.5`) — Scroll-synced camera animation and UI choreography
- **Lenis** (`^1.1.18`) — Smooth momentum scroll
- **Vite** (`^5.2.0`) — Build tool and dev server

---

## 🚀 Getting Started

### Prerequisites

Ensure [Node.js](https://nodejs.org/) (v18+) is installed.

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173/](http://localhost:5173/) in your browser.

### Production Build

```bash
npm run build
npm run preview
```

---

## 📄 License

MIT © Ember & Oak Coffee Roasters
