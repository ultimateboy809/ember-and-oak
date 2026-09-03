import * as THREE from 'three';

export class CafeInterior {
  constructor() {
    this.group = new THREE.Group();
    this.dustParticles = null;
    this.pendantLights = [];
    
    this.createFloorAndWalls();
    this.createBarCounter();
    this.createEspressoMachine();
    this.createShelving();
    this.createPendants();
    this.createAtmosphericDust();
  }

  createFloorAndWalls() {
    // Polished Concrete / Terrazzo Floor
    const floorGeo = new THREE.PlaneGeometry(36, 40);
    floorGeo.rotateX(-Math.PI / 2);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x14100c, // Deep charcoal concrete
      roughness: 0.35,
      metalness: 0.25
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.01;
    floor.receiveShadow = true;
    this.group.add(floor);

    // Fluted Wood Back Wall
    const wallGroup = new THREE.Group();
    const wallBaseGeo = new THREE.PlaneGeometry(36, 12);
    const wallBaseMat = new THREE.MeshStandardMaterial({
      color: 0x1a140f,
      roughness: 0.85
    });
    const wallBase = new THREE.Mesh(wallBaseGeo, wallBaseMat);
    wallBase.position.set(0, 5, -8);
    wallBase.receiveShadow = true;
    wallGroup.add(wallBase);

    // Architectural Wood Slats along Back Wall (InstancedMesh)
    const slatGeo = new THREE.BoxGeometry(0.12, 10, 0.08);
    const slatMat = new THREE.MeshStandardMaterial({
      color: 0x3d2719, // Cured walnut
      roughness: 0.65,
      metalness: 0.05
    });
    const slatCount = 50;
    const slatMesh = new THREE.InstancedMesh(slatGeo, slatMat, slatCount);
    slatMesh.castShadow = true;
    slatMesh.receiveShadow = true;

    const dummy = new THREE.Object3D();
    for (let i = 0; i < slatCount; i++) {
      const x = (i - slatCount / 2) * 0.45;
      dummy.position.set(x, 5, -7.94);
      dummy.updateMatrix();
      slatMesh.setMatrixAt(i, dummy.matrix);
    }
    slatMesh.instanceMatrix.needsUpdate = true;
    wallGroup.add(slatMesh);

    this.group.add(wallGroup);
  }

  createBarCounter() {
    const counterGroup = new THREE.Group();

    // Solid Walnut Countertop
    const topGeo = new THREE.BoxGeometry(16, 0.25, 3.2);
    const topMat = new THREE.MeshStandardMaterial({
      color: 0x5a3922, // Rich oiled walnut
      roughness: 0.4,
      metalness: 0.05
    });
    const countertop = new THREE.Mesh(topGeo, topMat);
    countertop.position.set(0, 2.2, -2.5);
    countertop.castShadow = true;
    countertop.receiveShadow = true;
    counterGroup.add(countertop);

    // Counter Base with Fluted Front Slats
    const baseGeo = new THREE.BoxGeometry(15.6, 2.1, 2.8);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x221710,
      roughness: 0.8
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.set(0, 1.05, -2.5);
    base.castShadow = true;
    base.receiveShadow = true;
    counterGroup.add(base);

    // Brass Toe Kick
    const kickGeo = new THREE.BoxGeometry(15.6, 0.15, 2.6);
    const kickMat = new THREE.MeshStandardMaterial({
      color: 0xc59b27,
      roughness: 0.35,
      metalness: 0.85
    });
    const kick = new THREE.Mesh(kickGeo, kickMat);
    kick.position.set(0, 0.075, -2.5);
    counterGroup.add(kick);

    this.group.add(counterGroup);
  }

  createEspressoMachine() {
    const machineGroup = new THREE.Group();

    // Machine Main Body (Chiseled Italian commercial espresso machine)
    const bodyGeo = new THREE.BoxGeometry(2.4, 1.3, 1.4);
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xe8e8e8,
      roughness: 0.15,
      metalness: 0.95
    });
    const matteBlackMat = new THREE.MeshStandardMaterial({
      color: 0x1b1918,
      roughness: 0.5,
      metalness: 0.2
    });

    const body = new THREE.Mesh(bodyGeo, matteBlackMat);
    body.position.set(-2.5, 2.95, -2.6);
    body.castShadow = true;
    body.receiveShadow = true;
    machineGroup.add(body);

    // Chrome Top Cup Warming Tray & Rail
    const trayGeo = new THREE.BoxGeometry(2.3, 0.08, 1.3);
    const tray = new THREE.Mesh(trayGeo, chromeMat);
    tray.position.set(-2.5, 3.64, -2.6);
    machineGroup.add(tray);

    // Stacked Espresso Cups on Warming Tray
    const cupGeo = new THREE.CylinderGeometry(0.12, 0.08, 0.16, 16);
    const cupMat = new THREE.MeshStandardMaterial({ color: 0xf5efe6, roughness: 0.2 });
    for (let i = 0; i < 6; i++) {
      const miniCup = new THREE.Mesh(cupGeo, cupMat);
      miniCup.position.set(-3.2 + (i % 3) * 0.35, 3.76 + Math.floor(i / 3) * 0.14, -2.8 + (i % 2) * 0.25);
      miniCup.castShadow = true;
      machineGroup.add(miniCup);
    }

    // Dual Group Heads & Portafilters
    for (let g = 0; g < 2; g++) {
      const gx = -2.9 + g * 0.8;
      // Group head cylinder
      const headGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.22, 24);
      const head = new THREE.Mesh(headGeo, chromeMat);
      head.position.set(gx, 2.7, -1.85);
      machineGroup.add(head);

      // Portafilter Handle (Walnut wood handle)
      const handleGeo = new THREE.CylinderGeometry(0.04, 0.045, 0.45, 12);
      handleGeo.rotateX(Math.PI / 2);
      const handleMat = new THREE.MeshStandardMaterial({ color: 0x5a3922, roughness: 0.4 });
      const handle = new THREE.Mesh(handleGeo, handleMat);
      handle.position.set(gx, 2.6, -1.55);
      handle.castShadow = true;
      machineGroup.add(handle);
    }

    // Commercial Coffee Grinder next to machine
    const grinderGroup = new THREE.Group();
    const grinderBaseGeo = new THREE.BoxGeometry(0.8, 1.4, 0.9);
    const grinderBase = new THREE.Mesh(grinderBaseGeo, matteBlackMat);
    grinderBase.position.set(-0.8, 3.0, -2.6);
    grinderBase.castShadow = true;
    grinderGroup.add(grinderBase);

    // Glass Hopper with Coffee Beans inside
    const hopperGeo = new THREE.CylinderGeometry(0.4, 0.2, 0.8, 24);
    const glassMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      roughness: 0.1,
      transmission: 0.85,
      thickness: 0.3,
      transparent: true,
      opacity: 0.65
    });
    const hopper = new THREE.Mesh(hopperGeo, glassMat);
    hopper.position.set(-0.8, 4.0, -2.6);
    grinderGroup.add(hopper);

    // Bean fill inside hopper
    const fillGeo = new THREE.CylinderGeometry(0.36, 0.18, 0.65, 16);
    const fillMat = new THREE.MeshStandardMaterial({ color: 0x2b180d, roughness: 0.7 });
    const fill = new THREE.Mesh(fillGeo, fillMat);
    fill.position.set(-0.8, 3.95, -2.6);
    grinderGroup.add(fill);

    machineGroup.add(grinderGroup);
    this.group.add(machineGroup);
  }

  createShelving() {
    const shelfGroup = new THREE.Group();

    // Two Floating Shelves
    const shelfMat = new THREE.MeshStandardMaterial({ color: 0x4a2f1c, roughness: 0.5 });
    for (let s = 0; s < 2; s++) {
      const shelfY = 5.2 + s * 1.8;
      const shelfGeo = new THREE.BoxGeometry(12, 0.15, 0.9);
      const shelf = new THREE.Mesh(shelfGeo, shelfMat);
      shelf.position.set(0, shelfY, -7.5);
      shelf.castShadow = true;
      shelf.receiveShadow = true;
      shelfGroup.add(shelf);

      // Glass Carafes & Ceramic Jars on Shelves
      const jarGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.6, 16);
      const jarMat = new THREE.MeshStandardMaterial({ color: 0xdfd5c6, roughness: 0.3 });
      const amberMat = new THREE.MeshPhysicalMaterial({
        color: 0xd9822b,
        roughness: 0.2,
        transmission: 0.7,
        transparent: true
      });

      for (let j = 0; j < 8; j++) {
        const mat = j % 3 === 0 ? amberMat : jarMat;
        const jar = new THREE.Mesh(jarGeo, mat);
        jar.position.set(-5 + j * 1.4, shelfY + 0.38, -7.5);
        jar.castShadow = true;
        shelfGroup.add(jar);
      }
    }

    this.group.add(shelfGroup);
  }

  createPendants() {
    const pendantGroup = new THREE.Group();

    // 3 Brushed Brass Pendant Lamps along the counter
    const brassMat = new THREE.MeshStandardMaterial({
      color: 0xc59b27,
      roughness: 0.25,
      metalness: 0.85
    });
    const bulbMat = new THREE.MeshBasicMaterial({
      color: 0xffedd0
    });

    const positionsX = [-3.8, 0, 3.8];

    positionsX.forEach((px) => {
      // Wire hanging from ceiling
      const wireGeo = new THREE.CylinderGeometry(0.015, 0.015, 4.5, 8);
      const wireMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
      const wire = new THREE.Mesh(wireGeo, wireMat);
      wire.position.set(px, 7.5, -2.5);
      pendantGroup.add(wire);

      // Brass Conical Shade
      const shadeGeo = new THREE.ConeGeometry(0.45, 0.5, 24, 1, true);
      const shade = new THREE.Mesh(shadeGeo, brassMat);
      shade.position.set(px, 5.25, -2.5);
      shade.castShadow = true;
      pendantGroup.add(shade);

      // Glowing Filament Bulb
      const bulbGeo = new THREE.SphereGeometry(0.12, 16, 16);
      const bulb = new THREE.Mesh(bulbGeo, bulbMat);
      bulb.position.set(px, 5.12, -2.5);
      pendantGroup.add(bulb);

      // Warm Point Light casting localized downlight on counter
      const pLight = new THREE.PointLight(0xffb86c, 2.5, 7.0, 1.8);
      pLight.position.set(px, 4.9, -2.5);
      pLight.castShadow = true;
      pendantGroup.add(pLight);

      this.pendantLights.push(pLight);
    });

    this.group.add(pendantGroup);
  }

  createAtmosphericDust() {
    // 160 floating ambient light dust motes
    const count = 160;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const speeds = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 16;
      positions[i * 3 + 1] = 0.5 + Math.random() * 6.5;
      positions[i * 3 + 2] = -1.0 - Math.random() * 8.0;

      speeds[i * 3 + 0] = (Math.random() - 0.5) * 0.05;
      speeds[i * 3 + 1] = 0.02 + Math.random() * 0.04;
      speeds[i * 3 + 2] = (Math.random() - 0.5) * 0.05;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const dustMat = new THREE.PointsMaterial({
      color: 0xffdfaa,
      size: 0.08,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });

    this.dustParticles = new THREE.Points(geometry, dustMat);
    this.dustSpeeds = speeds;
    this.group.add(this.dustParticles);
  }

  update(time, delta) {
    // Animate floating dust motes
    if (this.dustParticles) {
      const pos = this.dustParticles.geometry.attributes.position;
      for (let i = 0; i < pos.count; i++) {
        let y = pos.getY(i) + this.dustSpeeds[i * 3 + 1] * delta;
        let x = pos.getX(i) + Math.sin(time * 0.5 + i) * 0.003;
        let z = pos.getZ(i) + Math.cos(time * 0.4 + i) * 0.003;

        // Reset if float too high
        if (y > 7.0) y = 0.5;

        pos.setXYZ(i, x, y, z);
      }
      pos.needsUpdate = true;
    }

    // Subtle gentle hum on pendant light intensity
    this.pendantLights.forEach((light, idx) => {
      light.intensity = 2.4 + Math.sin(time * 2.0 + idx * 1.5) * 0.15;
    });
  }
}
