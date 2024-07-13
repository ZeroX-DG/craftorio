import * as THREE from "three";
import { Entity } from "../entity";
import { Model } from "../model";

export class Player extends Entity {
  size: THREE.Vector3 = new THREE.Vector3(1, 1, 1);
  model = Model.PLAYER;

  constructor(x: number, y: number, z: number) {
    super();
    this.model.position.set(x, y, z);
    this.model.receiveShadow = true;
    this.model.castShadow = true;
  }
}
