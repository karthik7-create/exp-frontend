import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  HiOutlineHome,
  HiOutlineBanknotes,
  HiOutlineChartPie,
  HiOutlineTrophy,
  HiOutlineTag,
  HiOutlineDocumentChartBar,
  HiOutlineArrowRightOnRectangle,
} from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import CubeIcon from '../Common/CubeIcon';
import './Sidebar.css';

const navItems = [
  { path: '/', icon: HiOutlineHome, label: 'Dashboard' },
  { path: '/transactions', icon: HiOutlineBanknotes, label: 'Transactions' },
  { path: '/budgets', icon: HiOutlineChartPie, label: 'Budgets' },
  { path: '/savings', icon: HiOutlineTrophy, label: 'Savings' },
  { path: '/categories', icon: HiOutlineTag, label: 'Categories' },
  { path: '/reports', icon: HiOutlineDocumentChartBar, label: 'Reports' },
];

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'sidebar--open' : ''}`}>
        <div className="sidebar__brand">
          <div className="sidebar__brand-icon" style={{ display: 'flex', alignItems: 'center' }}>
            <CubeIcon size={26} />
          </div>
          <span className="sidebar__brand-name">ExpenseWise</span>
        </div>

        <nav className="sidebar__nav">
          <ul className="sidebar__nav-list">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `sidebar__nav-link ${isActive ? 'sidebar__nav-link--active' : ''}`
                  }
                  onClick={onClose}
                >
                  <item.icon className="sidebar__nav-icon" />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar__footer">
          <div className="sidebar__user">
            <div className="sidebar__user-avatar">
              {getInitials(user?.fullName || user?.name)}
            </div>
            <div className="sidebar__user-info">
              <div className="sidebar__user-name">{user?.fullName || user?.name || 'User'}</div>
              <div className="sidebar__user-email">{user?.email || ''}</div>
            </div>
            <button
              className="sidebar__logout"
              onClick={handleLogout}
              title="Logout"
              aria-label="Logout"
            >
              <HiOutlineArrowRightOnRectangle />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="mobile-nav">
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `mobile-nav__link ${isActive ? 'mobile-nav__link--active' : ''}`
            }
          >
            <item.icon className="mobile-nav__icon" />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
