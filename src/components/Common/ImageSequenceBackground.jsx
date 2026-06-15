import { useEffect, useRef, useState } from 'react';
import './ImageSequenceBackground.css';

export default function ImageSequenceBackground() {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const frameCount = 300;
  const fps = 30;

  useEffect(() => {
    let loadedCount = 0;
    const imgArray = new Array(frameCount);
    
    // Helper function to pad numbers to 3 digits (e.g., 1 -> 001)
    const pad = (num) => num.toString().padStart(3, '0');

    // Preload all images
    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      // Load from public folder
      img.src = `/3d_piggybank/ezgif-frame-${pad(i)}.jpg`;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          setIsLoaded(true);
        }
      };
      // Assign to array even before load finishes to maintain order
      imgArray[i - 1] = img;
    }
    
    setImages(imgArray);
  }, []);

  useEffect(() => {
    if (!isLoaded || !canvasRef.current || images.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { alpha: false }); // alpha: false for optimization since it's a solid background
    let animationFrameId;
    let startTime;

    const resizeCanvas = () => {
      // Use devicePixelRatio for ultra-high resolution on retina displays
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const render = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      
      // Calculate current frame based on 30 FPS (1000ms / 30 = 33.33ms per frame)
      const currentFrameIndex = Math.floor(elapsed / (1000 / fps)) % frameCount;
      const img = images[currentFrameIndex];

      if (img && img.complete) {
        const cWidth = window.innerWidth;
        const cHeight = window.innerHeight;
        
        // Calculate scaling to emulate 'object-fit: cover'
        const scale = Math.max(cWidth / img.width, cHeight / img.height);
        
        // Center the image
        const x = (cWidth / 2) - (img.width / 2) * scale;
        const y = (cHeight / 2) - (img.height / 2) * scale;

        // Clear and draw
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, cWidth, cHeight);
        ctx.drawImage(img, x, y, img.width * scale, img.height * scale);
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isLoaded, images]);

  return (
    <div className="bg-sequence-container">
      <canvas ref={canvasRef} className={`bg-sequence-canvas ${isLoaded ? 'fade-in' : ''}`} />
      {!isLoaded && (
        <div className="bg-sequence-loading">
          {/* Subtle loading state while caching 300 frames */}
        </div>
      )}
    </div>
  );
}
