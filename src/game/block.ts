import { Vector3 } from "three";

export enum BlockType {
  Grass,
  Dirt,
}

export class Block {
  position: Vector3;
  blockType: BlockType;

  constructor(blockType: BlockType, x: number, y: number, z: number) {
    this.position = new Vector3(x, y, z);
    this.blockType = blockType;
  }
}
