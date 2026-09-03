import { World } from './scene/World.js';
import { ScrollManager } from './controllers/ScrollManager.js';
import { UIController } from './controllers/UIController.js';

class App {
  constructor() {
    this.canvas = document.getElementById('webgl-canvas');
    this.uiController = new UIController();
    this.world = null;
    this.scrollManager = null;
    this.isRunning = true;

    this.init();
  }

  init() {
    // 1. Initialize 3D Graphics World
    this.world = new World(this.canvas);

    // 2. Start Animation Render Loop
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);

    // 3. Preloader completion triggers ScrollManager initialization
    this.uiController.simulatePreload(() => {
      // Initialize Lenis + GSAP ScrollTrigger once canvas is visible
      this.scrollManager = new ScrollManager(this.world, this.uiController);
    });

    // Cleanup on beforeunload
    window.addEventListener('beforeunload', () => {
      this.isRunning = false;
      if (this.world) this.world.destroy();
    });
  }

  animate() {
    if (!this.isRunning) return;
    requestAnimationFrame(this.animate);

    if (this.world) {
      this.world.update();
    }
  }
}

// Bootstrap once DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.__EMBER_APP__ = new App();
});
