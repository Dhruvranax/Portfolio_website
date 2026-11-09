// ========================================
// Dhruv Rana - Cybersecurity Portfolio
// Three.js 3D Effects Module
// ========================================

import * as THREE from 'three';

// Global 3D State
let heroScene = null, heroCamera = null, heroRenderer = null;
let heroAnimationId = null;
let heroObjects = [];
let mouse3D = new THREE.Vector2();
let targetMouse3D = new THREE.Vector2();
let reducedMotion3D = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Color palette matching CSS
const COLORS = {
    primary: 0xff006e,      // Magenta
    secondary: 0xfb5607,    // Orange-Red
    tertiary: 0xffbe0b,     // Gold
    quaternary: 0x06ffa5,   // Mint Green
    blue: 0x3a86ff,         // Blue
    violet: 0x8338ec,       // Violet
    dark: 0x050508,
    card: 0x12121a,
    border: 0x2a2a3e
};

const RAINBOW_COLORS = [
    COLORS.primary,
    COLORS.secondary,
    COLORS.tertiary,
    COLORS.quaternary,
    COLORS.blue,
    COLORS.violet
];

// ========================================
// Initialize 3D Hero Scene
// ========================================
async function initHero3D() {
    if (reducedMotion3D) return;

    const container = document.getElementById('hero-3d-scene');
    if (!container) return;

    // Scene setup
    heroScene = new THREE.Scene();

    // Camera - wider FOV for more dramatic 3D
    const aspect = container.clientWidth / container.clientHeight;
    heroCamera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
    heroCamera.position.set(0, 0, 50);

    // Renderer with alpha for transparency
    heroRenderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance'
    });
    heroRenderer.setSize(container.clientWidth, container.clientHeight);
    heroRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    heroRenderer.setClearColor(0x000000, 0);
    container.appendChild(heroRenderer.domElement);

    // Create 3D objects
    createFloatingGeometries();
    createParticleField();
    createGridFloor();
    createFloatingOrbs();

    // Mouse tracking
    document.addEventListener('mousemove', onMouseMove3D);
    window.addEventListener('resize', onResize3D);

    // Start animation loop
    animateHero3D();
}

function onMouseMove3D(event) {
    const container = document.getElementById('hero-3d-scene');
    if (!container) return;

    const rect = container.getBoundingClientRect();
    targetMouse3D.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    targetMouse3D.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function onResize3D() {
    const container = document.getElementById('hero-3d-scene');
    if (!container || !heroCamera || !heroRenderer) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    heroCamera.aspect = width / height;
    heroCamera.updateProjectionMatrix();
    heroRenderer.setSize(width, height);
}

// ========================================
// Create Floating Geometric Shapes
// ========================================
function createFloatingGeometries() {
    const geometryTypes = [
        { type: 'octahedron', count: 3, sizeRange: [2, 4], distance: 30 },
        { type: 'tetrahedron', count: 4, sizeRange: [1.5, 3], distance: 40 },
        { type: 'icosahedron', count: 2, sizeRange: [3, 5], distance: 50 },
        { type: 'box', count: 3, sizeRange: [2, 3.5], distance: 35 },
        { type: 'torus', count: 2, sizeRange: [2.5, 4], distance: 45, tube: 0.5 }
    ];

    geometryTypes.forEach(({ type, count, sizeRange, distance, tube }) => {
        for (let i = 0; i < count; i++) {
            let geometry;
            const size = THREE.MathUtils.lerp(sizeRange[0], sizeRange[1], Math.random());

            switch (type) {
                case 'octahedron':
                    geometry = new THREE.OctahedronGeometry(size, 0);
                    break;
                case 'tetrahedron':
                    geometry = new THREE.TetrahedronGeometry(size, 0);
                    break;
                case 'icosahedron':
                    geometry = new THREE.IcosahedronGeometry(size, 0);
                    break;
                case 'box':
                    geometry = new THREE.BoxGeometry(size, size, size);
                    break;
                case 'torus':
                    geometry = new THREE.TorusGeometry(size, tube || 0.8, 8, 16);
                    break;
            }

            // Wireframe material with glow
            const color = RAINBOW_COLORS[Math.floor(Math.random() * RAINBOW_COLORS.length)];
            const material = new THREE.MeshBasicMaterial({
                color: color,
                wireframe: true,
                transparent: true,
                opacity: 0.15,
                blending: THREE.AdditiveBlending
            });

            const mesh = new THREE.Mesh(geometry, material);

            // Random position in 3D space
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);
            const radius = distance + Math.random() * 20;

            mesh.position.setFromSphericalCoords(radius, phi, theta);

            // Store animation properties
            mesh.userData = {
                basePosition: mesh.position.clone(),
                rotationSpeed: new THREE.Vector3(
                    (Math.random() - 0.5) * 0.002,
                    (Math.random() - 0.5) * 0.003,
                    (Math.random() - 0.5) * 0.001
                ),
                floatOffset: Math.random() * Math.PI * 2,
                floatSpeed: 0.0005 + Math.random() * 0.001,
                floatAmplitude: 3 + Math.random() * 5,
                color: color,
                originalOpacity: material.opacity
            };

            heroObjects.push(mesh);
            heroScene.add(mesh);
        }
    });
}

// ========================================
// Create Particle Field
// ========================================
function createParticleField() {
    const particleCount = 800;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const velocities = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        // Spherical distribution
        const radius = 20 + Math.random() * 60;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);

        positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = radius * Math.cos(phi);

        // Random rainbow color
        const color = new THREE.Color(RAINBOW_COLORS[Math.floor(Math.random() * RAINBOW_COLORS.length)]);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;

        sizes[i] = Math.random() * 2 + 0.5;

        // Velocity for subtle drift
        velocities[i * 3] = (Math.random() - 0.5) * 0.02;
        velocities[i * 3 + 1] = (Math.random() - 0.5) * 0.02;
        velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const material = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const particles = new THREE.Points(geometry, material);
    particles.userData = { isParticleField: true };
    heroObjects.push(particles);
    heroScene.add(particles);
}

// ========================================
// Create Grid Floor
// ========================================
function createGridFloor() {
    const gridSize = 200;
    const gridDivisions = 40;

    const gridHelper = new THREE.GridHelper(gridSize, gridDivisions, COLORS.primary, COLORS.border);
    gridHelper.position.y = -40;
    gridHelper.material.transparent = true;
    gridHelper.material.opacity = 0.15;
    gridHelper.material.blending = THREE.AdditiveBlending;

    // Add glow lines
    const glowGeometry = new THREE.PlaneGeometry(gridSize, gridSize);
    const glowMaterial = new THREE.MeshBasicMaterial({
        color: COLORS.primary,
        transparent: true,
        opacity: 0.03,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });
    const glowPlane = new THREE.Mesh(glowGeometry, glowMaterial);
    glowPlane.rotation.x = -Math.PI / 2;
    glowPlane.position.y = -40;

    heroScene.add(gridHelper);
    heroScene.add(glowPlane);
    heroObjects.push(gridHelper, glowPlane);
}

// ========================================
// Create Floating Glow Orbs
// ========================================
function createFloatingOrbs() {
    const orbData = [
        { color: COLORS.primary, size: 15, position: new THREE.Vector3(-30, 20, -20) },
        { color: COLORS.tertiary, size: 12, position: new THREE.Vector3(35, -10, -30) },
        { color: COLORS.quaternary, size: 10, position: new THREE.Vector3(10, -25, 20) },
        { color: COLORS.blue, size: 8, position: new THREE.Vector3(-25, -15, 35) },
        { color: COLORS.violet, size: 12, position: new THREE.Vector3(20, 30, -10) }
    ];

    orbData.forEach((data, index) => {
        // Create multiple layers for glow effect
        for (let layer = 0; layer < 3; layer++) {
            const geometry = new THREE.SphereGeometry(data.size * (1 + layer * 0.5), 16, 16);
            const material = new THREE.MeshBasicMaterial({
                color: data.color,
                transparent: true,
                opacity: 0.05 * (3 - layer),
                side: THREE.BackSide,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });

            const orb = new THREE.Mesh(geometry, material);
            orb.position.copy(data.position);

            orb.userData = {
                basePosition: data.position.clone(),
                floatSpeed: 0.0003 + index * 0.0002,
                floatOffset: index * Math.PI * 0.4,
                floatAmplitude: 5 + index * 2,
                rotationSpeed: new THREE.Vector3(0, 0.0002 * (index + 1), 0)
            };

            heroObjects.push(orb);
            heroScene.add(orb);
        }
    });
}

// ========================================
// Animation Loop
// ========================================
function animateHero3D() {
    heroAnimationId = requestAnimationFrame(animateHero3D);

    if (!heroScene || !heroCamera || !heroRenderer) return;

    const time = performance.now() * 0.001;

    // Smooth mouse follow
    mouse3D.lerp(targetMouse3D, 0.05);

    // Camera subtle movement based on mouse
    heroCamera.position.x += (mouse3D.x * 3 - heroCamera.position.x) * 0.02;
    heroCamera.position.y += (-mouse3D.y * 3 - heroCamera.position.y) * 0.02;
    heroCamera.lookAt(0, 0, 0);

    // Animate objects
    heroObjects.forEach(obj => {
        const ud = obj.userData;

        if (ud.isParticleField) {
            // Animate particles
            const positions = obj.geometry.attributes.position.array;
            const velocities = obj.geometry.attributes.velocity.array;

            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += velocities[i];
                positions[i + 1] += velocities[i + 1];
                positions[i + 2] += velocities[i + 2];

                // Wrap around sphere
                const dist = Math.sqrt(
                    positions[i] ** 2 + positions[i + 1] ** 2 + positions[i + 2] ** 2
                );
                if (dist > 80 || dist < 15) {
                    // Reset to random position on sphere
                    const radius = 20 + Math.random() * 60;
                    const theta = Math.random() * Math.PI * 2;
                    const phi = Math.acos(2 * Math.random() - 1);
                    positions[i] = radius * Math.sin(phi) * Math.cos(theta);
                    positions[i + 1] = radius * Math.sin(phi) * Math.sin(theta);
                    positions[i + 2] = radius * Math.cos(phi);
                }
            }
            obj.geometry.attributes.position.needsUpdate = true;

            // Rotate entire particle field slowly
            obj.rotation.y += 0.0001;
            obj.rotation.x += 0.00005;
        } else if (ud.basePosition) {
            // Floating geometries and orbs
            // Float up/down
            obj.position.y = ud.basePosition.y + Math.sin(time * ud.floatSpeed + ud.floatOffset) * ud.floatAmplitude;
            obj.position.x = ud.basePosition.x + Math.cos(time * ud.floatSpeed * 0.7 + ud.floatOffset) * ud.floatAmplitude * 0.5;
            obj.position.z = ud.basePosition.z + Math.sin(time * ud.floatSpeed * 1.3 + ud.floatOffset) * ud.floatAmplitude * 0.5;

            // Rotate
            if (ud.rotationSpeed) {
                obj.rotation.x += ud.rotationSpeed.x;
                obj.rotation.y += ud.rotationSpeed.y;
                obj.rotation.z += ud.rotationSpeed.z;
            }

            // Mouse influence
            const mouseInfluence = 0.5;
            obj.position.x += mouse3D.x * mouseInfluence;
            obj.position.y -= mouse3D.y * mouseInfluence;

            // Pulse opacity for orbs
            if (obj.material.opacity !== undefined && ud.originalOpacity !== undefined) {
                obj.material.opacity = ud.originalOpacity * (0.5 + 0.5 * Math.sin(time * 2 + ud.floatOffset));
            }
        }
    });

    heroRenderer.render(heroScene, heroCamera);
}

// ========================================
// 3D Skills Visualization
// ========================================
function initSkills3D() {
    if (reducedMotion3D) return;

    const container = document.querySelector('.skills-3d-container') || createSkills3DContainer();
    if (!container) return;

    // Create skills sphere data
    const skills = [
        { name: 'Nmap', category: 'security', level: 90 },
        { name: 'Metasploit', category: 'security', level: 75 },
        { name: 'Wireshark', category: 'security', level: 80 },
        { name: 'Nessus', category: 'security', level: 85 },
        { name: 'Burp Suite', category: 'security', level: 70 },
        { name: 'Kali Linux', category: 'security', level: 85 },
        { name: 'Python', category: 'development', level: 85 },
        { name: 'Java', category: 'development', level: 75 },
        { name: 'JavaScript', category: 'development', level: 80 },
        { name: 'Node.js', category: 'development', level: 70 },
        { name: 'React', category: 'development', level: 65 },
        { name: 'SQL', category: 'development', level: 75 },
        { name: 'Network Security', category: 'network', level: 90 },
        { name: 'Vuln Assessment', category: 'network', level: 85 },
        { name: 'Penetration Testing', category: 'network', level: 80 },
        { name: 'Digital Forensics', category: 'forensics', level: 75 },
        { name: 'Incident Response', category: 'network', level: 70 },
        { name: 'Threat Intelligence', category: 'network', level: 65 },
        { name: 'Log Analysis', category: 'network', level: 80 },
        { name: 'Malware Analysis', category: 'forensics', level: 60 }
    ];

    const categoryColors = {
        security: COLORS.primary,
        development: COLORS.violet,
        network: COLORS.blue,
        forensics: COLORS.secondary,
        academic: COLORS.quaternary
    };

    // Create scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 60;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    // Create skill nodes on sphere
    const sphereRadius = 22;
    const nodes = [];

    skills.forEach((skill, index) => {
        // Fibonacci sphere distribution
        const phi = Math.acos(1 - 2 * (index + 0.5) / skills.length);
        const theta = Math.PI * (1 + Math.sqrt(5)) * (index + 0.5);

        const x = sphereRadius * Math.sin(phi) * Math.cos(theta);
        const y = sphereRadius * Math.sin(phi) * Math.sin(theta);
        const z = sphereRadius * Math.cos(phi);

        const color = categoryColors[skill.category] || COLORS.primary;
        const size = THREE.MathUtils.lerp(0.4, 1.2, skill.level / 100);

        // Node geometry
        const geometry = new THREE.SphereGeometry(size, 16, 16);
        const material = new THREE.MeshBasicMaterial({
            color: color,
            transparent: true,
            opacity: 0.8,
            blending: THREE.AdditiveBlending
        });

        const node = new THREE.Mesh(geometry, material);
        node.position.set(x, y, z);
        node.lookAt(0, 0, 0);

        // Store data
        node.userData = {
            skill: skill,
            basePosition: new THREE.Vector3(x, y, z),
            baseScale: size,
            color: color
        };

        // Create label sprite
        const labelDiv = document.createElement('div');
        labelDiv.className = 'node-label';
        labelDiv.textContent = skill.name;
        labelDiv.style.cssText = `
            position: absolute;
            background: var(--bg-card);
            border: 1px solid var(--border-color);
            padding: 6px 12px;
            border-radius: var(--radius-pill);
            font-size: 0.75rem;
            font-weight: 600;
            color: var(--text-primary);
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transform: translateX(-50%) translateY(-100%);
            transition: opacity 0.2s ease;
            box-shadow: var(--shadow-md);
            z-index: 100;
        `;
        container.appendChild(labelDiv);

        node.userData.labelElement = labelDiv;
        nodes.push(node);
        scene.add(node);
    });

    // Connection lines between related skills
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = [];
    const lineColors = [];

    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const skill1 = nodes[i].userData.skill;
            const skill2 = nodes[j].userData.skill;

            // Connect same category skills
            if (skill1.category === skill2.category) {
                const pos1 = nodes[i].position;
                const pos2 = nodes[j].position;
                const dist = pos1.distanceTo(pos2);

                if (dist < 35) {
                    linePositions.push(pos1.x, pos1.y, pos1.z, pos2.x, pos2.y, pos2.z);
                    const color = new THREE.Color(categoryColors[skill1.category]);
                    lineColors.push(color.r, color.g, color.b, color.r, color.g, color.b);
                }
            }
        }
    }

    if (linePositions.length > 0) {
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        lineGeometry.setAttribute('color', new THREE.Float32BufferAttribute(lineColors, 3));

        const lineMaterial = new THREE.LineBasicMaterial({
            vertexColors: true,
            transparent: true,
            opacity: 0.15,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });

        const lines = new THREE.LineSegments(lineGeometry, lineMaterial);
        scene.add(lines);
    }

    // Central core
    const coreGeometry = new THREE.IcosahedronGeometry(4, 1);
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: COLORS.primary,
        wireframe: true,
        transparent: true,
        opacity: 0.3,
        blending: THREE.AdditiveBlending
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);

    // Pulse rings
    const rings = [];
    for (let i = 0; i < 3; i++) {
        const ringGeometry = new THREE.RingGeometry(25 + i * 3, 26 + i * 3, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
            color: RAINBOW_COLORS[i % RAINBOW_COLORS.length],
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.1,
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = -Math.PI / 2;
        ring.userData = { speed: 0.0005 + i * 0.0002, phase: i * Math.PI * 0.3 };
        rings.push(ring);
        scene.add(ring);
    }

    // Mouse interaction
    let mouse = new THREE.Vector2();
    let raycaster = new THREE.Raycaster();
    let hoveredNode = null;

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    });

    function animateSkills3D() {
        requestAnimationFrame(animateSkills3D);

        const time = performance.now() * 0.001;

        // Rotate sphere
        scene.rotation.y += 0.0003;
        scene.rotation.x = Math.sin(time * 0.1) * 0.1;

        // Animate nodes
        nodes.forEach((node, index) => {
            const ud = node.userData;
            const pulse = Math.sin(time * 2 + index * 0.5) * 0.1 + 1;
            node.scale.setScalar(pulse);

            // Float slightly
            node.position.x = ud.basePosition.x + Math.sin(time * 0.5 + index) * 0.5;
            node.position.y = ud.basePosition.y + Math.cos(time * 0.7 + index) * 0.5;
            node.position.z = ud.basePosition.z + Math.sin(time * 0.3 + index) * 0.5;
        });

        // Animate core
        core.rotation.x += 0.001;
        core.rotation.y += 0.002;
        core.scale.setScalar(1 + Math.sin(time * 3) * 0.1);

        // Animate rings
        rings.forEach((ring, i) => {
            ring.rotation.z += ring.userData.speed;
            ring.material.opacity = 0.05 + 0.05 * Math.sin(time * 2 + ring.userData.phase);
        });

        // Raycast for hover
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(nodes);

        if (intersects.length > 0) {
            const node = intersects[0].object;
            if (hoveredNode !== node) {
                if (hoveredNode) resetNode(hoveredNode);
                hoveredNode = node;
                highlightNode(node);
            }
        } else if (hoveredNode) {
            resetNode(hoveredNode);
            hoveredNode = null;
        }

        // Camera follow mouse slightly
        camera.position.x += (mouse.x * 5 - camera.position.x) * 0.02;
        camera.position.y += (-mouse.y * 5 - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
    }

    function highlightNode(node) {
        node.material.opacity = 1;
        node.scale.setScalar(node.userData.baseScale * 1.8);
        node.material.color.setHex(0xffffff);
        if (node.userData.labelElement) {
            node.userData.labelElement.style.opacity = '1';
        }
        // Update label position
        updateLabelPosition(node);
    }

    function resetNode(node) {
        node.material.opacity = 0.8;
        node.scale.setScalar(node.userData.baseScale);
        node.material.color.setHex(node.userData.color);
        if (node.userData.labelElement) {
            node.userData.labelElement.style.opacity = '0';
        }
    }

    function updateLabelPosition(node) {
        const label = node.userData.labelElement;
        if (!label) return;

        const vector = node.position.clone().project(camera);
        const rect = container.getBoundingClientRect();

        label.style.left = `${(vector.x * 0.5 + 0.5) * rect.width}px`;
        label.style.top = `${(-vector.y * 0.5 + 0.5) * rect.height}px`;
    }

    // Update labels on scroll/resize
    container.addEventListener('mousemove', () => {
        if (hoveredNode) updateLabelPosition(hoveredNode);
    });

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });

    animateSkills3D();
}

function createSkills3DContainer() {
    const skillsSection = document.querySelector('.skills .proficiency-section');
    if (!skillsSection) return null;

    const container = document.createElement('div');
    container.className = 'skills-3d-container';
    container.style.cssText = 'width: 100%; height: 350px; margin: 32px 0;';
    skillsSection.insertBefore(container, skillsSection.firstChild);

    return container;
}

// ========================================
// 3D Project Card Enhancement
// ========================================
function enhanceProjectCards3D() {
    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        card.classList.add('project-card-3d');

        // Add inner wrapper for 3D transform
        const inner = document.createElement('div');
        inner.className = 'project-card-inner';
        inner.style.cssText = `
            position: relative;
            width: 100%;
            height: 100%;
            transform-style: preserve-3d;
            transition: transform 0.6s cubic-bezier(0.23, 1, 0.32, 1);
        `;

        // Move all children to inner
        while (card.firstChild) {
            inner.appendChild(card.firstChild);
        }
        card.appendChild(inner);

        // Add backface with tech details
        const backface = document.createElement('div');
        backface.className = 'card-3d-back';
        backface.style.cssText = `
            position: absolute;
            inset: 0;
            background: linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-card) 100%);
            border-radius: inherit;
            backface-visibility: hidden;
            transform: rotateY(180deg);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 32px;
            border: 1px solid var(--border-color);
        `;

        // Get project tech from data attribute or find it
        const techSpans = card.querySelectorAll('.project-tech span');
        const techList = Array.from(techSpans).map(s => s.textContent).join(', ');

        backface.innerHTML = `
            <div style="text-align: center; color: var(--text-primary);">
                <h4 style="margin-bottom: 16px; color: var(--accent-primary);">Tech Stack</h4>
                <p style="color: var(--text-secondary); margin-bottom: 24px; font-family: var(--font-mono); font-size: 0.9rem;">${techList || 'Various Technologies'}</p>
                <div style="display: flex; gap: 12px;">
                    <a href="${card.querySelector('.project-link[href*="github"]')?.href || '#'}" class="btn btn-primary btn-sm" style="transform: translateZ(20px);">
                        <i class="fab fa-github"></i> View Code
                    </a>
                </div>
            </div>
        `;
        inner.appendChild(backface);

        // Enhanced 3D hover
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const rotateY = (x / (rect.width / 2)) * 8;
            const rotateX = -(y / (rect.height / 2)) * 8;

            inner.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px) scale(1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            inner.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
        });
    });
}

// ========================================
// 3D Button Enhancement
// ========================================
function enhanceButtons3D() {
    const buttons = document.querySelectorAll('.btn:not(.btn-ghost)');

    buttons.forEach(btn => {
        btn.classList.add('btn-3d');
        btn.style.transformStyle = 'preserve-3d';
        btn.style.perspective = '500px';
    });
}

// ========================================
// 3D Text Effect for Hero Name
// ========================================
function enhanceHeroText3D() {
    const heroName = document.querySelector('.hero-name');
    if (heroName) {
        heroName.classList.add('text-3d');
        heroName.setAttribute('data-text', heroName.textContent);
        heroName.style.position = 'relative';
        heroName.style.transformStyle = 'preserve-3d';
    }

    const sectionTitles = document.querySelectorAll('.section-title');
    sectionTitles.forEach(title => {
        title.classList.add('text-3d');
        title.setAttribute('data-text', title.textContent);
        title.style.position = 'relative';
        title.style.transformStyle = 'preserve-3d';
    });
}

// ========================================
// 3D Parallax Hero Background
// ========================================
function initHeroParallax3D() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    hero.style.transformStyle = 'preserve-3d';
    hero.style.perspective = '1000px';

    // Add parallax layers
    const layers = [
        { depth: 1, element: document.querySelector('.grid-pattern'), scale: 1.3 },
        { depth: 2, element: document.querySelector('.orb-1'), scale: 1.2 },
        { depth: 3, element: document.querySelector('.orb-2'), scale: 1.1 },
        { depth: 4, element: document.querySelector('.orb-3'), scale: 1.05 },
        { depth: 5, element: document.querySelector('.floating-elements'), scale: 1 }
    ];

    layers.forEach(({ depth, element, scale }) => {
        if (element) {
            element.classList.add('parallax-3d-layer');
            element.setAttribute('data-depth', depth);
            element.style.transformStyle = 'preserve-3d';
            element.style.willChange = 'transform';
        }
    });

    // Parallax on mouse move
    document.addEventListener('mousemove', (e) => {
        if (reducedMotion3D) return;

        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;

        layers.forEach(({ element, depth }) => {
            if (!element) return;
            const moveX = x * depth * 15;
            const moveY = y * depth * 15;
            element.style.transform = `translate3d(${moveX}px, ${moveY}px, ${-depth * 30}px) scale(${1 + depth * 0.05})`;
        });
    });
}

// ========================================
// 3D Terminal Window Enhancement
// ========================================
function enhanceTerminal3D() {
    const terminal = document.querySelector('.terminal-window');
    if (!terminal) return;

    terminal.classList.add('terminal-window-3d');
    terminal.style.transformStyle = 'preserve-3d';
    terminal.style.perspective = '1000px';

    // Add depth to terminal lines
    const lines = terminal.querySelectorAll('.terminal-line');
    lines.forEach((line, index) => {
        line.style.transformStyle = 'preserve-3d';
        line.style.transform = `translateZ(${index * 2}px)`;
    });
}

// ========================================
// 3D Scroll Reveal Enhancement
// ========================================
function init3DScrollReveal() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-3d-active');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    // Add 3D reveal classes
    document.querySelectorAll('.project-card, .skill-category, .cert-card, .exp-card, .info-card').forEach((el, index) => {
        el.classList.add('reveal-3d');
        el.style.setProperty('--stagger', `${index * 100}ms`);
        observer.observe(el);
    });
}

// ========================================
// 3D Floating Particles for Sections
// ========================================
function createSection3DParticles() {
    if (reducedMotion3D) return;

    const sections = document.querySelectorAll('.section');

    sections.forEach(section => {
        const particleCount = 15;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle-3d';

            const color = RAINBOW_COLORS[Math.floor(Math.random() * RAINBOW_COLORS.length)];
            const size = Math.random() * 6 + 4;

            particle.style.cssText = `
                position: absolute;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: linear-gradient(135deg, #${color.toString(16).padStart(6, '0')}, #${((color + 0x202020) & 0xffffff).toString(16).padStart(6, '0')});
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                opacity: ${Math.random() * 0.3 + 0.1};
                animation: particleFloat3d ${15 + Math.random() * 10}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
                pointer-events: none;
                z-index: 0;
            `;

            section.appendChild(particle);
        }
    });
}

// ========================================
// 3D Navbar Enhancement
// ========================================
function enhanceNavbar3D() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;

    navbar.style.transformStyle = 'preserve-3d';
    navbar.style.perspective = '500px';

    const navLinks = navbar.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.style.transformStyle = 'preserve-3d';
        link.addEventListener('mousemove', (e) => {
            const rect = link.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            link.style.transform = `perspective(500px) rotateX(${-y * 0.1}deg) rotateY(${x * 0.1}deg) translateZ(10px)`;
        });

        link.addEventListener('mouseleave', () => {
            link.style.transform = 'perspective(500px) rotateX(0) rotateY(0) translateZ(0)';
        });
    });
}

// ========================================
// Global 3D Mouse Perspective Effect
// ========================================
function initGlobal3DPerspective() {
    if (reducedMotion3D) return;

    const root = document.documentElement;
    root.style.perspective = '1000px';
    root.style.transformStyle = 'preserve-3d';

    // Track mouse position globally
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    document.addEventListener('mousemove', (e) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 2;
        targetY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    function updatePerspective() {
        mouseX += (targetX - mouseX) * 0.05;
        mouseY += (targetY - mouseY) * 0.05;

        // Apply subtle perspective to sections based on mouse
        document.querySelectorAll('.section').forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const distX = (e.clientX - centerX) / window.innerWidth;
            const distY = (e.clientY - centerY) / window.innerHeight;

            if (rect.top < window.innerHeight && rect.bottom > 0) {
                const intensity = 0.5 + index * 0.1;
                section.style.transform = `perspective(1000px) rotateY(${distX * 2 * intensity}deg) rotateX(${-distY * 2 * intensity}deg)`;
                section.style.transformOrigin = 'center center';
            }
        });

        requestAnimationFrame(updatePerspective);
    }
    updatePerspective();
}

// ========================================
// Magnetic Hover Effect for All Interactive Elements
// ========================================
function initMagneticHover3D() {
    if (reducedMotion3D) return;

    const magneticElements = document.querySelectorAll(
        '.btn, .social-link, .project-link, .filter-btn, .nav-link, ' +
        '.footer-links a, .theme-toggle, .skill-tag, .goal-tag, ' +
        '.cert-card, .skill-category, .info-card, .highlight, ' +
        '.stat, .contact-method, .project-card, .exp-card, .timeline-content'
    );

    magneticElements.forEach(el => {
        // Add 3D transform style
        el.style.transformStyle = 'preserve-3d';
        el.style.willChange = 'transform';

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Calculate rotation based on mouse position
            const rotateY = (x / (rect.width / 2)) * 5;
            const rotateX = -(y / (rect.height / 2)) * 5;

            // Different intensity for different elements
            let intensity = 1;
            if (el.classList.contains('btn')) intensity = 1.5;
            if (el.classList.contains('project-card')) intensity = 0.8;
            if (el.classList.contains('cert-card') || el.classList.contains('skill-category')) intensity = 0.6;

            el.style.transform = `perspective(1000px) rotateX(${rotateX * intensity}deg) rotateY(${rotateY * intensity}deg) translateZ(${10 * intensity}px) scale(${1 + 0.02 * intensity})`;
            el.style.transition = 'transform 0.05s ease-out';
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
            el.style.transition = 'transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });

        // Add press effect
        el.addEventListener('mousedown', () => {
            el.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(0.98)';
            el.style.transition = 'transform 0.1s ease-out';
        });

        el.addEventListener('mouseup', () => {
            el.style.transition = 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        });
    });
}

// ========================================
// 3D Cursor Trail Effect
// ========================================
function init3DCursorTrail() {
    if (reducedMotion3D || window.innerWidth < 768) return;

    const trailLength = 15;
    const trails = [];

    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        const colorIndex = i % RAINBOW_COLORS.length;
        const color = RAINBOW_COLORS[colorIndex];
        const size = 10 - i * 0.5;

        dot.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: radial-gradient(circle at 30% 30%,
                #${color.toString(16).padStart(6, '0')},
                #${((color & 0xF0F0F0) >> 4).toString(16).padStart(6, '0')});
            pointer-events: none;
            z-index: 9999;
            opacity: ${1 - i / trailLength};
            transform: translate(-50%, -50%) scale(0);
            transition: transform 0.03s ease-out, opacity 0.1s ease;
            box-shadow:
                0 0 ${size * 2}px #${color.toString(16).padStart(6, '0')},
                0 0 ${size * 4}px #${color.toString(16).padStart(6, '0')80};
            mix-blend-mode: screen;
        `;
        document.body.appendChild(dot);
        trails.push({ element: dot, x: 0, y: 0, delay: i * 2 });
    }

    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animateTrail() {
        trails[0].x = mouseX;
        trails[0].y = mouseY;
        trails[0].element.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%) scale(1)`;

        for (let i = 1; i < trailLength; i++) {
            const prev = trails[i - 1];
            const curr = trails[i];

            curr.x += (prev.x - curr.x) * 0.3;
            curr.y += (prev.y - curr.y) * 0.3;

            const scale = 1 - i / trailLength;
            curr.element.style.transform = `translate(${curr.x}px, ${curr.y}px) translate(-50%, -50%) scale(${scale})`;
            curr.element.style.opacity = (1 - i / trailLength) * 0.5;
        }

        requestAnimationFrame(animateTrail);
    }

    animateTrail();

    // Hide trail when mouse leaves window
    document.addEventListener('mouseleave', () => {
        trails.forEach(t => t.element.style.opacity = '0');
    });

    document.addEventListener('mouseenter', () => {
        trails.forEach((t, i) => t.element.style.opacity = (1 - i / trailLength) * 0.5);
    });
}

// ========================================
// 3D Particle Burst on Click
// ========================================
function initClickParticleBurst() {
    if (reducedMotion3D) return;

    document.addEventListener('click', (e) => {
        // Don't create burst on links/buttons that navigate
        if (e.target.closest('a[href^="http"], a[href^="#"], button[type="submit"]')) return;

        createParticleBurst(e.clientX, e.clientY);
    });

    function createParticleBurst(x, y) {
        const burstCount = 12;
        const particles = [];

        for (let i = 0; i < burstCount; i++) {
            const particle = document.createElement('div');
            const color = RAINBOW_COLORS[Math.floor(Math.random() * RAINBOW_COLORS.length)];
            const size = Math.random() * 8 + 4;
            const angle = (Math.PI * 2 * i) / burstCount + Math.random() * 0.5;
            const velocity = Math.random() * 100 + 50;

            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: #${color.toString(16).padStart(6, '0')};
                pointer-events: none;
                z-index: 9998;
                transform: translate(-50%, -50%);
                box-shadow: 0 0 ${size * 2}px #${color.toString(16).padStart(6, '0')};
                mix-blend-mode: screen;
            `;

            document.body.appendChild(particle);

            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;

            particle.animate([
                { transform: `translate(-50%, -50%) scale(1)`, opacity: 1 },
                { transform: `translate(calc(-50% + ${tx}px), calc(-50% + ${ty}px)) scale(0)`, opacity: 0 }
            ], {
                duration: 600,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => particle.remove();
        }
    }
}

// ========================================
// 3D Scroll Parallax for All Sections
// ========================================
function initScrollParallax3D() {
    if (reducedMotion3D) return;

    let ticking = false;

    function updateParallax() {
        const scrollY = window.scrollY;

        document.querySelectorAll('.section').forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const sectionTop = rect.top + scrollY;
            const sectionHeight = rect.height;
            const viewportHeight = window.innerHeight;

            // Check if section is in viewport
            if (rect.bottom > 0 && rect.top < viewportHeight) {
                const progress = (viewportHeight - rect.top) / (viewportHeight + sectionHeight);
                const parallaxOffset = (progress - 0.5) * 100;

                // Apply 3D transform
                section.style.transform = `perspective(1000px) translateZ(${Math.sin(progress * Math.PI) * 20}px) rotateX(${Math.sin(progress * Math.PI) * 2}deg)`;
                section.style.transformOrigin = 'center center';

                // Parallax background elements
                const bgElements = section.querySelectorAll('.grid-pattern, .orb, .floating-elements, .particle-3d');
                bgElements.forEach((el, i) => {
                    const depth = (i + 1) * 10;
                    el.style.transform = `translate3d(0, ${parallaxOffset * 0.3 * (i + 1)}px, ${-depth}px)`;
                });
            }
        });

        // Parallax hero elements
        const hero = document.querySelector('.hero');
        if (hero) {
            const heroRect = hero.getBoundingClientRect();
            if (heroRect.bottom > 0) {
                const heroProgress = 1 - heroRect.top / window.innerHeight;
                const heroParallax = heroProgress * 50;

                document.querySelectorAll('.orb').forEach((orb, i) => {
                    orb.style.transform = `translate3d(0, ${heroParallax * (0.2 + i * 0.1)}px, ${-20 - i * 10}px)`;
                });

                const grid = document.querySelector('.grid-pattern');
                if (grid) {
                    grid.style.transform = `translate3d(0, ${heroParallax * 0.5}px, -50px)`;
                }

                const floating = document.querySelector('.floating-elements');
                if (floating) {
                    floating.style.transform = `translate3d(0, ${heroParallax * 0.3}px, 0)`;
                }
            }
        }

        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
        }
    }, { passive: true });
}

// ========================================
// 3D Card Stack Effect on Hover
// ========================================
function initCardStack3D() {
    if (reducedMotion3D) return;

    const cardContainers = document.querySelectorAll(
        '.projects-grid, .certifications-grid, .skills-grid, .experience-grid, .about-cards'
    );

    cardContainers.forEach(container => {
        const cards = container.querySelectorAll('.project-card, .cert-card, .skill-category, .exp-card, .info-card');

        cards.forEach((card, index) => {
            card.style.transformStyle = 'preserve-3d';
            card.style.transition = 'transform 0.4s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.3s ease';

            card.addEventListener('mouseenter', () => {
                // Lift the hovered card
                card.style.transform = 'perspective(1000px) translateZ(40px) scale(1.03) rotateX(-2deg)';
                card.style.zIndex = 100;
                card.style.boxShadow = 'var(--shadow-xl), var(--shadow-glow-strong)';

                // Push neighboring cards down slightly
                cards.forEach((other, i) => {
                    if (other !== card) {
                        const distance = Math.abs(i - index);
                        if (distance <= 2) {
                            const push = (3 - distance) * 5;
                            other.style.transform = `perspective(1000px) translateZ(${-push}px) scale(${1 - distance * 0.02})`;
                            other.style.zIndex = 10 - distance;
                        }
                    }
                });
            });

            card.addEventListener('mouseleave', () => {
                cards.forEach(other => {
                    other.style.transform = 'perspective(1000px) translateZ(0) scale(1)';
                    other.style.zIndex = '';
                    other.style.boxShadow = '';
                });
            });
        });
    });
}

// ========================================
// 3D Text Hover Reveal
// ========================================
function initText3DHover() {
    if (reducedMotion3D) return;

    const textElements = document.querySelectorAll(
        '.hero-name, .section-title, .project-title, .cert-card h3, ' +
        '.skill-category h3, .exp-card h3, .info-card h4, .highlight-content h4'
    );

    textElements.forEach(el => {
        el.style.transformStyle = 'preserve-3d';
        el.style.display = 'inline-block';
        el.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1), text-shadow 0.3s ease';

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            const rotateY = (x / (rect.width / 2)) * 15;
            const rotateX = -(y / (rect.height / 2)) * 15;

            el.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
            el.style.textShadow = `
                ${-rotateY * 0.5}px ${rotateX * 0.5}px 0 var(--rainbow-1),
                ${rotateY * 0.5}px ${-rotateX * 0.5}px 0 var(--rainbow-4),
                ${rotateY}px ${rotateX}px 20px var(--text-accent-glow)
            `;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'perspective(500px) rotateX(0) rotateY(0) translateZ(0)';
            el.style.textShadow = '';
        });
    });
}

// ========================================
// 3D Skill Tag Orbital Effect
// ========================================
function initSkillTagOrbital3D() {
    if (reducedMotion3D) return;

    const skillCategories = document.querySelectorAll('.skill-category');

    skillCategories.forEach(category => {
        const tags = category.querySelectorAll('.skill-tag');

        tags.forEach((tag, index) => {
            tag.style.transformStyle = 'preserve-3d';
            tag.style.transition = 'transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)';

            tag.addEventListener('mouseenter', () => {
                // Orbital animation
                const orbitRadius = 30;
                const angle = (index / tags.length) * Math.PI * 2;

                tag.style.transform = `perspective(500px)
                    translateX(${Math.cos(angle) * orbitRadius}px)
                    translateY(${Math.sin(angle) * orbitRadius}px)
                    translateZ(40px)
                    rotateY(180deg)
                    scale(1.2)`;
                tag.style.zIndex = 100;
                tag.style.boxShadow = 'var(--shadow-glow-strong)';
            });

            tag.addEventListener('mouseleave', () => {
                tag.style.transform = 'perspective(500px) translateZ(0) rotateY(0) scale(1)';
                tag.style.zIndex = '';
                tag.style.boxShadow = '';
            });
        });

        // Container hover - fan out all tags
        category.addEventListener('mouseenter', () => {
            tags.forEach((tag, index) => {
                const delay = index * 30;
                setTimeout(() => {
                    if (!tag.matches(':hover')) {
                        const angle = (index / tags.length) * Math.PI * 2;
                        const radius = 20;
                        tag.style.transform = `perspective(500px)
                            translateX(${Math.cos(angle) * radius}px)
                            translateY(${Math.sin(angle) * radius}px)
                            translateZ(20px)
                            rotateY(${Math.sin(Date.now() * 0.001 + index) * 10}deg)`;
                    }
                }, delay);
            });
        });

        category.addEventListener('mouseleave', () => {
            tags.forEach(tag => {
                if (!tag.matches(':hover')) {
                    tag.style.transform = 'perspective(500px) translateZ(0) rotateY(0) scale(1)';
                }
            });
        });
    });
}

// ========================================
// 3D Timeline Depth Effect
// ========================================
function initTimeline3D() {
    if (reducedMotion3D) return;

    const timelineItems = document.querySelectorAll('.timeline-item');

    timelineItems.forEach((item, index) => {
        const content = item.querySelector('.timeline-content');
        const marker = item.querySelector('.timeline-marker');

        if (content) {
            content.style.transformStyle = 'preserve-3d';
            content.style.transform = `perspective(1000px) translateZ(${index * 10}px) rotateY(${index % 2 === 0 ? -5 : 5}deg)`;
            content.style.transition = 'transform 0.5s cubic-bezier(0.23, 1, 0.32, 1)';

            content.addEventListener('mouseenter', () => {
                content.style.transform = `perspective(1000px) translateZ(40px) rotateY(0) scale(1.02)`;
                content.style.boxShadow = 'var(--shadow-xl), var(--shadow-glow)';
            });

            content.addEventListener('mouseleave', () => {
                content.style.transform = `perspective(1000px) translateZ(${index * 10}px) rotateY(${index % 2 === 0 ? -5 : 5}deg)`;
                content.style.boxShadow = '';
            });
        }

        if (marker) {
            marker.style.transformStyle = 'preserve-3d';
            marker.addEventListener('mouseenter', () => {
                marker.style.transform = 'perspective(500px) scale(1.5) translateZ(30px) rotateY(180deg)';
                marker.style.boxShadow = '0 0 0 4px var(--bg-primary), 0 0 40px var(--rainbow-4)';
            });
            marker.addEventListener('mouseleave', () => {
                marker.style.transform = 'perspective(500px) scale(1) translateZ(0) rotateY(0)';
            });
        }
    });
}

// ========================================
// 3D Floating Animation for Stats
// ========================================
function initStats3DFloat() {
    if (reducedMotion3D) return;

    const stats = document.querySelectorAll('.stat');

    stats.forEach((stat, index) => {
        stat.style.transformStyle = 'preserve-3d';
        stat.style.animation = `statFloat3D 4s ease-in-out infinite`;
        stat.style.animationDelay = `${index * 0.3}s`;

        stat.addEventListener('mouseenter', () => {
            stat.style.animation = 'none';
            stat.style.transform = 'perspective(1000px) translateZ(50px) rotateY(0) scale(1.1)';
            stat.style.boxShadow = 'var(--shadow-xl), var(--shadow-glow-strong)';

            const number = stat.querySelector('.stat-number');
            if (number) {
                number.style.transform = 'translateZ(20px) scale(1.2)';
                number.style.textShadow = '0 0 30px var(--accent-primary)';
            }
        });

        stat.addEventListener('mouseleave', () => {
            stat.style.animation = `statFloat3D 4s ease-in-out infinite`;
            stat.style.animationDelay = `${index * 0.3}s`;
            stat.style.boxShadow = '';

            const number = stat.querySelector('.stat-number');
            if (number) {
                number.style.transform = '';
                number.style.textShadow = '';
            }
        });
    });

    // Add keyframe animation
    if (!document.getElementById('stat-3d-keyframes')) {
        const style = document.createElement('style');
        style.id = 'stat-3d-keyframes';
        style.textContent = `
            @keyframes statFloat3D {
                0%, 100% {
                    transform: perspective(1000px) translate3d(0, 0, 0) rotateX(0deg) rotateY(0deg);
                }
                25% {
                    transform: perspective(1000px) translate3d(5px, -10px, 20px) rotateX(5deg) rotateY(3deg);
                }
                50% {
                    transform: perspective(1000px) translate3d(-5px, 5px, -10px) rotateX(-3deg) rotateY(-2deg);
                }
                75% {
                    transform: perspective(1000px) translate3d(8px, -5px, 15px) rotateX(2deg) rotateY(5deg);
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// ========================================
// 3D Button Ripple Effect
// ========================================
function initButton3DRipple() {
    if (reducedMotion3D) return;

    const buttons = document.querySelectorAll('.btn:not(.btn-ghost)');

    buttons.forEach(btn => {
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.style.transformStyle = 'preserve-3d';

        btn.addEventListener('click', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('span');
            ripple.style.cssText = `
                position: absolute;
                left: ${x}px;
                top: ${y}px;
                width: 0;
                height: 0;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(255,255,255,0.5) 0%, transparent 70%);
                transform: translate(-50%, -50%) translateZ(20px) scale(0);
                pointer-events: none;
                z-index: 10;
            `;

            btn.appendChild(ripple);

            ripple.animate([
                { transform: 'translate(-50%, -50%) translateZ(20px) scale(0)', opacity: 1 },
                { transform: `translate(-50%, -50%) translateZ(20px) scale(${Math.max(rect.width, rect.height) * 2})`, opacity: 0 }
            ], {
                duration: 400,
                easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
            }).onfinish = () => ripple.remove();
        });
    });
}

// ========================================
// Initialize All 3D Effects
// ========================================
async function initAll3DEffects() {
    // Check for reduced motion
    if (reducedMotion3D) {
        console.log('3D effects disabled: prefers-reduced-motion');
        return;
    }

    // Check WebGL support
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
        console.warn('WebGL not supported, 3D effects disabled');
        return;
    }

    try {
        // Initialize in order
        await initHero3D();

        // Small delay to let hero initialize
        setTimeout(() => {
            initSkills3D();
            enhanceProjectCards3D();
            enhanceButtons3D();
            enhanceHeroText3D();
            initHeroParallax3D();
            enhanceTerminal3D();
            init3DScrollReveal();
            createSection3DParticles();
            enhanceNavbar3D();

            // NEW: Global 3D Effects
            initGlobal3DPerspective();
            initMagneticHover3D();
            init3DCursorTrail();
            initClickParticleBurst();
            initScrollParallax3D();
            initCardStack3D();
            initText3DHover();
            initSkillTagOrbital3D();
            initTimeline3D();
            initStats3DFloat();
            initButton3DRipple();
        }, 100);

        console.log('✨ 3D effects initialized successfully');
    } catch (error) {
        console.error('Failed to initialize 3D effects:', error);
    }
}

// ========================================
// Cleanup on page unload
// ========================================
window.addEventListener('beforeunload', () => {
    if (heroAnimationId) cancelAnimationFrame(heroAnimationId);
    if (heroRenderer) heroRenderer.dispose();
    if (heroScene) heroScene.clear();
});

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll3DEffects);
} else {
    initAll3DEffects();
}

// Export for debugging
window.portfolio3D = {
    heroScene,
    heroCamera,
    heroRenderer,
    COLORS,
    RAINBOW_COLORS
};