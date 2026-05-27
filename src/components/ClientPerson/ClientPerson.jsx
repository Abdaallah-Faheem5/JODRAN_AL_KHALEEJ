import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ClientPerson = ({ className }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    let cleanupScene;

    if (!mount) return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      30,
      1,
      0.1,
      100
    );

    camera.position.set(0, 0.4, 3.6);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });

    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio || 1, 2)
    );

    renderer.setClearColor(0x000000, 0);

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type =
      THREE.PCFSoftShadowMap;

    renderer.toneMapping =
      THREE.ACESFilmicToneMapping;

    renderer.toneMappingExposure = 1.2;

    mount.appendChild(renderer.domElement);

    // ── MATERIALS ─────────────────────────────────────
    const leatherMain =
      new THREE.MeshStandardMaterial({
        color: 0x0a0a0a,
        roughness: 0.58,
        metalness: 0.12,
      });

    const leatherAccent =
      new THREE.MeshStandardMaterial({
        color: 0x050505,
        roughness: 0.5,
        metalness: 0.18,
      });

    const leatherLight =
      new THREE.MeshStandardMaterial({
        color: 0x151515,
        roughness: 0.52,
        metalness: 0.1,
      });

    const brass =
      new THREE.MeshStandardMaterial({
        color: 0xc8952a,
        roughness: 0.18,
        metalness: 0.92,
      });

    const chrome =
      new THREE.MeshStandardMaterial({
        color: 0xdde4ea,
        roughness: 0.05,
        metalness: 1,
      });

    const lockBody =
      new THREE.MeshStandardMaterial({
        color: 0xb8841e,
        roughness: 0.2,
        metalness: 0.9,
      });

    // ── MODEL ─────────────────────────────────────────
    const model = new THREE.Group();
    scene.add(model);

    const bag = new THREE.Group();
    model.add(bag);

    // ── MAIN BODY ─────────────────────────────────────
    const bodyMain = new THREE.Mesh(
      new THREE.BoxGeometry(
        1.12,
        0.72,
        0.42,
        8,
        8,
        8
      ),
      leatherMain
    );

    bodyMain.geometry.computeVertexNormals();

    bodyMain.castShadow = true;
    bodyMain.receiveShadow = true;

    bag.add(bodyMain);

    // front panel
    const frontPanel = new THREE.Mesh(
      new THREE.BoxGeometry(
        1.08,
        0.68,
        0.025
      ),
      leatherLight
    );

    frontPanel.position.z = 0.215;
    bag.add(frontPanel);

    // back panel
    const backPanel = new THREE.Mesh(
      new THREE.BoxGeometry(
        1.08,
        0.68,
        0.025
      ),
      leatherAccent
    );

    backPanel.position.z = -0.215;
    bag.add(backPanel);

    // side panels
    [-0.56, 0.56].forEach((x) => {
      const side = new THREE.Mesh(
        new THREE.BoxGeometry(
          0.03,
          0.68,
          0.38
        ),
        leatherAccent
      );

      side.position.x = x;
      side.castShadow = true;

      bag.add(side);
    });

    // bottom strip
    const bottom = new THREE.Mesh(
      new THREE.BoxGeometry(
        1.1,
        0.05,
        0.43
      ),
      leatherAccent
    );

    bottom.position.y = -0.36;
    bag.add(bottom);

    // ── FEET ──────────────────────────────────────────
    [
      [-0.42, -0.16],
      [0.42, -0.16],
      [-0.42, 0.16],
      [0.42, 0.16],
    ].forEach(([x, z]) => {
      const foot = new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.03,
          0.03,
          0.04,
          14
        ),
        brass
      );

      foot.rotation.x = Math.PI / 2;

      foot.position.set(
        x,
        -0.39,
        z
      );

      foot.castShadow = true;

      bag.add(foot);
    });

    // ── REAL FRONT FLAP ───────────────────────────────

    // ── HANDLE ────────────────────────────────────────
    const handleCurve =
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.24, 0.42, 0),
        new THREE.Vector3(-0.18, 0.62, 0),
        new THREE.Vector3(0.18, 0.62, 0),
        new THREE.Vector3(0.24, 0.42, 0),
      ]);

    const handleGeometry =
      new THREE.TubeGeometry(
        handleCurve,
        40,
        0.03,
        20,
        false
      );

    const handle = new THREE.Mesh(
      handleGeometry,
      leatherAccent
    );

    handle.castShadow = true;

    bag.add(handle);

    // straps only
    [-0.24, 0.24].forEach((x) => {
      const strap = new THREE.Mesh(
        new THREE.BoxGeometry(
          0.05,
          0.16 ,
          0.03
        ),
        leatherAccent
      );

      strap.position.set(
        x,
        0.35,
        0
      );

      strap.castShadow = true;

      bag.add(strap);

      const rivet = new THREE.Mesh(
        new THREE.CylinderGeometry(
          0.012,
          0.012,
          0.02,
          12
        ),
        brass
      );

      rivet.rotation.x = Math.PI / 2;

      rivet.position.set(
        x,
        0.36,
        0.018
      );

      bag.add(rivet);
    });

    // ── FRONT POCKET / FLAP ───────────────────────────
    const pocket = new THREE.Mesh(
      new THREE.BoxGeometry(
        0.5,
        0.22,
        0.06
      ),
      leatherAccent
    );

    pocket.position.set(
      0,
      -0.02,
      0.24
    );

    pocket.castShadow = true;

    bag.add(pocket);

    // pocket flap
    const pocketFlap = new THREE.Mesh(
      new THREE.BoxGeometry(
        0.54,
        0.06,
        0.08
      ),
      leatherLight
    );

    pocketFlap.position.set(
      0,
      0.08,
      0.25
    );

    pocketFlap.castShadow = true;

    bag.add(pocketFlap);

    // vertical leather strip
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(
        0.08,
        0.23,
        0.02
      ),
      leatherMain
    );

    strip.position.set(
      0,
      -0.02,
      0.27
    );

    bag.add(strip);

    // small metal detail
    const metalDot = new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.015,
        0.015,
        0.02,
        16
      ),
      brass
    );

    metalDot.rotation.x = Math.PI / 2;

    metalDot.position.set(
      0,
      -0.02,
      0.285
    );

    bag.add(metalDot);
    // ── SIDE BUCKLES ──────────────────────────────────
    [-0.48, 0.48].forEach((x) => {
      const buckle = new THREE.Mesh(
        new THREE.BoxGeometry(
          0.06,
          0.09,
          0.025
        ),
        brass
      );

      buckle.position.set(
        x,
        0,
        0.22
      );

      bag.add(buckle);
    });

    // ── SHADOW FLOOR ──────────────────────────────────
    const shadow = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.ShadowMaterial({
        opacity: 0.35,
      })
    );

    shadow.rotation.x = -Math.PI / 2;

    shadow.position.y = -0.72;

    shadow.receiveShadow = true;

    model.add(shadow);

    // ── LIGHTS ────────────────────────────────────────
    scene.add(
      new THREE.HemisphereLight(
        0xffffff,
        0x111111,
        1.5
      )
    );

    const key =
      new THREE.DirectionalLight(
        0xffffff,
        6
      );

    key.position.set(-3, 5, 4);

    key.castShadow = true;

    key.shadow.mapSize.set(2048, 2048);

    scene.add(key);

    const fill =
      new THREE.DirectionalLight(
        0xb0c8ff,
        2
      );

    fill.position.set(4, 2, 2);

    scene.add(fill);

    const rim =
      new THREE.DirectionalLight(
        0x66aaff,
        1.2
      );

    rim.position.set(0, 1, -4);

    scene.add(rim);

    // ── RESIZE ────────────────────────────────────────
    const resize = () => {
      const rect =
        mount.getBoundingClientRect();

      renderer.setSize(
        rect.width,
        rect.height,
        false
      );

      camera.aspect =
        rect.width / rect.height;

      camera.updateProjectionMatrix();
    };

    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    // ── ANIMATION ─────────────────────────────────────
    const start = performance.now();

    let frame;

    const animate = () => {
      const t =
        (performance.now() - start) / 1000;

      bag.position.y =
        Math.sin(t * 1.2) * 0.03;

      model.rotation.y =
        Math.sin(t * 0.3) * 0.5;

      bag.rotation.z =
        Math.sin(t * 0.7) * 0.015;

      renderer.render(scene, camera);

      frame =
        requestAnimationFrame(animate);
    };

    animate();

    cleanupScene = () => {
      cancelAnimationFrame(frame);

      ro.disconnect();

      scene.traverse((obj) => {
        if (obj.geometry)
          obj.geometry.dispose();

        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) =>
              m.dispose()
            );
          } else {
            obj.material.dispose();
          }
        }
      });

      renderer.dispose();

      if (
        renderer.domElement.parentNode === mount
      ) {
        mount.removeChild(
          renderer.domElement
        );
      }
    };

    return cleanupScene;
  }, []);

  return (
    <div
      ref={mountRef}
      className={className}
      aria-hidden="true"
    />
  );
};

export default ClientPerson;