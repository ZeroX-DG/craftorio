import { Entity, EntityActions } from "./entity";

export type KeyMap = {
  [key: string]: EntityActions;
};

export const hookEntityKeyboardControls = (entity: Entity, keymap: KeyMap) => {
  document.addEventListener("keydown", (e) => {
    const key = e.key;
    const action = keymap[key];
    entity.handleAction(action);
  });

  document.addEventListener("keyup", () => {
    entity.handleAction("Idle");
  });
};
