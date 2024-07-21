import * as THREE from "three";
import { Block } from "./block";
import { GrassBlock } from "./blocks/grass";
import { DirtBlock } from "./blocks/dirt";
import { BlockTypeName } from "./blockType";
import { Player } from "./entities/player";
import { GameConfig } from "./game";
import { EntityAction } from "./entity";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";

export class World {
  readonly SIZE = new THREE.Vector3(16, 10, 16);
  readonly MAX_BLOCKS = 1000000;
  private blocks: Map<BlockTypeName, Block[]> = new Map();
  private blockMeshes: Map<BlockTypeName, THREE.InstancedMesh> = new Map();
  private player: Player = new Player(
    this.SIZE.x / 2,
    this.SIZE.y + 1,
    this.SIZE.z / 2,
    this,
  );

  constructor(
    public scene: THREE.Scene,
    public camera: THREE.Camera,
    public config: GameConfig,
    public controls: PointerLockControls,
  ) {}

  init() {
    this.scene.add(this.player.model);
    this.generate();
  }

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
  }

  update(delta: number, playerActions: Set<EntityAction>) {
    const dummy = new THREE.Object3D();

    for (const [blockType, blocks] of this.getAllBlocks()) {
      const mesh = this.getBlockMesh(blockType);

      mesh.count = blocks.length;

      for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        dummy.position.set(
          block.position.x,
          block.position.y,
          block.position.z,
        );
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
      mesh.computeBoundingSphere();
    }

    this.player.update(delta, playerActions);
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
