import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

// Створюємо основні компоненти Three.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Додаємо орбітальні контроли
const controls = new OrbitControls(camera, renderer.domElement);
camera.position.set(5, 5, 5);
controls.update();

// Створюємо завантажувачі
const gltfLoader = new GLTFLoader();
const objLoader = new OBJLoader();
const textureLoader = new THREE.TextureLoader();

// Завантажуємо текстури
const woodTexture = textureLoader.load('textures/texture_wood.jpg');
const woodNormalMap = textureLoader.load('textures/texture_wood_normal.jpg');

// Створюємо матеріал для дерев'яних елементів
const woodMaterial = new THREE.MeshStandardMaterial({
    map: woodTexture,
    normalMap: woodNormalMap
});

// Функція для завантаження OBJ моделей
function loadOBJModel(path, material, position, rotation = { x: 0, y: 0, z: 0 }) {
    return new Promise((resolve) => {
        objLoader.load(path, (object) => {
            object.traverse((child) => {
                if (child instanceof THREE.Mesh) {
                    child.material = material;
                }
            });
            object.position.set(position.x, position.y, position.z);
            object.rotation.set(rotation.x, rotation.y, rotation.z);
            scene.add(object);
            resolve(object);
        });
    });
}



// Функція для створення колон
async function createColumns() {
    const columnPositions = [
        // Перший ряд (z = -1.5, тому що це половина від 3м)
        { x: -2.5, y: 0, z: -1.5 },  // Ліва колона (-5/2)
        { x: 0, y: 0, z: -1.5 },     // Центральна колона
        { x: 2.5, y: 0, z: -1.5 },   // Права колона (5/2)
        
        // Другий ряд (z = 1.5)
        { x: -2.5, y: 0, z: 1.5 },
        { x: 0, y: 0, z: 1.5 },
        { x: 2.5, y: 0, z: 1.5 }
    ];
    
    for (const pos of columnPositions) {
        await loadOBJModel(
            'models/balk_150x150x2200.obj',
            woodMaterial,
            pos
        );
    }
}


// Функція для створення кутових балок
async function createCornerBeams() {
    const cornerPositions = [
        // Перший ряд (спереду)
        { pos: { x: -2.5, y: 0, z: -1.5 }, rot: { x: 0, y: 0, z: 0 } },
        { pos: { x: -2.5, y: 0, z: -1.5 }, rot: { x: 0, y: -Math.PI/2, z: 0 } },
        { pos: { x: 0, y: 0, z: -1.5 }, rot: { x: 0, y: Math.PI/1, z: 0 } },
        { pos: { x: 0, y: 0, z: -1.5 }, rot: { x: 0, y: 0, z: 0 } },
        { pos: { x: 2.5, y: 0, z: -1.5 }, rot: { x: 0, y: Math.PI/1, z: 0 } },
        { pos: { x: 2.5, y: 0, z: -1.5 }, rot: { x: 0, y: Math.PI/1, z: 0 } },
        
        // Другий ряд (ззаду)
        { pos: { x: -2.5, y: 0, z: 1.5 }, rot: { x: 0, y: 0, z: 0 } },
        { pos: { x: -2.5, y: 0, z: 1.5 }, rot: { x: 0, y: Math.PI/2, z: 0 } },
        { pos: { x: 0, y: 0, z: 1.5 }, rot: { x: 0, y: Math.PI/1, z: 0 } },
        { pos: { x: 0, y: 0, z: 1.5 }, rot: { x: 0, y: 0, z: 0 } },
        { pos: { x: 2.5, y: 0, z: 1.5 }, rot: { x: 0, y: Math.PI/1, z: 0 } },
        { pos: { x: 2.5, y: 0, z: 1.5 }, rot: { x: 0, y: Math.PI/2, z: 0 } }
    ];
    
    for (const { pos, rot } of cornerPositions) {
        await loadOBJModel(
            'models/balk_corner.obj',
            woodMaterial,
            pos,
            rot
        );
       }
    }

 // Функція для створення горизонтальних балок
 async function createHorizontalBeams() {
     const beamPositions = [
         // Поздовжні балки (по 5м)
         { pos: { x: -2.42, y: 2.2, z: 1.5 }, scale: { x: 4.85, y: 1, z: 1 } },
         { pos: { x: -2.42, y: 2.2, z: -1.5 }, scale: { x: 4.85, y: 1, z: 1 } },
         
         // Поперечні балки (по 3м)
         { pos: { x: -2.5, y: 2.2, z: 1.57 }, scale: { x: 3.14, y: 1, z: 1 }, rot: { x: 0, y: Math.PI/2, z: 0 } },
         { pos: { x: 2.5, y: 2.2, z: 1.57 }, scale: { x: 3.14, y: 1, z: 1 }, rot: { x: 0, y: Math.PI/2, z: 0 } }
     ];
 
     for (const { pos, scale, rot = { x: 0, y: 0, z: 0 } } of beamPositions) {
         const beam = await loadOBJModel(
             'models/balk_150x150x1000.obj',
             woodMaterial,
             pos,
             rot
         );
         beam.scale.set(scale.x, scale.y, scale.z);
        }
     }



// ------// 


// Функція для створення нижнього фризу
async function createLowerFrize() {
    const frizePositions = [
        // Довга сторона (спереду)
        {
            pos: { x: -2.7, y: 2.3, z: -1.83 }, 
            scale: { x: 5.4, y: 1, z: 1 }, 
            rot: { x: 0, y: 0, z: 0 }
        },
        // Довга сторона (ззаду)
        {
      pos: { x: 2.7, y: 2.3, z: 1.77},
            scale: { x: 5.4, y: 1, z: 1 },
            rot: { x: 0, y: Math.PI, z: 0 }
        },
        // Коротка сторона (зліва)
        {
            pos: { x: -2.7, y: 2.3, z: 1.8 },
            scale: { x: 3.6, y: 1, z: 1 },  // 3.0 + (0.18 * 2) для виносу
            rot: { x: 0, y: Math.PI / 2, z: 0 }
        },
        // Коротка сторона (справа)
        {
            pos: { x: 2.7, y: 2.3, z: -1.81},
            scale: { x: 3.60, y: 1, z: 1 },
            rot: { x: 0, y: -Math.PI / 2, z: 0 }
        }
    ];

    for (const { pos, scale, rot } of frizePositions) {
        const frize = await loadOBJModel(
            'models/Lodge_20x200x1000.obj',
            woodMaterial,
            pos,
            rot
        );
        frize.scale.set(scale.x, scale.y, scale.z);
     }
   }

 // Функція для створення верхнього фризу

 async function createUpperFrize() {
     const upperFrizePositions = [
         // Довга сторона (спереду)
         {
             pos: { x: -2.7, y: 2.5, z: -1.85 }, 
             scale: { x: 5.4, y: 1, z: 1 },
             rot: { x: 0, y: 0, z: 0 }
         },
         // Довга сторона (ззаду)
         {
             pos: { x: 2.7, y: 2.5, z: 1.79 },
             scale: { x: 5.4, y: 1, z: 1 },
             rot: { x: 0, y: Math.PI, z: 0 }
         },
         // Коротка сторона (зліва)
         {
             pos: { x: -2.72, y: 2.5, z: 1.8},
             scale: { x: 3.65, y: 1, z: 1 },
             rot: { x: 0, y: Math.PI / 2, z: 0 }
         },
         // Коротка сторона (справа)
         {
             pos: { x: 2.72, y: 2.5, z: -1.85},
             scale: { x: 3.65, y: 1, z: 1 },
             rot: { x: 0, y: -Math.PI / 2, z: 0 }
         }
     ];
 
     for (const { pos, scale, rot } of upperFrizePositions) {
         const frize = await loadOBJModel(
             'models/Lodge_20x200x1000.obj',
             woodMaterial,
             pos,
             rot
         );
         frize.scale.set(scale.x, scale.y, scale.z);
     }
 }

// Критка для криші

async function createRoof() {
  const roofPosition = [
       {
             pos: { x: -2.2, y: 2.5, z: 1.75}, 
             scale: { x: 5.2, y: 1, z: 3.6 },
             rot: { x: 0, y: 0, z: 0 }
         },
        {
             pos: { x: -1.1, y: 2.5, z: 1.75 }, 
             scale: { x: 7, y: 1, z: 3.6 },
             rot: { x: 0, y: 0, z: 0 }
         },
        {
             pos: { x: 0.1, y: 2.5, z: 1.75 }, 
             scale: { x: 7, y: 1, z: 3.6 },
             rot: { x: 0, y: 0, z: 0 }
         },
         {
             pos: { x: 1.4, y: 2.5, z: 1.75 }, 
             scale: { x: 7, y: 1, z: 3.6 },
             rot: { x: 0, y: 0, z: 0 }
         },
        {
             pos: { x: 1.7, y: 2.5, z: 1.75 }, 
             scale: { x: 10.5, y: 1, z: 3.6 },
             rot: { x: 0, y: 0, z: 0 }
         }
      ];
    
      for (const { pos, scale, rot } of roofPosition) {
         const frize = await loadOBJModel(
             'models/Lodge_20x190x1000_bevel.obj',
             woodMaterial,
             pos,
           rot
         );
         frize.scale.set(scale.x, scale.y, scale.z);
     } 
}


// Повздовжні бруси між колонами

async function createGirder() {
    const girderPosition = [
        {
             pos: { x: -2.52, y: 2.35, z: 1.77 }, 
             scale: { x: 3.6, y: 1, z: 1 },
             rot: { x: 0, y: Math.PI/2, z: 0 }
         },   {
             pos: { x: -2, y: 2.35, z: 1.77 }, 
             scale: { x: 3.6, y: 1, z: 1 },
             rot: { x: 0, y: Math.PI/2, z: 0 }
         },   {
             pos: { x: -1.5, y: 2.35, z: 1.77 }, 
             scale: { x: 3.6, y: 1, z: 1 },
             rot: { x: 0, y: Math.PI/2, z: 0 }
         },   {
             pos: { x: -1, y: 2.35, z: 1.77 }, 
             scale: { x: 3.6, y: 1, z: 1 },
             rot: { x: 0, y: Math.PI/2, z: 0 }
         },   {
             pos: { x: -0.5, y: 2.35, z: 1.77 }, 
             scale: { x: 3.6, y: 1, z: 1 },
             rot: { x: 0, y: Math.PI/2, z: 0 }
         },
         {
             pos: { x: -0.02, y: 2.35, z: 1.77 }, 
             scale: { x: 3.6, y: 1, z: 1 },
             rot: { x: 0, y: Math.PI/2, z: 0 }
         }, 
         {
             pos: { x: 0.5, y: 2.35, z: 1.77 }, 
             scale: { x: 3.6, y: 1, z: 1 },
             rot: { x: 0, y: Math.PI/2, z: 0 }
         },   {
             pos: { x: 1, y: 2.35, z: 1.77 }, 
             scale: { x: 3.6, y: 1, z: 1 },
             rot: { x: 0, y: Math.PI/2, z: 0 }
         },   {
             pos: { x: 1.5, y: 2.35, z: 1.77 }, 
             scale: { x: 3.6, y: 1, z: 1 },
             rot: { x: 0, y: Math.PI/2, z: 0 }
         },   {
             pos: { x: 2, y: 2.35, z: 1.77 }, 
             scale: { x: 3.6, y: 1, z: 1 },
             rot: { x: 0, y: Math.PI/2, z: 0 }
         },   {
             pos: { x: 2.5, y: 2.35, z: 1.77 }, 
             scale: { x: 3.6, y: 1, z: 1 },
             rot: { x: 0, y: Math.PI/2, z: 0 }
         },    
  ]
for (const { pos, scale, rot } of girderPosition) {
         const frize = await loadOBJModel(
             'models/lodge_150x50x1000.obj',
             woodMaterial,
             pos,
           rot
         );
         frize.scale.set(scale.x, scale.y, scale.z);
     } 
}

// Створення вставок які заповнють проміжок 
async function createGirderBetweenFriezeandBeam() {
    const girderBetweenFriezeandBeamPosition = [
        {
             pos: { x: 2.7, y: 2.35, z: 1.5 }, 
             scale: { x: 5.4, y: 1, z: 1 },
             rot: { x: 0, y: Math.PI/1, z: 0 }
         },  {
             pos: { x: 2.7, y: 2.35, z: -1.5 }, 
             scale: { x: 5.4, y: 1, z: 1 },
             rot: { x: 0, y: Math.PI/1, z: 0 }
         },


         {
             pos: { x: -2.5, y: 2.35, z: 1.1 }, 
             scale: { x: 0.2, y: 1, z: 1 },
             rot: { x: 0, y: Math.PI/1, z: 0 }
         },  {
             pos: { x: -2.5, y: 2.35, z: -1.1 }, 
             scale: { x: 0.2, y: 1, z: 1 },
             rot: { x: 0, y: Math.PI/1, z: 0 }
         }, {
             pos: { x: -2.5, y: 2.35, z: 0.4 }, 
             scale: { x: 0.2, y: 1, z: 1 },
             rot: { x: 0, y: Math.PI/1, z: 0 }
         }, {
             pos: { x: -2.5, y: 2.35, z: -0.4 }, 
             scale: { x: 0.2, y: 1, z: 1 },
             rot: { x: 0, y: Math.PI/1, z: 0 }
         },

         {
             pos: { x: 2.7, y: 2.35, z: 1.1 }, 
             scale: { x: 0.2, y: 1, z: 1 },
             rot: { x: 0, y: Math.PI/1, z: 0 }
         },  {
             pos: { x: 2.7, y: 2.35, z: -1.1 }, 
             scale: { x: 0.2, y: 1, z: 1 },
             rot: { x: 0, y: Math.PI/1, z: 0 }
         }, {
             pos: { x: 2.7, y: 2.35, z: 0.4 }, 
             scale: { x: 0.2, y: 1, z: 1 },
             rot: { x: 0, y: Math.PI/1, z: 0 }
         }, {
             pos: { x: 2.7, y: 2.35, z: -0.4 }, 
             scale: { x: 0.2, y: 1, z: 1 },
             rot: { x: 0, y: Math.PI/1, z: 0 }
         },

  ]

  for (const {pos, scale, rot} of girderBetweenFriezeandBeamPosition) {
    const frize = await loadOBJModel(
        'models/lodge_150x50x1000.obj',
           woodMaterial,
             pos,
           rot
         );
         frize.scale.set(scale.x, scale.y, scale.z);
  }
}

// Основна функція ініціалізації
async function init() {
    // Додаємо освітлення
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Створюємо всі елементи конструкції
    await createColumns();
    await createCornerBeams();
    await createHorizontalBeams();
    await createLowerFrize();
    await createUpperFrize();
    await createRoof();
    await createGirder();
    await createGirderBetweenFriezeandBeam();


    // Анімаційний цикл
    function animate() {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }
    animate();
}

// Обробник зміни розміру вікна
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Запускаємо програму
init();
