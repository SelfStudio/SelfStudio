"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * GearMovement
 * A full-screen, procedurally generated "clay model" watch movement rendered
 * with three.js. Each axis carries one thin large wheel + one thick small
 * pinion (coaxial, rigid). New axes mesh their pinion onto a parent wheel
 * (speed up) or their wheel onto a parent pinion (slow down), so the whole
 * train turns with real, continuous gear ratios across 5 depth layers.
 *
 * Renders behind page content. Reads the document `data-theme` attribute to
 * tint the clay between light/dark and reacts to theme changes live.
 */
export default function GearMovement() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const scene = new THREE.Scene();
    const cam = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      80
    );
    cam.position.set(0, 0, 10.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    el.appendChild(renderer.domElement);

    const hemi = new THREE.HemisphereLight(0xffffff, 0x777777, 0.85);
    const dir = new THREE.DirectionalLight(0xffffff, 1.5);
    dir.position.set(7, 11, 13);
    dir.castShadow = true;
    dir.shadow.mapSize.set(1024, 1024);
    dir.shadow.camera.left = -16;
    dir.shadow.camera.right = 16;
    dir.shadow.camera.top = 12;
    dir.shadow.camera.bottom = -12;
    dir.shadow.camera.near = 1;
    dir.shadow.camera.far = 45;
    dir.shadow.bias = -0.0015;
    scene.add(hemi, dir);

    const clay = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      metalness: 0,
      roughness: 0.85,
    });
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0xe8e2d4,
      metalness: 0,
      roughness: 0.95,
    });

    // ---- geometry: trapezoid gear with arbor hole + lightening holes ----
    const gearGeo = (
      N: number,
      m: number,
      holes: number,
      holeR: number,
      depth: number
    ) => {
      const r = (m * N) / 2;
      const ra = r + m;
      const rd = r - 1.25 * m;
      const p = (Math.PI * 2) / N;
      const s = new THREE.Shape();
      const pt = (rad: number, a: number): [number, number] => [
        Math.cos(a) * rad,
        Math.sin(a) * rad,
      ];
      for (let k = 0; k < N; k++) {
        const A = k * p;
        [A - 0.18 * p, A + 0.18 * p].forEach((a, i) => {
          const [x, y] = pt(ra, a);
          if (k === 0 && i === 0) s.moveTo(x, y);
          else s.lineTo(x, y);
        });
        const [fx, fy] = pt(rd, A + 0.32 * p);
        s.lineTo(fx, fy);
        for (let j = 1; j <= 3; j++) {
          const a = A + 0.32 * p + 0.36 * p * (j / 3);
          const [rx, ry] = pt(rd, a);
          s.lineTo(rx, ry);
        }
      }
      s.closePath();
      const arbor = new THREE.Path();
      arbor.absarc(0, 0, Math.max(0.07, r * 0.1), 0, Math.PI * 2, true);
      s.holes.push(arbor);
      if (holes > 0) {
        const ringR = (rd + r * 0.12) / 2;
        for (let i = 0; i < holes; i++) {
          const a = (i / holes) * Math.PI * 2;
          const h = new THREE.Path();
          h.absarc(Math.cos(a) * ringR, Math.sin(a) * ringR, holeR, 0, Math.PI * 2, true);
          s.holes.push(h);
        }
      }
      const geo = new THREE.ExtrudeGeometry(s, {
        depth,
        bevelEnabled: false,
        curveSegments: 5,
      });
      geo.translate(0, 0, -depth / 2);
      return geo;
    };

    // child axis meshing parent: alpha = direction parent -> child
    const meshPhase = (phiP: number, Np: number, Nc: number, alpha: number) =>
      alpha + Math.PI + Math.PI / Nc - (Np / Nc) * (phiP - alpha);

    const wall = new THREE.Group();
    wall.rotation.x = -0.07;
    scene.add(wall);

    const plane = new THREE.Mesh(new THREE.PlaneGeometry(46, 28), plateMat);
    plane.position.z = -1.5;
    plane.receiveShadow = true;
    wall.add(plane);

    const m = 0.075;
    const layers = [-0.84, -0.42, 0, 0.42, 0.84];
    let seed = 90210;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    const ri = (a: number, b: number) => a + Math.floor(rand() * (b - a + 1));

    type Gear = { x: number; y: number; li: number; ra: number };
    type Axis = {
      x: number;
      y: number;
      phi: number;
      omega: number;
      g: THREE.Group;
      wheel: { N: number; r: number; ra: number; li: number };
      pin: { N: number; r: number; ra: number; li: number };
      _gw: Gear;
      _gp: Gear;
    };
    const axes: Axis[] = [];
    const gearsFlat: Gear[] = [];

    const addMesh = (axis: Axis) => {
      const g = new THREE.Group();
      g.position.set(axis.x, axis.y, 0);
      const wDepth = 0.08 + rand() * 0.08;
      const holes = rand() < 0.8 ? ri(3, 6) : 0;
      const wGeo = gearGeo(
        axis.wheel.N,
        m,
        holes,
        Math.max(0.1, axis.wheel.r * 0.16),
        wDepth
      );
      const wm = new THREE.Mesh(wGeo, clay);
      wm.position.z = layers[axis.wheel.li];
      wm.castShadow = true;
      wm.receiveShadow = true;
      g.add(wm);
      const pDepth = 0.26 + rand() * 0.14;
      const pGeo = gearGeo(axis.pin.N, m, 0, 0, pDepth);
      const pm = new THREE.Mesh(pGeo, clay);
      pm.position.z = layers[axis.pin.li];
      pm.castShadow = true;
      pm.receiveShadow = true;
      g.add(pm);
      const z0 = layers[axis.wheel.li];
      const z1 = layers[axis.pin.li];
      const lo = Math.min(z0, z1) - 0.25;
      const hi = Math.max(z0, z1) + 0.25;
      const arb = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, hi - lo, 10).rotateX(Math.PI / 2),
        clay
      );
      arb.position.z = (lo + hi) / 2;
      arb.castShadow = true;
      g.add(arb);
      wall.add(g);
      axis.g = g;
    };

    const collides = (
      x: number,
      y: number,
      li: number,
      ra: number,
      partner: Gear | null
    ) => {
      for (const gg of gearsFlat) {
        if (gg.li !== li) continue;
        if (partner && gg === partner) continue;
        const d = Math.hypot(x - gg.x, y - gg.y);
        if (d < ra + gg.ra + 0.07) return true;
      }
      return false;
    };
    const axisTooClose = (x: number, y: number) => {
      for (const a of axes) if (Math.hypot(x - a.x, y - a.y) < 0.65) return true;
      return false;
    };

    const makeAxis = (
      x: number,
      y: number,
      NW: number,
      NP: number,
      liW: number,
      liP: number,
      phi: number,
      omega: number
    ) => {
      const axis = {
        x,
        y,
        phi,
        omega,
        g: null as unknown as THREE.Group,
        wheel: { N: NW, r: (m * NW) / 2, ra: (m * NW) / 2 + m, li: liW },
        pin: { N: NP, r: (m * NP) / 2, ra: (m * NP) / 2 + m, li: liP },
        _gw: null as unknown as Gear,
        _gp: null as unknown as Gear,
      } as Axis;
      axes.push(axis);
      const gw: Gear = { x, y, li: liW, ra: axis.wheel.ra };
      const gp: Gear = { x, y, li: liP, ra: axis.pin.ra };
      gearsFlat.push(gw, gp);
      axis._gw = gw;
      axis._gp = gp;
      addMesh(axis);
      return axis;
    };

    const rootDefs: [number, number, number][] = [
      [-7.2, 3.4, 0.12],
      [0.5, -0.8, -0.16],
      [7.4, 3.0, 0.14],
      [-4.5, -4.6, -0.12],
      [5.0, -4.8, 0.1],
    ];
    rootDefs.forEach(([x, y, w]) => {
      const NW = ri(44, 64);
      const NP = ri(9, 13);
      const liW = ri(1, 3);
      const liP = (liW + (rand() < 0.5 ? 1 : -1) + 5) % 5;
      const ra = (m * NW) / 2 + m;
      if (
        !collides(x, y, liW, ra, null) &&
        !collides(x, y, liP, (m * NP) / 2 + m, null) &&
        !axisTooClose(x, y)
      ) {
        makeAxis(x, y, NW, NP, liW, liP, rand() * 6.28, w);
      }
    });

    let attempts = 0;
    while (axes.length < 40 && attempts < 6000) {
      attempts++;
      const parent = axes[Math.floor(rand() * axes.length)];
      const sp = Math.abs(parent.omega);
      let type: "a" | "b";
      if (sp > 0.5) type = "b";
      else if (sp < 0.1) type = "a";
      else type = rand() < 0.5 ? "a" : "b";
      const NW = ri(40, 68);
      const NP = ri(9, 13);
      let dist: number, meshLi: number, pGear: Gear, Np: number, Nc: number;
      let childMesh: "w" | "p";
      if (type === "a") {
        dist = parent.wheel.r + (m * NP) / 2;
        meshLi = parent.wheel.li;
        pGear = parent._gw;
        Np = parent.wheel.N;
        Nc = NP;
        childMesh = "p";
      } else {
        dist = parent.pin.r + (m * NW) / 2;
        meshLi = parent.pin.li;
        pGear = parent._gp;
        Np = parent.pin.N;
        Nc = NW;
        childMesh = "w";
      }
      const omega = -(Np / Nc) * parent.omega;
      if (Math.abs(omega) > 1.3 || Math.abs(omega) < 0.035) continue;
      const alpha = rand() * Math.PI * 2;
      const x = parent.x + Math.cos(alpha) * dist;
      const y = parent.y + Math.sin(alpha) * dist;
      if (Math.abs(x) > 12 || Math.abs(y) > 7.4) continue;
      if (axisTooClose(x, y)) continue;
      const cands = [meshLi - 1, meshLi + 1].filter((v) => v >= 0 && v <= 4);
      const otherLi = cands[Math.floor(rand() * cands.length)];
      const meshRa = childMesh === "p" ? (m * NP) / 2 + m : (m * NW) / 2 + m;
      const otherRa = childMesh === "p" ? (m * NW) / 2 + m : (m * NP) / 2 + m;
      if (collides(x, y, meshLi, meshRa, pGear)) continue;
      if (collides(x, y, otherLi, otherRa, null)) continue;
      const phi = meshPhase(parent.phi, Np, Nc, alpha);
      const liW = childMesh === "w" ? meshLi : otherLi;
      const liP = childMesh === "p" ? meshLi : otherLi;
      makeAxis(x, y, NW, NP, liW, liP, phi, omega);
    }

    // ---- theme tinting ----
    const applyTheme = () => {
      const dark = document.documentElement.dataset.theme !== "light";
      clay.color.setHex(dark ? 0xd8d1c2 : 0xffffff);
      plateMat.color.setHex(dark ? 0x2a241c : 0xe8e2d4);
      hemi.intensity = dark ? 0.5 : 0.9;
      dir.intensity = dark ? 1.1 : 1.6;
      scene.fog = new THREE.FogExp2(dark ? 0x1b1714 : 0xf4efe6, 0.024);
    };
    applyTheme();
    const themeObs = new MutationObserver(applyTheme);
    themeObs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    // ---- interaction + loop ----
    let mx = 0;
    let my = 0;
    const onMove = (e: MouseEvent) => {
      mx = (e.clientX / window.innerWidth - 0.5) * 2;
      my = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    const onResize = () => {
      cam.aspect = window.innerWidth / window.innerHeight;
      cam.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("resize", onResize);

    const clock = new THREE.Clock();
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const t = clock.getElapsedTime();
      for (let i = 0; i < axes.length; i++) {
        const a = axes[i];
        a.g.rotation.z = a.phi + a.omega * t;
      }
      wall.rotation.y += (mx * 0.06 - wall.rotation.y) * 0.05;
      wall.rotation.x += (-0.07 - my * 0.05 - wall.rotation.x) * 0.05;
      renderer.render(scene, cam);
    };
    if (prefersReduced) {
      renderer.render(scene, cam);
    } else {
      loop();
    }

    return () => {
      cancelAnimationFrame(raf);
      themeObs.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (renderer.domElement.parentNode === el) {
        el.removeChild(renderer.domElement);
      }
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
      });
    };
  }, []);

  return (
    // 独立的 view-transition 组：路由切换时 canvas 不参与根快照、持续实时渲染。
    // 用显式 z-0（内容层 z-10 盖在上面）替代负 z-index，避免部分浏览器里
    // body 背景绘制顺序差异导致背景被遮挡。
    <div aria-hidden className="fixed inset-0 z-0 pointer-events-none [view-transition-name:ss-gears]">
      <div ref={mountRef} className="absolute inset-0" />
      {/* readability veil over the movement */}
      <div
        className="absolute inset-0"
        style={{ background: "color-mix(in srgb, var(--paper) 48%, transparent)" }}
      />
    </div>
  );
}
