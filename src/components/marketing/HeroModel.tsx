"use client";

import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, ContactShadows } from "@react-three/drei";
import * as THREE from "three";

function Model() {
  const { scene } = useGLTF("/models/3dmates-hero.glb");
  const groupRef = useRef<THREE.Group>(null);
  const scrollRef = useRef(0);
  const maxScrollRef = useRef(1);
  const idleRef = useRef(0);

  // Respect prefers-reduced-motion
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    setReducedMotion(
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }, []);

  // Track scroll position and page height
  useEffect(() => {
    const update = () => {
      scrollRef.current = window.scrollY;
      maxScrollRef.current = Math.max(
        1,
        document.documentElement.scrollHeight - window.innerHeight
      );
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  // Center and scale the model
  useEffect(() => {
    if (scene) {
      const box = new THREE.Box3().setFromObject(scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 3.2 / maxDim;

      scene.scale.setScalar(scale);
      scene.position.set(-center.x * scale, -center.y * scale, -center.z * scale);

      // Apply premium material tweaks
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          if (child.material) {
            const mat = child.material as THREE.MeshStandardMaterial;
            if (mat.metalness !== undefined) {
              mat.metalness = Math.max(mat.metalness, 0.3);
              mat.roughness = Math.min(mat.roughness, 0.6);
              mat.envMapIntensity = 1.5;
            }
          }
        }
      });
    }
  }, [scene]);

  useFrame((_, delta) => {
    if (!groupRef.current || reducedMotion) return;

    // Gentle idle float
    idleRef.current += delta;
    const floatY = Math.sin(idleRef.current * 0.8) * 0.06;
    const floatX = Math.sin(idleRef.current * 0.5) * 0.02;

    // Scroll-based rotation: full 360 degrees over page scroll
    // scrollProgress goes from 0 to 1 as user scrolls the full page
    const scrollProgress = scrollRef.current / maxScrollRef.current;
    // Map to a full rotation (2 * PI = 360 degrees)
    const scrollRotation = scrollProgress * Math.PI * 2;

    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      -0.3 + scrollRotation,
      0.06
    );
    groupRef.current.position.y = THREE.MathUtils.lerp(
      groupRef.current.position.y,
      floatY - 0.2,
      0.08
    );
    groupRef.current.position.x = floatX;

    // Gentle tilt on scroll for depth feel
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      Math.sin(scrollProgress * Math.PI) * 0.1,
      0.05
    );
  });

  return (
    <group ref={groupRef} rotation={[0, -0.3, 0]} position={[0, -0.2, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function SceneLighting() {
  return (
    <>
      {/* Key light - warm teal tint */}
      <directionalLight
        position={[5, 8, 5]}
        intensity={1.8}
        color="#e0f7fa"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Fill light - soft cyan */}
      <directionalLight
        position={[-4, 3, -3]}
        intensity={0.6}
        color="#0FB6C8"
      />

      {/* Rim/back light for edge definition */}
      <directionalLight
        position={[0, 2, -6]}
        intensity={0.8}
        color="#0DD9EF"
      />

      {/* Subtle bottom fill */}
      <directionalLight
        position={[0, -3, 2]}
        intensity={0.2}
        color="#0FB6C8"
      />

      {/* Ambient base */}
      <ambientLight intensity={0.3} color="#b0bec5" />

      {/* Point light for teal glow accent */}
      <pointLight position={[2, 0, 3]} intensity={0.5} color="#0FB6C8" distance={10} decay={2} />
    </>
  );
}

function CameraRig() {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0.3, 4.8);
    camera.lookAt(0, -0.1, 0);
  }, [camera]);

  return null;
}

function FallbackPlaceholder() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="relative">
        <div className="h-32 w-32 rounded-full bg-cyan/5 animate-pulse" />
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(15, 182, 200, 0.15) 0%, transparent 70%)",
          }}
        />
      </div>
    </div>
  );
}

export default function HeroModel() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-full w-full">
        <FallbackPlaceholder />
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.2,
        }}
        dpr={[1, 1.5]}
        camera={{ fov: 40, near: 0.1, far: 100 }}
        style={{ background: "transparent" }}
      >
        <CameraRig />
        <SceneLighting />
        <Environment preset="city" environmentIntensity={0.4} />
        <Suspense fallback={null}>
          <Model />
          <ContactShadows
            position={[0, -1.8, 0]}
            opacity={0.3}
            scale={8}
            blur={2.5}
            far={4}
            color="#0FB6C8"
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Preload the model
useGLTF.preload("/models/3dmates-hero.glb");
