import * as THREE from 'three';

export class BeanBag {
  constructor() {
    this.group = new THREE.Group();
    this.bagMesh = null;
    this.beansMesh = null;
    this.beanCount = 75;
    this.beanInstances = [];

    this.createBag();
    this.createBeans();
  }

  generateLabelTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Rich dark matte craft charcoal pouch background
    ctx.fillStyle = '#171412';
    ctx.fillRect(0, 0, 1024, 1024);

    // Subtle paper grain / fiber lines
    ctx.strokeStyle = '#1d1916';
    ctx.lineWidth = 1;
    for (let i = 0; i < 400; i++) {
      ctx.beginPath();
      const y = Math.random() * 1024;
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y + (Math.random() - 0.5) * 8);
      ctx.stroke();
    }

    // Label Plaque (Warm Oatmeal/Cream paper badge)
    ctx.fillStyle = '#eedfcb';
    const lx = 140;
    const ly = 180;
    const lw = 744;
    const lh = 680;
    const radius = 24;

    ctx.beginPath();
    ctx.roundRect(lx, ly, lw, lh, radius);
    ctx.fill();

    // Gold Foil Trim Border
    ctx.strokeStyle = '#c59b27';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Inner subtle hairline
    ctx.strokeStyle = 'rgba(197, 155, 39, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(lx + 16, ly + 16, lw - 32, lh - 32);

    // Typography
    ctx.textAlign = 'center';
    
    // Eyebrow
    ctx.font = '600 24px -apple-system, sans-serif';
    ctx.fillStyle = '#8c5835';
    ctx.fillText('• SPECIALTY COFFEE ROASTERS •', 512, ly + 75);

    // Brand Title
    ctx.font = 'bold 64px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#171412';
    ctx.fillText('EMBER & OAK', 512, ly + 155);

    // Gold Emblem
    ctx.fillStyle = '#c59b27';
    ctx.font = '32px Georgia, serif';
    ctx.fillText('✦   EST. 2021   ✦', 512, ly + 205);

    // Divider
    ctx.strokeStyle = '#c59b27';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(260, ly + 230);
    ctx.lineTo(764, ly + 230);
    ctx.stroke();

    // Origin
    ctx.font = 'italic 34px "Playfair Display", Georgia, serif';
    ctx.fillStyle = '#d36135';
    ctx.fillText('Single Origin — Huila, Colombia', 512, ly + 290);

    // Details Grid
    ctx.font = 'bold 22px -apple-system, sans-serif';
    ctx.fillStyle = '#2a221c';
    ctx.fillText('VARIETAL: PINK BOURBON   |   ELEVATION: 1,920 MASL', 512, ly + 345);
    ctx.fillText('PROCESS: 48HR ANAEROBIC OAK BARREL FERMENT', 512, ly + 385);

    // Tasting Notes
    ctx.font = 'italic 26px Georgia, serif';
    ctx.fillStyle = '#5c483b';
    ctx.fillText('Tasting Notes: Dark Chocolate, Blood Orange, Roasted Walnut', 512, ly + 445);

    // Roast Level Badge
    ctx.fillStyle = '#d36135';
    ctx.beginPath();
    ctx.roundRect(312, ly + 490, 400, 52, 26);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px -apple-system, sans-serif';
    ctx.fillText('ROAST: MEDIUM-CITY (OAK TEMPERED)', 512, ly + 525);

    // Net Weight
    ctx.font = '500 20px -apple-system, sans-serif';
    ctx.fillStyle = '#8c5835';
    ctx.fillText('NET WT. 12 OZ (340G) • WHOLE BEAN COFFEE', 512, ly + 610);

    const texture = new THREE.CanvasTexture(canvas);
    texture.anisotropy = 8;
    return texture;
  }

  createBag() {
    // 3D Coffee Pouch Geometry
    // Tapered bag with pinched top crimp
    const bagGroup = new THREE.Group();

    // Main pouch body (Box with bevel / smooth subdivisions)
    const bodyGeo = new THREE.BoxGeometry(2.4, 3.4, 1.4, 16, 24, 16);
    const pos = bodyGeo.attributes.position;

    // Deform vertices to look like an authentic filled pouch (bulging center, pinched top)
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i);
      const x = pos.getX(i);
      const z = pos.getZ(i);

      const normalizedY = (y + 1.7) / 3.4; // 0 to 1

      // Bulge in lower-middle
      const belly = Math.sin(normalizedY * Math.PI) * 0.18;
      pos.setZ(i, z * (1.0 + belly * (z > 0 ? 1.2 : 0.8)));

      // Pinch top into flat seal
      if (normalizedY > 0.75) {
        const pinchFactor = (normalizedY - 0.75) / 0.25;
        pos.setZ(i, z * (1.0 - pinchFactor * 0.82));
        pos.setX(i, x * (1.0 + pinchFactor * 0.12));
      }
    }
    bodyGeo.computeVertexNormals();

    const labelTexture = this.generateLabelTexture();
    const pouchMaterial = new THREE.MeshStandardMaterial({
      map: labelTexture,
      roughness: 0.72,
      metalness: 0.15,
      bumpScale: 0.05
    });

    this.bagMesh = new THREE.Mesh(bodyGeo, pouchMaterial);
    this.bagMesh.position.y = 1.7;
    this.bagMesh.castShadow = true;
    this.bagMesh.receiveShadow = true;
    bagGroup.add(this.bagMesh);

    // Top Crimp Seal Bar (Metallic Tin-Tie / Crimp)
    const sealGeo = new THREE.BoxGeometry(2.6, 0.22, 0.28);
    const sealMat = new THREE.MeshStandardMaterial({
      color: 0xc59b27, // Brushed gold crimp
      roughness: 0.35,
      metalness: 0.8
    });
    const sealMesh = new THREE.Mesh(sealGeo, sealMat);
    sealMesh.position.set(0, 3.48, 0);
    sealMesh.castShadow = true;
    bagGroup.add(sealMesh);

    this.group.add(bagGroup);
  }

  createBeanGeometry() {
    // High-fidelity procedural coffee bean with authentic curved cleft crease
    const beanGeo = new THREE.SphereGeometry(0.18, 24, 18);
    beanGeo.scale(1.0, 1.45, 0.65); // Elongated bean proportion

    const pos = beanGeo.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);
      const z = pos.getZ(i);

      // On the front flat side (z > 0), carve an organic center longitudinal crease
      if (z > 0.0) {
        // Subtle S-curve to crease
        const curveX = Math.sin(y * 8.0) * 0.02;
        const distToCenter = Math.abs(x - curveX);

        if (distToCenter < 0.07) {
          const depth = (1.0 - (distToCenter / 0.07)) * 0.09;
          pos.setZ(i, z - depth);
        }
      }
    }
    beanGeo.computeVertexNormals();
    return beanGeo;
  }

  createBeans() {
    const beanGeo = this.createBeanGeometry();
    const beanMat = new THREE.MeshStandardMaterial({
      color: 0x331c11, // Dark roasted glossy bean
      roughness: 0.38,
      metalness: 0.08
    });

    this.beansMesh = new THREE.InstancedMesh(beanGeo, beanMat, this.beanCount);
    this.beansMesh.castShadow = true;
    this.beansMesh.receiveShadow = true;

    const dummy = new THREE.Object3D();

    for (let i = 0; i < this.beanCount; i++) {
      let x, y, z;

      if (i < 40) {
        // Scattered on the ground surface around bag base
        const angle = Math.random() * Math.PI * 2;
        const radius = 1.2 + Math.random() * 2.2;
        x = Math.cos(angle) * radius;
        y = 0.08 + Math.random() * 0.12;
        z = Math.sin(angle) * radius;
      } else {
        // Orbiting / floating in an upward dynamic spiral
        const t = (i - 40) / 35;
        const angle = t * Math.PI * 4;
        const radius = 1.5 + Math.sin(t * Math.PI) * 0.8;
        x = Math.cos(angle) * radius;
        y = 0.6 + t * 3.5;
        z = Math.sin(angle) * radius;
      }

      dummy.position.set(x, y, z);
      dummy.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
      );

      const scale = 0.85 + Math.random() * 0.35;
      dummy.scale.set(scale, scale, scale);
      dummy.updateMatrix();

      this.beansMesh.setMatrixAt(i, dummy.matrix);

      // Store initial info for gentle floating animation
      this.beanInstances.push({
        basePos: new THREE.Vector3(x, y, z),
        rotSpeed: new THREE.Vector3(
          (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * 0.8,
          (Math.random() - 0.5) * 0.8
        ),
        phase: Math.random() * Math.PI * 2,
        isFloating: i >= 40
      });
    }

    this.beansMesh.instanceMatrix.needsUpdate = true;
    this.group.add(this.beansMesh);
  }

  update(time, delta) {
    // Gentle idle floating & subtle breathing rotation for the bag
    if (this.bagMesh) {
      this.bagMesh.rotation.y = Math.sin(time * 0.4) * 0.12;
      this.bagMesh.position.y = 1.7 + Math.sin(time * 0.6) * 0.04;
    }

    // Animate floating beans
    if (this.beansMesh && this.beanInstances.length > 0) {
      const dummy = new THREE.Object3D();
      for (let i = 40; i < this.beanCount; i++) {
        const info = this.beanInstances[i];
        if (!info) continue;

        const floatY = Math.sin(time * 1.2 + info.phase) * 0.12;
        const floatAngle = time * 0.2 + info.phase;
        const rad = Math.sqrt(info.basePos.x * info.basePos.x + info.basePos.z * info.basePos.z);

        dummy.position.set(
          Math.cos(floatAngle) * rad,
          info.basePos.y + floatY,
          Math.sin(floatAngle) * rad
        );
        dummy.rotation.set(
          time * info.rotSpeed.x,
          time * info.rotSpeed.y,
          time * info.rotSpeed.z
        );
        dummy.scale.set(1.0, 1.0, 1.0);
        dummy.updateMatrix();

        this.beansMesh.setMatrixAt(i, dummy.matrix);
      }
      this.beansMesh.instanceMatrix.needsUpdate = true;
    }
  }
}
