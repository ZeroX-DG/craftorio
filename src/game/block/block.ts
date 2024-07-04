import { Vector3 } from "three";

export enum BlockType {
  Grass,
  Dirt,
}

export abstract class Block {
  position: Vector3;
  abstract blockType: BlockType;

  constructor(x: number, y: number, z: number) {
    this.position = new Vector3(x, y, z);
  }
}
