import * as THREE from "three";
import { Block, BlockType } from "./block";
import { Material } from "./material";

export class World {
  readonly SIZE = new THREE.Vector3(16, 10, 16);
  readonly MAX_BLOCKS = 1000000;
  private blocks: Map<BlockType, Block[]> = new Map();
  private blockMeshes: Map<BlockType, THREE.InstancedMesh> = new Map();

  generate() {
    for (let x = 0; x < this.SIZE.x; x++) {
      for (let y = 0; y < this.SIZE.y; y++) {
        for (let z = 0; z < this.SIZE.z; z++) {
          let block = new Block(BlockType.Dirt, x, y, z);
          if (y == this.SIZE.y - 1) {
            block.blockType = BlockType.Grass;
          }
          this.addBlock(block);
        }
      }
    }
  }

  initialise(scene: THREE.Scene) {
    const blockGeometry = new THREE.BoxGeometry(1, 1, 1);
    for (const blockTypeKey in BlockType) {
      if (isNaN(Number(blockTypeKey))) {
        const blockType = BlockType[
          blockTypeKey as any
        ] as unknown as BlockType;
        const blockMaterial = Material.getMaterialForBlockType(blockType);
        const blockMesh = new THREE.InstancedMesh(
          blockGeometry,
          blockMaterial,
          this.MAX_BLOCKS,
        );
        blockMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
        this.blockMeshes.set(blockType, blockMesh);
        this.blocks.set(blockType, []);
      }
    }

    scene.add(...this.blockMeshes.values());
  }

  getBlockMesh(blockType: BlockType): THREE.InstancedMesh {
    return this.blockMeshes.get(blockType)!;
  }

  getBlockTypes(): BlockType[] {
    return [...this.blocks.keys()];
  }

  getBlocks(blockType: BlockType) {
    return this.blocks.get(blockType)!;
  }

  addBlock(block: Block) {
    this.blocks.get(block.blockType)!.push(block);
  }
}
