/**
 * 3D Anti-Gravity Simulator using React Three Fiber.
 * High-performance physics simulation with interactive gravity dial,
 * multiple geometries, attractor/repulsor fields, and presets.
 */
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars, Float } from '@react-three/drei';
import * as THREE from 'three';
import PageTransition from '../components/PageTransition';
import GlowCard from '../components/GlowCard';
import NeonButton from '../components/NeonButton';

const THEMES = {
  cyberpunk: { name: 'Cyberpunk', c1: '#00f5ff', c2: '#a855f7', c3: '#ec4899', starColor: '#a855f7' },
  solar: { name: 'Solar', c1: '#f59e0b', c2: '#ef4444', c3: '#fbbf24', starColor: '#f59e0b' },
  matrix: { name: 'Matrix', c1: '#10b981', c2: '#06b6d4', c3: '#84cc16', starColor: '#10b981' },
};

const GRAVITY_PRESETS = [
  { label: 'Hyper Anti-G (-2.5G)', value: -2.5 },
  { label: 'Anti-G (-1.0G)', value: -1.0 },
  { label: 'Zero-G (0.0G)', value: 0.0 },
  { label: 'Moon (0.16G)', value: 0.16 },
  { label: 'Mars (0.38G)', value: 0.38 },
  { label: 'Earth (1.0G)', value: 1.0 },
  { label: 'Jupiter (2.5G)', value: 2.5 },
];

const PhysicsObject = ({
  initialPosition,
  shapeType,
  gravity,
  repelVectorRef,
  forceMode,
  forceStrength,
  damping,
  wireframe,
  colors,
}) => {
  const meshRef = useRef();
  const velocity = useRef(
    new THREE.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2)
  );
  const tempPos = new THREE.Vector3();
  const force = new THREE.Vector3();

  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const clampedDelta = Math.min(delta, 0.1);

    // Apply directional gravity
    velocity.current.y -= gravity * clampedDelta * 9.8;

    // Apply damping / vacuum friction
    velocity.current.multiplyScalar(Math.pow(damping, clampedDelta * 60));

    // Cursor field interaction (repel vs attract)
    const repelVec = repelVectorRef.current;
    if (repelVec && repelVec.x < 9000) {
      tempPos.copy(meshRef.current.position);
      const dist = tempPos.distanceTo(repelVec);
      if (dist < 8 && dist > 0.15) {
        if (forceMode === 'repel') {
          force.subVectors(tempPos, repelVec).normalize().multiplyScalar((forceStrength * 18) / (dist * dist + 1));
        } else {
          force.subVectors(repelVec, tempPos).normalize().multiplyScalar((forceStrength * 18) / (dist * dist + 1));
        }
        velocity.current.addScaledVector(force, clampedDelta);
      }
    }

    // Limit maximum velocity for stability
    if (velocity.current.lengthSq() > 900) {
      velocity.current.setLength(30);
    }

    meshRef.current.position.addScaledVector(velocity.current, clampedDelta * 3);

    // Boundary bounce constraints
    const bounds = 8.5;
    const restitution = -0.78;

    if (meshRef.current.position.y < -bounds) {
      meshRef.current.position.y = -bounds;
      velocity.current.y *= restitution;
      velocity.current.x += (Math.random() - 0.5) * 0.5;
    } else if (meshRef.current.position.y > bounds) {
      meshRef.current.position.y = bounds;
      velocity.current.y *= restitution;
    }

    if (Math.abs(meshRef.current.position.x) > bounds) {
      meshRef.current.position.x = Math.sign(meshRef.current.position.x) * bounds;
      velocity.current.x *= restitution;
    }
    if (Math.abs(meshRef.current.position.z) > bounds) {
      meshRef.current.position.z = Math.sign(meshRef.current.position.z) * bounds;
      velocity.current.z *= restitution;
    }

    // Rotation relative to motion
    const speed = velocity.current.length();
    meshRef.current.rotation.x += (speed * 0.4 + 0.3) * clampedDelta;
    meshRef.current.rotation.y += (speed * 0.5 + 0.4) * clampedDelta;
  });

  const objectColor = useMemo(() => {
    if (shapeType === 'cube') return colors.c2;
    if (shapeType === 'sphere') return colors.c1;
    if (shapeType === 'torus') return colors.c3;
    return colors.c1;
  }, [shapeType, colors]);

  const renderGeometry = () => {
    switch (shapeType) {
      case 'cube':
        return <boxGeometry args={[0.9, 0.9, 0.9]} />;
      case 'sphere':
        return <sphereGeometry args={[0.55, 24, 24]} />;
      case 'torus':
        return <torusGeometry args={[0.5, 0.2, 16, 32]} />;
      case 'tetrahedron':
      default:
        return <tetrahedronGeometry args={[0.7, 0]} />;
    }
  };

  return (
    <mesh ref={meshRef} position={initialPosition} castShadow receiveShadow>
      {renderGeometry()}
      <meshStandardMaterial
        color={objectColor}
        roughness={0.2}
        metalness={0.7}
        wireframe={wireframe}
        emissive={objectColor}
        emissiveIntensity={0.25}
      />
    </mesh>
  );
};

const SceneManager = ({
  objects,
  gravity,
  forceMode,
  forceStrength,
  damping,
  wireframe,
  theme,
}) => {
  const { mouse, camera } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const intersectPoint = useMemo(() => new THREE.Vector3(), []);
  const repelVectorRef = useRef(new THREE.Vector3(9999, 9999, 9999));
  const pointerVisualRef = useRef();

  useFrame(() => {
    raycaster.setFromCamera(mouse, camera);
    if (raycaster.ray.intersectPlane(plane, intersectPoint)) {
      repelVectorRef.current.copy(intersectPoint);
      if (pointerVisualRef.current) {
        pointerVisualRef.current.position.copy(intersectPoint);
      }
    }
  });

  const colors = THEMES[theme] || THEMES.cyberpunk;

  return (
    <>
      {/* Visual Cursor Indicator */}
      <mesh ref={pointerVisualRef} position={[9999, 9999, 9999]}>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshBasicMaterial
          color={forceMode === 'repel' ? colors.c1 : colors.c2}
          wireframe
        />
      </mesh>

      {/* Physics Objects */}
      {objects.map((obj) => (
        <PhysicsObject
          key={obj.id}
          initialPosition={obj.position}
          shapeType={obj.shapeType}
          gravity={gravity}
          repelVectorRef={repelVectorRef}
          forceMode={forceMode}
          forceStrength={forceStrength}
          damping={damping}
          wireframe={wireframe}
          colors={colors}
        />
      ))}
    </>
  );
};

const Simulator = () => {
  const [gravity, setGravity] = useState(0.0);
  const [forceMode, setForceMode] = useState('repel'); // 'repel' | 'attract'
  const [forceStrength, setForceStrength] = useState(1.5);
  const [damping, setDamping] = useState(0.985);
  const [wireframe, setWireframe] = useState(false);
  const [theme, setTheme] = useState('cyberpunk');

  const createInitialObjects = (count = 24) => {
    const shapes = ['cube', 'sphere', 'torus', 'tetrahedron'];
    return Array.from({ length: count }).map((_, i) => ({
      id: `${Date.now()}-${i}`,
      position: [
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 8,
      ],
      shapeType: shapes[i % shapes.length],
    }));
  };

  const [objects, setObjects] = useState(() => createInitialObjects(24));

  const spawnMore = (count = 6) => {
    const shapes = ['cube', 'sphere', 'torus', 'tetrahedron'];
    const newItems = Array.from({ length: count }).map((_, i) => ({
      id: `${Date.now()}-spawn-${Math.random()}`,
      position: [
        (Math.random() - 0.5) * 6,
        4 + Math.random() * 3,
        (Math.random() - 0.5) * 6,
      ],
      shapeType: shapes[Math.floor(Math.random() * shapes.length)],
    }));
    setObjects((prev) => [...prev, ...newItems]);
  };

  const resetObjects = () => {
    setObjects(createInitialObjects(24));
  };

  const clearObjects = () => {
    setObjects([]);
  };

  const currentTheme = THEMES[theme];

  return (
    <PageTransition className="flex flex-col lg:flex-row gap-6 max-h-[88vh] h-[88vh] overflow-hidden !py-0">
      {/* Side Control Panel */}
      <aside className="w-full lg:w-96 flex-shrink-0 z-10 flex flex-col gap-4 overflow-y-auto pr-1">
        <GlowCard className="p-5">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-bold neon-text">Graviton Control</h2>
            <span
              className={`text-xs px-2 py-0.5 rounded font-orbitron uppercase border ${
                gravity < 0
                  ? 'text-neon-cyan border-neon-cyan/50 bg-neon-cyan/10'
                  : gravity === 0
                  ? 'text-yellow-400 border-yellow-400/50 bg-yellow-400/10'
                  : 'text-neon-purple border-neon-purple/50 bg-neon-purple/10'
              }`}
            >
              {gravity < 0 ? 'Anti-G' : gravity === 0 ? 'Zero-G' : 'Positive-G'}
            </span>
          </div>

          {/* Slider */}
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-1 font-rajdhani">
              <span className="text-gray-300">Gravity Scale:</span>
              <span className="text-neon-cyan font-mono font-bold">
                {gravity > 0 ? `+${gravity.toFixed(2)}` : gravity.toFixed(2)} G ({(gravity * 9.8).toFixed(1)} m/s²)
              </span>
            </div>
            <input
              type="range"
              min="-2.5"
              max="2.5"
              step="0.05"
              value={gravity}
              onChange={(e) => setGravity(parseFloat(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-white/20 accent-neon-cyan"
            />
            <div className="flex justify-between text-[10px] mt-1 text-gray-400 font-mono">
              <span>-2.5G</span>
              <span>-1.0G</span>
              <span>0.0G</span>
              <span>+1.0G</span>
              <span>+2.5G</span>
            </div>
          </div>

          {/* Gravity Presets */}
          <div className="mb-4">
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-bold">
              Orbital Presets
            </label>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              {GRAVITY_PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setGravity(preset.value)}
                  className={`py-1.5 px-2 rounded border transition text-left truncate font-rajdhani text-xs ${
                    Math.abs(gravity - preset.value) < 0.04
                      ? 'border-neon-cyan bg-neon-cyan/20 text-white font-bold'
                      : 'border-white/10 hover:border-white/30 text-gray-300 bg-black/30'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Cursor Interaction Mode */}
          <div className="mb-4">
            <label className="block text-xs uppercase tracking-wider text-gray-400 mb-2 font-bold">
              Cursor Field Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setForceMode('repel')}
                className={`py-2 rounded border font-orbitron text-xs transition ${
                  forceMode === 'repel'
                    ? 'border-neon-cyan bg-neon-cyan/20 text-neon-cyan font-bold shadow-[0_0_10px_rgba(0,245,255,0.3)]'
                    : 'border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                ⚡ Repulsor
              </button>
              <button
                onClick={() => setForceMode('attract')}
                className={`py-2 rounded border font-orbitron text-xs transition ${
                  forceMode === 'attract'
                    ? 'border-neon-purple bg-neon-purple/20 text-neon-purple font-bold shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                    : 'border-white/10 text-gray-400 hover:text-white'
                }`}
              >
                🌀 Singularity
              </button>
            </div>
          </div>

          {/* Sliders: Force & Damping */}
          <div className="space-y-3 mb-4 text-xs">
            <div>
              <div className="flex justify-between text-gray-300 mb-1">
                <span>Field Intensity:</span>
                <span className="font-mono text-neon-cyan">{forceStrength.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="3.0"
                step="0.1"
                value={forceStrength}
                onChange={(e) => setForceStrength(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded accent-neon-cyan cursor-pointer"
              />
            </div>
            <div>
              <div className="flex justify-between text-gray-300 mb-1">
                <span>Vacuum Medium:</span>
                <span className="font-mono text-neon-purple">
                  {damping > 0.99 ? 'Deep Space (No Drag)' : damping > 0.96 ? 'Low Gas' : 'Dense Fluid'}
                </span>
              </div>
              <input
                type="range"
                min="0.94"
                max="0.999"
                step="0.005"
                value={damping}
                onChange={(e) => setDamping(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-white/20 rounded accent-neon-purple cursor-pointer"
              />
            </div>
          </div>

          {/* Theme & Display Options */}
          <div className="flex justify-between items-center pt-3 border-t border-white/10 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-gray-400 mr-1">Theme:</span>
              {Object.keys(THEMES).map((key) => (
                <button
                  key={key}
                  onClick={() => setTheme(key)}
                  className={`w-5 h-5 rounded-full border transition ${
                    theme === key ? 'scale-125 border-white' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: THEMES[key].c1 }}
                  title={THEMES[key].name}
                />
              ))}
            </div>
            <button
              onClick={() => setWireframe(!wireframe)}
              className={`px-2.5 py-1 rounded border text-[11px] transition ${
                wireframe
                  ? 'border-neon-cyan text-neon-cyan bg-neon-cyan/20'
                  : 'border-white/15 text-gray-400 hover:text-white'
              }`}
            >
              {wireframe ? 'Wireframe: ON' : 'Solid Mesh'}
            </button>
          </div>
        </GlowCard>

        {/* Spawner Controls Card */}
        <GlowCard className="p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-bold text-gray-300">Matter Spawner</span>
            <span className="text-xs font-mono text-neon-cyan">{objects.length} Active Bodies</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <button
              onClick={() => spawnMore(6)}
              className="py-1.5 px-2 rounded border border-neon-cyan/50 text-neon-cyan hover:bg-neon-cyan/15 transition font-orbitron"
            >
              + Spawn 6
            </button>
            <button
              onClick={resetObjects}
              className="py-1.5 px-2 rounded border border-white/20 text-gray-300 hover:bg-white/10 transition font-orbitron"
            >
              Reset
            </button>
            <button
              onClick={clearObjects}
              className="py-1.5 px-2 rounded border border-red-500/40 text-red-400 hover:bg-red-500/15 transition font-orbitron"
            >
              Clear
            </button>
          </div>
        </GlowCard>
      </aside>

      {/* 3D Canvas Viewport */}
      <div className="flex-1 glass-card overflow-hidden relative w-full h-[55vh] lg:h-full border border-white/15 rounded-2xl shadow-[0_0_30px_rgba(0,245,255,0.08)]">
        <Canvas camera={{ position: [0, 0, 16], fov: 55 }}>
          <ambientLight intensity={0.4} />
          <pointLight position={[12, 12, 12]} intensity={1.5} color={currentTheme.c1} />
          <pointLight position={[-12, -12, -12]} intensity={1.5} color={currentTheme.c2} />
          <pointLight position={[0, 15, -5]} intensity={1.0} color={currentTheme.c3} />
          <Stars radius={50} depth={50} count={3500} factor={4} saturation={0.5} />

          <SceneManager
            objects={objects}
            gravity={gravity}
            forceMode={forceMode}
            forceStrength={forceStrength}
            damping={damping}
            wireframe={wireframe}
            theme={theme}
          />

          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            maxDistance={25}
            minDistance={4}
          />
        </Canvas>

        {/* Live HUD Overlay */}
        <div className="absolute top-4 left-4 pointer-events-none bg-black/60 backdrop-blur-md px-3 py-2 rounded-lg text-xs font-mono border border-white/15 flex flex-col gap-1 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="text-gray-300">
              PHYSICS ENGINE: <span className="text-neon-cyan font-bold">ONLINE</span>
            </span>
          </div>
          <div className="text-gray-400">
            FIELD: <span className="text-neon-purple font-bold uppercase">{forceMode}</span> ({forceStrength.toFixed(1)}x)
          </div>
          <div className="text-gray-400">
            BODIES: <span className="text-white font-bold">{objects.length}</span>
          </div>
        </div>

        <div className="absolute bottom-4 left-4 right-4 pointer-events-none flex justify-between items-center">
          <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs text-gray-300 border border-white/10">
            🖱️ Move mouse to <span className="text-neon-cyan font-bold">{forceMode}</span> objects | Drag mouse to Orbit
          </div>
          <div className="hidden sm:block bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-xs font-mono text-gray-400 border border-white/10">
            BOUNDS: [-8.5, +8.5]
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Simulator;
