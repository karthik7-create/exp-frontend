import { useLocation } from 'react-router-dom';
import { HiOutlineSun, HiOutlineMoon, HiBars3 } from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../hooks/useTheme';
import './TopBar.css';

const pageTitles = {
  '/': 'Dashboard',
  '/transactions': 'Transactions',
  '/budgets': 'Budgets',
  '/savings': 'Savings Goals',
  '/categories': 'Categories',
  '/reports': 'Reports',
};

export default function TopBar({ onMenuToggle }) {
  const location = useLocation();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const title = pageTitles[location.pathname] || 'ExpenseWise';

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="topbar">
      <div className="topbar__left">
        <button className="topbar__hamburger" onClick={onMenuToggle} aria-label="Toggle menu">
          <HiBars3 />
        </button>
        <h1 className="topbar__title">{title}</h1>
      </div>

      <div className="topbar__right">
        <button
          className="topbar__theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          {theme === 'dark' ? <HiOutlineSun /> : <HiOutlineMoon />}
        </button>

        <div className="topbar__user-pill">
          <div className="topbar__user-avatar">
            {getInitials(user?.fullName || user?.name)}
          </div>
          <span className="topbar__user-name">{user?.fullName || user?.name || 'User'}</span>
        </div>
      </div>
    </header>
  );
}
