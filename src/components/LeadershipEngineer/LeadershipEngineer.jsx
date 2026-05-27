import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const LeadershipEngineer = ({ className }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    let cleanupScene;
    let isMounted = true;

    if (!mount) return undefined;

    const initScene = () => {
      if (!isMounted || !mountRef.current) return;

      // ── Scene / Camera ─────────────────────────────────────────────────
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
      camera.position.set(0, 1.0, 5.6);
      camera.lookAt(0, 0.45, 0);

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      mount.appendChild(renderer.domElement);

      // ── Materials ───────────────────────────────────────────────────────
      const tableMat = new THREE.MeshStandardMaterial({
        color: 0x4b2e1f,
        roughness: 0.55,
        metalness: 0.15,
      });

      const darkMat = new THREE.MeshStandardMaterial({
        color: 0x161616,
        roughness: 0.7,
        metalness: 0.2,
      });

      const metalMat = new THREE.MeshStandardMaterial({
        color: 0xbec5cc,
        roughness: 0.2,
        metalness: 1,
      });

      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x6ea8ff,
        transmission: 0.9,
        transparent: true,
        opacity: 0.45,
        roughness: 0.05,
        metalness: 0.1,
        clearcoat: 1,
      });

      const screenMat = new THREE.MeshStandardMaterial({
        color: 0x1f4d88,
        emissive: 0x3b82f6,
        emissiveIntensity: 1.5,
      });

      const chairMat = new THREE.MeshStandardMaterial({
        color: 0x202020,
        roughness: 0.78,
        metalness: 0.12,
      });

      const accentMat = new THREE.MeshStandardMaterial({
        color: 0xf5c518,
        roughness: 0.32,
        metalness: 0.35,
      });

      const gridMat = new THREE.LineBasicMaterial({
        color: 0x9ca3af,
        transparent: true,
        opacity: 0.08,
      });

      // ── Model group ─────────────────────────────────────────────────────
      const model = new THREE.Group();
      scene.add(model);

      const boardroom = new THREE.Group();
      boardroom.position.y = -0.2;
      model.add(boardroom);

      // ── Rectangular conference table ───────────────────────────────────
      const table = new THREE.Mesh(
        new THREE.BoxGeometry(4.2, 0.14, 1.8),
        tableMat,
      );

      table.position.y = 0.35;
      table.castShadow = true;
      table.receiveShadow = true;
      boardroom.add(table);

      // Gold edge lines
      const edge1 = new THREE.Mesh(
        new THREE.BoxGeometry(4.25, 0.015, 0.03),
        accentMat,
      );
      edge1.position.set(0, 0.43, 0.9);
      boardroom.add(edge1);

      const edge2 = edge1.clone();
      edge2.position.z = -0.9;
      boardroom.add(edge2);

      const edge3 = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 0.015, 1.85),
        accentMat,
      );
      edge3.position.set(2.1, 0.43, 0);
      boardroom.add(edge3);

      const edge4 = edge3.clone();
      edge4.position.x = -2.1;
      boardroom.add(edge4);

      // ── Chairs ──────────────────────────────────────────────────────────
      const chairPositions = [
        [-2.6, 0, -0.8],
        [-1.3, 0, -0.8],
        [0, 0, -0.8],
        [1.3, 0, -0.8],
        [2.6, 0, -0.8],

        [-2.6, 0, 0.8],
        [-1.3, 0, 0.8],
        [0, 0, 0.8],
        [1.3, 0, 0.8],
        [2.6, 0, 0.8],
      ];

      chairPositions.forEach(([x, y, z]) => {
        const chair = new THREE.Group();

        const seat = new THREE.Mesh(
          new THREE.BoxGeometry(0.38, 0.08, 0.38),
          chairMat,
        );

        seat.position.y = 0.05;
        seat.castShadow = true;
        chair.add(seat);

        const back = new THREE.Mesh(
          new THREE.BoxGeometry(0.38, 0.5, 0.08),
          chairMat,
        );

        back.position.set(0, 0.32, z > 0 ? -0.15 : 0.15);
        back.castShadow = true;
        chair.add(back);

        const leg = new THREE.Mesh(
          new THREE.CylinderGeometry(0.03, 0.03, 0.34, 12),
          metalMat,
        );

        leg.position.y = -0.12;
        leg.castShadow = true;
        chair.add(leg);

        chair.position.set(x, y, z);

        if (z > 0) {
          chair.rotation.y = Math.PI;
        }

        boardroom.add(chair);
      });


      // ── Subtle monitor wall behind ──────────────────────────────────────
      const wallPanel = new THREE.Mesh(
        new THREE.BoxGeometry(2.2, 1.1, 0.06),
        darkMat,
      );
      wallPanel.position.set(0, 1.55, -1.45);
      wallPanel.castShadow = true;
      boardroom.add(wallPanel);

      // ── Company logo screen ────────────────────────────────────────────
const textureLoader = new THREE.TextureLoader();

const logoTexture = textureLoader.load('./assets/icons/logo1.png');

logoTexture.colorSpace = THREE.SRGBColorSpace;
logoTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

// Thin elegant frame
const screenFrame = new THREE.Mesh(
  new THREE.BoxGeometry(2.42, 1.12, 0.035),
  new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.4,
    metalness: 0.75,
  }),
);

screenFrame.position.set(0, 1.55, -1.43);

boardroom.add(screenFrame);

// Logo screen
const wallScreen = new THREE.Mesh(
  new THREE.PlaneGeometry(2.28, 1.0),
  new THREE.MeshStandardMaterial({
    map: logoTexture,

    emissive: 0xffffff,
    emissiveMap: logoTexture,
    emissiveIntensity: 0.22,

    roughness: 0.18,
    metalness: 0.05,
  }),
);

wallScreen.position.set(0, 1.55, -1.405);

boardroom.add(wallScreen);
      // ── Table papers / tablets ─────────────────────────────────────────
      for (let i = 0; i < 4; i++) {
        const paper = new THREE.Mesh(
          new THREE.BoxGeometry(0.32, 0.01, 0.22),
          new THREE.MeshStandardMaterial({
            color: 0xf2f0e8,
            roughness: 0.95,
            metalness: 0,
          }),
        );
        const angle = (i / 4) * Math.PI * 2 + 0.35;
        paper.position.set(Math.sin(angle) * 1.0, 0.49, Math.cos(angle) * 1.0);
        paper.rotation.y = -angle + Math.PI / 2;
        paper.rotation.z = 0.04;
        paper.castShadow = true;
        boardroom.add(paper);
      }

      // ── Lighting ───────────────────────────────────────────────────────
      scene.add(new THREE.HemisphereLight(0xffffff, 0x0a1628, 1.45));

      const key = new THREE.DirectionalLight(0xfff4dc, 6.0);
      key.position.set(-3, 5, 4);
      key.castShadow = true;
      key.shadow.mapSize.set(2048, 2048);
      key.shadow.camera.near = 0.5;
      key.shadow.camera.far = 15;
      key.shadow.camera.left = -3;
      key.shadow.camera.right = 3;
      key.shadow.camera.top = 3;
      key.shadow.camera.bottom = -3;
      key.shadow.bias = -0.001;
      scene.add(key);

      const fill = new THREE.DirectionalLight(0xc9ddff, 2.2);
      fill.position.set(4, 2, 2);
      scene.add(fill);

      const rim = new THREE.DirectionalLight(0x7aa6ff, 1.4);
      rim.position.set(0, 1.5, -4);
      scene.add(rim);

      const ground = new THREE.PointLight(0xf5c518, 1.6, 6);
      ground.position.set(0, -0.45, 1.4);
      scene.add(ground);

      // ── Ground shadow & grid ───────────────────────────────────────────
      const shadowPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(8, 8),
        new THREE.ShadowMaterial({ opacity: 0.35 }),
      );
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.y = -0.78;
      shadowPlane.receiveShadow = true;
      model.add(shadowPlane);

      const grid = new THREE.GridHelper(5, 16, 0x9ca3af, 0x1e293b);
      grid.position.y = -0.78;
      grid.material = gridMat;
      model.add(grid);

      // ── Resize ─────────────────────────────────────────────────────────
      let frameId = 0;
      let resizeFrameId = 0;
      const startTime = performance.now();

      const applyResize = () => {
        const s = mount.getBoundingClientRect();
        const w = Math.max(1, Math.floor(s.width));
        const h = Math.max(1, Math.floor(s.height));
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };

      const resize = () => {
        cancelAnimationFrame(resizeFrameId);
        resizeFrameId = requestAnimationFrame(applyResize);
      };

      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(mount);
      applyResize();

      // ── Animation ─────────────────────────────────────────────────────
      const render = () => {
        const t = (performance.now() - startTime) / 1000;

        boardroom.position.y = -0.2 + Math.sin(t * 1.1) * 0.03;
        model.rotation.y = Math.sin(t * 0.25) * 0.35;



        boardroom.rotation.z = Math.sin(t * 0.6) * 0.01;
        boardroom.rotation.x = Math.sin(t * 0.45) * 0.008;

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

        scene.traverse(o => {
          if (!o.isMesh && !o.isLine) return;
          o.geometry?.dispose();
          Array.isArray(o.material)
            ? o.material.forEach(m => m.dispose())
            : o.material?.dispose();
        });

        gridMat.dispose();
        renderer.dispose();
      };
    };

    initScene();

    return () => {
      isMounted = false;
      if (cleanupScene) cleanupScene();
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
};

export default LeadershipEngineer;