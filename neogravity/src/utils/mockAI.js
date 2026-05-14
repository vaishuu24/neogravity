/**
 * Mock AI utility to simulate API response for Anti-Gravity Lab.
 */
const inventions = [
  {
    name: "GraviShield MK-VII",
    powerSource: "Dark matter reactor",
    description: "A localized field generator that repels gravitational waves, allowing for complete weightlessness within a 10-meter radius.",
    useCases: ["Deep space module construction", "Terrestrial heavy lifting", "Zero-G medical stasis"]
  },
  {
    name: "Quantum Lev-Boots",
    powerSource: "Miniaturized zero-point module",
    description: "Personal footwear manipulating the Higgs field, granting the user adjustable anti-gravity and smooth traversal over any terrain.",
    useCases: ["Planetary exploration", "Extreme sports", "Search and rescue"]
  },
  {
    name: "Aether-Drive Engine",
    powerSource: "Antimatter containment cell",
    description: "Creates a distortion in space-time to effectively 'fall' forward without being affected by local gravity wells.",
    useCases: ["Interstellar travel", "Near-lightspeed evasion maneuver", "Orbital insertion"]
  },
  {
    name: "Repulsor Pod",
    powerSource: "Magnetic flux capacitor",
    description: "A small, drone-like device that uses advanced magnetics and graviton-blocking materials to float stationary or follow a target.",
    useCases: ["Personal cargo transport", "Aerial camera platform", "Mobile defensive shield"]
  }
];

export const generateInvention = async (keywords) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = Math.floor(Math.random() * inventions.length);
      resolve(inventions[index]);
    }, 1500);
  });
};
