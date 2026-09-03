import * as THREE from 'three';
import { CoffeeCup } from './objects/CoffeeCup.js';
import { BeanBag } from './objects/BeanBag.js';
import { CafeInterior } from './objects/CafeInterior.js';
import { Storefront } from './objects/Storefront.js';

export class World {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x0a0806, 0.024);

    // Camera
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 100);
    // Initial hero camera position: close-up on steaming cup
    this.camera.position.set(0, 1.4, 2.4);
    this.lookAtTarget = new THREE.Vector3(0, 0.75, 0);
    this.camera.lookAt(this.lookAtTarget);

    // Mouse parallax offsets
    this.mouse = { x: 0, y: 0 };
    this.targetMouse = { x: 0, y: 0 };

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance',
      alpha: false
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting
    this.setupLighting();

    // Scene Objects
    this.setupObjects();

    // Clock
    this.clock = new THREE.Clock();

    // Events
    this.onResize = this.onResize.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    window.addEventListener('resize', this.onResize);
    window.addEventListener('mousemove', this.onMouseMove, { passive: true });

    // Responsive initial check
    this.adaptForScreenSize();
  }

  setupLighting() {
    // Warm Ambient Light
    this.ambientLight = new THREE.AmbientLight(0x2a1e16, 1.2);
    this.scene.add(this.ambientLight);

    // Dynamic Directional Sun Light (Simulates Time of Day)
    this.sunLight = new THREE.DirectionalLight(0xffeedb, 3.0);
    this.sunLight.position.set(6, 12, 6);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 45;
    this.sunLight.shadow.camera.left = -12;
    this.sunLight.shadow.camera.right = 12;
    this.sunLight.shadow.camera.top = 12;
    this.sunLight.shadow.camera.bottom = -12;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);

    // Subtle Cool Fill / Sky Light from opposite side
    this.fillLight = new THREE.DirectionalLight(0x4a3b32, 0.8);
    this.fillLight.position.set(-8, 8, -4);
    this.scene.add(this.fillLight);

    // Golden Rim Light on Hero Cup
    this.cupRimLight = new THREE.PointLight(0xd36135, 2.2, 5.0, 1.5);
    this.cupRimLight.position.set(1.5, 2.0, 1.2);
    this.scene.add(this.cupRimLight);
  }

  setupObjects() {
    // 1. Hero Steaming Coffee Cup
    this.coffeeCup = new CoffeeCup();
    this.coffeeCup.group.position.set(0, 0, 0);
    this.scene.add(this.coffeeCup.group);

    // 2. Specialty Bean Bag & Scattered Beans
    this.beanBag = new BeanBag();
    this.beanBag.group.position.set(3.4, 0, -6.8);
    this.beanBag.group.rotation.y = -0.42;
    this.scene.add(this.beanBag.group);

    // 3. Cafe Interior Walkthrough
    this.interior = new CafeInterior();
    this.interior.group.position.set(0, 0, -18);
    this.scene.add(this.interior.group);

    // 4. Storefront Module
    this.storefront = new Storefront();
    this.storefront.group.position.set(0, 0, 0);
    this.scene.add(this.storefront.group);
  }

  setDaylightProgress(progress) {
    // progress: 0.0 (7:30 AM Dawn) -> 1.0 (4:30 PM Golden Hour)
    const morningColor = new THREE.Color(0xffeedb);
    const goldenColor = new THREE.Color(0xe26a2c);
    const afternoonColor = new THREE.Color(0xf59e42);

    // Interpolate sun color from morning white-amber to warm afternoon golden-ember
    let targetColor;
    if (progress < 0.6) {
      targetColor = morningColor.clone().lerp(afternoonColor, progress / 0.6);
    } else {
      targetColor = afternoonColor.clone().lerp(goldenColor, (progress - 0.6) / 0.4);
    }

    this.sunLight.color.copy(targetColor);

    // Sun angle tracks across sky
    this.sunLight.position.x = 6 + progress * 8;
    this.sunLight.position.y = 12 - progress * 4.5;
    this.sunLight.position.z = 6 - progress * 14;

    // Intensity increases slightly during warm golden hour
    this.sunLight.intensity = 2.8 + progress * 1.2;
    this.ambientLight.intensity = 1.0 + progress * 0.4;
  }

  onMouseMove(e) {
    this.targetMouse.x = (e.clientX / this.width - 0.5) * 2;
    this.targetMouse.y = -(e.clientY / this.height - 0.5) * 2;
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.adaptForScreenSize();
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  adaptForScreenSize() {
    if (this.width < 768) {
      // Mobile: widen FOV slightly so 3D objects are not cut off
      this.camera.fov = 56;
    } else if (this.width < 1024) {
      this.camera.fov = 50;
    } else {
      this.camera.fov = 45;
    }
  }

  update() {
    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    // Smooth mouse parallax damping
    this.mouse.x += (this.targetMouse.x - this.mouse.x) * 0.05;
    this.mouse.y += (this.targetMouse.y - this.mouse.y) * 0.05;

    // Update scene objects
    if (this.coffeeCup) this.coffeeCup.update(time, delta);
    if (this.beanBag) this.beanBag.update(time, delta);
    if (this.interior) this.interior.update(time, delta);
    if (this.storefront) this.storefront.update(time, delta);

    // Apply gentle mouse parallax offset to camera
    const parallaxX = this.mouse.x * 0.25;
    const parallaxY = this.mouse.y * 0.15;

    this.camera.position.x += parallaxX * 0.05;
    this.camera.position.y += parallaxY * 0.05;

    // Camera lookAt
    this.camera.lookAt(
      this.lookAtTarget.x + parallaxX * 0.1,
      this.lookAtTarget.y + parallaxY * 0.1,
      this.lookAtTarget.z
    );

    // Render
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    window.removeEventListener('resize', this.onResize);
    window.removeEventListener('mousemove', this.onMouseMove);
    this.renderer.dispose();
  }
}
