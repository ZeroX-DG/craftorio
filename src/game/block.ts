import * as THREE from "three";
import { BlockType } from "./blockType";

export class Block {
  position: THREE.Vector3;
  blockType: BlockType;

  constructor(blockType: BlockType, x: number, y: number, z: number) {
    this.position = new THREE.Vector3(x, y, z);
    this.blockType = blockType;
  }
}
