import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { World } from "./world";
import { Material } from "./material";

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
    this.world = new World();
  }

  setup() {
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

  render(container: HTMLElement) {
    this.setup();

    const blockGeometry = new THREE.BoxGeometry();
    const blockMatrix = new THREE.Object3D();

    for (const [blockType, blocks] of this.world.blockByTypes) {
      const material = Material.getMaterialForBlockType(blockType);
      const blockMesh = new THREE.InstancedMesh(
        blockGeometry,
        material,
        blocks.length,
      );
      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        blockMatrix.position.x = block.position.x;
        blockMatrix.position.y = block.position.y;
        blockMatrix.position.z = block.position.z;

        blockMatrix.updateMatrix();
        blockMesh.setMatrixAt(i, blockMatrix.matrix);
      }
      this.scene.add(blockMesh);
    }

    this.renderer.setAnimationLoop(() => {
      this.renderer.render(this.scene, this.camera);
    });

    container.appendChild(this.renderer.domElement);
  }
}
