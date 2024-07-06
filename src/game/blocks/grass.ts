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
  getMesh() {
    return createCubeMesh(this.getMaterialArray());
  }
}
