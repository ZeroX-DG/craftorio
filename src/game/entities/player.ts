import * as THREE from "three";
import { Entity, EntityActions } from "../entity";
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

  private handleAction(action: EntityActions) {
    const newState = action == "Idle" ? "Idle" : "Walking";
    if (this.currentState != newState) {
      const nextAnimation = this.animationMap.get(newState)!;
      const currentAnimation = this.animationMap.get(this.currentState)!;

      currentAnimation.fadeOut(this.animationFadeDuration);
      nextAnimation.reset().fadeIn(this.animationFadeDuration).play();
      this.currentState = newState;
    }
  }

  private updateCameraAngle() {
    if (this.world.config.thirdPersonMode) {
      // Rotate to where the camera is facing
      const angleYCameraDirection = Math.atan2(
        this.world.camera.position.x - this.model.position.x,
        this.world.camera.position.z - this.model.position.z,
      );
      const directionOffset = Math.PI;
      this.rotateQuarternion.setFromAxisAngle(
        this.rotateAxis,
        angleYCameraDirection + directionOffset,
      );
      this.model.quaternion.rotateTowards(this.rotateQuarternion, 0.2);

      // calculate direction
      this.world.camera.getWorldDirection(this.direction);
      this.direction.y = 0;
      this.direction.normalize();
      this.direction.applyAxisAngle(this.rotateAxis, 0);
    }
  }

  update(delta: number, action: EntityActions) {
    this.handleAction(action);
    this.animationMixer.update(delta);
    this.updateCameraAngle();

    if (this.currentState == "Walking") {
      // move model
      const moveX = this.direction.x * this.velocity * delta;
      const moveZ = this.direction.z * this.velocity * delta;
      this.position.x += moveX;
      this.position.z += moveZ;
    }
  }
}
