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

export default function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    if (!fullName.trim()) return 'Full name is required';
    if (fullName.trim().length < 2) return 'Name must be at least 2 characters';
    if (!email.trim()) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Invalid email format';
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters';
    if (!/(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(password)) {
      return 'Password must contain letters, numbers, and special characters (!@#$%^&*)';
    }
    if (password !== confirmPassword) return 'Passwords do not match';
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
      await register(fullName.trim(), email.trim(), password);
      showSuccess('Account created successfully!');
      setLoginSuccess(true);
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Registration failed. Please try again.';
      setError(msg);
      showError(msg);
    } finally {
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
            <FallingText text="Join ExpenseWise Today" className="text-gradient" />
          </h2>
          <p className="auth-hero__subtitle">
            <FallingText text="Your journey to financial freedom starts here." delayOffset={0.5} />
          </p>
          <ul className="auth-hero__features">
            <li>
              <span className="feature-icon">🚀</span>
              <div>
                <strong><FallingText text="Quick Setup" delayOffset={1.0} /></strong>
                <p><FallingText text="Create your account in seconds and start managing your money." delayOffset={1.2} /></p>
              </div>
            </li>
            <li>
              <span className="feature-icon">🔒</span>
              <div>
                <strong><FallingText text="Secure & Private" delayOffset={1.5} /></strong>
                <p><FallingText text="Your financial data is encrypted and completely secure." delayOffset={1.7} /></p>
              </div>
            </li>
            <li>
              <span className="feature-icon">💡</span>
              <div>
                <strong><FallingText text="Smart Recommendations" delayOffset={2.0} /></strong>
                <p><FallingText text="Get personalized tips to help you save more every month." delayOffset={2.2} /></p>
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
            <FallingText text="ExpenseWise" delayOffset={1} className="text-gradient" />
          </h1>
          <p className="auth-brand__tagline">
            <FallingText text="Smart Expense & Savings Tracker" delayOffset={2.5} />
          </p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="register-name">
              <FallingText text="Full Name" delayOffset={3.0} />
            </label>
            <input
              id="reg-name"
              type="text"
              className="form-input"
              placeholder="John Doe"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              autoComplete="name"
              autoFocus
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-email">
              <FallingText text="Email Address" delayOffset={3.2} />
            </label>
            <input
              id="register-email"
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-password">
              <FallingText text="Password" delayOffset={3.4} />
            </label>
            <input
              id="register-password"
              type="password"
              className="form-input"
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              disabled={loading}
            />
            <small className="form-hint" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>
              Must be at least 8 characters with a mix of letters, numbers & symbols.
            </small>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="register-confirm-password">
              <FallingText text="Confirm Password" delayOffset={3.6} />
            </label>
            <input
              id="register-confirm-password"
              type="password"
              className="form-input"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              autoComplete="new-password"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit"
            disabled={loading}
          >
            <FallingText text={loading ? 'Creating account...' : 'Create Account'} delayOffset={4.0} />
          </button>
        </form>

        <div className="auth-footer">
          <FallingText text="Already have an account?" delayOffset={4.2} />{' '}
          <Link to="/login"><FallingText text="Sign in" delayOffset={4.4} /></Link>
        </div>
      </TiltCard>
      </div>
    </div>
  );
}
