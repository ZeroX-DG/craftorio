import * as THREE from "three";
import { Texture } from "./texture";
import { BlockType } from "./block/block";

export namespace Material {
  export const GRASS_TOP = new THREE.MeshStandardMaterial({
    map: Texture.GRASS_TOP,
  });
  export const GRASS_SIDE = new THREE.MeshStandardMaterial({
    map: Texture.GRASS_SIDE,
  });
  export const DIRT = new THREE.MeshStandardMaterial({ map: Texture.DIRT });

  export function getMaterialForBlockType(
    blockType: BlockType,
  ): THREE.Material | THREE.Material[] {
    switch (blockType) {
      case BlockType.Grass:
        return [
          Material.GRASS_SIDE, // side
          Material.GRASS_SIDE, // side
          Material.GRASS_TOP, // top
          Material.DIRT, // bottom
          Material.GRASS_SIDE, // side
          Material.GRASS_SIDE, // side
        ];
      case BlockType.Dirt:
        return [
          Material.DIRT, // side
          Material.DIRT, // side
          Material.DIRT, // top
          Material.DIRT, // bottom
          Material.DIRT, // side
          Material.DIRT, // side
        ];
      default:
        throw new Error("Unknown block type");
    }
  }
}
