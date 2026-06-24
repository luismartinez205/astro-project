import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export function initScene() {

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  const controls= new OrbitControls(camera,renderer.domElement);
  controls.enableDamping=true;
  controls.dampingFactor=0.05
  renderer.shadowMap.enabled=true;
  renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  renderer.setSize(window.innerWidth, window.innerHeight);

  document
    .getElementById('scene-container')
    .appendChild(renderer.domElement);
  
  camera.position.set(0, 1, 4);

  let modelo; // 👈 importante: variable global

  const loader = new GLTFLoader();

  loader.load('/modelos/jerryblessed-laptop-5040.glb', (gltf) => {

    modelo = gltf.scene;

    modelo.scale.set(5, 5, 5);
    modelo.position.set(0,1.3, 0);

    scene.add(modelo);
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
directionalLight.position.set(3, 5, 2);
scene.add(directionalLight);

  });

  function animate() {

    requestAnimationFrame(animate);
    controls.update();
    // solo rota si ya cargó
    if (modelo) {
      modelo.rotation.y += 0.005;
      camera.lookAt(modelo.position)
    }
    
    renderer.setClearColor(0x000000, 0);
    renderer.render(scene, camera);

  }

  animate();

  
}

