import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ClientPerson = ({ className }) => {
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
      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
      camera.position.set(0, 0.4, 3.6);
      camera.lookAt(0, 0.0, 0);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      mount.appendChild(renderer.domElement);

      // ── Materials ───────────────────────────────────────────────────────
      const leatherMain = new THREE.MeshStandardMaterial({
        color: 0x2b1a0e,  // dark espresso leather
        roughness: 0.72,
        metalness: 0.06,
      });
      const leatherAccent = new THREE.MeshStandardMaterial({
        color: 0x1a0f07,  // near-black leather trim
        roughness: 0.78,
        metalness: 0.04,
      });
      const leatherLight = new THREE.MeshStandardMaterial({
        color: 0x3d2510,  // slightly lighter for flap & side panels
        roughness: 0.68,
        metalness: 0.05,
      });
      const brass = new THREE.MeshStandardMaterial({
        color: 0xc8952a,
        roughness: 0.14,
        metalness: 0.92,
      });
      const chrome = new THREE.MeshStandardMaterial({
        color: 0xdde4ea,
        roughness: 0.06,
        metalness: 0.97,
      });
      const stitchMat = new THREE.MeshStandardMaterial({
        color: 0xc8a86a,
        roughness: 0.82,
        metalness: 0.0,
      });
      const lockBody = new THREE.MeshStandardMaterial({
        color: 0xb8841e,
        roughness: 0.18,
        metalness: 0.88,
      });
      const gridMat = new THREE.LineBasicMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.12,
      });

      // ── Model group ─────────────────────────────────────────────────────
      const model = new THREE.Group();
      scene.add(model);

      const bag = new THREE.Group();
      bag.position.y = 0.02;
      model.add(bag);

      // ── MAIN BODY ────────────────────────────────────────────────────────
      // Bottom base (slightly wider / trapezoidal profile)
      const bodyMain = new THREE.Mesh(
        new THREE.BoxGeometry(1.12, 0.72, 0.42),
        leatherMain,
      );
      bodyMain.castShadow = true;
      bodyMain.receiveShadow = true;
      bag.add(bodyMain);

      // Body corner rounding — overlay thin panels on each face
      // Front face
      const frontPanel = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.7, 0.02),
        leatherLight,
      );
      frontPanel.position.z = 0.22;
      bag.add(frontPanel);

      // Back face
      const backPanel = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.7, 0.02),
        leatherAccent,
      );
      backPanel.position.z = -0.22;
      bag.add(backPanel);

      // ── GUSSET / SIDES ────────────────────────────────────────────────────
      [-0.57, 0.57].forEach(sx => {
        // Side gusset panel (visible leather seam)
        const gusset = new THREE.Mesh(
          new THREE.BoxGeometry(0.02, 0.7, 0.4),
          leatherAccent,
        );
        gusset.position.x = sx;
        gusset.castShadow = true;
        bag.add(gusset);

        // Corner piping
        const pipe = new THREE.Mesh(
          new THREE.CylinderGeometry(0.025, 0.025, 0.72, 10),
          leatherAccent,
        );
        pipe.position.set(sx, 0, 0);
        pipe.castShadow = true;
        bag.add(pipe);
      });

      // Bottom piping
      const bottomPipe = new THREE.Mesh(
        new THREE.BoxGeometry(1.14, 0.04, 0.44),
        leatherAccent,
      );
      bottomPipe.position.y = -0.37;
      bag.add(bottomPipe);

      // ── PROTECTIVE FEET (4 brass studs bottom) ───────────────────────────
      [[-0.44, -0.44], [0.44, -0.44], [-0.44, 0.44], [0.44, 0.44]].forEach(([fx, fz]) => {
        const foot = new THREE.Mesh(
          new THREE.CylinderGeometry(0.04, 0.04, 0.045, 10),
          brass,
        );
        foot.rotation.x = Math.PI / 2;
        foot.position.set(fx, -0.385, fz);
        foot.castShadow = true;
        bag.add(foot);
      });

      // ── TOP FLAP ──────────────────────────────────────────────────────────
      const flapGroup = new THREE.Group();
      flapGroup.position.set(0, 0.36, 0);
      bag.add(flapGroup);

      // Flap main surface
      const flap = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.14, 0.44),
        leatherLight,
      );
      flap.position.y = 0.06;
      flap.castShadow = true;
      flapGroup.add(flap);

      // Flap front lip (droops slightly)
      const flapLip = new THREE.Mesh(
        new THREE.BoxGeometry(1.08, 0.08, 0.03),
        leatherLight,
      );
      flapLip.position.set(0, 0.02, 0.235);
      flapGroup.add(flapLip);

      // ── HANDLE ────────────────────────────────────────────────────────────
      const handleGroup = new THREE.Group();
      handleGroup.position.set(0, 0.46, 0);
      bag.add(handleGroup);

      // Handle bar (curved — approximated with a tube-like box + end cylinders)
      const handleBar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.038, 0.038, 0.5, 14),
        leatherAccent,
      );
      handleBar.rotation.z = Math.PI / 2;
      handleBar.castShadow = true;
      handleGroup.add(handleBar);

      // Leather wrapping highlight
      const handleWrap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.036, 0.036, 0.48, 14),
        leatherMain,
      );
      handleWrap.rotation.z = Math.PI / 2;
      handleGroup.add(handleWrap);

      // Handle attachment loops (D-rings)
      [-0.26, 0.26].forEach(hx => {
        // Loop strap
        const loop = new THREE.Mesh(
          new THREE.BoxGeometry(0.055, 0.14, 0.045),
          leatherAccent,
        );
        loop.position.set(hx, -0.08, 0);
        handleGroup.add(loop);

        // D-ring hardware
        const dRing = new THREE.Mesh(
          new THREE.TorusGeometry(0.042, 0.012, 8, 18),
          brass,
        );
        dRing.position.set(hx, -0.06, 0);
        handleGroup.add(dRing);

        // Strap rivet
        const rivet = new THREE.Mesh(
          new THREE.CylinderGeometry(0.016, 0.016, 0.05, 8),
          brass,
        );
        rivet.rotation.x = Math.PI / 2;
        rivet.position.set(hx, -0.1, 0.025);
        handleGroup.add(rivet);
      });

      // ── COMBINATION LOCK / CLASP (centre) ──────────────────────────────
      const claspGroup = new THREE.Group();
      claspGroup.position.set(0, 0.08, 0.23);
      bag.add(claspGroup);

      // Lock housing
      const lockHousing = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.1, 0.04),
        lockBody,
      );
      lockHousing.castShadow = true;
      claspGroup.add(lockHousing);

      // Lock shackle
      const shackle = new THREE.Mesh(
        new THREE.TorusGeometry(0.055, 0.014, 10, 20, Math.PI),
        chrome,
      );
      shackle.position.y = 0.065;
      shackle.rotation.x = Math.PI;
      claspGroup.add(shackle);

      // 3 digit wheels
      for (let di = 0; di < 3; di++) {
        const wheel = new THREE.Mesh(
          new THREE.CylinderGeometry(0.022, 0.022, 0.045, 12),
          chrome,
        );
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(-0.06 + di * 0.06, -0.015, 0.022);
        claspGroup.add(wheel);
      }

      // ── SIDE BUCKLES (decorative) ─────────────────────────────────────────
      [-0.48, 0.48].forEach(bx => {
        const buckleFrame = new THREE.Mesh(
          new THREE.BoxGeometry(0.07, 0.1, 0.03),
          brass,
        );
        buckleFrame.position.set(bx, 0.0, 0.225);
        bag.add(buckleFrame);

        // Buckle bar
        const buckleBar = new THREE.Mesh(
          new THREE.BoxGeometry(0.065, 0.018, 0.035),
          brass,
        );
        buckleBar.position.set(bx, 0.0, 0.232);
        bag.add(buckleBar);

        // Strap through buckle
        const strap = new THREE.Mesh(
          new THREE.BoxGeometry(0.04, 0.16, 0.016),
          leatherAccent,
        );
        strap.position.set(bx, -0.04, 0.228);
        bag.add(strap);
      });

      // ── STITCHING DETAILS (small dots along seams) ────────────────────────
      for (let si = -4; si <= 4; si++) {
        const stitch = new THREE.Mesh(
          new THREE.BoxGeometry(0.012, 0.012, 0.018),
          stitchMat,
        );
        stitch.position.set(si * 0.12, -0.34, 0.222);
        bag.add(stitch);

        const stitchB = new THREE.Mesh(
          new THREE.BoxGeometry(0.012, 0.012, 0.018),
          stitchMat,
        );
        stitchB.position.set(si * 0.12, 0.34, 0.222);
        bag.add(stitchB);
      }

      // ── LOGO EMBOSS (front centre) ─────────────────────────────────────────
      const logoPlate = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 0.08, 0.015),
        brass,
      );
      logoPlate.position.set(0, -0.12, 0.232);
      bag.add(logoPlate);

      // ── GROUND / GRID ──────────────────────────────────────────────────────
      const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(6, 6),
        new THREE.ShadowMaterial({ opacity: 0.42 }),
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = -0.72;
      shadow.receiveShadow = true;
      model.add(shadow);

      const grid = new THREE.GridHelper(4.5, 14, 0x38bdf8, 0x0c2a54);
      grid.position.y = -0.72;
      grid.material = gridMat;
      model.add(grid);

      // ── LIGHTING ──────────────────────────────────────────────────────────
      scene.add(new THREE.HemisphereLight(0xfff4e8, 0x0a1628, 1.5));

      const key = new THREE.DirectionalLight(0xfff8f0, 6.0);
      key.position.set(-3, 5, 4);
      key.castShadow = true;
      key.shadow.mapSize.set(2048, 2048);
      key.shadow.camera.left = -3; key.shadow.camera.right = 3;
      key.shadow.camera.top = 3; key.shadow.camera.bottom = -3;
      key.shadow.bias = -0.001;
      scene.add(key);

      const fill = new THREE.DirectionalLight(0xb0c8ff, 2.0);
      fill.position.set(4, 2, 2);
      scene.add(fill);

      const rim = new THREE.DirectionalLight(0x66aaff, 1.4);
      rim.position.set(0, 1, -4);
      scene.add(rim);

      const ground = new THREE.PointLight(0xf47b20, 2.2, 5);
      ground.position.set(0.5, -0.4, 1.5);
      scene.add(ground);

      // ── Resize & Animation ────────────────────────────────────────────────
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
      const ro = new ResizeObserver(resize);
      ro.observe(mount);
      applyResize();

      const render = () => {
        const t = (performance.now() - startTime) / 1000;

        // Float up/down
        bag.position.y = 0.02 + Math.sin(t * 1.2) * 0.035;
        // Slow showcase rotation
        model.rotation.y = Math.sin(t * 0.28) * 0.65;
        // Subtle sway
        bag.rotation.z = Math.sin(t * 0.7) * 0.022;
        bag.rotation.x = Math.sin(t * 0.5) * 0.018;

        renderer.render(scene, camera);
        frameId = requestAnimationFrame(render);
      };
      render();

      cleanupScene = () => {
        cancelAnimationFrame(frameId);
        cancelAnimationFrame(resizeFrameId);
        ro.disconnect();
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

export default ClientPerson;
