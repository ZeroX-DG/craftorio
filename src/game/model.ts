import { GLTFLoader, GLTF } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";

export namespace Model {
  const loader = new GLTFLoader();
  loader.setPath("models/");
  export let PLAYER!: THREE.Group;

  const loadModel = (path: string) =>
    new Promise<GLTF>((resolve, reject) =>
      loader.load(path, resolve, undefined, reject),
    );

  export const loadModels = async () => {
    const player = await loadModel("player.gltf");
    PLAYER = player.scene;
  };
}
