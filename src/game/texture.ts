import * as THREE from "three";

export namespace Texture {
  const texture_loader = new THREE.TextureLoader();
  texture_loader.setPath("textures/");

  export const GRASS_TOP = texture_loader.load("grass_top.webp");
  export const GRASS_SIDE = texture_loader.load("grass_side.webp");
  export const DIRT = texture_loader.load("dirt.webp");
}
