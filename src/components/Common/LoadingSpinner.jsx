import './LoadingSpinner.css';

export default function LoadingSpinner({ fullscreen, text, size = 40 }) {
  if (fullscreen) {
    return (
      <div className="spinner-fullscreen">
        <div className="spinner-container">
          <svg className="spinner-svg" width={size} height={size} viewBox="0 0 50 50">
            <circle
              className="spinner-track"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="4"
            />
            <circle
              className="spinner-circle"
              cx="25"
              cy="25"
              r="20"
              fill="none"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </svg>
          {text && <p className="spinner-text">{text}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="spinner-inline">
      <svg className="spinner-svg" width={size} height={size} viewBox="0 0 50 50">
        <circle
          className="spinner-track"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="4"
        />
        <circle
          className="spinner-circle"
          cx="25"
          cy="25"
          r="20"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
}
