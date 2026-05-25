import { useEffect, useRef } from 'react';

const ClientNetwork = ({ className }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    let cleanupScene;
    let isMounted = true;

    if (!mount) {
      return undefined;
    }

    const initScene = async () => {
      const THREE = await import('three');

      if (!isMounted || !mountRef.current) {
        return;
      }

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
      camera.position.set(4.8, 4.1, 7.2);
      camera.lookAt(0, 0.5, 0);

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;

      if (THREE.SRGBColorSpace) {
        renderer.outputColorSpace = THREE.SRGBColorSpace;
      }

      mount.appendChild(renderer.domElement);

      const model = new THREE.Group();
      model.rotation.set(-0.05, -0.42, 0);
      scene.add(model);

      const navyMaterial = new THREE.MeshStandardMaterial({
        color: 0x1d5d97,
        roughness: 0.42,
        metalness: 0.18,
      });
      const darkMaterial = new THREE.MeshStandardMaterial({
        color: 0x0b2448,
        roughness: 0.52,
        metalness: 0.24,
      });
      const orangeMaterial = new THREE.MeshStandardMaterial({
        color: 0xf47b20,
        roughness: 0.35,
        metalness: 0.12,
        emissive: 0x4c1600,
        emissiveIntensity: 0.18,
      });
      const glassMaterial = new THREE.MeshStandardMaterial({
        color: 0x55c7ff,
        roughness: 0.12,
        metalness: 0.02,
        transparent: true,
        opacity: 0.46,
        emissive: 0x0b7cb6,
        emissiveIntensity: 0.35,
      });
      const cableMaterial = new THREE.LineBasicMaterial({
        color: 0x0b2448,
        transparent: true,
        opacity: 0.78,
      });

      const addBox = ({ size, position, material, parent = model }) => {
        const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
        mesh.position.set(...position);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        parent.add(mesh);
        return mesh;
      };

      const addCylinder = ({ radius = 0.06, height, position, material, axis = 'y', parent = model }) => {
        const mesh = new THREE.Mesh(new THREE.CylinderGeometry(radius, radius, height, 18), material);

        if (axis === 'x') {
          mesh.rotation.z = Math.PI / 2;
        }

        if (axis === 'z') {
          mesh.rotation.x = Math.PI / 2;
        }

        mesh.position.set(...position);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        parent.add(mesh);
        return mesh;
      };

      const addBeam = ({ from, to, radius = 0.025, material = orangeMaterial, parent = model }) => {
        const start = new THREE.Vector3(...from);
        const end = new THREE.Vector3(...to);
        const midpoint = start.clone().add(end).multiplyScalar(0.5);
        const direction = end.clone().sub(start);
        const mesh = new THREE.Mesh(
          new THREE.CylinderGeometry(radius, radius, direction.length(), 12),
          material,
        );

        mesh.position.copy(midpoint);
        mesh.quaternion.setFromUnitVectors(
          new THREE.Vector3(0, 1, 0),
          direction.normalize(),
        );
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        parent.add(mesh);
        return mesh;
      };

      const building = new THREE.Group();
      building.position.set(0.62, 0, 0.1);
      building.scale.set(0.88, 0.88, 0.88);
      model.add(building);

      addBox({ size: [1.9, 1.72, 1.64], position: [0, 0.78, 0], material: navyMaterial, parent: building });
      addBox({ size: [2.02, 0.18, 1.76], position: [0, 1.66, 0], material: orangeMaterial, parent: building });
      addBox({ size: [2.0, 0.18, 1.74], position: [0, 0.08, 0], material: orangeMaterial, parent: building });

      const windowPositions = [-0.66, 0, 0.66];
      windowPositions.forEach((x) => {
        [0.45, 0.9, 1.35].forEach((y) => {
          addBox({ size: [0.34, 0.28, 0.035], position: [x, y, 0.84], material: glassMaterial, parent: building });
          addBox({ size: [0.035, 0.28, 0.34], position: [-0.98, y, x * 0.72], material: glassMaterial, parent: building });
        });
      });

      const frameGroup = new THREE.Group();
      frameGroup.position.set(0, 1.72, 0);
      building.add(frameGroup);

      [-0.84, -0.28, 0.28, 0.84].forEach((x) => {
        [-0.68, 0, 0.68].forEach((z) => {
          addCylinder({ radius: 0.035, height: 1.55, position: [x, 0.66, z], material: navyMaterial, parent: frameGroup });
        });
      });

      [0.18, 0.66, 1.14].forEach((y) => {
        [-0.68, 0, 0.68].forEach((z) => {
          addCylinder({ radius: 0.027, height: 1.72, position: [0, y, z], material: navyMaterial, axis: 'x', parent: frameGroup });
        });

        [-0.84, -0.28, 0.28, 0.84].forEach((x) => {
          addCylinder({ radius: 0.027, height: 1.36, position: [x, y, 0], material: navyMaterial, axis: 'z', parent: frameGroup });
        });
      });

      const bracePairs = [
        [-0.72, 0.14, 0.78, 1.18],
        [-0.22, 0.14, 0.22, 1.18],
        [0.28, 0.14, -0.34, 1.18],
      ];

      bracePairs.forEach(([x1, y1, x2, y2]) => {
        const length = Math.hypot(x2 - x1, y2 - y1);
        const brace = addCylinder({
          radius: 0.032,
          height: length,
          position: [(x1 + x2) / 2, (y1 + y2) / 2, 0.82],
          material: orangeMaterial,
          parent: frameGroup,
        });
        brace.rotation.z = Math.atan2(y2 - y1, x2 - x1) - Math.PI / 2;
      });

      const crane = new THREE.Group();
      crane.position.set(-2.0, -0.34, -0.2);
      crane.rotation.y = -0.60;
      crane.scale.set(0.92, 0.92, 0.92);
      model.add(crane);

      addBox({ size: [0.58, 0.16, 0.58], position: [0, 0.02, 0], material: darkMaterial, parent: crane });

      const towerHeight = 3.12;
      const towerTop = 2.94;
      const legOffset = 0.16;
      const towerCorners = [
        [-legOffset, -legOffset],
        [legOffset, -legOffset],
        [-legOffset, legOffset],
        [legOffset, legOffset],
      ];

      towerCorners.forEach(([x, z]) => {
        addCylinder({
          radius: 0.026,
          height: towerHeight,
          position: [x, towerHeight / 2, z],
          material: orangeMaterial,
          parent: crane,
        });
      });

      [0.42, 0.9, 1.38, 1.86, 2.34, 2.82].forEach((y, index) => {
        addBeam({ from: [-legOffset, y, -legOffset], to: [legOffset, y, -legOffset], radius: 0.018, parent: crane });
        addBeam({ from: [-legOffset, y, legOffset], to: [legOffset, y, legOffset], radius: 0.018, parent: crane });
        addBeam({ from: [-legOffset, y, -legOffset], to: [-legOffset, y, legOffset], radius: 0.018, parent: crane });
        addBeam({ from: [legOffset, y, -legOffset], to: [legOffset, y, legOffset], radius: 0.018, parent: crane });

        if (index < 5) {
          const nextY = y + 0.48;
          addBeam({ from: [-legOffset, y, -legOffset], to: [legOffset, nextY, -legOffset], radius: 0.016, parent: crane });
          addBeam({ from: [legOffset, y, legOffset], to: [-legOffset, nextY, legOffset], radius: 0.016, parent: crane });
          addBeam({ from: [-legOffset, y, legOffset], to: [-legOffset, nextY, -legOffset], radius: 0.016, parent: crane });
          addBeam({ from: [legOffset, y, -legOffset], to: [legOffset, nextY, legOffset], radius: 0.016, parent: crane });
        }
      });

      addBox({ size: [0.48, 0.22, 0.42], position: [0, towerTop, 0], material: navyMaterial, parent: crane });

      const boom = new THREE.Group();
      boom.position.set(0.08, towerTop + 0.08, 0);
      boom.rotation.z = 0.12;
      crane.add(boom);

      const boomLength = 3.25;
      const boomSegments = 7;
      const boomBottomY = 0;
      const boomTopY = 0.28;
      const boomHalfDepth = 0.09;

      addBeam({ from: [0, boomBottomY, -boomHalfDepth], to: [boomLength, boomBottomY, -boomHalfDepth], radius: 0.024, parent: boom });
      addBeam({ from: [0, boomBottomY, boomHalfDepth], to: [boomLength, boomBottomY, boomHalfDepth], radius: 0.024, parent: boom });
      addBeam({ from: [0.04, boomTopY, 0], to: [boomLength - 0.18, boomTopY, 0], radius: 0.022, parent: boom });

      for (let index = 0; index <= boomSegments; index += 1) {
        const x = (boomLength / boomSegments) * index;
        addBeam({ from: [x, boomBottomY, -boomHalfDepth], to: [x, boomBottomY, boomHalfDepth], radius: 0.016, parent: boom });
        addBeam({ from: [x, boomBottomY, -boomHalfDepth], to: [x, boomTopY, 0], radius: 0.016, parent: boom });
        addBeam({ from: [x, boomBottomY, boomHalfDepth], to: [x, boomTopY, 0], radius: 0.016, parent: boom });

        if (index < boomSegments) {
          const nextX = (boomLength / boomSegments) * (index + 1);
          addBeam({ from: [x, boomBottomY, -boomHalfDepth], to: [nextX, boomTopY, 0], radius: 0.015, parent: boom });
          addBeam({ from: [x, boomBottomY, boomHalfDepth], to: [nextX, boomTopY, 0], radius: 0.015, parent: boom });
        }
      }

      addBox({ size: [0.34, 0.26, 0.34], position: [boomLength + 0.12, boomBottomY + 0.02, 0], material: navyMaterial, parent: boom });
      addBox({ size: [0.54, 0.24, 0.36], position: [-0.48, towerTop + 0.12, 0], material: navyMaterial, parent: crane });
      addBox({ size: [0.3, 0.2, 0.28], position: [0.34, towerTop - 0.02, 0.24], material: glassMaterial, parent: crane });

      const supportLines = new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, towerTop + 0.48, 0),
          new THREE.Vector3(2.72, towerTop + 0.34, 0),
          new THREE.Vector3(0, towerTop + 0.48, 0),
          new THREE.Vector3(-0.7, towerTop + 0.08, 0),
        ]),
        cableMaterial,
      );
      crane.add(supportLines);

      const trolley = addBox({ size: [0.18, 0.15, 0.2], position: [1.42, 2.96, 0], material: navyMaterial, parent: crane });
      const hookLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(1.42, 2.86, 0),
          new THREE.Vector3(1.42, 1.8, 0),
        ]),
        cableMaterial,
      );
      crane.add(hookLine);

      const hook = new THREE.Mesh(new THREE.TorusGeometry(0.11, 0.022, 10, 32, Math.PI * 1.42), darkMaterial);
      hook.position.set(1.42, 1.68, 0);
      hook.rotation.z = -0.7;
      hook.castShadow = true;
      crane.add(hook);

      const ambientLight = new THREE.HemisphereLight(0xffffff, 0x071b3d, 2.2);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 4.6);
      keyLight.position.set(-3.6, 4.4, 5.8);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      scene.add(keyLight);

      const warmLight = new THREE.PointLight(0xf47b20, 5.2, 8.5);
      warmLight.position.set(2.4, 1.2, 2.8);
      scene.add(warmLight);

      const blueLight = new THREE.PointLight(0x39b8ff, 2.8, 7);
      blueLight.position.set(-2.8, 0.5, -1.8);
      scene.add(blueLight);

      let frameId = 0;
      let resizeFrameId = 0;
      const startTime = performance.now();

      const applyResize = () => {
        const size = mount.getBoundingClientRect();
        const width = Math.max(1, Math.floor(size.width));
        const height = Math.max(1, Math.floor(size.height));

        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.position.z = width < 520 ? 8.4 : 7.2;
        camera.updateProjectionMatrix();
      };

      const resize = () => {
        cancelAnimationFrame(resizeFrameId);
        resizeFrameId = requestAnimationFrame(applyResize);
      };

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(mount);
      applyResize();

      const render = () => {
        const elapsed = (performance.now() - startTime) / 1000;

        model.rotation.y = -0.42 + Math.sin(elapsed * 0.34) * 0.1;
        model.rotation.x = -0.05 + Math.sin(elapsed * 0.48) * 0.02;
        model.position.y = Math.sin(elapsed * 0.7) * 0.08;
        trolley.position.x = 1.26 + Math.sin(elapsed * 0.9) * 0.22;
        trolley.position.y = 2.94 + trolley.position.x * 0.12;
        hookLine.geometry.setFromPoints([
          new THREE.Vector3(trolley.position.x, trolley.position.y - 0.12, 0),
          new THREE.Vector3(trolley.position.x, 1.78 + Math.sin(elapsed * 1.2) * 0.08, 0),
        ]);
        hook.position.x = trolley.position.x;
        hook.position.y = 1.66 + Math.sin(elapsed * 1.2) * 0.08;

        renderer.render(scene, camera);
        frameId = requestAnimationFrame(render);
      };

      render();

      cleanupScene = () => {
        cancelAnimationFrame(frameId);
        cancelAnimationFrame(resizeFrameId);
        resizeObserver.disconnect();

        if (renderer.domElement.parentElement === mount) {
          mount.removeChild(renderer.domElement);
        }

        scene.traverse((object) => {
          if (!object.isMesh && !object.isLine) {
            return;
          }

          object.geometry?.dispose();

          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material?.dispose();
          }
        });

        renderer.dispose();
      };
    };

    initScene();

    return () => {
      isMounted = false;

      if (cleanupScene) {
        cleanupScene();
      }
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
};

export default ClientNetwork;
