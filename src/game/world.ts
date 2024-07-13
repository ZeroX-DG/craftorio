import * as THREE from "three";
import { Block } from "./block";
import { GrassBlock } from "./blocks/grass";
import { DirtBlock } from "./blocks/dirt";
import { BlockTypeName } from "./blockType";
import { Player } from "./player";

export class World {
  readonly SIZE = new THREE.Vector3(16, 10, 16);
  readonly MAX_BLOCKS = 1000000;
  private blocks: Map<BlockTypeName, Block[]> = new Map();
  private blockMeshes: Map<BlockTypeName, THREE.InstancedMesh> = new Map();
  private players: Player[] = [];

  constructor(private scene: THREE.Scene) {}

  generate() {
    for (let x = 0; x < this.SIZE.x; x++) {
      for (let y = 0; y < this.SIZE.y; y++) {
        for (let z = 0; z < this.SIZE.z; z++) {
          let block;
          if (y == this.SIZE.y - 1) {
            block = new Block(new GrassBlock(), x, y, z);
          } else {
            block = new Block(new DirtBlock(), x, y, z);
          }
          this.addBlock(block);
        }
      }
    }

    this.addPlayer(this.SIZE.x / 2, this.SIZE.y + 1, this.SIZE.z / 2);
  }

  addPlayer(x: number, y: number, z: number) {
    const player = new Player(x, y, z);
    this.scene.add(player.model);
    this.players.push(player);
  }

  getBlockMesh(blockType: BlockTypeName): THREE.InstancedMesh {
    return this.blockMeshes.get(blockType)!;
  }

  getAllBlocks() {
    return this.blocks.entries();
  }

  getBlocks(blockType: BlockTypeName) {
    return this.blocks.get(blockType)!;
  }

  addBlock(block: Block) {
    if (!this.blocks.has(block.blockType.name)) {
      this.blocks.set(block.blockType.name, []);
    }
    if (!this.blockMeshes.has(block.blockType.name)) {
      const mesh = block.blockType.getMesh();
      this.blockMeshes.set(block.blockType.name, mesh);
      this.scene.add(mesh);
    }
    this.blocks.get(block.blockType.name)!.push(block);
  }
}
