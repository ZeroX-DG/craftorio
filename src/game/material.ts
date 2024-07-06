import * as THREE from "three";
import { Texture } from "./texture";

export namespace Material {
  export const GRASS_TOP = new THREE.MeshStandardMaterial({
    map: Texture.GRASS_TOP,
  });
  export const GRASS_SIDE = new THREE.MeshStandardMaterial({
    map: Texture.GRASS_SIDE,
  });
  export const DIRT = new THREE.MeshStandardMaterial({ map: Texture.DIRT });
}
