/**
 * Canvas-based Zero Gravity Mini Game.
 */
import React, { useEffect, useRef, useState } from 'react';
import PageTransition from '../components/PageTransition';
import { useLocalStorage } from '../hooks/useLocalStorage';
import NeonButton from '../components/NeonButton';

const Game = () => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('start');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(90);
  const [highScore, setHighScore] = useLocalStorage('gravityGameHighScore', 0);
  
  const reqRef = useRef();
  const player = useRef({ x: 400, y: 300, vx: 0, vy: 0, radius: 15, maxSpeed: 5, hitTime: 0 });
  const keys = useRef({});
  const orbs = useRef([]);
  const asteroids = useRef([]);
  const particles = useRef([]);
  const lastTime = useRef(0);
  const spawnTimer = useRef(0);
  const difficultyMult = useRef(1);

  useEffect(() => {
    const handleKeyDown = (e) => { keys.current[e.code] = true; };
    const handleKeyUp = (e) => { keys.current[e.code] = false; };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const resetGame = () => {
    player.current = { x: window.innerWidth / 2, y: window.innerHeight / 2, vx: 0, vy: 0, radius: 15, maxSpeed: 5, hitTime: 0 };
    orbs.current = [];
    asteroids.current = [];
    particles.current = [];
    setScore(0);
    setLives(3);
    setTimeLeft(90);
    difficultyMult.current = 1;
    setGameState('playing');
    lastTime.current = performance.now();
  };

  useEffect(() => {
    if (gameState !== 'playing') return;
    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setGameState('gameover');
          return 0;
        }
        if (prev % 30 === 0) {
          difficultyMult.current += 0.1;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [gameState]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const update = (time) => {
      if (gameState !== 'playing') {
        reqRef.current = requestAnimationFrame(update);
        return;
      }
      
      const delta = (time - lastTime.current) / 1000;
      lastTime.current = time;
      spawnTimer.current += delta;

      const container = document.getElementById('game-container');
      const width = container ? container.clientWidth : window.innerWidth;
      const height = container ? container.clientHeight : 500;
      if (canvas.width !== width) canvas.width = width;
      if (canvas.height !== height) canvas.height = height;

      const p = player.current;

      const accel = keys.current['Space'] ? 40 : 15;
      if (keys.current['ArrowUp'] || keys.current['KeyW']) p.vy -= accel * delta;
      if (keys.current['ArrowDown'] || keys.current['KeyS']) p.vy += accel * delta;
      if (keys.current['ArrowLeft'] || keys.current['KeyA']) p.vx -= accel * delta;
      if (keys.current['ArrowRight'] || keys.current['KeyD']) p.vx += accel * delta;

      p.vx *= 0.98;
      p.vy *= 0.98;

      const speed = Math.hypot(p.vx, p.vy);
      if (speed > p.maxSpeed) {
        p.vx = (p.vx / speed) * p.maxSpeed;
        p.vy = (p.vy / speed) * p.maxSpeed;
      }

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < p.radius) { p.x = p.radius; p.vx *= -0.5; }
      if (p.x > width - p.radius) { p.x = width - p.radius; p.vx *= -0.5; }
      if (p.y < p.radius) { p.y = p.radius; p.vy *= -0.5; }
      if (p.y > height - p.radius) { p.y = height - p.radius; p.vy *= -0.5; }

      if (spawnTimer.current > 1) {
        spawnTimer.current = 0;
        if (Math.random() > 0.5) {
          orbs.current.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: 8,
            life: 10
          });
        } else {
          const side = Math.floor(Math.random() * 4);
          let ax, ay, vx, vy;
          const astSpeed = (50 + Math.random() * 100) * difficultyMult.current;
          if (side === 0) { ax = Math.random() * width; ay = -20; vx = (Math.random() - 0.5) * astSpeed; vy = astSpeed; }
          if (side === 1) { ax = width + 20; ay = Math.random() * height; vx = -astSpeed; vy = (Math.random() - 0.5) * astSpeed; }
          if (side === 2) { ax = Math.random() * width; ay = height + 20; vx = (Math.random() - 0.5) * astSpeed; vy = -astSpeed; }
          if (side === 3) { ax = -20; ay = Math.random() * height; vx = astSpeed; vy = (Math.random() - 0.5) * astSpeed; }
          asteroids.current.push({ x: ax, y: ay, vx, vy, radius: 15 + Math.random() * 20, angle: 0, spin: (Math.random() - 0.5) * 5 });
        }
      }

      orbs.current.forEach((orb, i) => {
        orb.life -= delta;
        if (orb.life <= 0) {
          orbs.current.splice(i, 1);
          return;
        }
        const dist = Math.hypot(p.x - orb.x, p.y - orb.y);
        if (dist < p.radius + orb.radius) {
          setScore(s => s + 10);
          orbs.current.splice(i, 1);
          for(let k=0; k<10; k++) {
            particles.current.push({
              x: orb.x, y: orb.y,
              vx: (Math.random() - 0.5) * 200, vy: (Math.random() - 0.5) * 200,
              life: 0.5 + Math.random() * 0.5
            });
          }
        }
      });

      asteroids.current.forEach((ast, i) => {
        ast.x += ast.vx * delta;
        ast.y += ast.vy * delta;
        ast.angle += ast.spin * delta;

        const dist = Math.hypot(p.x - ast.x, p.y - ast.y);
        if (dist < p.radius + ast.radius && p.hitTime <= 0) {
          asteroids.current.splice(i, 1);
          setLives(l => {
            if (l <= 1) setGameState('gameover');
            return l - 1;
          });
          p.hitTime = 0.5;
        }

        if (ast.x < -100 || ast.x > width + 100 || ast.y < -100 || ast.y > height + 100) {
          asteroids.current.splice(i, 1);
        }
      });

      particles.current.forEach((part, i) => {
        part.x += part.vx * delta;
        part.y += part.vy * delta;
        part.life -= delta;
        if (part.life <= 0) particles.current.splice(i, 1);
      });

      if (p.hitTime > 0) p.hitTime -= delta;

      ctx.clearRect(0, 0, width, height);
      
      particles.current.forEach(part => {
        ctx.fillStyle = `rgba(0, 245, 255, ${part.life})`;
        ctx.beginPath();
        ctx.arc(part.x, part.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      orbs.current.forEach(orb => {
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00f5ff';
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      asteroids.current.forEach(ast => {
        ctx.save();
        ctx.translate(ast.x, ast.y);
        ctx.rotate(ast.angle);
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2;
          const r = ast.radius * (0.8 + Math.random() * 0.4); 
          const x = Math.cos(angle) * ast.radius; 
          const y = Math.sin(angle) * ast.radius;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      });

      ctx.fillStyle = p.hitTime > 0 ? '#ff0000' : '#ffffff';
      ctx.shadowBlur = p.hitTime > 0 ? 20 : 10;
      ctx.shadowColor = p.hitTime > 0 ? '#ff0000' : '#ffffff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      reqRef.current = requestAnimationFrame(update);
    };

    reqRef.current = requestAnimationFrame(update);
    return () => cancelAnimationFrame(reqRef.current);
  }, [gameState]);

  useEffect(() => {
    if (gameState === 'gameover' && score > highScore) {
      setHighScore(score);
    }
  }, [gameState, score, highScore, setHighScore]);

  return (
    <PageTransition className="flex flex-col items-center">
      <div className="w-full flex justify-between items-end mb-4 max-w-5xl">
        <div>
          <h1 className="text-3xl font-bold neon-text">Zero Gravity Recovery</h1>
          <p className="text-gray-400 font-rajdhani">Use WASD/Arrows to move, Space to boost.</p>
        </div>
        <div className="flex gap-6 text-xl font-orbitron glass-card py-2 px-6">
          <span className="text-neon-cyan">Score: {score}</span>
          <span className="text-neon-purple">Time: {timeLeft}s</span>
          <span className="text-red-400 flex items-center">
            Lives: 
            {[...Array(3)].map((_, i) => (
              <svg key={i} className={`w-5 h-5 ml-1 ${i < lives ? 'fill-current' : 'text-gray-700'}`} viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
            ))}
          </span>
        </div>
      </div>

      <div id="game-container" className="relative w-full max-w-5xl h-[60vh] glass-card overflow-hidden border border-white/20">
        <canvas ref={canvasRef} className="block cursor-crosshair w-full h-full" />
        
        {gameState === 'start' && (
          <div className="absolute inset-0 bg-space-black/80 flex flex-col items-center justify-center backdrop-blur-sm z-10 text-center">
            <h2 className="text-4xl font-bold neon-text mb-6">Ready to float?</h2>
            <NeonButton onClick={resetGame}>Start Engine</NeonButton>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 bg-space-black/90 flex flex-col items-center justify-center backdrop-blur-md z-10 text-center p-8">
            <h2 className="text-5xl font-bold text-red-500 mb-2 drop-shadow-[0_0_20px_red]">SYSTEM FAILURE</h2>
            <p className="text-2xl text-white mb-6">Final Score: <span className="text-neon-cyan font-orbitron">{score}</span></p>
            {score >= highScore && score > 0 ? (
              <p className="text-lg text-yellow-400 mb-8 animate-pulse font-orbitron">NEW HIGH SCORE!</p>
            ) : (
              <p className="text-lg text-gray-400 mb-8 font-rajdhani">High Score: {highScore}</p>
            )}
            <NeonButton onClick={resetGame}>Restart Simulation</NeonButton>
          </div>
        )}
      </div>
    </PageTransition>
  );
};

export default Game;
