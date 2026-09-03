import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export class ScrollManager {
  constructor(world, uiController) {
    this.world = world;
    this.uiController = uiController;
    this.lenis = null;
    this.timeline = null;

    this.initLenis();
    this.initScrollTimeline();
    this.setupNavLinks();
  }

  initLenis() {
    this.lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
      infinite: false
    });

    // Synchronize Lenis scroll with GSAP ScrollTrigger
    this.lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  initScrollTimeline() {
    const world = this.world;
    const camera = world.camera;
    const target = world.lookAtTarget;

    // Master ScrollTrigger timeline spanning the entire page
    this.timeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#scroll-container',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        onUpdate: (self) => {
          this.handleGlobalScrollProgress(self.progress);
        }
      }
    });

    // =========================================================================
    // STAGE 1: HERO -> THE BEAN (0.0 to 0.25)
    // Camera starts on steaming cup (0, 1.4, 2.4) looking at (0, 0.75, 0)
    // Pulls back, tilts right, approaches Bean Pouch at (3.4, 0, -6.8)
    // =========================================================================
    this.timeline.to(camera.position, {
      x: 3.4,
      y: 2.3,
      z: -3.6,
      ease: 'power2.inOut',
      duration: 2.5
    }, 0);

    this.timeline.to(target, {
      x: 3.4,
      y: 1.8,
      z: -6.8,
      ease: 'power2.inOut',
      duration: 2.5
    }, 0);

    // =========================================================================
    // STAGE 2: THE BEAN -> THE SPACE INTERIOR (0.25 to 0.55)
    // Camera moves from Bean pouch to glide past the fluted walnut cafe counter
    // =========================================================================
    this.timeline.to(camera.position, {
      x: 1.2,
      y: 3.4,
      z: -13.5,
      ease: 'power2.inOut',
      duration: 3.0
    }, 2.5);

    this.timeline.to(target, {
      x: -0.5,
      y: 2.8,
      z: -20.5,
      ease: 'power2.inOut',
      duration: 3.0
    }, 2.5);

    // Dynamic Daylight progression during Cafe Walkthrough
    const daylightState = { progress: 0.0 };
    this.timeline.to(daylightState, {
      progress: 1.0,
      duration: 3.0,
      ease: 'power1.inOut',
      onUpdate: () => {
        world.setDaylightProgress(daylightState.progress);
      }
    }, 2.5);

    // =========================================================================
    // STAGE 3: THE SPACE -> THE MENU (0.55 to 0.8)
    // Camera settles into an elevated architectural perspective
    // =========================================================================
    this.timeline.to(camera.position, {
      x: -1.5,
      y: 3.6,
      z: -17.5,
      ease: 'power2.inOut',
      duration: 2.5
    }, 5.5);

    this.timeline.to(target, {
      x: -2.5,
      y: 2.9,
      z: -22.0,
      ease: 'power2.inOut',
      duration: 2.5
    }, 5.5);

    // =========================================================================
    // STAGE 4: THE MENU -> VISIT US STOREFRONT (0.8 to 1.0)
    // Camera pulls back to reveal the warm glowing cafe storefront facade
    // =========================================================================
    this.timeline.to(camera.position, {
      x: 0,
      y: 3.6,
      z: -23.0,
      ease: 'power2.inOut',
      duration: 2.5
    }, 8.0);

    this.timeline.to(target, {
      x: 0,
      y: 4.5,
      z: -36.0,
      ease: 'power2.inOut',
      duration: 2.5
    }, 8.0);

    // Setup Section In/Out UI Triggers
    this.setupSectionTriggers();
  }

  setupSectionTriggers() {
    // 1. Hero Content fade out as user scrolls down
    gsap.to('.hero-content, .scroll-indicator', {
      opacity: 0,
      y: -40,
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: '50% top',
        scrub: true
      }
    });

    // 2. Bean Story Card Slide & Roast Animation
    ScrollTrigger.create({
      trigger: '#bean',
      start: 'top 65%',
      end: 'bottom 40%',
      onEnter: () => {
        this.uiController.animateRoastLevel('medium');
        this.updateActiveNav('bean');
      },
      onEnterBack: () => {
        this.updateActiveNav('bean');
      }
    });

    // 3. Space Section Navigation & Time indicator
    ScrollTrigger.create({
      trigger: '#space',
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => {
        this.updateActiveNav('space');
      },
      onEnterBack: () => {
        this.updateActiveNav('space');
      }
    });

    // 4. Menu Section Navigation
    ScrollTrigger.create({
      trigger: '#menu',
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => {
        this.updateActiveNav('menu');
      },
      onEnterBack: () => {
        this.updateActiveNav('menu');
      }
    });

    // 5. Visit Us Section Navigation
    ScrollTrigger.create({
      trigger: '#visit',
      start: 'top 60%',
      end: 'bottom bottom',
      onEnter: () => {
        this.updateActiveNav('visit');
      },
      onEnterBack: () => {
        this.updateActiveNav('visit');
      }
    });
  }

  handleGlobalScrollProgress(progress) {
    // Update ambient time indicator badge text
    const timeLabel = document.getElementById('time-label');
    if (!timeLabel) return;

    if (progress < 0.25) {
      timeLabel.textContent = '07:30 AM — Dawn Brew';
    } else if (progress < 0.50) {
      timeLabel.textContent = '10:15 AM — Roast Batching';
    } else if (progress < 0.75) {
      timeLabel.textContent = '01:45 PM — Sunlit Bar';
    } else {
      timeLabel.textContent = '04:30 PM — Golden Hearth';
    }
  }

  updateActiveNav(sectionId) {
    document.querySelectorAll('.nav-link').forEach((link) => {
      if (link.dataset.nav === sectionId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  setupNavLinks() {
    // Smooth scroll navigation clicks via Lenis
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');
        if (href === '#' || !href) return;
        const targetElement = document.querySelector(href);
        if (targetElement && this.lenis) {
          e.preventDefault();
          this.lenis.scrollTo(targetElement, {
            offset: 0,
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
          });
        }
      });
    });
  }
}
