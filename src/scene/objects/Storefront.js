import * as THREE from 'three';

export class Storefront {
  constructor() {
    this.group = new THREE.Group();
    this.windowLight = null;
    this.signMaterial = null;

    this.createFacade();
    this.createWindowAndDoor();
    this.createSignage();
    this.createOutdoorDetails();
  }

  createFacade() {
    // Charred Cedar / Dark Timber Facade Wall
    const wallGeo = new THREE.BoxGeometry(22, 12, 1.5);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0x17120e, // Dark roasted timber
      roughness: 0.85,
      metalness: 0.05
    });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(0, 5.5, -36);
    wall.receiveShadow = true;
    this.group.add(wall);

    // Stone Sidewalk / Pavement
    const walkGeo = new THREE.BoxGeometry(26, 0.4, 16);
    const walkMat = new THREE.MeshStandardMaterial({
      color: 0x110e0b,
      roughness: 0.75
    });
    const walk = new THREE.Mesh(walkGeo, walkMat);
    walk.position.set(0, -0.2, -32);
    walk.receiveShadow = true;
    this.group.add(walk);

    // Architectural Cornice / Header molding
    const corniceGeo = new THREE.BoxGeometry(22.6, 0.6, 2.0);
    const corniceMat = new THREE.MeshStandardMaterial({
      color: 0x241b14,
      roughness: 0.7
    });
    const cornice = new THREE.Mesh(corniceGeo, corniceMat);
    cornice.position.set(0, 10.5, -35.8);
    cornice.castShadow = true;
    this.group.add(cornice);
  }

  createWindowAndDoor() {
    const openingsGroup = new THREE.Group();

    // Large Arched Cafe Window (Left side)
    const windowFrameGeo = new THREE.BoxGeometry(6.5, 6.0, 0.4);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0x0c0a08,
      roughness: 0.5
    });
    const windowFrame = new THREE.Mesh(windowFrameGeo, frameMat);
    windowFrame.position.set(-4.5, 4.5, -35.2);
    openingsGroup.add(windowFrame);

    // Warm Illuminated Window Glass
    const glassGeo = new THREE.PlaneGeometry(6.1, 5.6);
    const glassMat = new THREE.MeshBasicMaterial({
      color: 0xffdb99, // Warm golden candlelight glow from inside
      transparent: true,
      opacity: 0.88
    });
    const glass = new THREE.Mesh(glassGeo, glassMat);
    glass.position.set(-4.5, 4.5, -35.0);
    openingsGroup.add(glass);

    // Warm Interior Light spilling from the window onto the sidewalk
    this.windowLight = new THREE.PointLight(0xffaa44, 4.0, 14.0, 1.6);
    this.windowLight.position.set(-4.5, 4.5, -33.5);
    this.windowLight.castShadow = true;
    openingsGroup.add(this.windowLight);

    // Timber & Glass Entrance Door (Right side)
    const doorFrameGeo = new THREE.BoxGeometry(3.6, 7.2, 0.4);
    const doorFrame = new THREE.Mesh(doorFrameGeo, frameMat);
    doorFrame.position.set(4.0, 3.6, -35.2);
    openingsGroup.add(doorFrame);

    // Door Glass
    const doorGlassGeo = new THREE.PlaneGeometry(3.0, 4.2);
    const doorGlass = new THREE.Mesh(doorGlassGeo, glassMat);
    doorGlass.position.set(4.0, 4.5, -35.0);
    openingsGroup.add(doorGlass);

    // Solid Wood Lower Door Panel
    const doorPanelGeo = new THREE.BoxGeometry(3.0, 2.0, 0.2);
    const doorPanelMat = new THREE.MeshStandardMaterial({ color: 0x4a2e1c, roughness: 0.6 });
    const doorPanel = new THREE.Mesh(doorPanelGeo, doorPanelMat);
    doorPanel.position.set(4.0, 1.2, -35.0);
    openingsGroup.add(doorPanel);

    // Brass Vertical Door Handle
    const handleGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 16);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0xc59b27, roughness: 0.2, metalness: 0.85 });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.set(2.8, 3.2, -34.8);
    openingsGroup.add(handle);

    this.group.add(openingsGroup);
  }

  createSignage() {
    // Canvas texture for the illuminated transom sign: "EMBER & OAK"
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    // Charcoal sign board
    ctx.fillStyle = '#100c09';
    ctx.fillRect(0, 0, 1024, 256);

    // Gold border line
    ctx.strokeStyle = '#c59b27';
    ctx.lineWidth = 4;
    ctx.strokeRect(12, 12, 1000, 232);

    // Warm Glowing Lettering
    ctx.textAlign = 'center';
    ctx.font = 'bold 78px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#eedfcb';
    ctx.shadowColor = '#d36135';
    ctx.shadowBlur = 18;
    ctx.fillText('EMBER & OAK', 512, 135);

    ctx.shadowBlur = 0;
    ctx.font = '600 24px -apple-system, sans-serif';
    ctx.fillStyle = '#c59b27';
    ctx.letterSpacing = '6px';
    ctx.fillText('SPECIALTY COFFEE • ROASTERY', 512, 185);

    const signTexture = new THREE.CanvasTexture(canvas);

    const signGeo = new THREE.BoxGeometry(8.5, 2.1, 0.3);
    this.signMaterial = new THREE.MeshStandardMaterial({
      map: signTexture,
      emissive: 0x3d2314,
      emissiveIntensity: 0.6,
      roughness: 0.4
    });

    const sign = new THREE.Mesh(signGeo, this.signMaterial);
    sign.position.set(0, 8.8, -35.1);
    sign.castShadow = true;
    this.group.add(sign);
  }

  createOutdoorDetails() {
    const detailsGroup = new THREE.Group();

    // Outdoor Bistro Table (Cast Iron & Oak)
    const tableTopGeo = new THREE.CylinderGeometry(1.0, 1.0, 0.08, 32);
    const tableTopMat = new THREE.MeshStandardMaterial({ color: 0x5a3922, roughness: 0.4 });
    const tableTop = new THREE.Mesh(tableTopGeo, tableTopMat);
    tableTop.position.set(-4.5, 2.1, -29.5);
    tableTop.castShadow = true;
    tableTop.receiveShadow = true;
    detailsGroup.add(tableTop);

    // Table pedestal leg
    const legGeo = new THREE.CylinderGeometry(0.06, 0.12, 2.1, 16);
    const legMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.7, metalness: 0.8 });
    const leg = new THREE.Mesh(legGeo, legMat);
    leg.position.set(-4.5, 1.05, -29.5);
    leg.castShadow = true;
    detailsGroup.add(leg);

    // Warm Lantern on the table
    const lanternGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.45, 12);
    const lanternMat = new THREE.MeshStandardMaterial({
      color: 0xc59b27,
      roughness: 0.3,
      metalness: 0.8
    });
    const lantern = new THREE.Mesh(lanternGeo, lanternMat);
    lantern.position.set(-4.5, 2.38, -29.5);
    detailsGroup.add(lantern);

    // Table candle light
    const candleLight = new THREE.PointLight(0xffaa44, 1.2, 5.0, 2.0);
    candleLight.position.set(-4.5, 2.6, -29.5);
    detailsGroup.add(candleLight);

    this.group.add(detailsGroup);
  }

  update(time, delta) {
    if (this.windowLight) {
      // Subtle cozy fireplace-like flicker in the cafe window
      this.windowLight.intensity = 3.8 + Math.sin(time * 3.5) * 0.2 + Math.cos(time * 7.0) * 0.1;
    }
  }
}
