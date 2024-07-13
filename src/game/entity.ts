import * as THREE from "three";

export type EntityActions =
  | "MoveForward"
  | "MoveBackward"
  | "MoveLeft"
  | "MoveRight";

export abstract class Entity {
  abstract size: THREE.Vector3;
  abstract model: THREE.Group;

  moveInCurrentDirection(speed: number) {
    const euler = new THREE.Euler(0, this.rotation.y, 0);
    const quat = new THREE.Quaternion().setFromEuler(euler);
    const vector = new THREE.Vector3(0, 0, speed).applyQuaternion(quat);
    this.position.add(vector);
  }

  get position() {
    return this.model.position;
  }

  get rotation() {
    return this.model.rotation;
  }

  moveForward() {
    this.moveInCurrentDirection(0.5);
  }

  moveBackward() {
    this.moveInCurrentDirection(-0.5);
  }
}
