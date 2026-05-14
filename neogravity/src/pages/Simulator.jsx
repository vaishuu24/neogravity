/**
 * 3D Anti-Gravity Simulator using React Three Fiber.
 */
import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import PageTransition from '../components/PageTransition';
import GlowCard from '../components/GlowCard';

const NUM_OBJECTS = 20;

const PhysicsObject = ({ initialPosition, isCube, gravity, repelVector }) => {
  const meshRef = useRef();
  const velocity = useRef(new THREE.Vector3(0, 0, 0));
  const tempPos = new THREE.Vector3();

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    
    velocity.current.y -= gravity * delta * 5; 
    velocity.current.multiplyScalar(0.98);

    if (repelVector && repelVector.lengthSq() > 0) {
      tempPos.copy(meshRef.current.position);
      const distance = tempPos.distanceTo(repelVector);
      if (distance < 5 && distance > 0.1) {
        const force = new THREE.Vector3().subVectors(tempPos, repelVector).normalize().multiplyScalar(1 / distance);
        velocity.current.add(force.multiplyScalar(delta * 10));
      }
    }

    meshRef.current.position.addScaledVector(velocity.current, delta * 10);

    const bounds = 10;
    if (meshRef.current.position.y < -bounds) {
      meshRef.current.position.y = -bounds;
      velocity.current.y *= -0.8;
    } else if (meshRef.current.position.y > bounds) {
      meshRef.current.position.y = bounds;
      velocity.current.y *= -0.8;
    }

    if (Math.abs(meshRef.current.position.x) > bounds) {
      meshRef.current.position.x = Math.sign(meshRef.current.position.x) * bounds;
      velocity.current.x *= -0.8;
    }
    if (Math.abs(meshRef.current.position.z) > bounds) {
      meshRef.current.position.z = Math.sign(meshRef.current.position.z) * bounds;
      velocity.current.z *= -0.8;
    }
    
    meshRef.current.rotation.x += velocity.current.length() * delta;
    meshRef.current.rotation.y += velocity.current.length() * delta;
  });

  return (
    <mesh ref={meshRef} position={initialPosition} castShadow receiveShadow>
      {isCube ? <boxGeometry args={[1, 1, 1]} /> : <sphereGeometry args={[0.6, 32, 32]} />}
      <meshStandardMaterial color={isCube ? '#a855f7' : '#00f5ff'} wireframe={Math.random() > 0.5} />
    </mesh>
  );
};

const SceneManager = ({ gravity }) => {
  const { mouse, camera } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const intersectPoint = useMemo(() => new THREE.Vector3(), []);
  const [repelVector, setRepelVector] = useState(new THREE.Vector3());

  useFrame(() => {
    raycaster.setFromCamera(mouse, camera);
    raycaster.ray.intersectPlane(plane, intersectPoint);
    setRepelVector(intersectPoint.clone());
  });

  const objects = useMemo(() => {
    return Array.from({ length: NUM_OBJECTS }).map((_, i) => ({
      id: i,
      position: [(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5],
      isCube: Math.random() > 0.5,
    }));
  }, []);

  return (
    <>
      {objects.map(obj => (
        <PhysicsObject 
          key={obj.id} 
          initialPosition={obj.position} 
          isCube={obj.isCube} 
          gravity={gravity} 
          repelVector={repelVector} 
        />
      ))}
    </>
  );
};

const Simulator = () => {
  const [gravity, setGravity] = useState(1);

  return (
    <PageTransition className="flex flex-col lg:flex-row gap-6 max-h-[85vh] h-[85vh] overflow-hidden">
      <aside className="w-full lg:w-80 flex-shrink-0 z-10 flex flex-col gap-6">
        <GlowCard>
          <h2 className="text-2xl font-bold neon-text mb-4">Controls</h2>
          
          <div className="mb-6">
            <label className="block text-gray-400 mb-2 font-rajdhani text-lg">Gravity Dial: {gravity.toFixed(2)}</label>
            <input 
              type="range" 
              min="-1" 
              max="1" 
              step="0.1" 
              value={gravity} 
              onChange={(e) => setGravity(parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-white/20 accent-neon-cyan"
            />
            <div className="flex justify-between text-xs mt-1 text-gray-500">
              <span>Anti-G (-1)</span>
              <span>Zero-G (0)</span>
              <span>Earth (1)</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button 
              onClick={() => setGravity(0)}
              className="border border-neon-cyan/50 text-neon-cyan py-2 rounded hover:bg-neon-cyan/10 transition"
            >
              Zero Gravity
            </button>
            <button 
              onClick={() => setGravity(1)}
              className="border border-white/20 py-2 rounded hover:bg-white/10 transition text-gray-300"
            >
              Reset Gravity
            </button>
          </div>
        </GlowCard>
      </aside>

      <div className="flex-1 glass-card overflow-hidden relative w-full h-[50vh] lg:h-full">
        <Canvas camera={{ position: [0, 0, 15], fov: 60 }}>
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1} color="#00f5ff" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#a855f7" />
          <Stars radius={50} depth={50} count={3000} factor={4} />
          
          <SceneManager gravity={gravity} />
          <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
        </Canvas>
        
        <div className="absolute bottom-4 left-4 pointer-events-none bg-black/50 px-3 py-1 rounded text-xs text-gray-400 border border-white/10 shadow-lg">
          Mouse interact: Repel objects | Drag to orbit scene
        </div>
      </div>
    </PageTransition>
  );
};

export default Simulator;
