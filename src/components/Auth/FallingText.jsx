import './FallingText.css';

export default function FallingText({ text, delayOffset = 0, className = "" }) {
  return (
    <span className={`falling-text ${className}`}>
      {text.split(' ').map((word, wordIndex, wordsArray) => {
        const currentDelay = delayOffset + wordIndex * 0.1;
        return (
          <span 
            key={wordIndex} 
            className="falling-word"
            style={{ animationDelay: `${currentDelay}s` }}
          >
            {word}
            {wordIndex < wordsArray.length - 1 && (
              <span className="falling-space">&nbsp;</span>
            )}
          </span>
        );
      })}
    </span>
  );
}
