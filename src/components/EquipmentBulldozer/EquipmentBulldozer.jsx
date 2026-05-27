import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const EquipmentBulldozer = ({ className }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    let cleanupScene;
    let isMounted = true;

    if (!mount) return undefined;

    const initScene = () => {
      if (!isMounted || !mountRef.current) return;

      // ── Scene & Camera ────────────────────────────────────────────────────
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
      camera.position.set(4.1, 2.8, 5.2);
      camera.lookAt(0, 0.4, 0);

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      mount.appendChild(renderer.domElement);

      // ── Materials ─────────────────────────────────────────────────────────
      const catYellow = new THREE.MeshStandardMaterial({ color: 0xf5a623, roughness: 0.38, metalness: 0.28 });
      catYellow.onBeforeCompile = (shader) => {
        shader.fragmentShader = shader.fragmentShader.replace(
          '#include <dithering_fragment>',
          `
      float dirt = sin(vViewPosition.x * 8.0) * 0.03;
      gl_FragColor.rgb -= dirt;
      #include <dithering_fragment>
    `
        );
      };
      const catYellowDark = new THREE.MeshStandardMaterial({ color: 0xd4891a, roughness: 0.42, metalness: 0.32 });
      const darkSteel = new THREE.MeshStandardMaterial({
        color: 0x2b2b2b,
        roughness: 0.58,
        metalness: 0.72,
      });
      const rubber = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.88, metalness: 0.04 });
      const chrome = new THREE.MeshStandardMaterial({ color: 0xdde8ee, roughness: 0.08, metalness: 0.97 });
      const exhaustMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.55, metalness: 0.7 });
      const glassMat = new THREE.MeshPhysicalMaterial({
        color: 0x7fa6bf,
        roughness: 0.22,
        metalness: 0,
        transparent: true,
        opacity: 0.45,
        transmission: 0.35,
        ior: 1.45,
        thickness: 0.12,
      });
      const seatMat = new THREE.MeshStandardMaterial({ color: 0x1a1a2e, roughness: 0.75, metalness: 0.05 });
      const grilleMat = new THREE.MeshStandardMaterial({ color: 0x0d0d0d, roughness: 0.6, metalness: 0.5 });
      const lightLens = new THREE.MeshStandardMaterial({ color: 0xfffde7, emissive: 0xffe880, emissiveIntensity: 3.5, roughness: 0.05 });
      const redLight = new THREE.MeshStandardMaterial({ color: 0xff2200, emissive: 0xff1100, emissiveIntensity: 2.8, roughness: 0.08 });
      const trackLink = new THREE.MeshStandardMaterial({ color: 0x2a2a2a, roughness: 0.35, metalness: 0.78 });
      const bladeWear = new THREE.MeshStandardMaterial({ color: 0x232323, roughness: 0.48, metalness: 0.82 });

      // ── Root group ────────────────────────────────────────────────────────
      const model = new THREE.Group();
      model.rotation.set(0.08, -0.5, 0);
      scene.add(model);

      const dozer = new THREE.Group();
      dozer.position.y = -0.1;
      model.add(dozer);

      // ═══════════════════════════════════════════════════════════════════
      // TRACKS — rubber track pads + steel track frame + road wheels
      // ═══════════════════════════════════════════════════════════════════
      const buildTrack = (side) => {
        const x = side * 0.72;
        const trackGroup = new THREE.Group();
        dozer.add(trackGroup);

        // Outer track frame (slightly wider, darker steel)
        const frame = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.32, 1.85), darkSteel);
        frame.position.set(x, 0.16, 0);
        frame.castShadow = true;
        frame.receiveShadow = true;
        trackGroup.add(frame);

        // Inner rubber lining
        const inner = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.28, 1.82), rubber);
        inner.position.set(x, 0.16, 0);
        inner.receiveShadow = true;
        trackGroup.add(inner);

        // Sprocket (rear drive wheel)
        const sprocket = new THREE.Mesh(new THREE.CylinderGeometry(0.155, 0.155, 0.24, 14), darkSteel);
        sprocket.rotation.z = Math.PI / 2;
        sprocket.position.set(x, 0.155, -0.82);
        sprocket.castShadow = true;
        trackGroup.add(sprocket);

        // Idler (front wheel)
        const idler = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.22, 12), darkSteel);
        idler.rotation.z = Math.PI / 2;
        idler.position.set(x, 0.155, 0.82);
        idler.castShadow = true;
        trackGroup.add(idler);

        // Road wheels (5 evenly spaced)
        for (let i = 0; i < 5; i++) {
          const z = -0.6 + i * 0.3;
          const roadWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.2, 12), rubber);
          roadWheel.rotation.z = Math.PI / 2;
          roadWheel.position.set(x, 0.045, z);
          roadWheel.castShadow = true;
          trackGroup.add(roadWheel);

          // Wheel hub
          const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.22, 8), chrome);
          hub.rotation.z = Math.PI / 2;
          hub.position.set(x, 0.045, z);
          trackGroup.add(hub);
        }

        // Carrier roller (top, 2 pieces)
        for (let ci = 0; ci < 2; ci++) {
          const cz = -0.35 + ci * 0.7;
          const carrier = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 0.18, 10), darkSteel);
          carrier.rotation.z = Math.PI / 2;
          carrier.position.set(x, 0.32, cz);
          carrier.castShadow = true;
          trackGroup.add(carrier);
        }

        // Track pads (grouser bars) — top and bottom rows
        for (let z = -0.88; z <= 0.88; z += 0.1) {
          // Top
          const padT = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.025, 0.07), trackLink);
          padT.position.set(x, 0.325, z);
          padT.castShadow = true;
          trackGroup.add(padT);

          // Bottom
          const padB = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.025, 0.07), trackLink);
          padB.position.set(x, 0.0, z);
          padB.receiveShadow = true;
          trackGroup.add(padB);
        }

        // Grouser teeth on bottom pads
        for (let z = -0.88; z <= 0.88; z += 0.1) {
          const tooth = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, 0.02), darkSteel);
          tooth.position.set(x, -0.02, z);
          trackGroup.add(tooth);
        }
      };

      buildTrack(-1);
      buildTrack(1);

      // ═══════════════════════════════════════════════════════════════════
      // MAIN CHASSIS & HULL
      // ═══════════════════════════════════════════════════════════════════
      // Lower hull — sits on top of tracks
      const lowerHull = new THREE.Mesh(new THREE.BoxGeometry(1.18, 0.18, 1.6), catYellow);
      lowerHull.position.set(0, 0.38, 0);
      lowerHull.castShadow = true;
      lowerHull.receiveShadow = true;
      dozer.add(lowerHull);

      // Track guard / fenders
      [-0.62, 0.62].forEach(x => {
        const fender = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 1.6), catYellowDark);
        fender.position.set(x, 0.38, 0);
        fender.castShadow = true;
        dozer.add(fender);
      });

      // Upper engine deck
      const engineDeck = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.42, 0.85), catYellow);
      engineDeck.position.set(0, 0.68, 0.3);
      engineDeck.castShadow = true;
      engineDeck.receiveShadow = true;
      dozer.add(engineDeck);

      // Engine deck cover ridge
      const deckRidge = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.05, 0.82), catYellowDark);
      deckRidge.position.set(0, 0.9, 0.3);
      deckRidge.castShadow = true;
      dozer.add(deckRidge);

      // ── Radiator grille (front of engine) ────────────────────────────────
      const grilleBase = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.36, 0.04), grilleMat);
      grilleBase.position.set(0, 0.68, 0.73);
      grilleBase.castShadow = true;
      dozer.add(grilleBase);

      // Grille louvres
      for (let i = 0; i < 8; i++) {
        const ly = 0.52 + i * 0.046;
        const louvre = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.018, 0.05), chrome);
        louvre.position.set(0, ly, 0.75);
        louvre.rotation.x = 0.25;
        dozer.add(louvre);
      }

      // Grille surround frame
      const grilleSurround = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.42, 0.05), catYellowDark);
      grilleSurround.position.set(0, 0.68, 0.72);
      dozer.add(grilleSurround);
      const grilleHole = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.32, 0.06), grilleMat);
      grilleHole.position.set(0, 0.68, 0.73);
      dozer.add(grilleHole);

      // ── Headlights ────────────────────────────────────────────────────────
      [[-0.32, 0.82], [0.32, 0.82]].forEach(([hx, hz]) => {
        const housing = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.06), darkSteel);
        housing.position.set(hx, 0.82, hz);
        dozer.add(housing);

        const lens = new THREE.Mesh(new THREE.CircleGeometry(0.045, 16), lightLens);
        lens.position.set(hx, 0.82, hz + 0.035);
        dozer.add(lens);

        // Light ring
        const ring = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.052, 0.012, 16), chrome);
        ring.rotation.x = Math.PI / 2;
        ring.position.set(hx, 0.82, hz + 0.028);
        dozer.add(ring);
      });

      

      // ── Exhaust Stack ─────────────────────────────────────────────────────
      const exhaustBase = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.046, 0.12, 10), darkSteel);
      exhaustBase.position.set(0.28, 0.93, 0.22);
      dozer.add(exhaustBase);

      const exhaustPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.038, 0.55, 10), exhaustMat);
      exhaustPipe.position.set(0.28, 1.24, 0.22);
      exhaustPipe.castShadow = true;
      dozer.add(exhaustPipe);

      // Chrome stack tip
      const stackTip = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.025, 0.06, 10), chrome);
      stackTip.position.set(0.28, 1.52, 0.22);
      dozer.add(stackTip);

      // Rain cap
      const rainCap = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.06, 10), darkSteel);
      rainCap.position.set(0.28, 1.56, 0.22);
      rainCap.rotation.z = Math.PI;
      dozer.add(rainCap);

      // ── Air filter housing ────────────────────────────────────────────────
      const airFilter = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.05, 0.18, 10), darkSteel);
      airFilter.position.set(-0.28, 0.98, 0.26);
      dozer.add(airFilter);
      const airFilterTop = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.045, 0.04, 10), catYellow);
      airFilterTop.position.set(-0.28, 1.08, 0.26);
      dozer.add(airFilterTop);

      // ═══════════════════════════════════════════════════════════════════
      // OPERATOR CABIN
      // ═══════════════════════════════════════════════════════════════════
      const cabinGroup = new THREE.Group();
      cabinGroup.position.set(0, 0, -0.22);
      dozer.add(cabinGroup);

      // Cabin floor plate
      const cabinFloor = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.06, 0.72), catYellowDark);
      cabinFloor.position.set(0, 0.5, 0);
      cabinGroup.add(cabinFloor);

      // Cabin walls (glass panels) — front, rear, sides
      const panelFront = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.58, 0.04), glassMat);
      panelFront.position.set(0, 0.82, 0.36);
      panelFront.castShadow = true;
      cabinGroup.add(panelFront);

      const panelRear = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.52, 0.04), glassMat);
      panelRear.position.set(0, 0.82, -0.36);
      cabinGroup.add(panelRear);

      const panelLeft = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.58, 0.72), glassMat);
      panelLeft.position.set(-0.41, 0.82, 0);
      cabinGroup.add(panelLeft);

      const panelRight = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.58, 0.72), glassMat);
      panelRight.position.set(0.41, 0.82, 0);
      cabinGroup.add(panelRight);

      // Roof
      const roof = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.055, 0.78), catYellow);
      roof.position.set(0, 1.115, 0);
      roof.castShadow = true;
      cabinGroup.add(roof);

      // Roof lip overhang
      const roofLip = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.028, 0.82), catYellowDark);
      roofLip.position.set(0, 1.09, 0);
      cabinGroup.add(roofLip);

      // ROPS pillars (4 corner structural bars)
      [[-0.38, 0.34], [0.38, 0.34], [-0.38, -0.34], [0.38, -0.34]].forEach(([px, pz]) => {
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.62, 0.04), catYellowDark);
        pillar.position.set(px, 0.82, pz);
        pillar.castShadow = true;
        cabinGroup.add(pillar);

      });

      // Interior: seat
      const seatCushion = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.06, 0.24), seatMat);
      seatCushion.position.set(0, 0.62, -0.04);
      cabinGroup.add(seatCushion);

      const seatBack = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.3, 0.05), seatMat);
      seatBack.position.set(0, 0.77, -0.16);
      seatBack.rotation.x = 0.1;
      cabinGroup.add(seatBack);

      // Armrests
      [-0.14, 0.14].forEach(ax => {
        const arm = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.22), darkSteel);
        arm.position.set(ax, 0.66, -0.05);
        cabinGroup.add(arm);
      });

      // Steering column & wheel
      const column = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.22, 8), darkSteel);
      column.position.set(0, 0.64, 0.16);
      column.rotation.x = 0.45;
      cabinGroup.add(column);

      const steerHub = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.025, 8), darkSteel);
      steerHub.rotation.x = Math.PI / 2 + 0.45;
      steerHub.position.set(0, 0.74, 0.25);
      cabinGroup.add(steerHub);

      const steerWheel = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.014, 8, 24), darkSteel);
      steerWheel.rotation.x = Math.PI / 2 + 0.45;
      steerWheel.position.set(0, 0.74, 0.25);
      cabinGroup.add(steerWheel);

      // Dashboard / instrument panel
      const dash = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.12, 0.06), darkSteel);
      dash.position.set(0, 0.64, 0.3);
      dash.rotation.x = -0.3;
      cabinGroup.add(dash);

      // Gauge clusters
      for (let gi = 0; gi < 3; gi++) {
        const gx = -0.18 + gi * 0.18;
        const gauge = new THREE.Mesh(new THREE.CircleGeometry(0.03, 12), grilleMat);
        gauge.position.set(gx, 0.68, 0.33);
        gauge.rotation.x = -0.3;
        cabinGroup.add(gauge);
      }

      // ═══════════════════════════════════════════════════════════════════
      // BLADE LIFT ARM ASSEMBLY
      // ═══════════════════════════════════════════════════════════════════
      const bladeGroup = new THREE.Group();
      bladeGroup.position.set(0, 0.38, 0.7);
      dozer.add(bladeGroup);

      // Push arms (C-frame) — two heavy beams angled forward
      [-0.45, 0.45].forEach(ax => {
        // Main push arm
        const pushArm = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.085, 0.7), darkSteel);
        pushArm.position.set(ax, 0.04, 0.13);
        pushArm.rotation.x = -0.14;
        pushArm.castShadow = true;
        bladeGroup.add(pushArm);

        // Gusset plate at blade end
        

        // Ball joint pin at frame
        const pin = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.14, 10), chrome);
        pin.rotation.z = Math.PI / 2;
        pin.position.set(ax, 0.05, 0.0);
        bladeGroup.add(pin);
      });

      // Hydraulic tilt cylinder (centre)
      

      // Lift hydraulics (2 outer)
      [-0.32, 0.32].forEach(hx => {
        const liftSleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.26, 10), catYellow);
        liftSleeve.rotation.x = Math.PI / 2.8;
        liftSleeve.position.set(hx, 0.38, -0.08);
        dozer.add(liftSleeve);

        const liftRod = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.3, 8), chrome);
        liftRod.rotation.x = Math.PI / 2.8;
        liftRod.position.set(hx, 0.26, 0.08);
        dozer.add(liftRod);
      });

      // ── Concave Blade ─────────────────────────────────────────────────────
      const buildConcaveBlade = (mat) => {
        const W = 1.76, H = 0.62, T = 0.03;
        const arc = Math.PI * 0.3;
        const R = H / (2 * Math.sin(arc / 2));
        const vS = 24, wS = 10;

        const pos = [], nor = [], uv = [], idx = [];
        const arcCZ = R * Math.cos(arc / 2);

        const addPanel = (inner) => {
          const r = inner ? R - T : R;
          const nd = inner ? 1 : -1;
          for (let wi = 0; wi <= wS; wi++) {
            const xf = wi / wS;
            const x = -W / 2 + xf * W;
            const sideWrap = Math.pow(Math.abs(xf * 2 - 1), 2.2) * 0.09;
            const centerCup = Math.cos((xf - 0.5) * Math.PI) * 0.012;
            for (let vi = 0; vi <= vS; vi++) {
              const t = vi / vS;
              const a = -arc / 2 + t * arc;
              pos.push(x, r * Math.sin(a), arcCZ - r * Math.cos(a) + sideWrap - centerCup);
              nor.push(0, nd * Math.sin(a), nd * -Math.cos(a));
              uv.push(xf, t);
            }
          }
        };

        const oS = 0; addPanel(false);
        const iS = (wS + 1) * (vS + 1); addPanel(true);

        const stride = vS + 1;
        [{ base: oS, flip: false }, { base: iS, flip: true }].forEach(({ base, flip }) => {
          for (let wi = 0; wi < wS; wi++) {
            for (let vi = 0; vi < vS; vi++) {
              const bl = base + wi * stride + vi, br = base + (wi + 1) * stride + vi;
              const tl = bl + 1, tr = br + 1;
              if (!flip) idx.push(bl, br, tl, tl, br, tr);
              else idx.push(bl, tl, br, tl, tr, br);
            }
          }
        });

        const capEdge = (w0, w1, s0, s1) => {
          for (let vi = 0; vi < vS; vi++) {
            const a = s0 + w0 * stride + vi, b = a + 1;
            const c = s1 + w1 * stride + vi, d = c + 1;
            idx.push(a, c, b, b, c, d);
          }
        };
        capEdge(0, 0, oS, iS); capEdge(wS, wS, iS, oS);

        const edgeStrip = (s0, s1, vIdx, flip) => {
          for (let wi = 0; wi < wS; wi++) {
            const a = s0 + wi * stride + vIdx, b = s0 + (wi + 1) * stride + vIdx;
            const c = s1 + wi * stride + vIdx, d = s1 + (wi + 1) * stride + vIdx;
            if (!flip) idx.push(a, b, c, c, b, d);
            else idx.push(a, c, b, c, d, b);
          }
        };
        edgeStrip(oS, iS, vS, false);
        edgeStrip(oS, iS, 0, true);

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
        geo.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
        geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
        geo.setIndex(idx);
        geo.computeVertexNormals();
        return new THREE.Mesh(geo, mat);
      };

      const blade = buildConcaveBlade(catYellow);
      blade.position.set(0, 0.04, 0.58);
      blade.castShadow = true;
      blade.receiveShadow = true;
      bladeGroup.add(blade);

      const bladeCrossTube = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.36, 12), darkSteel);
      bladeCrossTube.rotation.z = Math.PI / 2;
      bladeCrossTube.position.set(0, -0.08, 0.34);
      bladeCrossTube.castShadow = true;
      bladeGroup.add(bladeCrossTube);

      // Blade reinforcement ribs
     

      // Blade top rolled lip
      

      const bladeTop = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.04, 0.2), catYellowDark);
      bladeTop.position.set(0, 0.33, 0.58);
      bladeTop.castShadow = true;
      bladeGroup.add(bladeTop);

      // Cutting edge (heavy black steel bottom)
      const cuttingEdge = new THREE.Mesh(new THREE.BoxGeometry(1.84, 0.065, 0.14), bladeWear);
      cuttingEdge.position.set(0, -0.23, 0.62);
      cuttingEdge.rotation.x = -0.1;
      cuttingEdge.castShadow = true;
      bladeGroup.add(cuttingEdge);

      // Cutting edge bolts
      for (let bi = -7; bi <= 7; bi += 2) {
        const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.05, 0.06, 6), chrome);
        bolt.rotation.x = Math.PI / 2;
        bolt.position.set(bi * 0.105, -0.23, 0.72);
        bladeGroup.add(bolt);
      }

      // Blade end plates (left & right)
      [-0.9, 0.9].forEach(epx => {
        const endPlate = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.6, 0.2), bladeWear);
        endPlate.position.set(epx, 0.03, 0.58);
        endPlate.rotation.y = epx < 0 ? -0.18 : 0.18;
        endPlate.castShadow = true;
        bladeGroup.add(endPlate);
      });

      // ── Ground shadow & grid ──────────────────────────────────────────────
      const shadowCanvas = document.createElement('canvas');
      shadowCanvas.width = 160;
      shadowCanvas.height = 96;
      const shadowCtx = shadowCanvas.getContext('2d');
      const shadowGradient = shadowCtx.createRadialGradient(80, 48, 8, 80, 48, 80);
      shadowGradient.addColorStop(0, 'rgba(0,0,0,0.34)');
      shadowGradient.addColorStop(0.68, 'rgba(0,0,0,0.16)');
      shadowGradient.addColorStop(1, 'rgba(0,0,0,0)');
      shadowCtx.fillStyle = shadowGradient;
      shadowCtx.fillRect(0, 0, shadowCanvas.width, shadowCanvas.height);

      const contactShadowTexture = new THREE.CanvasTexture(shadowCanvas);
      const contactShadow = new THREE.Mesh(
        new THREE.PlaneGeometry(3.0, 1.25),
        new THREE.MeshBasicMaterial({
          map: contactShadowTexture,
          transparent: true,
          opacity: 0.46,
          depthWrite: false,
        })
      );

      contactShadow.rotation.x = -Math.PI / 2;
      contactShadow.position.set(0, -0.11, 0.12);

      scene.add(contactShadow);
      // ── Lighting ──────────────────────────────────────────────────────────
      scene.add(new THREE.HemisphereLight(0xfff8e7, 0x0a1628, 1.8));

      const sun = new THREE.DirectionalLight(0xffffff, 2.4);
      sun.position.set(-4, 6, 4);
      sun.castShadow = true;
      sun.shadow.mapSize.set(2048, 2048);
      sun.shadow.camera.near = 0.5;
      sun.shadow.camera.far = 20;
      sun.shadow.camera.left = -4;
      sun.shadow.camera.right = 4;
      sun.shadow.camera.top = 4;
      sun.shadow.camera.bottom = -4;
      sun.shadow.bias = -0.0008;
      scene.add(sun);

      // Fill light from right
      const fill = new THREE.DirectionalLight(0xb0d4ff, 1.8);
      fill.position.set(5, 3, -2);
      scene.add(fill);

      // Ground amber bounce
      const bounce = new THREE.PointLight(0xf5a623, 3.5, 6);
      bounce.position.set(2, 0.3, 2);
      scene.add(bounce);

      // Rim light (back)
      const rim = new THREE.DirectionalLight(0x4488ff, 1.2);
      rim.position.set(0, 2, -5);
      scene.add(rim);

      // ── Animation loop ────────────────────────────────────────────────────
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

      const render = () => {
        const t = (performance.now() - startTime) / 1000;

        // Gentle body suspension bounce
        dozer.position.y = Math.sin(t * 1) * 0.02;

        // Blade slowly lifts and drops (working motion)
        bladeGroup.rotation.x = Math.sin(t * 1.6) * 0.1 - 0.04;

        // Slow showcase rotation
        model.rotation.y = -0.3 + Math.sin(t * 0.24) * 0.28;

        // Hydraulic rods animate with blade
        renderer.render(scene, camera);
        frameId = requestAnimationFrame(render);
      };

      render();

      cleanupScene = () => {
        cancelAnimationFrame(frameId);
        cancelAnimationFrame(resizeFrameId);
        resizeObserver.disconnect();
        if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
        const disposeMaterial = (material) => {
          material.map?.dispose();
          material.dispose();
        };
        scene.traverse(o => {
          if (!o.isMesh && !o.isLine) return;
          o.geometry?.dispose();
          Array.isArray(o.material) ? o.material.forEach(disposeMaterial) : o.material && disposeMaterial(o.material);
        });
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

export default EquipmentBulldozer;
