import * as THREE from "three";

export namespace Texture {
  const texture_loader = new THREE.TextureLoader();
  texture_loader.setPath("textures/");

  const loadTexture = (path: string) => {
    const texture = texture_loader.load(path);
    texture.magFilter = THREE.NearestFilter;
    return texture;
  };

  export const GRASS_TOP = loadTexture("grass_block_top.png");
  export const GRASS_SIDE = loadTexture("grass_block_side.png");
  export const DIRT = loadTexture("dirt.png");
}
