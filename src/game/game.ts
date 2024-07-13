import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { World } from "./world";
import { Model } from "./model";

export class Game {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.WebGLRenderer;
  world: World;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.renderer = new THREE.WebGLRenderer();

    this.world = new World(this.scene);
  }

  async setup() {
    await Model.loadModels();
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene.add(new THREE.DirectionalLight(0xf7d67c, 2));
    this.scene.add(new THREE.AmbientLight(0x404040, 10));

    this.camera.position.z = 0;
    this.camera.position.x = -10;
    this.camera.position.y = 10;

    const controls = new OrbitControls(this.camera, this.renderer.domElement);
    controls.target.set(0, 0, 0);
    controls.update();

    this.scene.add(new THREE.GridHelper(100, 10));

    this.world.generate();

    (window as any).game = this;
  }

  async render(container: HTMLElement) {
    await this.setup();

    this.renderer.setAnimationLoop(() => {
      const dummy = new THREE.Object3D();

      for (const [blockType, blocks] of this.world.getAllBlocks()) {
        const mesh = this.world.getBlockMesh(blockType);

        mesh.count = blocks.length;

        for (let i = 0; i < blocks.length; i++) {
          const block = blocks[i];
          dummy.position.set(
            block.position.x,
            block.position.y,
            block.position.z,
          );
          dummy.updateMatrix();
          mesh.setMatrixAt(i, dummy.matrix);
        }
        mesh.instanceMatrix.needsUpdate = true;
        mesh.computeBoundingSphere();
      }
      this.renderer.render(this.scene, this.camera);
    });

    container.appendChild(this.renderer.domElement);
  }
}
