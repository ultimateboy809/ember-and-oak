import * as THREE from 'three';

export class CoffeeCup {
  constructor() {
    this.group = new THREE.Group();
    this.steamParticles = null;
    this.liquidMesh = null;
    this.liquidMaterial = null;
    
    this.createCup();
    this.createLiquid();
    this.createSteam();
  }

  createCup() {
    // Ceramic Latte Cup using LatheGeometry for authentic artisanal curve
    const points = [];
    points.push(new THREE.Vector2(0.0, 0.0));
    points.push(new THREE.Vector2(0.55, 0.0));
    points.push(new THREE.Vector2(0.65, 0.05));
    points.push(new THREE.Vector2(0.85, 0.35));
    points.push(new THREE.Vector2(1.05, 0.75));
    points.push(new THREE.Vector2(1.15, 1.15));
    // Rim curve
    points.push(new THREE.Vector2(1.13, 1.2));
    points.push(new THREE.Vector2(1.08, 1.2));
    // Inner wall
    points.push(new THREE.Vector2(1.02, 1.15));
    points.push(new THREE.Vector2(0.92, 0.75));
    points.push(new THREE.Vector2(0.72, 0.35));
    points.push(new THREE.Vector2(0.52, 0.1));
    points.push(new THREE.Vector2(0.0, 0.1));

    const cupGeometry = new THREE.LatheGeometry(points, 48);
    cupGeometry.computeVertexNormals();

    // High-end ceramic physical material with glazed clearcoat
    const ceramicMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf3ede3, // Artisanal cream oat ceramic
      roughness: 0.18,
      metalness: 0.04,
      clearcoat: 0.9,
      clearcoatRoughness: 0.12,
      reflectivity: 0.7
    });

    const cupMesh = new THREE.Mesh(cupGeometry, ceramicMaterial);
    cupMesh.castShadow = true;
    cupMesh.receiveShadow = true;
    this.group.add(cupMesh);

    // Ceramic Saucer
    const saucerPoints = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(0.8, 0),
      new THREE.Vector2(1.3, 0.06),
      new THREE.Vector2(1.7, 0.22),
      new THREE.Vector2(1.68, 0.26),
      new THREE.Vector2(1.25, 0.1),
      new THREE.Vector2(0.75, 0.05),
      new THREE.Vector2(0, 0.05)
    ];
    const saucerGeometry = new THREE.LatheGeometry(saucerPoints, 48);
    const saucerMesh = new THREE.Mesh(saucerGeometry, ceramicMaterial);
    saucerMesh.position.y = -0.05;
    saucerMesh.castShadow = true;
    saucerMesh.receiveShadow = true;
    this.group.add(saucerMesh);

    // Cup Handle (Curved Torus)
    const handleGeo = new THREE.TorusGeometry(0.35, 0.08, 24, 32, Math.PI * 0.95);
    const handleMesh = new THREE.Mesh(handleGeo, ceramicMaterial);
    handleMesh.position.set(1.02, 0.65, 0);
    handleMesh.rotation.z = -Math.PI / 1.8;
    handleMesh.castShadow = true;
    this.group.add(handleMesh);
  }

  createLiquid() {
    // Espresso Surface with Crema Shader
    const liquidGeo = new THREE.CircleGeometry(0.98, 48);
    liquidGeo.rotateX(-Math.PI / 2);

    // Custom Shader for animated liquid reflections and crema gradient ring
    this.liquidMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColorDark: { value: new THREE.Color(0x1a0d06) }, // Deep extraction
        uColorCrema: { value: new THREE.Color(0xd18a38) }, // Golden crema rim
        uColorFoam: { value: new THREE.Color(0xedd3a8) }   // Heart foam highlight
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vNormal;
        uniform float uTime;
        
        void main() {
          vUv = uv;
          vec3 pos = position;
          // Subtle meniscus elevation & micro waves
          float dist = length(uv - vec2(0.5));
          pos.y += sin(dist * 18.0 - uTime * 2.5) * 0.008 * (1.0 - dist * 1.5);
          vNormal = normal;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 uColorDark;
        uniform vec3 uColorCrema;
        uniform vec3 uColorFoam;
        uniform float uTime;
        varying vec2 vUv;
        
        // Simplex/Perlin noise helper
        vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
        vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
        float snoise(vec2 v) {
          const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
          vec2 i  = floor(v + dot(v, C.yy) );
          vec2 x0 = v -   i + dot(i, C.xx);
          vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
          vec4 x12 = x0.xyxy + C.xxzz;
          x12.xy -= i1;
          i = mod289(i);
          vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
          vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
          m = m*m ;
          m = m*m ;
          vec3 x = 2.0 * fract(p * C.www) - 1.0;
          vec3 h = abs(x) - 0.5;
          vec3 ox = floor(x + 0.5);
          vec3 a0 = x - ox;
          m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
          vec3 g;
          g.x  = a0.x  * x0.x  + h.x  * x0.y;
          g.yz = a0.yz * x12.xz + h.yz * x12.yw;
          return 130.0 * dot(m, g);
        }

        void main() {
          vec2 center = vUv - vec2(0.5);
          float dist = length(center) * 2.0;
          
          // Crema swirling texture
          float noise = snoise(center * 7.0 + vec2(cos(uTime * 0.4), sin(uTime * 0.4)) * 0.5);
          float swirl = snoise(center * 14.0 - uTime * 0.2);
          
          // Radial blend: dark core, marbled crema towards rim
          vec3 color = mix(uColorDark, uColorCrema, smoothstep(0.3, 0.95, dist + noise * 0.15));
          
          // Artisanal latte art / pour heart trace
          float heartPattern = smoothstep(0.25, 0.05, abs(center.x) + center.y * 0.8 + swirl * 0.08);
          color = mix(color, uColorFoam, heartPattern * 0.6);
          
          // Specular highlight gloss
          vec2 lightDir = normalize(vec2(0.8, -0.6));
          float spec = pow(max(0.0, dot(normalize(-center), lightDir)), 8.0) * 0.35;
          color += vec3(spec);

          gl_FragColor = vec4(color, 1.0);
        }
      `
    });

    this.liquidMesh = new THREE.Mesh(liquidGeo, this.liquidMaterial);
    this.liquidMesh.position.y = 0.98; // Level inside cup
    this.group.add(this.liquidMesh);
  }

  createSteam() {
    // Volumetric rising steam particle cloud using custom shader
    const particleCount = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const randomScales = new Float32Array(particleCount);
    const lifeOffsets = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Clustered above the liquid surface
      const radius = Math.random() * 0.45;
      const angle = Math.random() * Math.PI * 2;
      positions[i * 3 + 0] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = 1.05 + Math.random() * 2.2;
      positions[i * 3 + 2] = Math.sin(angle) * radius;

      randomScales[i] = 0.5 + Math.random() * 1.5;
      lifeOffsets[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(randomScales, 1));
    geometry.setAttribute('aLifeOffset', new THREE.BufferAttribute(lifeOffsets, 1));

    // Custom steam shader with curl drift and soft fading
    const steamMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0xf2e8dc) }
      },
      vertexShader: `
        attribute float aScale;
        attribute float aLifeOffset;
        uniform float uTime;
        varying float vAlpha;

        void main() {
          vec3 pos = position;
          
          // Continuous rising loop
          float loopTime = fract(uTime * 0.3 + aLifeOffset);
          pos.y = 1.02 + loopTime * 2.5;
          
          // Gentle swirling drift outwards as it rises
          float curl = sin(uTime * 1.2 + pos.y * 3.0) * 0.18 * loopTime;
          pos.x += curl + sin(loopTime * 6.28) * 0.08;
          pos.z += cos(uTime * 0.9 + pos.y * 2.5) * 0.15 * loopTime;
          
          // Alpha: fade in at base, fade out smoothly at top
          vAlpha = sin(loopTime * 3.14159) * (1.0 - loopTime * 0.5) * 0.28;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          // Particle size scales with distance and expansion as steam rises
          gl_PointSize = (32.0 * aScale * (1.0 + loopTime * 1.8)) * (1.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;

        void main() {
          // Soft radial falloff for fluffy puff
          vec2 center = gl_PointCoord - vec2(0.5);
          float dist = length(center);
          if (dist > 0.5) discard;
          
          float softAlpha = smoothstep(0.5, 0.05, dist) * vAlpha;
          gl_FragColor = vec4(uColor, softAlpha);
        }
      `
    });

    this.steamParticles = new THREE.Points(geometry, steamMaterial);
    this.group.add(this.steamParticles);
  }

  update(time, delta) {
    if (this.liquidMaterial) {
      this.liquidMaterial.uniforms.uTime.value = time;
    }
    if (this.steamParticles) {
      this.steamParticles.material.uniforms.uTime.value = time;
    }
  }
}
