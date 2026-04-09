// Three.js Setup Minimalist Style
const canvas = document.getElementById('designCanvas');
const container = document.getElementById('preview-container');
const scene = new THREE.Scene();
scene.background = new THREE.Color('#0a0a0a'); 

// Minimal Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9);
directionalLight.position.set(5, 10, 7.5);
directionalLight.castShadow = true;
scene.add(directionalLight);
const backLight = new THREE.DirectionalLight(0xffffff, 0.2);
backLight.position.set(-5, 5, -7.5);
scene.add(backLight);

let aspect = container.clientWidth / container.clientHeight;
const camera = new THREE.PerspectiveCamera(40, aspect, 0.1, 1000);
camera.position.set(0, 4, 18); 

const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
renderer.setSize(container.clientWidth || 400, container.clientHeight || 500); 
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const dummyGroup = new THREE.Group();
scene.add(dummyGroup);
dummyGroup.position.y = -3;

const woodMaterial = new THREE.MeshPhongMaterial({ color: '#222', shininess: 5 }); 

let clothMaterial = new THREE.MeshPhongMaterial({ 
    color: '#111111', 
    shininess: 5,
    wireframe: false 
});

// Stand
const baseGeom = new THREE.CylinderGeometry(1.5, 1.8, 0.4, 32);
const base = new THREE.Mesh(baseGeom, woodMaterial);
base.position.y = 0.2;
base.receiveShadow = true;
dummyGroup.add(base);

const poleGeom = new THREE.CylinderGeometry(0.15, 0.15, 4, 32);
const pole = new THREE.Mesh(poleGeom, woodMaterial);
pole.position.y = 2;
pole.castShadow = true;
dummyGroup.add(pole);

// Torso
const torsoGroup = new THREE.Group();
torsoGroup.position.y = 5.5; 
dummyGroup.add(torsoGroup);

const hipsGeom = new THREE.CylinderGeometry(1.2, 1.1, 1.8, 32);
const hips = new THREE.Mesh(hipsGeom, clothMaterial);
hips.position.y = -1.5;
hips.castShadow = true;
torsoGroup.add(hips);

const chestGeom = new THREE.CylinderGeometry(1.3, 1.2, 2.2, 32);
const chest = new THREE.Mesh(chestGeom, clothMaterial);
chest.position.y = 0.5;
chest.castShadow = true;
torsoGroup.add(chest);

const neckGeom = new THREE.CylinderGeometry(0.4, 0.5, 0.6, 32);
const neck = new THREE.Mesh(neckGeom, clothMaterial);
neck.position.y = 1.9;
torsoGroup.add(neck);

const sleeveGeom = new THREE.SphereGeometry(0.6, 32, 32);
const leftSleeve = new THREE.Mesh(sleeveGeom, clothMaterial);
leftSleeve.position.set(-1.3, 1.2, 0);
leftSleeve.scale.set(0.6, 1, 1);
torsoGroup.add(leftSleeve);

const rightSleeve = new THREE.Mesh(sleeveGeom, clothMaterial);
rightSleeve.position.set(1.3, 1.2, 0);
rightSleeve.scale.set(0.6, 1, 1);
torsoGroup.add(rightSleeve);

// Text
const textCanvas = document.createElement('canvas');
textCanvas.width = 512;
textCanvas.height = 512;
const ctx = textCanvas.getContext('2d');
const textTexture = new THREE.CanvasTexture(textCanvas);

const textMaterial = new THREE.MeshBasicMaterial({ map: textTexture, transparent: true, depthWrite: false });
const textPlaneGeom = new THREE.CylinderGeometry(1.31, 1.31, 2.0, 32, 1, true, Math.PI - 0.8, 1.6);
const textPlane = new THREE.Mesh(textPlaneGeom, textMaterial);
textPlane.position.y = 0.5;
torsoGroup.add(textPlane);

function updateText() {
    ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);
    const text = document.getElementById('customText').value;
    const fontStyle = document.getElementById('fontStyle').value;
    if(text) {
        // High contrast text color based on fabric darkness
        ctx.fillStyle = 'rgba(255,255,255,0.9)'; 
        ctx.font = `bold 60px ${fontStyle}, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 256, 256);
    }
    textTexture.needsUpdate = true;
}

// Camera Controls
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

container.addEventListener('mousedown', (e) => { isDragging = true; });
container.addEventListener('mousemove', (e) => {
    if (isDragging) {
        const deltaMove = { x: e.offsetX - previousMousePosition.x, y: e.offsetY - previousMousePosition.y };
        dummyGroup.rotation.y += deltaMove.x * 0.01;
    }
    previousMousePosition = { x: e.offsetX, y: e.offsetY };
});
container.addEventListener('mouseup', () => { isDragging = false; });
container.addEventListener('mouseleave', () => { isDragging = false; });

function animate() {
    requestAnimationFrame(animate);
    if (!isDragging) { dummyGroup.rotation.y += 0.002; }
    renderer.render(scene, camera);
}
animate();

function resizeCanvas() {
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width > 0 && height > 0) {
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    }
}
window.addEventListener('resize', resizeCanvas);
setTimeout(resizeCanvas, 300);

// UI Binds
let activePatternPart = document.getElementById('pat-front');
document.querySelectorAll('.pattern-part').forEach(part => {
    part.addEventListener('click', (e) => {
        document.querySelectorAll('.pattern-part').forEach(p => p.classList.remove('active'));
        e.target.classList.add('active');
        activePatternPart = e.target;
    });
});

document.getElementById('wireframeToggle').addEventListener('change', (e) => {
    clothMaterial.wireframe = e.target.checked;
});

document.getElementById('fabricType').addEventListener('change', (e) => {
    const type = e.target.value;
    if(type === 'cotton') {
        clothMaterial.shininess = 5;
        clothMaterial.flatShading = false;
    } else if (type === 'silk') {
        clothMaterial.shininess = 100;
        clothMaterial.flatShading = false;
    } else if (type === 'leather') {
        clothMaterial.shininess = 20;
        clothMaterial.flatShading = true;
    }
    clothMaterial.needsUpdate = true;
    hipsGeom.computeVertexNormals();
    chestGeom.computeVertexNormals();
    sleeveGeom.computeVertexNormals();
});

document.getElementById('genderSelect').addEventListener('change', (e) => {
    const val = e.target.value;
    if (val === 'female') {
        torsoGroup.scale.set(0.9, 0.95, 0.85);
        torsoGroup.position.y = 5.5;
    } else if (val === 'kids') {
        torsoGroup.scale.set(0.7, 0.7, 0.7);
        torsoGroup.position.y = 4.2;
    } else {
        torsoGroup.scale.set(1, 1, 1);
        torsoGroup.position.y = 5.5;
    }
});

document.querySelectorAll('.color-swatch-pro').forEach(swatch => {
    swatch.addEventListener('click', (e) => {
        document.querySelectorAll('.color-swatch-pro').forEach(s => s.classList.remove('active'));
        e.target.classList.add('active');
        
        const hexColor = e.target.getAttribute('data-color');
        clothMaterial.color.set(hexColor);
        if(activePatternPart) activePatternPart.style.fill = hexColor;
    });
});

document.getElementById('customText').addEventListener('input', updateText);
document.getElementById('fontStyle').addEventListener('change', updateText);

window.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    if (params.has('color')) {
        const queryColor = params.get('color');
        clothMaterial.color.set(queryColor);
        if (activePatternPart) activePatternPart.style.fill = queryColor;
    }
});
