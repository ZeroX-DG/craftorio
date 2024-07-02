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

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0, 0);
        controls.update();

        scene.add(new THREE.GridHelper(100, 10));

        const worldSize = { width: 5, height: 5, depth: 5 };
        const textureLoader = new THREE.TextureLoader();
        textureLoader.setPath('textures/');

        const grassSideTexture = textureLoader.load('grass_block_side.webp');
        const dirtTexture = textureLoader.load('dirt.webp');
        const grassTopTexture = textureLoader.load('grass_top.webp');

        const grassSideMaterial = new THREE.MeshBasicMaterial({ map: grassSideTexture });
        const dirtMaterial = new THREE.MeshBasicMaterial({ map: dirtTexture });
        const grassTopMaterial = new THREE.MeshBasicMaterial({ map: grassTopTexture });
        const blockGeometry = new THREE.BoxGeometry();

        for (let x = 0; x < worldSize.width; x++) {
            for (let y = 0; y < worldSize.height; y++) {
                for (let z = 0; z < worldSize.depth; z++) {
                    const block = new THREE.Mesh(blockGeometry, [
                        grassSideMaterial, // side
                        grassSideMaterial, // side
                        grassTopMaterial, // top
                        dirtMaterial, // bottom
                        grassSideMaterial, // side
                        grassSideMaterial, // side
                    ]);
                    block.position.x = x;
                    block.position.y = -y;
                    block.position.z = z;
                    scene.add(block);
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
