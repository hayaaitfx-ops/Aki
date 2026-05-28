'use client';

import React, { useEffect, useRef } from 'react';

interface MatrixRainProps {
  theme: 'purple' | 'cyberpunk' | 'emerald' | 'crimson' | 'nordic' | 'sakura' | 'synthwave' | 'obsidian' | 'forest';
}

export const MatrixRain: React.FC<MatrixRainProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Get color based on active theme
    const getMatrixColor = () => {
      switch (theme) {
        case 'cyberpunk': return '#d97706';
        case 'emerald': return '#059669';
        case 'crimson': return '#ef4444';
        case 'nordic': return '#38bdf8';
        case 'sakura': return '#ec4899';
        case 'synthwave': return '#06b6d4';
        case 'obsidian': return '#eab308';
        case 'forest': return '#a855f7';
        default: return '#8b5cf6';
      }
    };

    const columns = Math.floor(width / 16);
    const yPositions = Array(columns).fill(0);
    
    // Character pool (Katakana + Binary + Hex)
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ'.split('');

    let animationFrameId: number;

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, width, height);

      ctx.fillStyle = getMatrixColor();
      ctx.font = '13px monospace';

      for (let i = 0; i < yPositions.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * 16;
        const y = yPositions[i];

        ctx.fillText(char, x, y);

        if (y > 100 + Math.random() * 10000) {
          yPositions[i] = 0;
        } else {
          yPositions[i] += 16;
        }
      }
      animationFrameId = requestAnimationFrame(draw);
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-45 opacity-25"
      style={{ mixBlendMode: 'screen' }}
    />
  );
};
