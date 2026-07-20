"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function ParticleGlobe() {
  const ref = useRef<THREE.Points>(null);
  const swooshRef = useRef<THREE.Mesh>(null);

  const { positions, colors } = useMemo(() => {
    const COUNT = 2600;
    const positions = new Float32Array(COUNT * 3);
    const colors = new Float32Array(COUNT * 3);
    const c1 = new THREE.Color("#38bdf8");
    const c2 = new THREE.Color("#2563eb");
    const c3 = new THREE.Color("#93c5fd");
    for (let i = 0; i < COUNT; i++) {
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = Math.random() * Math.PI * 2;
      const r = 1.55 + (Math.random() - 0.5) * 0.06;
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      const c = Math.random() < 0.5 ? c1.clone().lerp(c2, Math.random()) : c3;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }
    return { positions, colors };
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.12;
      ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.08;
    }
    if (swooshRef.current) {
      swooshRef.current.rotation.z -= delta * 0.25;
    }
  });

  return (
    <group rotation={[0.15, 0, -0.12]}>
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={0.028}
          vertexColors
          transparent
          opacity={0.95}
          sizeAttenuation
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      {/* Inner glow core */}
      <mesh>
        <sphereGeometry args={[1.42, 32, 32]} />
        <meshBasicMaterial color="#0a1b3d" transparent opacity={0.85} />
      </mesh>

      {/* Swoosh ring */}
      <mesh ref={swooshRef} rotation={[Math.PI / 2.35, 0, 0]}>
        <torusGeometry args={[1.95, 0.012, 8, 128]} />
        <meshBasicMaterial color="#38bdf8" transparent opacity={0.75} />
      </mesh>
      <mesh rotation={[Math.PI / 2.6, 0.3, 0]}>
        <torusGeometry args={[2.15, 0.006, 8, 128]} />
        <meshBasicMaterial color="#2563eb" transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function Starfield() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const COUNT = 900;
    const arr = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 22;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 3;
    }
    return arr;
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.008;
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.15;
    }
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#bfdbfe"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function FloatingOrbs() {
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!group.current) return;
    const t = state.clock.elapsedTime;
    group.current.children.forEach((child, i) => {
      child.position.y = Math.sin(t * 0.5 + i * 1.7) * 0.35 + (i % 2 === 0 ? 1.4 : -1.2);
      child.position.x = Math.cos(t * 0.3 + i * 2.1) * 0.5 + (i - 1.5) * 2.2;
    });
  });

  const orbs = [
    { color: "#38bdf8", size: 0.07 },
    { color: "#2563eb", size: 0.1 },
    { color: "#7dd3fc", size: 0.05 },
    { color: "#3b82f6", size: 0.08 },
  ];

  return (
    <group ref={group}>
      {orbs.map((o, i) => (
        <mesh key={i}>
          <sphereGeometry args={[o.size, 16, 16]} />
          <meshBasicMaterial color={o.color} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}

export default function ThreeBackground() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return (
    <div className="absolute inset-0" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0, 5.2], fov: 50 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        <group position={isDesktop ? [1.6, 0.1, 0] : [0, 0.9, -0.6]}>
          <ParticleGlobe />
        </group>
        <Starfield />
        <FloatingOrbs />
      </Canvas>
    </div>
  );
}
