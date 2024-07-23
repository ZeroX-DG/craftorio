import * as THREE from "three";
import { Entity, EntityAction } from "../entity";
import { Model } from "../model";
import { Texture } from "../texture";
import { World } from "../world";

export class Player extends Entity {
  size: THREE.Vector3 = new THREE.Vector3(1, 1, 1);
  model = Model.PLAYER.scene;
  animationMixer: THREE.AnimationMixer;

  animationMap: Map<string, THREE.AnimationAction>;

  // This map directly to the animation name in the model.
  currentState: "Idle" | "Walking" = "Idle";
  animationFadeDuration = 0.2;

  world: World;

  constructor(x: number, y: number, z: number, world: World) {
    super();
    this.world = world;
    this.model.position.set(x, y, z);

    const skin = Texture.OLIVER_SKIN;
    this.model.traverse((object: any) => {
      if (object.isMesh) {
        object.material = new THREE.MeshPhysicalMaterial({
          map: skin,
        });
        object.material.map.flipY = false;
        object.castShadow = true;
        object.receiveShadow = true;
      }
    });

    this.animationMixer = new THREE.AnimationMixer(this.model);
    this.animationMap = new Map(
      Model.PLAYER.animations.map((animation) => [
        animation.name,
        this.animationMixer.clipAction(animation),
      ]),
    );

    this.animationMap.get(this.currentState)!.play();
  }

  private handleAction(actions: Set<EntityAction>) {
    const newState = actions.size === 0 ? "Idle" : "Walking";
    if (this.currentState != newState) {
      const nextAnimation = this.animationMap.get(newState)!;
      const currentAnimation = this.animationMap.get(this.currentState)!;

      currentAnimation.fadeOut(this.animationFadeDuration);
      nextAnimation.reset().fadeIn(this.animationFadeDuration).play();
      this.currentState = newState;
    }
  }

  private updateCameraAngle(actions: Set<EntityAction>) {
    const directionOffset = this.directionOffset(actions);

    // calculate direction
    this.world.camera.getWorldDirection(this.direction);
    this.direction.y = 0;
    this.direction.normalize();
    this.direction.applyAxisAngle(this.rotateAxis, directionOffset);

    if (
      this.world.config.cameraMode === "first-person" ||
      this.world.config.cameraMode === "third-person-back"
    ) {
      this.rotateQuarternion.set(
        0,
        this.world.camera.quaternion.y,
        0,
        this.world.camera.quaternion.w,
      );

      const ninetyRotateQuat = new THREE.Quaternion();
      ninetyRotateQuat.setFromAxisAngle(this.rotateQuarternion, Math.PI);
      ninetyRotateQuat.normalize();
      this.rotateQuarternion.multiply(ninetyRotateQuat);
    }
    this.model.quaternion.rotateTowards(this.rotateQuarternion, 0.2);
  }

  private directionOffset(actions: Set<EntityAction>): number {
    let offset = 0;

    if (actions.has("MoveForward")) {
      if (actions.has("MoveLeft")) {
        offset = Math.PI / 4;
      } else if (actions.has("MoveRight")) {
        offset = -Math.PI / 4;
      }
    } else if (actions.has("MoveBackward")) {
      if (actions.has("MoveLeft")) {
        offset = Math.PI / 4 + Math.PI / 2;
      } else if (actions.has("MoveRight")) {
        offset = -Math.PI / 4 - Math.PI / 2;
      } else {
        offset = Math.PI;
      }
    } else if (actions.has("MoveLeft")) {
      offset = Math.PI / 2;
    } else if (actions.has("MoveRight")) {
      offset = -Math.PI / 2;
    }

    return offset;
  }

  update(delta: number, actions: Set<EntityAction>) {
    this.handleAction(actions);
    this.animationMixer.update(delta);
    this.updateCameraAngle(actions);

    if (this.currentState == "Walking") {
      // move model
      const moveX = this.direction.x * this.velocity * delta;
      const moveZ = this.direction.z * this.velocity * delta;
      this.position.x += moveX;
      this.position.z += moveZ;
    }

    const camera = this.world.controls.getObject();

    if (this.world.config.cameraMode === "first-person") {
      camera.position.set(
        this.position.x,
        this.position.y + 1,
        this.position.z,
      );
    } else if (this.world.config.cameraMode === "third-person-back") {
      let vec = new THREE.Vector3();
      camera.getWorldDirection(vec);

      vec.multiplyScalar(-5);
      vec.add({
        x: this.position.x,
        y: 0,
        z: this.position.z,
      });

      camera.position.set(vec.x, this.position.y + 3, vec.z);
    }
  }
}
