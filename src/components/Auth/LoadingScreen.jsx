import './LoadingScreen.css';
import CubeIcon from '../Common/CubeIcon';

export default function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div style={{ marginBottom: 60 }}>
        <CubeIcon size={80} />
      </div>
      <div className="loading-text">
        <span className="brand-name">ExpenseWise</span>
        <div className="loading-dots">
          <span>.</span><span>.</span><span>.</span>
        </div>
      </div>
    </div>
  );
}
