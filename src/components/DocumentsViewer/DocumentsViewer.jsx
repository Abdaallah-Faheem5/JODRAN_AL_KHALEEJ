import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const DocumentsViewer = ({ className }) => {
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
      camera.position.set(0.3, 0.55, 3.6);
      camera.lookAt(0, 0.05, 0);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      mount.appendChild(renderer.domElement);

      // ── Materials ───────────────────────────────────────────────────────
      const folderOrange = new THREE.MeshStandardMaterial({
        color: 0xe8750a,
        roughness: 0.55,
        metalness: 0.04,
      });
      const folderOrangeDark = new THREE.MeshStandardMaterial({
        color: 0xbf5c04,
        roughness: 0.6,
        metalness: 0.04,
      });
      const folderOrangeLight = new THREE.MeshStandardMaterial({
        color: 0xf58c22,
        roughness: 0.5,
        metalness: 0.03,
      });
      const paperWhite = new THREE.MeshStandardMaterial({
        color: 0xf5f5f0,
        roughness: 0.82,
        metalness: 0.0,
      });
      const paperCream = new THREE.MeshStandardMaterial({
        color: 0xeeebd8,
        roughness: 0.85,
        metalness: 0.0,
      });
      const paperBlue = new THREE.MeshStandardMaterial({
        color: 0xdce8f5,
        roughness: 0.82,
        metalness: 0.0,
      });
      const tabAccent = new THREE.MeshStandardMaterial({
        color: 0x12448b,
        roughness: 0.42,
        metalness: 0.1,
      });
      const brass = new THREE.MeshStandardMaterial({
        color: 0xc8952a,
        roughness: 0.14,
        metalness: 0.92,
      });
      const gridMat = new THREE.LineBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.12,
      });

      // ── Model group ─────────────────────────────────────────────────────
      const model = new THREE.Group();
      scene.add(model);

      const folder = new THREE.Group();
      folder.position.y = 0.02;
      folder.rotation.x = 0.18; // slight tilt toward viewer
      model.add(folder);

      // ═══════════════════════════════════════════════════════════════════
      // BACK COVER
      // ═══════════════════════════════════════════════════════════════════
      const backCover = new THREE.Mesh(
        new THREE.BoxGeometry(1.18, 0.9, 0.028),
        folderOrangeDark,
      );
      backCover.position.z = -0.06;
      backCover.castShadow = true;
      backCover.receiveShadow = true;
      folder.add(backCover);

      // Back cover texture lines
      for (let li = 0; li < 6; li++) {
        const ln = new THREE.Mesh(
          new THREE.BoxGeometry(1.14, 0.008, 0.03),
          folderOrange,
        );
        ln.position.set(0, -0.36 + li * 0.12, -0.046);
        folder.add(ln);
      }

      // ═══════════════════════════════════════════════════════════════════
      // DOCUMENT STACK (pages inside the folder)
      // ═══════════════════════════════════════════════════════════════════
      // Pages visible above the folder
      const pageMats = [paperWhite, paperCream, paperBlue, paperCream, paperWhite];
      pageMats.forEach((mat, i) => {
        const pageW = 1.05 - i * 0.01;
        const pageH = 0.88 - i * 0.005;
        const page = new THREE.Mesh(
          new THREE.BoxGeometry(pageW, pageH, 0.007),
          mat,
        );
        // Fan out slightly
        const angle = (i - 2) * 0.028;
        page.rotation.z = angle;
        page.position.set(
          Math.sin(angle) * 0.04,
          -0.005 + i * 0.01,
          -0.025 + i * 0.014,
        );
        page.castShadow = true;
        folder.add(page);

        // Ruled lines on each page
        if (i < 3) {
          for (let r = 0; r < 7; r++) {
            const rule = new THREE.Mesh(
              new THREE.BoxGeometry(pageW * 0.84, 0.006, 0.009),
              new THREE.MeshStandardMaterial({ color: 0xaac8e0, roughness: 0.9 }),
            );
            rule.rotation.z = angle;
            rule.position.set(
              Math.sin(angle) * 0.04,
              0.25 - r * 0.085,
              -0.02 + i * 0.014 + 0.005,
            );
            folder.add(rule);
          }

          // Header line on each page
          const header = new THREE.Mesh(
            new THREE.BoxGeometry(pageW * 0.7, 0.028, 0.01),
            new THREE.MeshStandardMaterial({ color: 0x12448b, roughness: 0.5, metalness: 0.08 }),
          );
          header.rotation.z = angle;
          header.position.set(
            Math.sin(angle) * 0.04 - pageW * 0.08,
            0.36,
            -0.015 + i * 0.014,
          );
          folder.add(header);
        }
      });

      // ═══════════════════════════════════════════════════════════════════
      // FRONT COVER
      // ═══════════════════════════════════════════════════════════════════
      const frontCover = new THREE.Mesh(
        new THREE.BoxGeometry(1.18, 0.9, 0.028),
        folderOrange,
      );
      frontCover.position.set(0, 0, 0.06);
      frontCover.castShadow = true;
      folder.add(frontCover);

      // Front cover — vertical rib lines (texture)
      for (let ri = -4; ri <= 4; ri++) {
        const rib = new THREE.Mesh(
          new THREE.BoxGeometry(0.008, 0.88, 0.03),
          folderOrangeLight,
        );
        rib.position.set(ri * 0.128, 0, 0.073);
        folder.add(rib);
      }

      // ── TAB (upper-left) ──────────────────────────────────────────────
      const tab = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.095, 0.03),
        tabAccent,
      );
      tab.position.set(-0.42, 0.497, 0.06);
      tab.castShadow = true;
      folder.add(tab);

      // Tab label highlight
      const tabLabel = new THREE.Mesh(
        new THREE.BoxGeometry(0.24, 0.052, 0.035),
        new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.7 }),
      );
      tabLabel.position.set(-0.42, 0.497, 0.077);
      folder.add(tabLabel);

      // ── LABEL WINDOW (front lower-centre) ─────────────────────────────
      const labelBox = new THREE.Mesh(
        new THREE.BoxGeometry(0.52, 0.18, 0.03),
        new THREE.MeshStandardMaterial({ color: 0xfff8f0, roughness: 0.75 }),
      );
      labelBox.position.set(0, -0.24, 0.075);
      folder.add(labelBox);

      // Label border
      const labelBorder = new THREE.Mesh(
        new THREE.BoxGeometry(0.54, 0.2, 0.025),
        folderOrangeDark,
      );
      labelBorder.position.set(0, -0.24, 0.073);
      folder.add(labelBorder);

      // Lines inside label
      for (let ll = 0; ll < 2; ll++) {
        const lline = new THREE.Mesh(
          new THREE.BoxGeometry(0.44, 0.01, 0.032),
          new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.9 }),
        );
        lline.position.set(0, -0.27 + ll * 0.06, 0.078);
        folder.add(lline);
      }

      // ── SPINE (left side) ─────────────────────────────────────────────
      const spine = new THREE.Mesh(
        new THREE.BoxGeometry(0.028, 0.9, 0.145),
        folderOrangeDark,
      );
      spine.position.set(-0.604, 0, 0);
      spine.castShadow = true;
      folder.add(spine);

      // Spine label
      const spineLabel = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 0.55, 0.06),
        new THREE.MeshStandardMaterial({ color: 0x12448b, roughness: 0.5 }),
      );
      spineLabel.position.set(-0.616, 0.05, 0.02);
      folder.add(spineLabel);

      // ── BRASS FASTENER PRONGS (centre, 2 holes) ────────────────────────
      [-0.1, 0.1].forEach(py => {
        const prong = new THREE.Mesh(
          new THREE.CylinderGeometry(0.025, 0.025, 0.04, 10),
          brass,
        );
        prong.rotation.x = Math.PI / 2;
        prong.position.set(0, py, 0.078);
        folder.add(prong);

        const prongHead = new THREE.Mesh(
          new THREE.CylinderGeometry(0.038, 0.038, 0.014, 10),
          brass,
        );
        prongHead.rotation.x = Math.PI / 2;
        prongHead.position.set(0, py, 0.093);
        folder.add(prongHead);
      });

      // Fastener bridge
      const bridge = new THREE.Mesh(
        new THREE.BoxGeometry(0.06, 0.22, 0.016),
        brass,
      );
      bridge.position.set(0, 0, 0.075);
      folder.add(bridge);

      // ── CORNER PROTECTORS (4 brass corners) ────────────────────────────
      [[-0.57, -0.43], [0.57, -0.43], [-0.57, 0.43], [0.57, 0.43]].forEach(([cx, cy]) => {
        const corner = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, 0.08, 0.04),
          brass,
        );
        corner.position.set(cx, cy, 0.074);
        folder.add(corner);
      });

      // ═══════════════════════════════════════════════════════════════════
      // DOCUMENT STICKING OUT (rear right, slightly raised)
      // ═══════════════════════════════════════════════════════════════════
      const stickOut = new THREE.Mesh(
        new THREE.BoxGeometry(0.26, 0.18, 0.012),
        paperWhite,
      );
      stickOut.position.set(0.38, 0.52, -0.04);
      stickOut.rotation.z = 0.08;
      stickOut.castShadow = true;
      folder.add(stickOut);

      // Ruled lines on sticking document
      for (let rl = 0; rl < 3; rl++) {
        const rl2 = new THREE.Mesh(
          new THREE.BoxGeometry(0.2, 0.007, 0.014),
          new THREE.MeshStandardMaterial({ color: 0xb0c8e0, roughness: 0.9 }),
        );
        rl2.position.set(0.38, 0.46 + rl * 0.04, -0.033);
        rl2.rotation.z = 0.08;
        folder.add(rl2);
      }

      // ── SHADOW & GRID ──────────────────────────────────────────────────
      const shadowPlane = new THREE.Mesh(
        new THREE.PlaneGeometry(6, 6),
        new THREE.ShadowMaterial({ opacity: 0.4 }),
      );
      shadowPlane.rotation.x = -Math.PI / 2;
      shadowPlane.position.y = -0.78;
      shadowPlane.receiveShadow = true;
      model.add(shadowPlane);

      const grid = new THREE.GridHelper(4.5, 14, 0x10b981, 0x0c2a54);
      grid.position.y = -0.78;
      grid.material = gridMat;
      model.add(grid);

      // ── LIGHTING ──────────────────────────────────────────────────────
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

      const rim = new THREE.DirectionalLight(0x44aaff, 1.4);
      rim.position.set(0, 1, -4);
      scene.add(rim);

      const glow = new THREE.PointLight(0x10b981, 2.4, 5);
      glow.position.set(-1, 0.3, 1.8);
      scene.add(glow);

      // ── Resize ────────────────────────────────────────────────────────
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

      // ── Animation ─────────────────────────────────────────────────────
      const render = () => {
        const t = (performance.now() - startTime) / 1000;

        folder.position.y = 0.02 + Math.sin(t * 1.25) * 0.038;
        model.rotation.y = Math.sin(t * 0.3) * 0.62;
        folder.rotation.z = Math.sin(t * 0.65) * 0.022;
        folder.rotation.x = 0.18 + Math.sin(t * 0.5) * 0.018;

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

export default DocumentsViewer;
