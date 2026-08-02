import { useEffect, useRef } from 'react';

const FRAME_COUNT = 80;

function frameSrc(index: number): string {
  return `/assets/frames/fondo_${String(index + 1).padStart(6, '0')}.webp`;
}

export function FondoAnimado() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const context = canvas.getContext('2d');
    if (!context) return;

    const frames: HTMLImageElement[] = [];
    let currentFrame = 0;

    function render(index: number) {
      currentFrame = index;
      const img = frames[index];
      if (!img || !img.complete) return;
      const scale = Math.max(canvas!.width / img.width, canvas!.height / img.height);
      const x = canvas!.width / 2 - (img.width * scale) / 2;
      const y = canvas!.height / 2 - (img.height * scale) / 2;
      context!.clearRect(0, 0, canvas!.width, canvas!.height);
      context!.drawImage(img, x, y, img.width * scale, img.height * scale);
    }

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      if (i === 0) {
        img.onload = () => render(0);
      }
      img.src = frameSrc(i);
      frames.push(img);
    }

    function onScroll() {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - doc.clientHeight;
      const progress = maxScroll > 0 ? window.scrollY / maxScroll : 0;
      const frameIndex = Math.floor(progress * (FRAME_COUNT - 1));
      if (frameIndex !== currentFrame) render(frameIndex);
    }

    function onResize() {
      canvas!.width = window.innerWidth;
      canvas!.height = window.innerHeight;
      render(currentFrame);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      id="fondo-timelapse"
      ref={canvasRef}
      style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1 }}
    />
  );
}