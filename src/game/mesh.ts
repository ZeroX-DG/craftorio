import * as THREE from "three";

export const MAX_MESH_INSTANCE_COUNT = 100000;

export const createCubeMesh = (material: THREE.Material[]) => {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const mesh = new THREE.InstancedMesh(
    geometry,
    material,
    MAX_MESH_INSTANCE_COUNT,
  );
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  return mesh;
};
