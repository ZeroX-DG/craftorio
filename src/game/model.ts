import { GLTFLoader, GLTF } from "three/addons/loaders/GLTFLoader.js";

export namespace Model {
  const loader = new GLTFLoader();
  loader.setPath("models/");
  export let PLAYER!: GLTF;

  const loadModel = (path: string) =>
    new Promise<GLTF>((resolve, reject) =>
      loader.load(path, resolve, undefined, reject),
    );

  export const loadModels = async () => {
    PLAYER = await loadModel("player.gltf");
  };
}
