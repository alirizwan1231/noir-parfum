"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { stage, SCENTS } from "@/lib/stage";

function labelTexture(scentIdx: number): THREE.CanvasTexture {
  const s = SCENTS[scentIdx];
  const c = document.createElement("canvas");
  c.width = 512; c.height = 372;
  const g = c.getContext("2d")!;
  g.clearRect(0, 0, 512, 372);
  g.strokeStyle = "rgba(239,233,220,0.9)";
  g.lineWidth = 3; g.strokeRect(16, 16, 480, 340);
  g.lineWidth = 1; g.strokeRect(26, 26, 460, 320);
  g.fillStyle = "#EFE9DC";
  g.textAlign = "center";
  g.font = "600 76px Fraunces, Georgia, serif";
  g.fillText("NOIRÉ", 256, 138);
  g.font = "500 25px 'JetBrains Mono', monospace";
  g.fillText("P A R F U M", 256, 188);
  g.beginPath(); g.moveTo(156, 222); g.lineTo(356, 222);
  g.strokeStyle = s.accent; g.lineWidth = 2; g.stroke();
  g.font = "italic 500 37px Fraunces, Georgia, serif";
  g.fillStyle = s.accent;
  g.fillText(s.name, 256, 278);
  g.font = "400 19px 'JetBrains Mono', monospace";
  g.fillStyle = "rgba(239,233,220,0.75)";
  g.fillText("PARIS — 75 ML", 256, 322);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 8;
  return t;
}

function glowTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 256;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(128, 128, 8, 128, 128, 128);
  grad.addColorStop(0, "rgba(255,255,255,0.55)");
  grad.addColorStop(0.45, "rgba(255,255,255,0.16)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 256, 256);
  return new THREE.CanvasTexture(c);
}

function dotTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(32, 32, 2, 32, 32, 30);
  grad.addColorStop(0, "rgba(255,255,255,1)");
  grad.addColorStop(0.4, "rgba(255,255,255,0.5)");
  grad.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(c);
}

function blobTexture(): THREE.CanvasTexture {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d")!;
  const grad = g.createRadialGradient(64, 64, 4, 64, 64, 62);
  grad.addColorStop(0, "rgba(0,0,0,0.62)");
  grad.addColorStop(0.6, "rgba(0,0,0,0.28)");
  grad.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

export default function Scene3D() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const smallScreen = window.innerWidth < 820;
    const weakCpu = (navigator.hardwareConcurrency || 8) <= 4;
    const lightMode = coarse || smallScreen || weakCpu;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, lightMode ? 1.25 : 1.6));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.shadowMap.enabled = !lightMode;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x08080a);
    scene.fog = new THREE.Fog(0x08080a, 8, 17);
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
    camera.position.set(0, 0.15, 4.55);

    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const key = new THREE.DirectionalLight(0xfff1dd, 2.6);
    key.position.set(3, 4.5, 3);
    key.castShadow = !lightMode;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -2.2; key.shadow.camera.right = 2.2;
    key.shadow.camera.top = 2.6; key.shadow.camera.bottom = -2;
    key.shadow.radius = 7;
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xd9b36a, 1.15);
    rim.position.set(-4, 2, -3.5);
    scene.add(rim);
    const fill = new THREE.DirectionalLight(0xdfe8ff, 0.45);
    fill.position.set(-2.5, 0.5, 4);
    scene.add(fill);

    const s0 = SCENTS[0];

    // Backdrop glow (also what the glass refracts)
    const backdrop = new THREE.Mesh(
      new THREE.PlaneGeometry(13, 8),
      new THREE.MeshBasicMaterial({ map: glowTexture(), transparent: true, depthWrite: false, color: s0.accent, opacity: 0.38, fog: false })
    );
    backdrop.position.set(0, 0.35, -5);
    scene.add(backdrop);

    // Floor + gold ring
    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(16, 56),
      new THREE.MeshStandardMaterial({ color: 0x08080a, roughness: 0.85, metalness: 0.0, envMapIntensity: 0.1 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.18;
    floor.receiveShadow = true;
    scene.add(floor);
    const ringMat = new THREE.MeshBasicMaterial({ color: s0.accent, transparent: true, opacity: 0.32, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.87, 0.9, 72), ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -1.175;
    scene.add(ring);

    /* ---------- bottle ---------- */
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xc9a24b, metalness: 1, roughness: 0.28 });
    const goldDark = new THREE.MeshStandardMaterial({ color: 0x8a6d2f, metalness: 1, roughness: 0.38 });
    const glassMat = lightMode
      ? new THREE.MeshPhysicalMaterial({
          color: 0x141414, metalness: 0, roughness: 0.06, transparent: true, opacity: 0.34,
          clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.15, specularIntensity: 1, depthWrite: false,
        })
      : new THREE.MeshPhysicalMaterial({
          color: 0xffffff, metalness: 0, roughness: 0.03, transmission: 1, thickness: 0.22,
          ior: 1.45, clearcoat: 1, clearcoatRoughness: 0.04, envMapIntensity: 1.4, specularIntensity: 1,
          attenuationColor: new THREE.Color(0xe8e2d4), attenuationDistance: 4,
        });
    const liquidMat = new THREE.MeshPhysicalMaterial({
      color: s0.liquid, roughness: 0.08, metalness: 0,
      clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.1,
      emissive: s0.liquid, emissiveIntensity: 0.22,
    });
    const capMat = new THREE.MeshPhysicalMaterial({ color: 0x0e0e10, roughness: 0.22, metalness: 0.15, clearcoat: 1, clearcoatRoughness: 0.1 });
    const labelMat = new THREE.MeshStandardMaterial({ map: labelTexture(0), transparent: true, roughness: 0.5, metalness: 0.1, polygonOffset: true, polygonOffsetFactor: -1 });

    const bottle = new THREE.Group();
    bottle.position.y = -1.18;
    scene.add(bottle);
    const shadowed = (m: THREE.Mesh) => { m.castShadow = true; return m; };

    const body = new THREE.Mesh(new RoundedBoxGeometry(1.26, 1.44, 0.58, 5, 0.085), glassMat);
    body.position.y = 0.74;
    if (lightMode) body.renderOrder = 2;
    bottle.add(body);

    const liquid = shadowed(new THREE.Mesh(new RoundedBoxGeometry(1.1, 1.3, 0.45, 4, 0.06), liquidMat));
    liquid.position.y = 0.68;
    if (lightMode) liquid.renderOrder = 1;
    bottle.add(liquid);

    const collar = shadowed(new THREE.Mesh(new THREE.TorusGeometry(0.115, 0.022, 12, 40), goldMat));
    collar.rotation.x = Math.PI / 2;
    collar.position.y = 1.485;
    bottle.add(collar);
    const neck = shadowed(new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.17, 32), goldMat));
    neck.position.y = 1.54;
    bottle.add(neck);
    const sprayer = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.048, 0.2, 24), goldDark);
    sprayer.position.y = 1.7;
    bottle.add(sprayer);

    const cap = new THREE.Group();
    cap.position.y = 1.82;
    const capMesh = shadowed(new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.56, 0.5, 4, 0.05), capMat));
    cap.add(capMesh);
    bottle.add(cap);
    const capHome = cap.position.y;

    const label = new THREE.Mesh(new THREE.PlaneGeometry(0.74, 0.54), labelMat);
    label.position.set(0, 0.78, 0.297);
    if (lightMode) label.renderOrder = 3;
    bottle.add(label);

    if (lightMode) {
      const blob = new THREE.Mesh(
        new THREE.PlaneGeometry(2.3, 1.5),
        new THREE.MeshBasicMaterial({ map: blobTexture(), transparent: true, depthWrite: false, opacity: 0.85 })
      );
      blob.rotation.x = -Math.PI / 2;
      blob.position.y = -1.172;
      scene.add(blob);
    }

    /* ---------- gold dust ---------- */
    const pCount = lightMode ? 90 : 170;
    const pos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 1.5 + Math.random() * 2.3;
      pos[i * 3] = Math.cos(a) * r;
      pos[i * 3 + 1] = -1.1 + Math.random() * 3.3;
      pos[i * 3 + 2] = Math.sin(a) * r - 0.4;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    const pMat = new THREE.PointsMaterial({ size: 0.05, map: dotTexture(), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: s0.accent, opacity: 0.7 });
    const dust = new THREE.Points(pGeo, pMat);
    scene.add(dust);

    /* ---------- interaction: drag with inertia ---------- */
    let dragY = 0.5, dragX = 0.04, autoY = 0, velY = 0;
    let dragging = false, lastX = 0, lastY = 0, lastInteract = performance.now();
    const onDown = (e: PointerEvent) => { dragging = true; velY = 0; lastX = e.clientX; lastY = e.clientY; lastInteract = performance.now(); mount.setPointerCapture(e.pointerId); };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      dragY += dx * 0.0085;
      velY = velY * 0.6 + dx * 0.0085 * 0.4;
      dragX = THREE.MathUtils.clamp(dragX + (e.clientY - lastY) * 0.004, -0.26, 0.34);
      lastX = e.clientX; lastY = e.clientY; lastInteract = performance.now();
    };
    const onUp = () => { dragging = false; lastInteract = performance.now(); };
    mount.addEventListener("pointerdown", onDown);
    mount.addEventListener("pointermove", onMove);
    mount.addEventListener("pointerup", onUp);
    mount.addEventListener("pointercancel", onUp);

    let stageVisible = true;
    const vio = new IntersectionObserver((es) => { stageVisible = es[0].isIntersecting; }, { threshold: 0.02 });
    vio.observe(mount);

    const resize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    /* ---------- loop ---------- */
    const clock = new THREE.Clock();
    let raf = 0;
    let lastScent = stage.scent;
    let capVal = 0;
    const cLiquid = new THREE.Color(s0.liquid), cAccent = new THREE.Color(s0.accent);

    const damp = (dt: number, k: number) => 1 - Math.exp(-dt * k);

    let fpsAcc = 0, fpsTime = 0, downgraded = lightMode;
    const tick = () => {
      raf = requestAnimationFrame(tick);
      if (!stageVisible) return;
      const rawDt = clock.getDelta();
      const dt = Math.min(rawDt, 0.05);

      // If a desktop GPU still cannot hold ~35fps, fall back to the light glass.
      if (!downgraded && rawDt > 0) {
        fpsAcc += 1; fpsTime += rawDt;
        if (fpsTime > 3.5) {
          if (fpsAcc / fpsTime < 35) {
            downgraded = true;
            const gm = glassMat as THREE.MeshPhysicalMaterial;
            gm.transmission = 0; gm.transparent = true; gm.opacity = 0.34; gm.color.set(0x141414); gm.depthWrite = false; gm.needsUpdate = true;
            body.renderOrder = 2; liquid.renderOrder = 1; label.renderOrder = 3;
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
          }
          fpsAcc = 0; fpsTime = 0;
        }
      }
      const t = clock.elapsedTime;

      if (!dragging) {
        dragY += velY;
        velY *= Math.exp(-dt * 2.4);
        if (performance.now() - lastInteract > 2600) autoY += dt * 0.35;
      }

      const targetRotY = dragY + autoY + stage.progress * Math.PI * 1.5;
      const targetRotX = dragX + stage.progress * 0.05;
      bottle.rotation.y += (targetRotY - bottle.rotation.y) * damp(dt, 5.5);
      bottle.rotation.x += (targetRotX - bottle.rotation.x) * damp(dt, 5.5);
      bottle.position.y = -1.18 + Math.sin(t * 0.8) * 0.03;

      const w1 = THREE.MathUtils.smoothstep(stage.progress, 0.3, 0.42) * (1 - THREE.MathUtils.smoothstep(stage.progress, 0.58, 0.68));
      const w2 = THREE.MathUtils.smoothstep(stage.progress, 0.68, 0.8);
      const xOff = camera.aspect < 1 ? 0.18 : 0.52;
      bottle.position.x += (xOff * w1 - xOff * w2 - bottle.position.x) * damp(dt, 4);

      const baseZ = camera.aspect >= 1 ? 4.55 : THREE.MathUtils.clamp((4.55 / camera.aspect) * 0.6, 5.0, 6.8);
      camera.position.z += (baseZ - stage.progress * 0.5 - camera.position.z) * damp(dt, 4);
      camera.position.y += (0.15 + stage.progress * 0.12 - camera.position.y) * damp(dt, 4);
      camera.lookAt(0, -0.08, 0);

      capVal += (stage.capTarget - capVal) * damp(dt, 3.4);
      const ce = capVal * capVal * (3 - 2 * capVal);
      cap.position.y = capHome + ce * 0.62;
      cap.rotation.y = ce * 0.7;

      dust.rotation.y = t * 0.03;
      dust.position.y = Math.sin(t * 0.22) * 0.06;

      if (stage.scent !== lastScent) {
        lastScent = stage.scent;
        const old = labelMat.map;
        labelMat.map = labelTexture(lastScent);
        labelMat.needsUpdate = true;
        old?.dispose();
      }
      const s = SCENTS[stage.scent];
      const k = damp(dt, 5);
      cLiquid.lerp(new THREE.Color(s.liquid), k); liquidMat.color.copy(cLiquid); liquidMat.emissive.copy(cLiquid);
      cAccent.lerp(new THREE.Color(s.accent), k);
      ringMat.color.copy(cAccent); pMat.color.copy(cAccent);
      (backdrop.material as THREE.MeshBasicMaterial).color.copy(cAccent);

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      vio.disconnect();
      ro.disconnect();
      mount.removeEventListener("pointerdown", onDown);
      mount.removeEventListener("pointermove", onMove);
      mount.removeEventListener("pointerup", onUp);
      mount.removeEventListener("pointercancel", onUp);
      scene.traverse((o) => { const m = o as THREE.Mesh; if (m.isMesh || (o as THREE.Points).isPoints) (m.geometry as THREE.BufferGeometry)?.dispose(); });
      [goldMat, goldDark, glassMat, liquidMat, capMat, labelMat, ringMat, pMat].forEach((m) => { m.map?.dispose(); m.dispose(); });
      (backdrop.material as THREE.Material).dispose();
      pmrem.dispose();
      renderer.dispose();
      if (renderer.domElement.parentElement === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" aria-label="Interactive 3D perfume bottle. Drag to rotate." />;
}
