/**
 * AI Gravity Lab - Dynamic Sci-Fi Blueprint Engine.
 * Generates tailored, rich theoretical anti-gravity inventions based on user prompts
 * with physics metrics, schematics, power ratings, and failure modes.
 * Supports optional external API keys with seamless offline generator fallback.
 */

const TECH_PREFIXES = ['Aether', 'Quantum', 'Gravi', 'Chronos', 'Void', 'Tachyon', 'Singularity', 'Hyper', 'Nexus', 'Flux'];
const TECH_SUFFIXES = ['Array', 'Drive', 'Emitter', 'Inverter', 'Matrix', 'Modulator', 'Resonator', 'Diffractor', 'Lens', 'Conduit'];

const POWER_SOURCES = [
  'Zero-Point Field Fluctuator (3.4 GW)',
  'Micro-Singularity Containment Vessel (12 TW)',
  'Superconducting Diamagnetic Core (850 MW)',
  'Dark Matter Catalyzed Fusion Cell (4.2 GW)',
  'Polarized Graviton Capacitor (6.8 TW)',
  'Tachyon Resonance Battery (920 MW)',
];

export const generateInvention = async (prompt) => {
  // Simulate neural network computation time
  await new Promise((res) => setTimeout(res, 1200));

  const lower = (prompt || '').toLowerCase();

  // Pattern detection
  let category = 'general';
  if (/boot|shoe|suit|wear|armor|person|walk|run/.test(lower)) {
    category = 'wearable';
  } else if (/shield|barrier|defend|contain|protect|hull/.test(lower)) {
    category = 'defense';
  } else if (/cargo|lift|heavy|crane|ton|haul|carry|canyon|truck/.test(lower)) {
    category = 'cargo';
  } else if (/ship|engine|propulsion|speed|warp|fly|travel|orbit/.test(lower)) {
    category = 'propulsion';
  } else if (/mine|mining|drill|asteroid|rock|ore|excavat/.test(lower)) {
    category = 'industrial';
  } else if (/medic|heal|stasis|surgery|hospital|patient|doctor/.test(lower)) {
    category = 'medical';
  }

  const mark = `MK-${Math.floor(Math.random() * 9) + 1}${String.fromCharCode(65 + Math.floor(Math.random() * 6))}`;
  const protoId = `NG-${Math.floor(1000 + Math.random() * 9000)}-${mark}`;
  const powerSource = POWER_SOURCES[Math.floor(Math.random() * POWER_SOURCES.length)];
  const efficiency = (94.5 + Math.random() * 5.3).toFixed(1) + '%';
  const fieldRadius = (3 + Math.random() * 45).toFixed(1) + ' meters';

  let name = '';
  let description = '';
  let useCases = [];
  let physicsPrinciple = '';
  let safetyWarning = '';

  switch (category) {
    case 'wearable':
      name = `Exo-Grav Vector Strides ${mark}`;
      description = `An ergonomic wearable apparatus utilizing sub-dermal graviton dampeners. When activated, it shifts the wearer's effective mass down to 0.05% of Earth gravity, allowing vertical boundary traversal, superhuman leap arcs, and zero-G wall traction.`;
      useCases = [
        'High-angle planetary survey across sheer cliff faces',
        'Emergency zero-G orbital station maintenance without tether risk',
        'Tactical high-mobility surface deployment in hostile atmospheres',
      ];
      physicsPrinciple = 'Localized Higgs boson coupling inversion via micro-coil induction.';
      safetyWarning = 'Avoid sudden termination of power while elevated; manual parachute override recommended.';
      break;

    case 'defense':
      name = `GraviShield Barrier Array ${mark}`;
      description = `A multi-phase repulsion field projector that generates a steep localized space-time curvature gradient. Kinetic ordnance, micro-meteorites, and plasma discharges are deflected along Riemannian geodesic contours before impacting protected structures.`;
      useCases = [
        'Deep-space outpost protection from hypervelocity space debris',
        'Planetary entry heat shield replacement using pure repulsion geometry',
        'Containment barrier for unstable volatile matter reactors',
      ];
      physicsPrinciple = 'Riemannian space-time tensor displacement driven by counter-rotating graviton emitters.';
      safetyWarning = 'Do not step between secondary reflector nodes during active field resonance.';
      break;

    case 'cargo':
      name = `Heavy-Haul Levitation Rig ${mark}`;
      description = `Engineered specifically to solve high-mass logistics: effortlessly hovers multi-ton containers across untamed canyons, open vacuum trenches, and unstable terrain with negligible inertia resistance.`;
      useCases = [
        'Bulk mineral transport across tectonic fissures and canyons',
        'Lunar base modular pod assembly without heavy hydraulic cranes',
        'Shock-free transport of hyper-sensitive scientific payloads',
      ];
      physicsPrinciple = 'Diamagnetic anti-gravity funneling with active harmonic stabilization feedback.';
      safetyWarning = 'Ensure perimeter clearance of 5 meters to prevent inductive electromagnetic coupling with iron alloys.';
      break;

    case 'propulsion':
      name = `Alcubierre Aether-Drive ${mark}`;
      description = `A continuous-distortion propulsion engine that contracts space-time ahead of the vessel while expanding space-time behind it, producing apparent superluminal displacement without violating local special relativity limits.`;
      useCases = [
        'Interplanetary transit within the Sol system reduced to hours',
        'Instantaneous orbital altitude elevation without rocket reaction mass',
        'Gravitational slipstream maneuvers inside planetary gravity wells',
      ];
      physicsPrinciple = 'Negative energy density Casimir cavity arrays coupled with dark-energy flux pumps.';
      safetyWarning = 'Field collapse during transit creates Cherenkov radiation bursts; engage quantum shielding.';
      break;

    case 'industrial':
      name = `Tectonic Ore Displacer ${mark}`;
      description = `Specialized industrial extraction device that creates selective gravity null-zones inside solid rock strata, freeing high-density precious elements and floating core samples directly to atmospheric collectors.`;
      useCases = [
        'Sub-surface asteroid core harvesting without mechanical blasting',
        'Deep sea trench mineral retrieval without extreme pressure hulls',
        'Rapid subterranean shaft excavation and debris ejection',
      ];
      physicsPrinciple = 'Selective mass-density harmonic resonance and gravitational phase decoupling.';
      safetyWarning = 'Uncontrolled resonance can trigger localized seismic fault slip; calibrate before firing.';
      break;

    case 'medical':
      name = `Bio-Grav Stasis Pod ${mark}`;
      description = `A medical isolation cradle that places biological tissue in an absolute zero-strain anti-gravity cradle, eliminating hydrostatic pressure gradients and halting cardiovascular trauma progression.`;
      useCases = [
        'Immediate spinal decompression and critical organ trauma stabilization',
        'Prolonged deep-space hypothermic metabolic stasis during travel',
        'Accelerated micro-cellular stem repair under zero gravity shear stress',
      ];
      physicsPrinciple = 'Micro-scale isotropic counter-gravitational field balancing.';
      safetyWarning = 'Patient vitals require sync with the primary neural shunt monitor.';
      break;

    default:
      const p1 = TECH_PREFIXES[Math.floor(Math.random() * TECH_PREFIXES.length)];
      const s1 = TECH_SUFFIXES[Math.floor(Math.random() * TECH_SUFFIXES.length)];
      name = `${p1}-${s1} System ${mark}`;
      description = `A multi-purpose anti-gravity construct engineered to address: "${prompt}". By producing a coherent negative-mass density bubble, the device cancels ambient gravitational acceleration across all standard dimensional axes.`;
      useCases = [
        'Precision positioning and zero-G alignment in experimental test chambers',
        'Rapid counter-gravitational stabilization during anomalous atmospheric events',
        'Autonomous hovering platform for scientific monitoring and planetary telemetry',
      ];
      physicsPrinciple = 'Dynamic metric inversion through high-frequency graviton oscillation.';
      safetyWarning = 'Maintain operating temperature below 14 Kelvin for superconductor longevity.';
      break;
  }

  return {
    protoId,
    name,
    promptUsed: prompt,
    powerSource,
    efficiency,
    fieldRadius,
    description,
    physicsPrinciple,
    useCases,
    safetyWarning,
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
  };
};
