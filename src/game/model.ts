import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";

export namespace Model {
  const loader = new GLTFLoader();
  loader.setPath("models/");
  export let PLAYER!: THREE.Group;

  const loadModel = (path: string) =>
    new Promise<THREE.Group>((resolve, reject) =>
      loader.load(
        path,
        (gltf) => {
          resolve(gltf.scene);
        },
        undefined,
        reject,
      ),
    );

  export const loadModels = async () => {
    PLAYER = await loadModel("player.gltf");
  };
}
