/**
 * Canvas-based Zero Gravity Mini Game.
 * Features realistic inertia physics, asteroid dodging, quantum orb collection,
 * procedural Web Audio SFX, touch/on-screen controls, combo streaks, and high score tracking.
 */
import React, { useEffect, useRef, useState, useCallback } from 'react';
import PageTransition from '../components/PageTransition';
import { useLocalStorage } from '../hooks/useLocalStorage';
import NeonButton from '../components/NeonButton';

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playOrbChime(combo = 1) {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      const baseFreq = 440 * Math.pow(1.15, Math.min(combo, 8));
      osc.type = 'sine';
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.5, now + 0.12);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      // Audio fallback silent
    }
  }

  playHitNoise() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.25);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      // Audio fallback silent
    }
  }

  playGameOver() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.6);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.6);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.6);
    } catch (e) {
      // Audio fallback silent
    }
  }
}

const sounds = new SoundEngine();

const Game = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('start'); // 'start' | 'playing' | 'paused' | 'gameover'
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(90);
  const [combo, setCombo] = useState(0);
  const [muted, setMuted] = useLocalStorage('gravityGameMuted', false);
  const [highScore, setHighScore] = useLocalStorage('gravityGameHighScore', 0);

  const reqRef = useRef();
  const player = useRef({
    x: 400,
    y: 300,
    vx: 0,
    vy: 0,
    radius: 14,
    angle: 0,
    maxSpeed: 5.5,
    hitTime: 0,
  });
  const keys = useRef({});
  const orbs = useRef([]);
  const asteroids = useRef([]);
  const particles = useRef([]);
  const floatingTexts = useRef([]);
  const lastTime = useRef(0);
  const spawnTimer = useRef(0);
  const difficultyMult = useRef(1);
  const shakeTime = useRef(0);
  const lastOrbPickup = useRef(0);

  useEffect(() => {
    sounds.muted = muted;
  }, [muted]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
        e.preventDefault();
      }
      keys.current[e.code] = true;
      if (e.code === 'KeyP') {
        setGameState((prev) => (prev === 'playing' ? 'paused' : prev === 'paused' ? 'playing' : prev));
      }
    };
    const handleKeyUp = (e) => {
      keys.current[e.code] = false;
    };
    const handleBlur = () => {
      keys.current = {};
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  const resetGame = () => {
    sounds.init();
    const container = document.getElementById('game-container');
    const startW = container ? container.clientWidth : 800;
    const startH = container ? container.clientHeight : 500;

    player.current = {
      x: startW / 2,
      y: startH / 2,
      vx: 0,
      vy: 0,
      radius: 14,
      angle: -Math.PI / 2,
      maxSpeed: 5.5,
      hitTime: 0,
    };
    orbs.current = [];
    asteroids.current = [];
    particles.current = [];
    floatingTexts.current = [];
    setScore(0);
    setLives(3);
    setTimeLeft(90);
    setCombo(0);
    difficultyMult.current = 1;
    shakeTime.current = 0;
    setGameState('playing');
    lastTime.current = performance.now();
  };

  // Timer countdown
  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          sounds.playGameOver();
          setGameState('gameover');
          return 0;
        }
        if (prev % 25 === 0) {
          difficultyMult.current += 0.15;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const update = (time) => {
      if (gameState !== 'playing') {
        reqRef.current = requestAnimationFrame(update);
        return;
      }

      const delta = Math.min((time - lastTime.current) / 1000, 0.1);
      lastTime.current = time;
      spawnTimer.current += delta;

      const container = document.getElementById('game-container');
      const width = container ? container.clientWidth : 800;
      const height = container ? container.clientHeight : 500;
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;

      const p = player.current;

      // Handle input thrust
      const isBoosting = keys.current['Space'] || keys.current['TouchBoost'];
      const accel = isBoosting ? 42 : 16;
      let isThrusting = false;

      if (keys.current['ArrowUp'] || keys.current['KeyW'] || keys.current['TouchUp']) {
        p.vy -= accel * delta;
        isThrusting = true;
      }
      if (keys.current['ArrowDown'] || keys.current['KeyS'] || keys.current['TouchDown']) {
        p.vy += accel * delta;
        isThrusting = true;
      }
      if (keys.current['ArrowLeft'] || keys.current['KeyA'] || keys.current['TouchLeft']) {
        p.vx -= accel * delta;
        isThrusting = true;
      }
      if (keys.current['ArrowRight'] || keys.current['KeyD'] || keys.current['TouchRight']) {
        p.vx += accel * delta;
        isThrusting = true;
      }

      // Air resistance / inertia
      p.vx *= 0.985;
      p.vy *= 0.985;

      const speed = Math.hypot(p.vx, p.vy);
      const curMax = isBoosting ? p.maxSpeed * 1.5 : p.maxSpeed;
      if (speed > curMax) {
        p.vx = (p.vx / speed) * curMax;
        p.vy = (p.vy / speed) * curMax;
      }

      if (speed > 0.2) {
        p.angle = Math.atan2(p.vy, p.vx);
      }

      p.x += p.vx;
      p.y += p.vy;

      // Thruster exhaust particles
      if (isThrusting || isBoosting) {
        const exhaustAngle = p.angle + Math.PI + (Math.random() - 0.5) * 0.5;
        const exhaustSpeed = (isBoosting ? 80 : 40) + Math.random() * 40;
        particles.current.push({
          x: p.x - Math.cos(p.angle) * p.radius,
          y: p.y - Math.sin(p.angle) * p.radius,
          vx: Math.cos(exhaustAngle) * exhaustSpeed,
          vy: Math.sin(exhaustAngle) * exhaustSpeed,
          radius: isBoosting ? 2.5 : 1.5,
          color: isBoosting ? '#00f5ff' : '#a855f7',
          life: 0.35 + Math.random() * 0.2,
          maxLife: 0.55,
        });
      }

      // Elastic boundary bounds
      if (p.x < p.radius) {
        p.x = p.radius;
        p.vx *= -0.6;
      }
      if (p.x > width - p.radius) {
        p.x = width - p.radius;
        p.vx *= -0.6;
      }
      if (p.y < p.radius) {
        p.y = p.radius;
        p.vy *= -0.6;
      }
      if (p.y > height - p.radius) {
        p.y = height - p.radius;
        p.vy *= -0.6;
      }

      // Spawn orbs and asteroids
      if (spawnTimer.current > 0.85) {
        spawnTimer.current = 0;
        if (Math.random() > 0.42 || orbs.current.length < 3) {
          orbs.current.push({
            x: 30 + Math.random() * (width - 60),
            y: 30 + Math.random() * (height - 60),
            radius: 9,
            pulse: 0,
            life: 14,
            maxLife: 14,
          });
        } else {
          const side = Math.floor(Math.random() * 4);
          let ax, ay, vx, vy;
          const astSpeed = (55 + Math.random() * 85) * difficultyMult.current;
          if (side === 0) {
            ax = Math.random() * width;
            ay = -25;
            vx = (Math.random() - 0.5) * astSpeed;
            vy = astSpeed;
          } else if (side === 1) {
            ax = width + 25;
            ay = Math.random() * height;
            vx = -astSpeed;
            vy = (Math.random() - 0.5) * astSpeed;
          } else if (side === 2) {
            ax = Math.random() * width;
            ay = height + 25;
            vx = (Math.random() - 0.5) * astSpeed;
            vy = -astSpeed;
          } else {
            ax = -25;
            ay = Math.random() * height;
            vx = astSpeed;
            vy = (Math.random() - 0.5) * astSpeed;
          }

          const baseRadius = 16 + Math.random() * 18;
          const points = 7 + Math.floor(Math.random() * 4);
          const vertices = [];
          for (let k = 0; k < points; k++) {
            const ang = (k / points) * Math.PI * 2;
            const r = baseRadius * (0.7 + Math.random() * 0.5);
            vertices.push({ x: Math.cos(ang) * r, y: Math.sin(ang) * r });
          }

          asteroids.current.push({
            x: ax,
            y: ay,
            vx,
            vy,
            radius: baseRadius,
            angle: 0,
            spin: (Math.random() - 0.5) * 4,
            vertices,
          });
        }
      }

      // Orbs logic
      for (let i = orbs.current.length - 1; i >= 0; i--) {
        const orb = orbs.current[i];
        orb.life -= delta;
        orb.pulse += delta * 4;

        if (orb.life <= 0) {
          orbs.current.splice(i, 1);
          continue;
        }

        const dist = Math.hypot(p.x - orb.x, p.y - orb.y);
        if (dist < p.radius + orb.radius) {
          const nowMs = performance.now();
          const isQuickCombo = nowMs - lastOrbPickup.current < 2500;
          lastOrbPickup.current = nowMs;

          setCombo((c) => {
            const nextCombo = isQuickCombo ? c + 1 : 1;
            const pointsGained = 10 * nextCombo;
            setScore((s) => s + pointsGained);
            sounds.playOrbChime(nextCombo);

            floatingTexts.current.push({
              x: orb.x,
              y: orb.y,
              text: nextCombo > 1 ? `+${pointsGained} (${nextCombo}x Combo!)` : `+10`,
              life: 1.0,
              color: nextCombo > 2 ? '#ec4899' : '#00f5ff',
            });
            return nextCombo;
          });

          orbs.current.splice(i, 1);

          // Burst particles
          for (let k = 0; k < 14; k++) {
            const ang = Math.random() * Math.PI * 2;
            const spd = 60 + Math.random() * 140;
            particles.current.push({
              x: orb.x,
              y: orb.y,
              vx: Math.cos(ang) * spd,
              vy: Math.sin(ang) * spd,
              radius: 2 + Math.random() * 2,
              color: '#00f5ff',
              life: 0.5 + Math.random() * 0.4,
              maxLife: 0.9,
            });
          }
        }
      }

      // Asteroids logic
      for (let i = asteroids.current.length - 1; i >= 0; i--) {
        const ast = asteroids.current[i];
        ast.x += ast.vx * delta;
        ast.y += ast.vy * delta;
        ast.angle += ast.spin * delta;

        const dist = Math.hypot(p.x - ast.x, p.y - ast.y);
        if (dist < p.radius + ast.radius && p.hitTime <= 0) {
          asteroids.current.splice(i, 1);
          sounds.playHitNoise();
          shakeTime.current = 0.3;
          setCombo(0);

          // Explosion particles
          for (let k = 0; k < 20; k++) {
            const ang = Math.random() * Math.PI * 2;
            const spd = 80 + Math.random() * 180;
            particles.current.push({
              x: ast.x,
              y: ast.y,
              vx: Math.cos(ang) * spd,
              vy: Math.sin(ang) * spd,
              radius: 2 + Math.random() * 2.5,
              color: '#ef4444',
              life: 0.6 + Math.random() * 0.4,
              maxLife: 1.0,
            });
          }

          setLives((l) => {
            if (l <= 1) {
              sounds.playGameOver();
              setGameState('gameover');
              return 0;
            }
            return l - 1;
          });
          p.hitTime = 1.0; // 1 second invulnerability
        }

        if (ast.x < -80 || ast.x > width + 80 || ast.y < -80 || ast.y > height + 80) {
          asteroids.current.splice(i, 1);
        }
      }

      // Particles logic
      for (let i = particles.current.length - 1; i >= 0; i--) {
        const part = particles.current[i];
        part.x += part.vx * delta;
        part.y += part.vy * delta;
        part.life -= delta;
        if (part.life <= 0) particles.current.splice(i, 1);
      }

      // Floating text logic
      for (let i = floatingTexts.current.length - 1; i >= 0; i--) {
        const ft = floatingTexts.current[i];
        ft.y -= delta * 30;
        ft.life -= delta;
        if (ft.life <= 0) floatingTexts.current.splice(i, 1);
      }

      if (p.hitTime > 0) p.hitTime -= delta;
      if (shakeTime.current > 0) shakeTime.current -= delta;

      // ================= DRAWING =================
      ctx.save();

      // Screen shake
      if (shakeTime.current > 0) {
        const shakeMag = shakeTime.current * 12;
        ctx.translate((Math.random() - 0.5) * shakeMag, (Math.random() - 0.5) * shakeMag);
      }

      ctx.clearRect(0, 0, width, height);

      // Draw faint space grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let gx = 0; gx < width; gx += gridSize) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, height);
        ctx.stroke();
      }
      for (let gy = 0; gy < height; gy += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(width, gy);
        ctx.stroke();
      }

      // Draw Particles
      particles.current.forEach((part) => {
        const alpha = Math.max(0, part.life / part.maxLife);
        ctx.fillStyle = part.color;
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.arc(part.x, part.y, part.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;

      // Draw Orbs
      orbs.current.forEach((orb) => {
        const pulseScale = 1 + Math.sin(orb.pulse) * 0.18;
        const r = orb.radius * pulseScale;

        ctx.save();
        ctx.shadowBlur = 14;
        ctx.shadowColor = '#00f5ff';
        ctx.fillStyle = '#00f5ff';
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, r * 0.45, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Draw Asteroids
      asteroids.current.forEach((ast) => {
        ctx.save();
        ctx.translate(ast.x, ast.y);
        ctx.rotate(ast.angle);
        ctx.strokeStyle = '#a855f7';
        ctx.fillStyle = 'rgba(168, 85, 247, 0.12)';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#a855f7';

        ctx.beginPath();
        ast.vertices.forEach((v, idx) => {
          if (idx === 0) ctx.moveTo(v.x, v.y);
          else ctx.lineTo(v.x, v.y);
        });
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      });

      // Draw Player Spaceship
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);

      const isInvulnerable = p.hitTime > 0;
      const flicker = isInvulnerable && Math.floor(time / 80) % 2 === 0;

      if (!flicker) {
        ctx.shadowBlur = isInvulnerable ? 20 : 12;
        ctx.shadowColor = isInvulnerable ? '#ff0055' : '#00f5ff';
        ctx.fillStyle = isInvulnerable ? '#ff2a70' : '#ffffff';
        ctx.strokeStyle = '#00f5ff';
        ctx.lineWidth = 2;

        // Delta fighter shape
        ctx.beginPath();
        ctx.moveTo(p.radius * 1.3, 0); // Nose
        ctx.lineTo(-p.radius, -p.radius * 0.9); // Left wing
        ctx.lineTo(-p.radius * 0.5, 0); // Engine center
        ctx.lineTo(-p.radius, p.radius * 0.9); // Right wing
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Cockpit canopy
        ctx.fillStyle = '#00f5ff';
        ctx.beginPath();
        ctx.arc(p.radius * 0.15, 0, p.radius * 0.35, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Floating text (+10 etc)
      floatingTexts.current.forEach((ft) => {
        ctx.save();
        ctx.font = 'bold 15px Orbitron, sans-serif';
        ctx.fillStyle = ft.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = ft.color;
        ctx.globalAlpha = Math.max(0, ft.life);
        ctx.fillText(ft.text, ft.x - 20, ft.y);
        ctx.restore();
      });

      ctx.restore();
      reqRef.current = requestAnimationFrame(update);
    };

    reqRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(reqRef.current);
  }, [gameState]);

  // Update high score
  useEffect(() => {
    if (gameState === 'gameover' && score > highScore) {
      setHighScore(score);
    }
  }, [gameState, score, highScore, setHighScore]);

  // Touch control helper
  const setTouchKey = useCallback((code, active) => {
    keys.current[code] = active;
  }, []);

  return (
    <PageTransition className="flex flex-col items-center !pt-20">
      {/* Top Header & HUD */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 mb-3 max-w-5xl">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black neon-text">Zero-G Recovery</h1>
            <button
              onClick={() => setMuted(!muted)}
              className="p-1.5 rounded-lg border border-white/10 hover:border-neon-cyan/50 text-gray-300 hover:text-white transition text-xs"
              title={muted ? 'Unmute SFX' : 'Mute SFX'}
            >
              {muted ? '🔇 Muted' : '🔊 Sound On'}
            </button>
          </div>
          <p className="text-gray-400 font-rajdhani text-sm">
            Thrust through the asteroid belt. WASD/Arrows to maneuver, Space to hyper-boost.
          </p>
        </div>

        <div className="flex items-center gap-3 text-base font-orbitron glass-card py-2 px-5">
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-gray-400 uppercase">Score</span>
            <span className="text-neon-cyan font-bold">{score}</span>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-gray-400 uppercase">Time</span>
            <span className={`font-bold ${timeLeft <= 15 ? 'text-red-400 animate-pulse' : 'text-neon-purple'}`}>
              {timeLeft}s
            </span>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-gray-400 uppercase">Hull</span>
            <div className="flex">
              {[...Array(3)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${i < lives ? 'text-red-400 fill-current' : 'text-gray-700'}`}
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                    clipRule="evenodd"
                  />
                </svg>
              ))}
            </div>
          </div>
          {combo > 1 && (
            <>
              <div className="w-px h-8 bg-white/10"></div>
              <div className="flex flex-col items-center text-pink-400 animate-bounce">
                <span className="text-[10px] uppercase font-bold">Streak</span>
                <span className="text-xs font-bold">{combo}x</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Main Canvas Viewport */}
      <div
        id="game-container"
        className="relative w-full max-w-5xl h-[56vh] glass-card overflow-hidden border border-white/20 rounded-2xl shadow-[0_0_35px_rgba(0,245,255,0.06)]"
      >
        <canvas ref={canvasRef} className="block cursor-crosshair w-full h-full" />

        {/* Start Overlay */}
        {gameState === 'start' && (
          <div className="absolute inset-0 bg-space-black/85 flex flex-col items-center justify-center backdrop-blur-md z-10 text-center p-6">
            <div className="w-16 h-16 rounded-full border border-neon-cyan flex items-center justify-center text-3xl text-neon-cyan mb-4 animate-bounce">
              🚀
            </div>
            <h2 className="text-4xl md:text-5xl font-black neon-text mb-3">MISSION READY</h2>
            <p className="text-gray-300 font-rajdhani text-lg max-w-md mb-6">
              Collect cyan Quantum Cores to stabilize your orbit. Dodge rogue asteroids that threaten your ship's hull.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <NeonButton onClick={resetGame}>Engage Thrusters</NeonButton>
            </div>
            <p className="text-xs text-gray-500 mt-6 font-mono">Top High Score: {highScore}</p>
          </div>
        )}

        {/* Paused Overlay */}
        {gameState === 'paused' && (
          <div className="absolute inset-0 bg-space-black/80 flex flex-col items-center justify-center backdrop-blur-sm z-10 text-center">
            <h2 className="text-4xl font-bold neon-text-purple mb-4">SIMULATION PAUSED</h2>
            <p className="text-gray-400 font-rajdhani mb-6">Press 'P' or click below to resume mission.</p>
            <NeonButton onClick={() => setGameState('playing')}>Resume</NeonButton>
          </div>
        )}

        {/* Game Over Overlay */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-space-black/90 flex flex-col items-center justify-center backdrop-blur-lg z-10 text-center p-8">
            <h2 className="text-5xl font-black text-red-500 mb-2 drop-shadow-[0_0_25px_rgba(239,68,68,0.8)]">
              MISSION TERMINATED
            </h2>
            <p className="text-2xl text-white mb-4">
              Final Recovery Score: <span className="text-neon-cyan font-orbitron font-bold">{score}</span>
            </p>
            {score >= highScore && score > 0 ? (
              <p className="text-lg text-yellow-400 mb-6 animate-pulse font-orbitron font-bold">
                🌟 NEW GALAXY RECORD ESTABLISHED!
              </p>
            ) : (
              <p className="text-sm text-gray-400 mb-6 font-rajdhani">All-time Record: {highScore} pts</p>
            )}
            <div className="flex gap-4">
              <NeonButton onClick={resetGame}>Reboot Thrusters</NeonButton>
            </div>
          </div>
        )}
      </div>

      {/* On-Screen / Touch Controls for Mobile and Accessibility */}
      <div className="w-full max-w-5xl mt-3 flex justify-between items-center px-2">
        <div className="grid grid-cols-3 gap-1 w-32 select-none">
          <div></div>
          <button
            onMouseDown={() => setTouchKey('TouchUp', true)}
            onMouseUp={() => setTouchKey('TouchUp', false)}
            onTouchStart={() => setTouchKey('TouchUp', true)}
            onTouchEnd={() => setTouchKey('TouchUp', false)}
            className="p-3 bg-white/10 hover:bg-neon-cyan/20 rounded active:bg-neon-cyan/40 text-center font-bold"
          >
            ▲
          </button>
          <div></div>
          <button
            onMouseDown={() => setTouchKey('TouchLeft', true)}
            onMouseUp={() => setTouchKey('TouchLeft', false)}
            onTouchStart={() => setTouchKey('TouchLeft', true)}
            onTouchEnd={() => setTouchKey('TouchLeft', false)}
            className="p-3 bg-white/10 hover:bg-neon-cyan/20 rounded active:bg-neon-cyan/40 text-center font-bold"
          >
            ◀
          </button>
          <button
            onMouseDown={() => setTouchKey('TouchDown', true)}
            onMouseUp={() => setTouchKey('TouchDown', false)}
            onTouchStart={() => setTouchKey('TouchDown', true)}
            onTouchEnd={() => setTouchKey('TouchDown', false)}
            className="p-3 bg-white/10 hover:bg-neon-cyan/20 rounded active:bg-neon-cyan/40 text-center font-bold"
          >
            ▼
          </button>
          <button
            onMouseDown={() => setTouchKey('TouchRight', true)}
            onMouseUp={() => setTouchKey('TouchRight', false)}
            onTouchStart={() => setTouchKey('TouchRight', true)}
            onTouchEnd={() => setTouchKey('TouchRight', false)}
            className="p-3 bg-white/10 hover:bg-neon-cyan/20 rounded active:bg-neon-cyan/40 text-center font-bold"
          >
            ▶
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (gameState === 'playing') setGameState('paused');
              else if (gameState === 'paused') setGameState('playing');
            }}
            className="px-4 py-2 border border-white/20 rounded-lg text-sm font-orbitron hover:border-white/50 text-gray-300"
          >
            {gameState === 'paused' ? 'Resume' : 'Pause [P]'}
          </button>
          <button
            onMouseDown={() => setTouchKey('TouchBoost', true)}
            onMouseUp={() => setTouchKey('TouchBoost', false)}
            onTouchStart={() => setTouchKey('TouchBoost', true)}
            onTouchEnd={() => setTouchKey('TouchBoost', false)}
            className="px-6 py-3 bg-neon-cyan/20 border border-neon-cyan text-neon-cyan rounded-lg font-orbitron font-bold text-sm uppercase tracking-wider active:bg-neon-cyan/40 shadow-[0_0_12px_rgba(0,245,255,0.3)]"
          >
            ⚡ Boost [Space]
          </button>
        </div>
      </div>
    </PageTransition>
  );
};

export default Game;
