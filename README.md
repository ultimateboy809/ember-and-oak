# Ember & Oak — Specialty Coffee & Roastery

A responsive, single-page 3D interactive web experience for the fictional artisanal coffee shop **"Ember & Oak"**. Engineered with **Three.js**, **GSAP ScrollTrigger**, and **Lenis** smooth scrolling.

---

## ☕ Features

- **Continuous 3D Camera Flight**: A single, seamless 3D camera trajectory driven by scroll scrub through 5 thematic zones:
  1. **The Pour (Hero)**: Handcrafted 3D ceramic latte cup with custom GLSL liquid crema shaders and rising steam particle system with curl noise.
  2. **The Bean (Product Reveal)**: Artisanal craft coffee bag with dynamic canvas-generated typography, surrounded by realistic 3D roasted coffee beans (`THREE.InstancedMesh`) with center clefts.
  3. **The Space (Interior Walkthrough)**: Minimalist Scandinavian/Japanese-inspired cafe interior with fluted walnut bar counters, commercial espresso machine silhouette, grinder, pendant lamps, and floating dust motes.
  4. **The Menu**: Seamless transition into an editorial 2D menu overlay with interactive category tabs, tasting notes, and price tags.
  5. **Visit Us (Storefront & Dispatch)**: Settles on a charred timber facade with illuminated signage and arched window glow, store hours, address, and interactive newsletter signup.
- **Dynamic Daylight Progression**: Directional sun light interpolates from morning dawn amber (`07:30 AM`) to warm golden hour ember (`04:30 PM`) with shifting sun angles.
- **Interactive Roast Profile Meter**: Interactive Light / Medium / Dark gauge with animated fill bar and roast tasting notes.
- **Editorial Design Language**: Deep obsidian and warm cured oak palette, film grain texture overlay, magnetic dual-ring custom cursor, and responsive mobile FOV adjustments.

---

## 🛠️ Tech Stack

- **3D Engine**: [Three.js](https://threejs.org/) (PBR materials, custom GLSL shaders, instanced geometry)
- **Animation & Scrollytelling**: [GSAP](https://gsap.com/) & [ScrollTrigger](https://gsap.com/scrolltrigger/)
- **Smooth Scrolling**: [Lenis](https://lenis.darkroom.engineering/)
- **Build Tool**: [Vite](https://vitejs.dev/)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/ultimateboy809/ember-and-oak.git

# Navigate into project directory
cd ember-and-oak

# Install dependencies
npm install

# Start local dev server
npm run dev
```

### Production Build
```bash
npm run build
npm run preview
```

---

## 📜 License
MIT License. Handcrafted with reverence.
