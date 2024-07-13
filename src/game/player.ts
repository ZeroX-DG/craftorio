import * as THREE from "three";
import { Model } from "./model";

export class Player {
  position: THREE.Vector3;
  size: THREE.Vector3 = new THREE.Vector3(1, 1, 1);
  model = Model.PLAYER;

  constructor(x: number, y: number, z: number) {
    this.position = new THREE.Vector3(x, y, z);
    this.model.position.set(x, y, z);
    this.model.receiveShadow = true;
    this.model.castShadow = true;
  }
}
