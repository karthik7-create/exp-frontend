import { useEffect, useState } from 'react';
import './EmojiConfetti.css';

export default function EmojiConfetti({ duration = 6000, type = 'celebration', title, message, onComplete }) {
  const [flakes, setFlakes] = useState([]);
  const [showMessage, setShowMessage] = useState(true);
  const isWarning = type === 'warning';
  
  const EMOJIS = isWarning 
    ? ['🚨', '⚠️', '💸', '📉', '🛑', '❗'] 
    : ['🎉', '💰', '🌟', '🚀', '🎊', '✨', '🏆', '💎', '💸', '🎯'];

  useEffect(() => {
    // Generate 60 random confetti flakes for a very rich effect
    const newFlakes = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      left: `${Math.random() * 100}vw`,
      animationDuration: `${Math.random() * 2.5 + 2}s`, // Between 2s and 4.5s
      animationDelay: `${Math.random() * 1.5}s`, // Staggered start up to 1.5s
      fontSize: `${Math.random() * 2 + 1.5}rem`, // Different sizes
    }));
    
    setFlakes(newFlakes);

    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, duration);

    const handleGlobalClick = () => {
      setShowMessage(false);
    };

    // Add listener after a tiny delay so the click that triggered the confetti doesn't close it
    const clickDelay = setTimeout(() => {
      window.addEventListener('click', handleGlobalClick);
    }, 100);

    return () => {
      clearTimeout(timer);
      clearTimeout(clickDelay);
      window.removeEventListener('click', handleGlobalClick);
    };
  }, [duration, onComplete]);

  return (
    <div className={`emoji-confetti-container ${isWarning ? 'warning-mode' : ''}`}>
      {message && showMessage && (
        <div className={`confetti-message-overlay ${isWarning ? 'warning' : 'success'}`}>
          <div className="confetti-message-icon">{isWarning ? '🚨' : '🏆'}</div>
          {title && <h2 className="confetti-message-title">{title}</h2>}
          <p className="confetti-message-text">{message}</p>
        </div>
      )}
      {flakes.map(flake => (
        <div
          key={flake.id}
          className="emoji-flake"
          style={{
            left: flake.left,
            animationDuration: flake.animationDuration,
            animationDelay: flake.animationDelay,
            fontSize: flake.fontSize,
          }}
        >
          {flake.emoji}
        </div>
      ))}
    </div>
  );
}
