import { createEffect } from 'solid-js';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

export const MainGame = () => {
    let gameContainer!: HTMLDivElement;

    createEffect(() => {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer();
        renderer.setSize(window.innerWidth, window.innerHeight);

        scene.add(new THREE.DirectionalLight(0xf7d67c, 5));
        scene.add(new THREE.AmbientLight(0x404040));

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0, 0);
        controls.update();

        scene.add(new THREE.GridHelper(100, 10));

        const worldSize = { width: 10, height: 10, depth: 10 };
        const textureLoader = new THREE.TextureLoader();
        textureLoader.setPath('textures/');

        const grassSideTexture = textureLoader.load('grass_block_side.webp');
        const dirtTexture = textureLoader.load('dirt.webp');
        const grassTopTexture = textureLoader.load('grass_top.webp');

        const grassSideMaterial = new THREE.MeshStandardMaterial({ map: grassSideTexture });
        const dirtMaterial = new THREE.MeshStandardMaterial({ map: dirtTexture });
        const grassTopMaterial = new THREE.MeshStandardMaterial({ map: grassTopTexture });
        const blockGeometry = new THREE.BoxGeometry();

        const blockMaterial = [
            grassSideMaterial, // side
            grassSideMaterial, // side
            grassTopMaterial, // top
            dirtMaterial, // bottom
            grassSideMaterial, // side
            grassSideMaterial, // side
        ];
        const blockMesh = new THREE.InstancedMesh(blockGeometry, blockMaterial, worldSize.width * worldSize.height * worldSize.depth);
        scene.add(blockMesh);
        const blockMatrix = new THREE.Object3D();

        for (let x = 0; x < worldSize.width; x++) {
            for (let y = 0; y < worldSize.height; y++) {
                for (let z = 0; z < worldSize.depth; z++) {
                    blockMatrix.position.x = x;
                    blockMatrix.position.y = -y;
                    blockMatrix.position.z = z;
                    const index = x * (worldSize.height * worldSize.depth) + y * worldSize.depth + z;
                    blockMatrix.updateMatrix();
                    blockMesh.setMatrixAt(index, blockMatrix.matrix);
                }
            }
        }

        camera.position.z = 5;
        camera.position.x = 0;
        camera.position.y = 10;

        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);
        });

        gameContainer.appendChild(renderer.domElement);
    });

    return (
        <div ref={gameContainer}></div>
    );
}
