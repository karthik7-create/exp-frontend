import { useEffect, useRef, useState } from 'react';

export default function BackgroundSequence() {
  const canvasRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const imagesRef = useRef([]);

  useEffect(() => {
    const totalFrames = 300;
    let loadedCount = 0;
    const images = [];

    // Preload all frames
    for (let i = 1; i <= totalFrames; i++) {
      const img = new Image();
      const frameNum = String(i).padStart(3, '0');
      img.src = `/lohin_page3d/ezgif-frame-${frameNum}.jpg`;
      
      img.onload = () => {
        loadedCount++;
        if (loadedCount === totalFrames) {
          setLoaded(true);
        }
      };
      
      // Handle potential image load errors gracefully
      img.onerror = () => {
        console.error(`Failed to load frame ${frameNum}`);
        loadedCount++;
        if (loadedCount === totalFrames) {
          setLoaded(true);
        }
      };

      images.push(img);
    }
    
    imagesRef.current = images;
  }, []);

  useEffect(() => {
    if (!loaded) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d', { alpha: false }); // Optimize for no transparency
    const images = imagesRef.current.filter(img => img.complete && img.naturalHeight !== 0);

    if (images.length === 0) return;

    // Set high-res canvas dimensions based on the source images
    canvas.width = images[0].naturalWidth;
    canvas.height = images[0].naturalHeight;

    let frame = 0;
    let animationId;
    let lastTime = performance.now();
    
    // We want 10 seconds for 300 frames, so 30 FPS.
    const fpsInterval = 1000 / 30; // ~33.33ms

    const render = (time) => {
      animationId = requestAnimationFrame(render);
      
      const elapsed = time - lastTime;
      
      if (elapsed >= fpsInterval) {
        lastTime = time - (elapsed % fpsInterval);
        
        ctx.drawImage(images[frame], 0, 0, canvas.width, canvas.height);
        frame = (frame + 1) % images.length;
      }
    };

    // Draw the first frame immediately
    ctx.drawImage(images[0], 0, 0, canvas.width, canvas.height);
    animationId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animationId);
  }, [loaded]);

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: '#000',
      zIndex: -1,
      overflow: 'hidden'
    }}>
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 1s ease-in-out' // Smooth fade in when loaded
        }}
      />
      {/* Optional: Add a subtle dark overlay to ensure the login form is always readable */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at center, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)',
        pointerEvents: 'none'
      }} />
    </div>
  );
}
