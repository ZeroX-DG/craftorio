import { Entity, EntityActions } from "./entity";

export type KeyMap = {
  [key: string]: EntityActions;
};

export const hookEntityKeyboardControls = (entity: Entity, keymap: KeyMap) => {
  document.addEventListener("keydown", (e) => {
    const key = e.key;
    const action = keymap[key];

    switch (action) {
      case "MoveForward":
        entity.moveForward();
        break;
      case "MoveBackward":
        entity.moveBackward();
        break;
      case "MoveLeft":
        break;
      case "MoveRight":
        break;
    }
  });
};
