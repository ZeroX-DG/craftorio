import * as THREE from "three";
import { BlockType } from "../blockType";
import { Material } from "../material";
import { createCubeMesh } from "../mesh";

export class GrassBlock extends BlockType {
  name = "GRASS";
  materials = {
    top: Material.GRASS_TOP,
    side: Material.GRASS_SIDE,
    bottom: Material.DIRT,
  };
  // Extracted from: https://minecraft.fandom.com/wiki/Block_colors#Grass_colors
  grassColor = {
    cherryGrove: new THREE.Color(0xb6db61),
  };
  getMesh() {
    const materials = this.getMaterialArray();
    const topMaterial = materials[2];
    topMaterial.color = this.grassColor.cherryGrove;
    return createCubeMesh(materials);
  }
}
