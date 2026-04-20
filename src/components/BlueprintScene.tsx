import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * Animated 3D blueprint -> wireframe house.
 * Renders a wireframe modern house with grid floor, slowly rotating,
 * with subtle parallax driven by scroll.
 */
export function BlueprintScene({ className = "" }: { className?: string }) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08090b, 0.06);

    const camera = new THREE.PerspectiveCamera(
      40,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    );
    camera.position.set(6, 4.2, 8);
    camera.lookAt(0, 0.5, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const lineColor = 0xb8d4e0;
    const dimColor = 0x4a5862;

    const group = new THREE.Group();

    // Floor grid
    const grid = new THREE.GridHelper(20, 20, dimColor, dimColor);
    (grid.material as THREE.Material).transparent = true;
    (grid.material as THREE.Material).opacity = 0.35;
    grid.position.y = 0;
    group.add(grid);

    // Build wireframe house from boxes
    const mat = new THREE.LineBasicMaterial({
      color: lineColor,
      transparent: true,
      opacity: 0.9,
    });

    const wireBox = (
      w: number,
      h: number,
      d: number,
      x: number,
      y: number,
      z: number,
    ) => {
      const geo = new THREE.BoxGeometry(w, h, d);
      const edges = new THREE.EdgesGeometry(geo);
      const line = new THREE.LineSegments(edges, mat);
      line.position.set(x, y, z);
      return line;
    };

    // Main lower volume
    group.add(wireBox(5, 1.6, 3.2, 0, 0.8, 0));
    // Cantilevered upper volume
    group.add(wireBox(3.6, 1.4, 2.6, 0.7, 2.3, 0.2));
    // Side wing
    group.add(wireBox(1.6, 1.2, 2.2, -2.6, 0.6, 0.5));
    // Roof slab thin
    group.add(wireBox(3.7, 0.08, 2.7, 0.7, 3.04, 0.2));

    // Vertical accent column
    const col = new THREE.CylinderGeometry(0.05, 0.05, 3.2, 8);
    const colLine = new THREE.LineSegments(
      new THREE.EdgesGeometry(col),
      new THREE.LineBasicMaterial({
        color: lineColor,
        transparent: true,
        opacity: 0.6,
      }),
    );
    colLine.position.set(2.4, 1.6, 1.5);
    group.add(colLine);

    // Floor plate (subtle filled)
    const plate = new THREE.Mesh(
      new THREE.PlaneGeometry(7, 5),
      new THREE.MeshBasicMaterial({
        color: 0x0d1014,
        transparent: true,
        opacity: 0.6,
      }),
    );
    plate.rotation.x = -Math.PI / 2;
    plate.position.y = 0.001;
    group.add(plate);

    scene.add(group);
    group.position.y = -0.5;

    let scrollY = window.scrollY;
    const onScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const handleResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    let raf = 0;
    const tick = () => {
      const t = performance.now() * 0.0001;
      group.rotation.y = t * 2 + scrollY * 0.0008;
      group.position.y = -0.5 + Math.sin(t * 4) * 0.05 - scrollY * 0.0006;
      camera.position.y = 4.2 + scrollY * 0.0015;
      camera.lookAt(0, 0.5, 0);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).geometry) (obj as THREE.Mesh).geometry.dispose();
        const m = (obj as THREE.Mesh).material as THREE.Material | undefined;
        if (m) m.dispose();
      });
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
