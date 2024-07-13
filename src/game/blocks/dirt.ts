import { BlockType } from "../blockType";
import { Material } from "../material";
import { createCubeMesh } from "../mesh";

export class DirtBlock extends BlockType {
  name = "DIRT";
  materials = Material.DIRT;
  getMesh() {
    return createCubeMesh(this.getMaterialArray());
  }
}
