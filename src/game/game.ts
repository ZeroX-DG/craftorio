import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/Addons.js";
import { World } from "./world";
import { Model } from "./model";
import { EntityActions } from "./entity";

export type GameConfig = {
  thirdPersonMode: boolean;
};

export class Game {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.WebGLRenderer;
  world!: World;

  config: GameConfig = {
    thirdPersonMode: true,
  };

  playerAction: EntityActions = "Idle";

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.renderer = new THREE.WebGLRenderer();
  }

  async setup() {
    await Model.loadModels();
    this.world = new World(this.scene, this.camera, this.config);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene.add(new THREE.DirectionalLight(0xf7d67c, 2));
    this.scene.add(new THREE.AmbientLight(0x404040, 10));

    this.camera.position.z = this.world.SIZE.z / 2;
    this.camera.position.x = this.world.SIZE.x / 2;
    this.camera.position.y = this.world.SIZE.y + 10;

    if (this.config.thirdPersonMode) {
      const controls = new OrbitControls(this.camera, this.renderer.domElement);
      controls.target.set(
        this.world.SIZE.x / 2,
        this.world.SIZE.y,
        this.world.SIZE.z / 2,
      );
      controls.update();
    }

    this.scene.add(new THREE.GridHelper(100, 10));

    this.world.init();

    this.setupControls();

    (window as any).game = this;
  }

  setupControls() {
    document.addEventListener("keydown", (e) => {
      if (e.key == "w") {
        this.playerAction = "MoveForward";
      }
    });
    document.addEventListener("keyup", () => {
      this.playerAction = "Idle";
    });
  }

  async render(container: HTMLElement) {
    await this.setup();

    const clock = new THREE.Clock();

    this.renderer.setAnimationLoop(() => {
      this.world.update(clock.getDelta(), this.playerAction);
      this.renderer.render(this.scene, this.camera);
    });

    container.appendChild(this.renderer.domElement);
  }
}
