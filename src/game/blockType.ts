import * as THREE from "three";

export type BlockTypeName = string;

export type BlockTypeMaterials =
  | {
      side:
        | {
            n: THREE.Material;
            e: THREE.Material;
            w: THREE.Material;
            s: THREE.Material;
          }
        | THREE.Material;
      top: THREE.Material;
      bottom: THREE.Material;
    }
  | THREE.Material;

export abstract class BlockType {
  abstract name: BlockTypeName;
  abstract materials: BlockTypeMaterials;
  abstract getMesh(): THREE.InstancedMesh;

  /**
   * The order of the materials in the array corresponds to the following faces:
   * 1. Positive X (right)
   * 2. Negative X (left)
   * 3. Positive Y (top)
   * 4. Negative Y (bottom)
   * 5. Positive Z (front)
   * 6. Negative Z (back)
   */
  protected getMaterialArray(): THREE.Material[] {
    const material = this.materials;

    if ("top" in material) {
      if ("n" in material.side) {
        return [
          material.side.e,
          material.side.w,
          material.top,
          material.bottom,
          material.side.s,
          material.side.n,
        ];
      } else {
        return [
          material.side,
          material.side,
          material.top,
          material.bottom,
          material.side,
          material.side,
        ];
      }
    }

    return new Array(6).fill(material);
  }
}
