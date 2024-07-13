import * as THREE from "three";
import { Entity, EntityActions } from "../entity";
import { Model } from "../model";
import { Texture } from "../texture";

export class Player extends Entity {
  size: THREE.Vector3 = new THREE.Vector3(1, 1, 1);
  model = Model.PLAYER.scene;
  animationMixer: THREE.AnimationMixer;

  animationMap: Map<string, THREE.AnimationAction>;

  // This map directly to the animation name in the model.
  currentState: "Idle" | "Walking" = "Idle";
  animationFadeDuration = 0.2;

  constructor(x: number, y: number, z: number) {
    super();
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

  handleAction(action: EntityActions) {
    const newState = action == "Idle" ? "Idle" : "Walking";
    if (this.currentState != newState) {
      const nextAnimation = this.animationMap.get(newState)!;
      const currentAnimation = this.animationMap.get(this.currentState)!;

      currentAnimation.fadeOut(this.animationFadeDuration);
      nextAnimation.reset().fadeIn(this.animationFadeDuration).play();
      this.currentState = newState;
    }
  }

  update(delta: number) {
    this.animationMixer.update(delta);
  }
}
