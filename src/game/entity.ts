import * as THREE from "three";

export type EntityActions =
  | "MoveForward"
  | "MoveBackward"
  | "MoveLeft"
  | "MoveRight"
  | "Idle";

export abstract class Entity {
  abstract size: THREE.Vector3;
  abstract model: THREE.Group;
  abstract update(delta: number, action: EntityActions): void;

  rotateAxis = new THREE.Vector3(0, 1, 0);
  rotateQuarternion = new THREE.Quaternion();
  direction = new THREE.Vector3();
  velocity = 4;

  get position() {
    return this.model.position;
  }

  get rotation() {
    return this.model.rotation;
  }
}
