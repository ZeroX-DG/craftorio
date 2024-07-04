import { Vector3 } from "three";
import { Block, BlockType } from "./block/block";
import { GrassBlock } from "./block/grass";
import { DirtBlock } from "./block/dirt";

export class World {
  size = new Vector3(10, 10, 10);
  blocks: Block[] = [];

  blockByTypes: Map<BlockType, Block[]> = new Map();

  generate() {
    for (let x = 0; x < this.size.x; x++) {
      for (let y = 0; y < this.size.y; y++) {
        for (let z = 0; z < this.size.z; z++) {
          let block;
          if (y == this.size.y - 1) {
            block = new GrassBlock(x, y, z);
          } else {
            block = new DirtBlock(x, y, z);
          }
          this.blocks.push(block);
          this.blockByTypes.set(block.blockType, [
            ...(this.blockByTypes.get(block.blockType) ?? []),
            block,
          ]);
        }
      }
    }
  }
}
