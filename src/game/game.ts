import * as THREE from "three";
import { World } from "./world";
import { Model } from "./model";
import { EntityAction } from "./entity";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

export type GameConfig = {
  cameraMode: "third-person-facing" | "third-person-back" | "first-person";
};

export class Game {
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.WebGLRenderer;
  world!: World;

  config: GameConfig = {
    cameraMode: "first-person",
  };

  controls: PointerLockControls;

  playerActions: Set<EntityAction> = new Set();

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000,
    );
    this.controls = new PointerLockControls(this.camera, document.body);
    this.renderer = new THREE.WebGLRenderer();
  }

  async setup() {
    await Model.loadModels();
    this.world = new World(this.scene, this.camera, this.config, this.controls);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene.add(new THREE.DirectionalLight(0xf7d67c, 2));
    this.scene.add(new THREE.AmbientLight(0x404040, 10));

    this.camera.position.z = this.world.SIZE.z / 2;
    this.camera.position.x = this.world.SIZE.x / 2;
    this.camera.position.y = this.world.SIZE.y + 10;

    this.scene.add(new THREE.GridHelper(100, 10));

    this.world.init();

    this.setupControls();

    (window as any).game = this;
  }

  setupControls() {
    this.scene.add(this.controls.getObject());

    const playerMapping: Record<string, EntityAction> = {
      w: "MoveForward",
      a: "MoveLeft",
      s: "MoveBackward",
      d: "MoveRight",
    };

    const cameraModeCycle: GameConfig["cameraMode"][] = [
      "third-person-back",
      // TODO: Support third person front
      "first-person",
    ];

    document.addEventListener("keydown", (e) => {
      const action = playerMapping[e.key];
      if (action) {
        this.playerActions.add(action);
      }

      if (e.key == "c") {
        const index = cameraModeCycle.findIndex(
          (mode) => mode === this.config.cameraMode,
        );
        const nextIndex = (index + 1) % cameraModeCycle.length;
        this.config.cameraMode = cameraModeCycle[nextIndex];
      }
    });

    document.addEventListener("keyup", (e) => {
      const action = playerMapping[e.key];
      if (action) {
        this.playerActions.delete(action);
      }

      if (e.key == "esc") {
        this.controls.unlock();
      }
    });

    document.addEventListener("click", (e) => {
      e.preventDefault();
      this.controls.lock();
    });
  }

  async render(container: HTMLElement) {
    await this.setup();

    const clock = new THREE.Clock();

    this.renderer.setAnimationLoop(() => {
      this.world.update(clock.getDelta(), this.playerActions);
      this.renderer.render(this.scene, this.camera);
    });

    container.appendChild(this.renderer.domElement);
  }
}
