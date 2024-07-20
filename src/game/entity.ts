import * as THREE from "three";

export type EntityAction =
  | "MoveForward"
  | "MoveBackward"
  | "MoveLeft"
  | "MoveRight";

export abstract class Entity {
  abstract size: THREE.Vector3;
  abstract model: THREE.Group;
  abstract update(delta: number, actions: Set<EntityAction>): void;

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
