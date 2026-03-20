'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, OrbitControls, Environment } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';

interface AgencyShapeProps {
  color?: string;
  distort?: number;
  speed?: number;
}

function AgencyShape({ color = '#A5D6A7', distort = 0.4, speed = 2 }: AgencyShapeProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <Float speed={speed} rotationIntensity={1} floatIntensity={1}>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial 
          color={color} 
          speed={speed} 
          distort={distort}
          roughness={0.2}
          metalness={0.8}
        />
      </mesh>
    </Float>
  );
}

interface ThreeAgencyBackgroundProps {
  activeDomain?: string;
  className?: string;
}

export default function ThreeAgencyBackground({ 
  activeDomain = 'healthcare',
  className = "" 
}: ThreeAgencyBackgroundProps) {
  // Map domains to different 3D styles/colors
  const domainProps: Record<string, { color: string; distort: number }> = {
    healthcare: { color: '#A5D6A7', distort: 0.3 },
    fintech:    { color: '#64B5F6', distort: 0.4 },
    ecommerce:  { color: '#FFB74D', distort: 0.5 },
  };

  const current = domainProps[activeDomain] || domainProps.healthcare;

  return (
    <div className={`w-full h-full bg-transparent overflow-hidden relative ${className}`}>
      <Canvas camera={{ position: [0, 0, 4], fov: 75 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <AgencyShape color={current.color} distort={current.distort} />
        
        <Environment preset="city" />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
}
