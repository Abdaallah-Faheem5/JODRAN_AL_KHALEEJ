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
      camera.position.set(0, 0.55, 3.8);
      camera.lookAt(0, 0.15, 0);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;
      mount.appendChild(renderer.domElement);

      // ── Materials ───────────────────────────────────────────────────────
      const helmetYellow = new THREE.MeshStandardMaterial({
        color: 0xf5c518,
        roughness: 0.16,
        metalness: 0.14,
      });
      const helmetUnder = new THREE.MeshStandardMaterial({
        color: 0xd4a810,
        roughness: 0.24,
        metalness: 0.1,
      });
      const brimMat = new THREE.MeshStandardMaterial({
        color: 0xe0ad10,
        roughness: 0.2,
        metalness: 0.12,
      });
      const suspensionMat = new THREE.MeshStandardMaterial({
        color: 0x1a1a1a,
        roughness: 0.7,
        metalness: 0.1,
      });
      const strapMat = new THREE.MeshStandardMaterial({
        color: 0x2a1a0a,
        roughness: 0.82,
        metalness: 0.0,
      });
      const logoMat = new THREE.MeshStandardMaterial({
        color: 0xff6600,
        roughness: 0.38,
        metalness: 0.05,
        emissive: 0x441100,
        emissiveIntensity: 0.4,
      });
      const reflectiveMat = new THREE.MeshStandardMaterial({
        color: 0xe8e8e8,
        roughness: 0.08,
        metalness: 0.96,
        emissive: 0x333333,
        emissiveIntensity: 0.3,
      });
      const gridMat = new THREE.LineBasicMaterial({
        color: 0xf5c518,
        transparent: true,
        opacity: 0.12,
      });

      // ── Model group ─────────────────────────────────────────────────────
      const model = new THREE.Group();
      scene.add(model);

      const hat = new THREE.Group();
      hat.position.y = 0.08;
      model.add(hat);

      // ── DOME — layered shells for thickness ─────────────────────────────
      // Outer dome shell (full upper hemisphere)
      const outerDome = new THREE.Mesh(
        new THREE.SphereGeometry(0.72, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.52),
        helmetYellow,
      );
      outerDome.castShadow = true;
      hat.add(outerDome);

      // Slight crown flat-top bulge (characteristic of hard hats)
      const crownBulge = new THREE.Mesh(
        new THREE.SphereGeometry(0.68, 32, 20, 0, Math.PI * 2, 0, Math.PI * 0.22),
        helmetYellow,
      );
      crownBulge.position.y = 0.52;
      crownBulge.scale.set(1, 0.32, 1);
      hat.add(crownBulge);

      // Inner shell (slightly smaller, darker — visible at brim edge)
      const innerDome = new THREE.Mesh(
        new THREE.SphereGeometry(0.67, 40, 28, 0, Math.PI * 2, 0, Math.PI * 0.52),
        helmetUnder,
      );
      innerDome.receiveShadow = true;
      hat.add(innerDome);

      // ── BRIM ─────────────────────────────────────────────────────────────
      // Full wrap-around brim (flat torus-cap shape)
      const brimOuter = new THREE.Mesh(
        new THREE.CylinderGeometry(0.86, 0.82, 0.06, 48),
        brimMat,
      );
      brimOuter.position.y = -0.12;
      brimOuter.castShadow = true;
      hat.add(brimOuter);

      // Brim underside
      const brimUnder = new THREE.Mesh(
        new THREE.CylinderGeometry(0.82, 0.78, 0.03, 48),
        helmetUnder,
      );
      brimUnder.position.y = -0.155;
      hat.add(brimUnder);

      // Front peak extension (longer than rear)
      const frontPeak = new THREE.Mesh(
        new THREE.BoxGeometry(0.48, 0.045, 0.22),
        brimMat,
      );
      frontPeak.position.set(0, -0.12, 0.9);
      frontPeak.rotation.x = 0.12;
      frontPeak.castShadow = true;
      hat.add(frontPeak);

      // Peak underside
      const frontPeakUnder = new THREE.Mesh(
        new THREE.BoxGeometry(0.46, 0.025, 0.2),
        helmetUnder,
      );
      frontPeakUnder.position.set(0, -0.148, 0.9);
      frontPeakUnder.rotation.x = 0.12;
      hat.add(frontPeakUnder);

      // ── SUSPENSION RIDGE ─────────────────────────────────────────────────
      const ridge = new THREE.Mesh(
        new THREE.TorusGeometry(0.7, 0.028, 10, 52),
        reflectiveMat,
      );
      ridge.rotation.x = Math.PI / 2;
      ridge.position.y = -0.06;
      hat.add(ridge);

      // ── VENTILATION SLOTS ─────────────────────────────────────────────────
      // Two vent slots on each side (4 total)
      const ventSlots = [
        { x: 0.58, z: 0.28, ry: -0.42 },
        { x: 0.58, z: -0.28, ry: -0.22 },
        { x: -0.58, z: 0.28, ry: 0.42 },
        { x: -0.58, z: -0.28, ry: 0.22 },
      ];
      ventSlots.forEach(({ x, z, ry }) => {
        const slot = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, 0.028, 0.13),
          new THREE.MeshStandardMaterial({ color: 0xb89000, roughness: 0.4 }),
        );
        slot.position.set(x, 0.28, z);
        slot.rotation.y = ry;
        hat.add(slot);
      });

      // ── LOGO / BADGE (front face) ─────────────────────────────────────────
      const logoPlate = new THREE.Mesh(
        new THREE.BoxGeometry(0.22, 0.12, 0.015),
        logoMat,
      );
      logoPlate.position.set(0, 0.1, 0.72);
      logoPlate.rotation.x = -0.35;
      hat.add(logoPlate);

      // Logo border (silver)
      const logoBorder = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.14, 0.01),
        reflectiveMat,
      );
      logoBorder.position.set(0, 0.1, 0.714);
      logoBorder.rotation.x = -0.35;
      hat.add(logoBorder);

      // ── HEADBAND / SUSPENSION INTERIOR ─────────────────────────────────
      // Internal headband ring (visible from below)
      const headband = new THREE.Mesh(
        new THREE.TorusGeometry(0.5, 0.04, 10, 40),
        suspensionMat,
      );
      headband.rotation.x = Math.PI / 2;
      headband.position.y = -0.05;
      hat.add(headband);

      // 6-point suspension webbing
      for (let i = 0; i < 6; i++) {
        const angle = (i / 6) * Math.PI * 2;
        const web = new THREE.Mesh(
          new THREE.BoxGeometry(0.014, 0.28, 0.014),
          suspensionMat,
        );
        web.position.set(Math.sin(angle) * 0.38, 0.06, Math.cos(angle) * 0.38);
        web.rotation.z = -angle + Math.PI / 2;
        web.rotation.y = angle;
        // tilt toward center
        const dir = new THREE.Vector3(-Math.sin(angle), 0.7, -Math.cos(angle)).normalize();
        web.lookAt(dir);
        hat.add(web);
      }

      // Sweatband (chin-area padded strip)
      const sweatband = new THREE.Mesh(
        new THREE.TorusGeometry(0.5, 0.06, 8, 40, Math.PI * 1.6),
        new THREE.MeshStandardMaterial({ color: 0x2a1505, roughness: 0.88 }),
      );
      sweatband.rotation.x = Math.PI / 2;
      sweatband.rotation.z = Math.PI * 0.2;
      sweatband.position.y = -0.08;
      sweatband.scale.set(1, 0.5, 1);
      hat.add(sweatband);

      // ── CHIN STRAP ───────────────────────────────────────────────────────
      // Chin strap D-rings on each side
      [-0.65, 0.65].forEach(sx => {
        const dRing = new THREE.Mesh(
          new THREE.TorusGeometry(0.055, 0.012, 8, 20),
          reflectiveMat,
        );
        dRing.position.set(sx, -0.18, 0.3);
        dRing.rotation.y = sx > 0 ? -Math.PI / 3 : Math.PI / 3;
        hat.add(dRing);

        const strap = new THREE.Mesh(
          new THREE.BoxGeometry(0.03, 0.012, 0.38),
          strapMat,
        );
        strap.position.set(sx * 0.72, -0.22, 0.12);
        strap.rotation.y = sx > 0 ? 0.3 : -0.3;
        hat.add(strap);
      });

      // ── REFLECTIVE STRIPS ────────────────────────────────────────────────
      // Front & back reflective sticker strips
      [{ z: 0.68, ry: 0 }, { z: -0.68, ry: Math.PI }].forEach(({ z, ry }) => {
        const strip = new THREE.Mesh(
          new THREE.BoxGeometry(0.44, 0.032, 0.016),
          reflectiveMat,
        );
        strip.position.set(0, -0.0, z);
        strip.rotation.y = ry;
        strip.rotation.x = ry === 0 ? -0.28 : 0.28;
        hat.add(strip);
      });

      // ── GROUND SHADOW & GRID ──────────────────────────────────────────────
      const shadowPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(6, 6),
        new THREE.ShadowMaterial({ opacity: 0.4 }),
      );
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.y = -0.72;
      shadowPlane.receiveShadow = true;
      model.add(shadowPlane);

      const grid = new THREE.GridHelper(4.5, 14, 0xf5c518, 0x1e293b);
      grid.position.y = -0.72;
      grid.material = gridMat;
      model.add(grid);

      // ── LIGHTING ──────────────────────────────────────────────────────────
      scene.add(new THREE.HemisphereLight(0xfff8e0, 0x0a1628, 1.6));

      const key = new THREE.DirectionalLight(0xfff8e0, 6.5);
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

      // Right fill (warm)
      const fill = new THREE.DirectionalLight(0xffd080, 2.5);
      fill.position.set(4, 2, 2);
      scene.add(fill);

      // Rim / back (cool blue)
      const rim = new THREE.DirectionalLight(0x88aaff, 1.8);
      rim.position.set(0, 1.5, -4);
      scene.add(rim);

      // Under bounce (warm ground)
      const ground = new THREE.PointLight(0xf5c518, 2.2, 5);
      ground.position.set(0, -0.5, 1.5);
      scene.add(ground);

      // ── Resize ────────────────────────────────────────────────────────────
      let frameId = 0, resizeFrameId = 0;
      const startTime = performance.now();

      const applyResize = () => {
        const s = mount.getBoundingClientRect();
        const w = Math.max(1, Math.floor(s.width));
        const h = Math.max(1, Math.floor(s.height));
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      const resize = () => { cancelAnimationFrame(resizeFrameId); resizeFrameId = requestAnimationFrame(applyResize); };
      const resizeObserver = new ResizeObserver(resize);
      resizeObserver.observe(mount);
      applyResize();

      // ── Animation ─────────────────────────────────────────────────────────
      const render = () => {
        const t = (performance.now() - startTime) / 1000;

        // Gentle float
        hat.position.y = 0.08 + Math.sin(t * 1.3) * 0.04;

        // Very slow proud showcase rotation
        model.rotation.y = Math.sin(t * 0.3) * 0.65;

        // Subtle tilt (breathing feel)
        hat.rotation.z = Math.sin(t * 0.8) * 0.03;
        hat.rotation.x = Math.sin(t * 0.6) * 0.025;

        renderer.render(scene, camera);
        frameId = requestAnimationFrame(render);
      };
      render();

      cleanupScene = () => {
        cancelAnimationFrame(frameId);
        cancelAnimationFrame(resizeFrameId);
        resizeObserver.disconnect();
        if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
        scene.traverse(o => {
          if (!o.isMesh && !o.isLine) return;
          o.geometry?.dispose();
          Array.isArray(o.material) ? o.material.forEach(m => m.dispose()) : o.material?.dispose();
        });
        gridMat.dispose();
        renderer.dispose();
      };
    };

    initScene();
    return () => { isMounted = false; if (cleanupScene) cleanupScene(); };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
};

export default LeadershipEngineer;
