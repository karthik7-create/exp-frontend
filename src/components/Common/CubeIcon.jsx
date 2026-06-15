import './CubeIcon.css';

export default function CubeIcon({ size = 40, className = '' }) {
  const halfSize = size / 2;
  return (
    <div 
      className={`cube-icon-container ${className}`} 
      style={{ 
        width: size, 
        height: size, 
        '--cube-size': `${size}px`, 
        '--cube-half': `${halfSize}px` 
      }}
    >
      <div className="cube-icon">
        <div className="cube-icon-face front"></div>
        <div className="cube-icon-face back"></div>
        <div className="cube-icon-face right"></div>
        <div className="cube-icon-face left"></div>
        <div className="cube-icon-face top"></div>
        <div className="cube-icon-face bottom"></div>
      </div>
    </div>
  );
}
