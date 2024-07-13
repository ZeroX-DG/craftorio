import * as THREE from "three";

export const MAX_MESH_INSTANCE_COUNT = 100000;

export const createCubeMesh = (material: THREE.Material[]) => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  // This is so the geometry is aligned with the grid instead of being at 0.5 0.5 0.5
  geometry.computeBoundingBox();
  geometry.translate(
    -geometry.boundingBox!.min.x,
    -geometry.boundingBox!.min.y,
    -geometry.boundingBox!.min.z,
  );
  const mesh = new THREE.InstancedMesh(
    geometry,
    material,
    MAX_MESH_INSTANCE_COUNT,
  );
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  return mesh;
};
