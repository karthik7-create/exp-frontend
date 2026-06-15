import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { showSuccess, showError } from '../Common/Toast';
import ImageSequenceBackground from '../Common/ImageSequenceBackground';
import FallingText from './FallingText';
import TiltCard from './TiltCard';
import LoadingScreen from './LoadingScreen';
import CubeIcon from '../Common/CubeIcon';
import './Auth.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    if (!email.trim()) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Invalid email format';
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      showSuccess('Welcome back!');
      setLoginSuccess(true);
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Login failed. Please check your credentials.';
      setError(msg);
      showError(msg);
      setLoading(false);
    }
  };

  if (loginSuccess) {
    return <LoadingScreen />;
  }

  return (
    <div className="auth-page">
      <ImageSequenceBackground />
      <div className="auth-content">
        <div className="auth-hero fade-in">
          <h2 className="auth-hero__title">
            <FallingText text="Take Control of Your Finances" className="text-gradient" />
          </h2>
          <p className="auth-hero__subtitle">
            <FallingText text="ExpenseWise helps you manage your money smarter, not harder." delayOffset={0.5} />
          </p>
          <ul className="auth-hero__features">
            <li>
              <span className="feature-icon">📊</span>
              <div>
                <strong><FallingText text="Track Every Penny" delayOffset={1.0} /></strong>
                <p><FallingText text="Log your income and expenses instantly with smart categorization." delayOffset={1.2} /></p>
              </div>
            </li>
            <li>
              <span className="feature-icon">🎯</span>
              <div>
                <strong><FallingText text="Set Savings Goals" delayOffset={1.5} /></strong>
                <p><FallingText text="Create custom budgets and watch your savings grow over time." delayOffset={1.7} /></p>
              </div>
            </li>
            <li>
              <span className="feature-icon">📈</span>
              <div>
                <strong><FallingText text="Visual Insights" delayOffset={2.0} /></strong>
                <p><FallingText text="Understand your spending habits with beautiful, easy-to-read charts." delayOffset={2.2} /></p>
              </div>
            </li>
          </ul>
        </div>

        <TiltCard className="auth-card">
        <div className="auth-brand">
          <div className="auth-brand__logo" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CubeIcon size={56} />
          </div>
          <h1 className="auth-brand__name">
            <FallingText text="ExpenseWise" delayOffset={1.5} className="text-gradient" />
          </h1>
          <p className="auth-brand__tagline">
            <FallingText text="Smart Expense & Savings Tracker" delayOffset={2.5} />
          </p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">
              <FallingText text="Email Address" delayOffset={3.0} />
            </label>
            <input
              id="login-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              autoFocus
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">
              <FallingText text="Password" delayOffset={3.2} />
            </label>
            <input
              id="login-password"
              type="password"
              className="form-input"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={loading}
          >
            <FallingText text={loading ? "Signing in..." : "Sign In"} delayOffset={3.5} />
          </button>
        </form>

        <div className="auth-footer">
          <FallingText text="Don't have an account?" delayOffset={3.8} />{' '}
          <Link to="/register"><FallingText text="Create one" delayOffset={4.0} /></Link>
        </div>
      </TiltCard>
      </div>
    </div>
  );
}
