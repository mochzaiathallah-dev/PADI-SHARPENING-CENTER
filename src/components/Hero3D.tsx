"use client";

import React, { useRef, Suspense, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

// ─── Original 3D Scene (No Image Uploaded) ────────────────────────────────────
function BladeAndStone() {
  const groupRef = useRef<THREE.Group>(null);
  const knifeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.25;
    }
    if (knifeRef.current) {
      knifeRef.current.position.y = Math.sin(t * 1.2) * 0.1 + 0.3;
      knifeRef.current.rotation.x = Math.sin(t * 0.7) * 0.06;
      knifeRef.current.rotation.z = Math.cos(t * 0.7) * 0.04 + 0.5;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Sharpening Stone */}
      <mesh position={[0, -0.6, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.4, 0.3, 1.0]} />
        <meshStandardMaterial color="#334155" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Stone Base */}
      <mesh position={[0, -0.8, 0]} receiveShadow>
        <boxGeometry args={[2.6, 0.15, 1.2]} />
        <meshStandardMaterial color="#1e293b" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Floating Knife */}
      <group ref={knifeRef} position={[0, 0.3, 0]}>
        {/* Handle */}
        <mesh position={[-0.8, 0, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 0.6, 12]} />
          <meshStandardMaterial color="#7c2d12" roughness={0.8} metalness={0.0} />
        </mesh>

        {/* Handguard */}
        <mesh position={[-0.48, 0, 0]} castShadow>
          <boxGeometry args={[0.06, 0.22, 0.12]} />
          <meshStandardMaterial color="#ca8a04" roughness={0.3} metalness={0.8} />
        </mesh>

        {/* Blade */}
        <mesh position={[0.2, 0.03, 0]} castShadow>
          <boxGeometry args={[1.3, 0.16, 0.02]} />
          <meshStandardMaterial color="#94a3b8" roughness={0.25} metalness={0.95} />
        </mesh>

        {/* Tip */}
        <mesh position={[0.9, 0.03, 0]} rotation={[0, 0, -Math.PI / 4]} castShadow>
          <boxGeometry args={[0.16, 0.16, 0.02]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.15} metalness={0.98} />
        </mesh>
      </group>
    </group>
  );
}

// ─── Floating Image Plane (Image Uploaded) ─────────────────────────────────────
function FloatingImagePlane({ url }: { url: string }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useTexture(url);

  useEffect(() => {
    if (texture) {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.generateMipmaps = false;
      texture.anisotropy = 4;
      texture.needsUpdate = true;
    }
  }, [texture]);

  const img = texture.image as HTMLImageElement | null;
  const aspect =
    img && img.naturalWidth && img.naturalHeight
      ? img.naturalWidth / img.naturalHeight
      : 4 / 3;

  const planeWidth = 3.0;
  const planeHeight = planeWidth / aspect;

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(t * 0.8) * 0.15;
      meshRef.current.rotation.y = Math.sin(t * 0.3) * 0.45;
      meshRef.current.rotation.x = Math.sin(t * 0.2) * 0.06;
    }
  });

  return (
    <mesh ref={meshRef} castShadow>
      <planeGeometry args={[planeWidth, planeHeight, 1, 1]} />
      <meshStandardMaterial
        map={texture}
        transparent={true}
        alphaTest={0.05}
        side={THREE.DoubleSide}
        roughness={0.25}
        metalness={0.05}
      />
    </mesh>
  );
}

// ─── Main Export ───────────────────────────────────────────────────────────────
export default function Hero3D({ imageUrl }: { imageUrl?: string | null }) {
  return (
    <div className="w-full h-full relative cursor-grab active:cursor-grabbing min-h-[350px] sm:min-h-[500px]">
      {/* Ambient glow backdrop */}
      <div className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse at 50% 50%, hsl(var(--primary) / 0.08) 0%, transparent 70%)"
      }} />

      <Canvas
        camera={{ position: [0, 0.5, 4.5], fov: 42 }}
        shadows={{ type: THREE.BasicShadowMap }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        style={{ background: "transparent", width: "100%", height: "100%" }}
      >
        <ambientLight intensity={1.8} />

        <directionalLight
          position={[4, 7, 4]}
          intensity={2.2}
          castShadow
          shadow-mapSize-width={512}
          shadow-mapSize-height={512}
          color="#fff8f0"
        />

        <directionalLight position={[-4, 2, -4]} intensity={0.6} color="#c7d8ff" />
        <pointLight position={[0, -1.5, 1]} intensity={0.8} color="#f43f5e" />

        <Suspense fallback={null}>
          {imageUrl ? (
            <FloatingImagePlane url={imageUrl} />
          ) : (
            <BladeAndStone />
          )}
        </Suspense>

        <OrbitControls
          enableZoom={false}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={(Math.PI * 3) / 4}
          enableDamping
          dampingFactor={0.08}
        />
      </Canvas>
    </div>
  );
}
