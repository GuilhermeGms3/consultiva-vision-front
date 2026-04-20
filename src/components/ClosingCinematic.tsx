import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsMobile } from "@/hooks/use-mobile";

gsap.registerPlugin(ScrollTrigger);

/**
 * Closing cinematic — pinned 500vh section with a slowly rotating
 * wireframe building, particle dust, scroll-driven phases and final CTA.
 */
export function ClosingCinematic() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const canvasMountRef = useRef<HTMLDivElement | null>(null);
  const phase1Ref = useRef<HTMLDivElement | null>(null);
  const phase2Ref = useRef<HTMLDivElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const curtainRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) return;
    const section = sectionRef.current;
    const mount = canvasMountRef.current;
    if (!section || !mount) return;

    // ---------- THREE.JS SETUP ----------
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0.6, 5);
    camera.lookAt(0, 0.4, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Subtle point light for any solid accents
    const point = new THREE.PointLight(0x00d4ff, 1.4, 18);
    point.position.set(3, 6, 4);
    scene.add(point);

    const buildingGroup = new THREE.Group();
    scene.add(buildingGroup);

    const ghostMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.18,
    });
    const accentMat = new THREE.LineBasicMaterial({
      color: 0x00d4ff,
      transparent: true,
      opacity: 0.6,
    });

    const addWireBox = (
      w: number,
      h: number,
      d: number,
      x: number,
      y: number,
      z: number,
      accent = false,
    ) => {
      const geo = new THREE.BoxGeometry(w, h, d);
      const edges = new THREE.EdgesGeometry(geo);
      const line = new THREE.LineSegments(edges, accent ? accentMat : ghostMat);
      line.position.set(x, y, z);
      buildingGroup.add(line);
      return line;
    };

    // Stepped modern architecture
    addWireBox(2.6, 2.4, 1.8, 0, -0.6, 0); // base
    addWireBox(2.2, 1.6, 1.5, 0.2, 1.4, 0.1); // 2nd floor
    addWireBox(1.6, 1.2, 1.2, -0.3, 2.8, 0.2); // 3rd floor
    addWireBox(1.0, 0.6, 0.8, 0.1, 3.7, 0.3); // 4th floor
    addWireBox(2.8, 0.06, 2.0, 0, 0.65, 0.05, true); // accent slab
    addWireBox(2.4, 0.06, 1.7, 0.2, 2.22, 0.1, true); // accent slab 2
    addWireBox(1.8, 0.06, 1.4, -0.3, 3.42, 0.2, true); // accent slab 3

    // Corner columns
    const colMat = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.22,
    });
    const cornerOffsets: [number, number][] = [
      [-1.25, -0.85],
      [1.25, -0.85],
      [-1.25, 0.85],
      [1.25, 0.85],
    ];
    cornerOffsets.forEach(([x, z]) => {
      const cyl = new THREE.CylinderGeometry(0.04, 0.04, 4.6, 10);
      const edges = new THREE.EdgesGeometry(cyl);
      const line = new THREE.LineSegments(edges, colMat);
      line.position.set(x, -0.4, z);
      buildingGroup.add(line);
    });

    // Window panels (faintly illuminate later)
    const windowPanels: THREE.Mesh[] = [];
    const windowMat = () =>
      new THREE.MeshBasicMaterial({
        color: 0xfff2c8,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide,
      });
    const buildWindowGrid = (
      cols: number,
      rows: number,
      width: number,
      height: number,
      yCenter: number,
      zFront: number,
    ) => {
      const cellW = width / cols;
      const cellH = height / rows;
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const w = cellW * 0.55;
          const h = cellH * 0.6;
          const geo = new THREE.PlaneGeometry(w, h);
          const mesh = new THREE.Mesh(geo, windowMat());
          const x = -width / 2 + cellW / 2 + i * cellW;
          const y = yCenter - height / 2 + cellH / 2 + j * cellH;
          mesh.position.set(x, y, zFront);
          buildingGroup.add(mesh);
          windowPanels.push(mesh);
        }
      }
    };
    buildWindowGrid(4, 3, 2.4, 2.0, -0.6, 0.91);
    buildWindowGrid(3, 2, 2.0, 1.3, 1.4, 0.76);
    buildWindowGrid(2, 2, 1.3, 0.9, 2.8, 0.61);

    buildingGroup.scale.setScalar(0.6);
    buildingGroup.position.y = -0.2;

    // ---------- PARTICLES ----------
    const particleCount = 200;
    const positions = new Float32Array(particleCount * 3);
    const seeds = new Float32Array(particleCount);
    for (let i = 0; i < particleCount; i++) {
      const r = 3 + Math.random() * 2.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.6;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      seeds[i] = Math.random() * 1000;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x8bafd4,
      size: 0.025,
      transparent: true,
      opacity: 0.4,
      sizeAttenuation: true,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // ---------- ANIMATION LOOP ----------
    let raf = 0;
    let inView = true;
    const clock = new THREE.Clock();
    const tick = () => {
      const t = clock.getElapsedTime();
      // Particle drift
      const arr = pGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const s = seeds[i];
        arr[i * 3] += Math.sin(t * 0.3 + s) * 0.0008;
        arr[i * 3 + 1] += Math.cos(t * 0.25 + s) * 0.0006;
        arr[i * 3 + 2] += Math.sin(t * 0.2 + s * 0.5) * 0.0008;
      }
      pGeo.attributes.position.needsUpdate = true;
      particles.rotation.y = t * 0.02;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    // Pause render when not in view
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          inView = e.isIntersecting;
          if (inView && !raf) tick();
          if (!inView && raf) {
            cancelAnimationFrame(raf);
            raf = 0;
          }
        });
      },
      { threshold: 0 },
    );
    io.observe(section);

    const onResize = () => {
      if (!mount) return;
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // ---------- GSAP CONTEXT ----------
    const ctx = gsap.context(() => {
      // Idle infinite Y rotation
      const idleSpin = gsap.to(buildingGroup.rotation, {
        y: "+=6.28318",
        duration: 24,
        repeat: -1,
        ease: "none",
      });

      // Master scroll timeline
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: 2,
          pin: ".closing-pin",
          pinSpacing: true,
        },
      });

      // PHASE 1 (0 - 0.2): emergence
      tl.fromTo(
        buildingGroup.position,
        { y: -2.5 },
        { y: -0.2, duration: 0.2 },
        0,
      )
        .fromTo(
          buildingGroup.scale,
          { x: 0.3, y: 0.3, z: 0.3 },
          { x: 0.6, y: 0.6, z: 0.6, duration: 0.2 },
          0,
        )
        .fromTo(
          ghostMat,
          { opacity: 0 },
          { opacity: 0.18, duration: 0.2 },
          0,
        )
        .fromTo(
          accentMat,
          { opacity: 0 },
          { opacity: 0.6, duration: 0.2 },
          0,
        )
        .fromTo(
          phase1Ref.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.1 },
          0.05,
        )
        // PHASE 2 (0.2 - 0.5): rotation showcase
        .to(buildingGroup.scale, { x: 1.2, y: 1.2, z: 1.2, duration: 0.3 }, 0.2)
        .to(buildingGroup.rotation, { x: 0.3, duration: 0.3 }, 0.2)
        .to(camera.position, { z: 6, x: 0.6, duration: 0.3 }, 0.2)
        .to(phase1Ref.current, { opacity: 0, duration: 0.05 }, 0.2)
        .fromTo(
          phase2Ref.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.1 },
          0.25,
        )
        // PHASE 3 (0.5 - 0.75): zoom & detail
        .to(buildingGroup.scale, { x: 1.0, y: 1.0, z: 1.0, duration: 0.25 }, 0.5)
        .to(buildingGroup.rotation, { x: 0.1, duration: 0.25 }, 0.5)
        .to(camera.position, { z: 3.5, x: 0, duration: 0.25 }, 0.5)
        .to(phase2Ref.current, { opacity: 0, duration: 0.1 }, 0.5)
        // PHASE 4 (0.75 - 1.0): final CTA
        .to(camera.position, { z: 5, duration: 0.25 }, 0.75)
        .to(buildingGroup.scale, { x: 0.7, y: 0.7, z: 0.7, duration: 0.25 }, 0.75)
        .to(buildingGroup.position, { x: 1.6, duration: 0.25 }, 0.75)
        .fromTo(
          ctaRef.current,
          { opacity: 0 },
          { opacity: 1, duration: 0.05 },
          0.78,
        );

      // Window illumination pulse during phase 3
      gsap.to(windowPanels, {
        opacity: 0.4,
        duration: 1.4,
        stagger: { each: 0.04, from: "random" },
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        scrollTrigger: {
          trigger: section,
          start: "top -50%",
          end: "top -100%",
          toggleActions: "play pause resume reset",
        },
      });

      // Accent pulse
      gsap.to(accentMat, {
        opacity: 0.85,
        duration: 1.6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        scrollTrigger: {
          trigger: section,
          start: "top -40%",
          end: "top -90%",
          toggleActions: "play pause resume reset",
        },
      });

      // CTA stagger reveal (independent ScrollTrigger over phase 4)
      const ctaItems = ctaRef.current?.querySelectorAll<HTMLElement>(
        "[data-cta-item]",
      );
      if (ctaItems && ctaItems.length) {
        gsap.fromTo(
          ctaItems,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            ease: "power3.out",
            scrollTrigger: {
              trigger: section,
              start: "top -270%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      // Decorative line draw
      const decoLine = ctaRef.current?.querySelector<HTMLElement>(
        "[data-deco-line]",
      );
      if (decoLine) {
        gsap.fromTo(
          decoLine,
          { width: "0%" },
          {
            width: "4rem",
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top -260%",
              toggleActions: "play none none reverse",
            },
          },
        );
      }

      // Headline char split
      if (headlineRef.current) {
        const text = headlineRef.current.dataset.text || "";
        headlineRef.current.innerHTML = text
          .split("")
          .map((c) =>
            c === " "
              ? `<span class="inline-block">&nbsp;</span>`
              : `<span class="inline-block opacity-0 translate-y-6">${c}</span>`,
          )
          .join("");
        gsap.to(headlineRef.current.querySelectorAll("span"), {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.02,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top -280%",
            toggleActions: "play none none reverse",
          },
        });
      }

      // Curtain in
      gsap.fromTo(
        curtainRef.current,
        { yPercent: -100 },
        {
          yPercent: 100,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 20%",
            scrub: 1.2,
          },
        },
      );

      return () => {
        idleSpin.kill();
      };
    }, section);

    return () => {
      ctx.revert();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
      renderer.dispose();
      pGeo.dispose();
      pMat.dispose();
      ghostMat.dispose();
      accentMat.dispose();
      colMat.dispose();
      windowPanels.forEach((m) => {
        m.geometry.dispose();
        (m.material as THREE.Material).dispose();
      });
      scene.traverse((obj) => {
        const mesh = obj as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
      });
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [isMobile]);

  // ---------- MOBILE FALLBACK ----------
  useEffect(() => {
    if (!isMobile) return;
    const section = sectionRef.current;
    if (!section) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        section.querySelectorAll("[data-mobile-fade]"),
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 70%" },
        },
      );
    }, section);
    return () => ctx.revert();
  }, [isMobile]);

  if (isMobile) {
    return (
      <section
        ref={sectionRef}
        className="relative w-full overflow-hidden bg-[#0a0a0a] py-24 px-6 text-foreground"
      >
        <div className="mx-auto max-w-xl flex flex-col items-start gap-8">
          <svg
            data-mobile-fade
            viewBox="0 0 200 240"
            className="w-48 self-center opacity-80"
            fill="none"
            stroke="white"
            strokeWidth="1"
          >
            <rect x="40" y="120" width="120" height="100" />
            <rect x="55" y="80" width="100" height="50" />
            <rect x="70" y="50" width="70" height="35" />
            <rect x="85" y="30" width="40" height="22" />
            <line x1="40" y1="220" x2="160" y2="220" stroke="#00D4FF" />
            <line x1="55" y1="130" x2="155" y2="130" stroke="#00D4FF" />
            <line x1="70" y1="85" x2="140" y2="85" stroke="#00D4FF" />
          </svg>
          <span
            data-mobile-fade
            className="font-mono-mini text-[#8BAFD4]"
          >
            CLP ENGENHARIA CONSULTIVA
          </span>
          <h2
            data-mobile-fade
            className="font-display text-4xl leading-[1.05] tracking-tight"
          >
            Decisões técnicas que constroem o futuro.
          </h2>
          <p data-mobile-fade className="text-base text-muted-foreground">
            Projetos, perícias, avaliações e orçamentos com precisão, agilidade
            e respaldo profissional.
          </p>
          <div data-mobile-fade className="flex flex-col gap-3 w-full">
            <a
              href="#contato"
              className="inline-flex items-center justify-center rounded-none bg-white px-6 py-3 text-sm font-medium text-black"
            >
              Solicitar Proposta
            </a>
            <a
              href="https://wa.me/"
              className="inline-flex items-center justify-center rounded-none border border-white/80 px-6 py-3 text-sm font-medium text-white"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      className="relative w-full bg-[#0a0a0a]"
      style={{ height: "500vh" }}
    >
      <div className="closing-pin relative h-screen w-full overflow-hidden">
        {/* Curtain transition */}
        <div
          ref={curtainRef}
          className="pointer-events-none absolute inset-0 z-30 bg-[#0a0a0a]"
          style={{ willChange: "transform" }}
        />

        {/* 3D canvas */}
        <div
          ref={canvasMountRef}
          className="absolute inset-0 z-0"
          aria-hidden="true"
          style={{ willChange: "transform" }}
        />

        {/* Phase 1 text */}
        <div
          ref={phase1Ref}
          className="absolute left-1/2 top-[12%] z-10 -translate-x-1/2 text-center opacity-0"
        >
          <p className="font-mono-mini tracking-[0.25em] text-[#8BAFD4]">
            FASE I
          </p>
          <p className="mt-3 font-display text-2xl text-white/85 md:text-3xl">
            Cada projeto começa com uma visão.
          </p>
        </div>

        {/* Phase 2 text */}
        <div
          ref={phase2Ref}
          className="absolute left-1/2 top-[12%] z-10 -translate-x-1/2 text-center opacity-0"
        >
          <p className="font-mono-mini tracking-[0.25em] text-[#8BAFD4]">
            FASE II
          </p>
          <p className="mt-3 font-display text-2xl text-white/85 md:text-3xl">
            E termina com precisão que você pode confiar.
          </p>
        </div>

        {/* Phase 4 — final CTA */}
        <div
          ref={ctaRef}
          className="absolute left-0 top-1/2 z-10 w-full max-w-[640px] -translate-y-1/2 px-10 opacity-0 md:px-20"
        >
          <div
            data-deco-line
            className="mb-6 h-px bg-[#00D4FF]"
            style={{ width: 0 }}
          />
          <span
            data-cta-item
            className="font-mono-mini tracking-[0.3em] text-[#8BAFD4]"
          >
            CLP ENGENHARIA CONSULTIVA
          </span>
          <h2
            ref={headlineRef}
            data-cta-item
            data-text="Decisões técnicas que constroem o futuro."
            className="mt-6 font-display text-5xl leading-[1.02] tracking-tight text-white md:text-6xl"
          >
            Decisões técnicas que constroem o futuro.
          </h2>
          <p
            data-cta-item
            className="mt-6 max-w-md text-base leading-relaxed text-white/70 md:text-lg"
          >
            Projetos, perícias, avaliações e orçamentos com precisão, agilidade
            e respaldo profissional.
          </p>
          <div data-cta-item className="mt-10 flex flex-wrap gap-4">
            <a
              href="#contato"
              className="group inline-flex items-center justify-center rounded-none bg-white px-7 py-4 text-sm font-medium tracking-wide text-black transition-transform duration-300 hover:scale-[1.02]"
            >
              Solicitar Proposta
            </a>
            <a
              href="https://wa.me/"
              className="inline-flex items-center justify-center rounded-none border border-white/80 px-7 py-4 text-sm font-medium tracking-wide text-white transition-colors duration-300 hover:bg-white hover:text-black"
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>

        {/* Bottom signature */}
        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
          <span className="font-mono-mini tracking-[0.4em] text-white/30">
            FIM · CLP
          </span>
        </div>
      </div>
    </section>
  );
}
