import { useEffect, useRef } from 'react';

const ProjectSphere = ({ className }) => {
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
      camera.position.set(4.2, 3.2, 6.4);
      camera.lookAt(0, 0, 0);

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });

      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;

      if (THREE.SRGBColorSpace) {
        renderer.outputColorSpace = THREE.SRGBColorSpace;
      }

      mount.appendChild(renderer.domElement);

      const model = new THREE.Group();
      model.rotation.set(-0.06, -0.36, 0);
      scene.add(model);

      const pipeMaterial = new THREE.MeshStandardMaterial({
        color: 0x1d5d97,
        roughness: 0.42,
        metalness: 0.18,
      });
      const pipeDarkMaterial = new THREE.MeshStandardMaterial({
        color: 0x0b2448,
        roughness: 0.52,
        metalness: 0.24,
      });
      const waterMaterial = new THREE.MeshStandardMaterial({
        color: 0x55c7ff,
        roughness: 0.12,
        metalness: 0.02,
        transparent: true,
        opacity: 0.46,
        emissive: 0x0b7cb6,
        emissiveIntensity: 0.35,
      });
      const concreteMaterial = new THREE.MeshStandardMaterial({
        color: 0xb8c2cc,
        roughness: 0.82,
        metalness: 0.02,
      });
      const coverMaterial = new THREE.MeshStandardMaterial({
        color: 0x26364a,
        roughness: 0.58,
        metalness: 0.16,
      });
      const orangeMaterial = new THREE.MeshStandardMaterial({
        color: 0xf47b20,
        roughness: 0.35,
        metalness: 0.12,
        emissive: 0x4c1600,
        emissiveIntensity: 0.18,
      });
      const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x718093,
        roughness: 0.9,
        metalness: 0.02,
        transparent: true,
        opacity: 0.72,
      });

      const makePipe = ({ length, radius = 0.16, position, axis = 'x', material = pipeMaterial }) => {
        const geometry = new THREE.CylinderGeometry(radius, radius, length, 36, 1);
        const mesh = new THREE.Mesh(geometry, material);

        if (axis === 'x') {
          mesh.rotation.z = Math.PI / 2;
        }

        if (axis === 'z') {
          mesh.rotation.x = Math.PI / 2;
        }

        mesh.position.set(...position);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        model.add(mesh);
        return mesh;
      };

      makePipe({ length: 4.2, position: [-0.25, 0.05, 0], axis: 'x' });
      makePipe({ length: 2.6, position: [0.85, 0.05, -1.1], axis: 'z' });
      makePipe({ length: 2.2, position: [-1.45, 0.05, 0.98], axis: 'z', radius: 0.13 });
      makePipe({ length: 1.7, position: [1.45, 0.05, 1.08], axis: 'x', radius: 0.13 });

      const waterPulse = makePipe({
        length: 2.1,
        radius: 0.07,
        position: [-0.7, 0.055, 0],
        axis: 'x',
        material: waterMaterial,
      });

      const chambers = [
        [-1.95, -0.15, 0, 0.82, 0.34, 0.82],
        [0.85, -0.15, -1.1, 0.78, 0.34, 0.78],
        [1.45, -0.15, 1.08, 0.66, 0.32, 0.66],
      ];

      chambers.forEach(([x, y, z, width, height, depth]) => {
        const chamber = new THREE.Mesh(
          new THREE.BoxGeometry(width, height, depth),
          concreteMaterial,
        );
        chamber.position.set(x, y, z);
        chamber.castShadow = true;
        chamber.receiveShadow = true;
        model.add(chamber);

        const cover = new THREE.Mesh(
          new THREE.BoxGeometry(width * 0.66, 0.045, depth * 0.66),
          coverMaterial,
        );
        cover.position.set(x, y + height / 2 + 0.032, z);
        cover.castShadow = true;
        model.add(cover);
      });

      const valveGeometry = new THREE.TorusGeometry(0.18, 0.018, 10, 48);
      const spokeGeometry = new THREE.BoxGeometry(0.34, 0.018, 0.018);
      const stemGeometry = new THREE.CylinderGeometry(0.026, 0.026, 0.44, 16);

      [
        [-1.95, 0.36, 0],
        [0.85, 0.36, -1.1],
        [1.45, 0.32, 1.08],
      ].forEach(([x, y, z], index) => {
        const valve = new THREE.Group();
        const wheel = new THREE.Mesh(valveGeometry, orangeMaterial);
        wheel.rotation.x = Math.PI / 2;
        valve.add(wheel);

        const spokeA = new THREE.Mesh(spokeGeometry, orangeMaterial);
        const spokeB = new THREE.Mesh(spokeGeometry, orangeMaterial);
        spokeB.rotation.y = Math.PI / 2;
        valve.add(spokeA, spokeB);

        const stem = new THREE.Mesh(stemGeometry, pipeDarkMaterial);
        stem.position.y = -0.24;
        valve.add(stem);

        valve.position.set(x, y, z);
        valve.rotation.y = index * 0.4;
        valve.castShadow = true;
        model.add(valve);
      });

      const elbowGeometry = new THREE.TorusGeometry(0.35, 0.15, 28, 60, Math.PI / 2);
      const elbows = [
        [0.85, 0.05, 0, 0, 0, Math.PI],
        [-1.45, 0.05, 0, 0, Math.PI, 0],
      ];

      elbows.forEach(([x, y, z, rx, ry, rz]) => {
        const elbow = new THREE.Mesh(elbowGeometry, pipeMaterial);
        elbow.position.set(x, y, z);
        elbow.rotation.set(rx, ry, rz);
        elbow.castShadow = true;
        elbow.receiveShadow = true;
        model.add(elbow);
      });

      const ground = new THREE.Mesh(
        new THREE.BoxGeometry(5.2, 0.08, 3.6),
        groundMaterial,
      );
      ground.position.set(-0.05, -0.45, 0.02);
      ground.receiveShadow = true;
      model.add(ground);

      const gridMaterial = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.12,
      });
      const grid = new THREE.GridHelper(5.2, 10, 0xffffff, 0xffffff);
      grid.material = gridMaterial;
      grid.position.set(-0.05, -0.39, 0.02);
      model.add(grid);

      const ambientLight = new THREE.HemisphereLight(0xbdd8ff, 0x071b3d, 2.1);
      scene.add(ambientLight);

      const keyLight = new THREE.DirectionalLight(0xffffff, 4.6);
      keyLight.position.set(-3.6, 4.4, 5.8);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.set(1024, 1024);
      scene.add(keyLight);

      const warmLight = new THREE.PointLight(0xf47b20, 5.6, 8.5);
      warmLight.position.set(2.4, 1.2, 2.8);
      scene.add(warmLight);

      const blueLight = new THREE.PointLight(0x39b8ff, 2.8, 7);
      blueLight.position.set(-2.8, 0.5, -1.8);
      scene.add(blueLight);

      const clock = new THREE.Clock();
      let frameId = 0;

      const resize = () => {
        const size = mount.getBoundingClientRect();
        const width = Math.max(1, Math.floor(size.width));
        const height = Math.max(1, Math.floor(size.height));

        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      };

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(mount);
      resize();

      const render = () => {
        const elapsed = clock.getElapsedTime();

        model.rotation.y = -0.42 + Math.sin(elapsed * 0.35) * 0.12;
        model.rotation.x = -0.08 + Math.sin(elapsed * 0.5) * 0.025;
        model.position.y = Math.sin(elapsed * 0.75) * 0.08;
        waterPulse.position.x = -0.9 + Math.sin(elapsed * 1.6) * 0.68;
        waterMaterial.opacity = 0.34 + Math.sin(elapsed * 2.4) * 0.1;

        renderer.render(scene, camera);
        frameId = requestAnimationFrame(render);
      };

      render();

      cleanupScene = () => {
        cancelAnimationFrame(frameId);
        resizeObserver.disconnect();

        if (renderer.domElement.parentElement === mount) {
          mount.removeChild(renderer.domElement);
        }

        scene.traverse((object) => {
          if (!object.isMesh) {
            return;
          }

          object.geometry?.dispose();

          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material?.dispose();
          }
        });

        gridMaterial.dispose();
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

export default ProjectSphere;
