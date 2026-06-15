import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency, formatDateShort, getMonthName } from '../../utils/formatters';
import { CATEGORY_ICONS } from '../../utils/constants';
import SummaryCards from './SummaryCards';
import CategoryPieChart from './CategoryPieChart';
import MonthlyTrendChart from './MonthlyTrendChart';
import './Dashboard.css';

export default function Dashboard() {
  const { user, isAnimatingLogin } = useAuth();
  const [summary, setSummary] = useState(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const now = new Date();
        const month = now.getMonth() + 1;
        const year = now.getFullYear();

        const [summaryRes, categoryRes, trendRes, txRes] = await Promise.allSettled([
          api.get('/dashboard/summary', { params: { month, year } }),
          api.get('/dashboard/category-breakdown', { params: { month, year } }),
          api.get('/dashboard/monthly-trend', { params: { year } }),
          api.get('/transactions', { params: { page: 0, size: 5 } }),
        ]);

        if (summaryRes.status === 'fulfilled') setSummary(summaryRes.value.data);
        if (categoryRes.status === 'fulfilled') setCategoryBreakdown(categoryRes.value.data || []);
        if (trendRes.status === 'fulfilled') setMonthlyTrend(trendRes.value.data || []);
        if (txRes.status === 'fulfilled') {
          const txData = txRes.value.data;
          setRecentTransactions(Array.isArray(txData) ? txData.slice(0, 5) : (txData.content || txData.transactions || txData.data || []).slice(0, 5));
        }
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  const currentMonth = getMonthName(new Date().getMonth() + 1);
  const currentYear = new Date().getFullYear();

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard__greeting">
          <div className="skeleton skeleton--title" style={{ width: '280px' }} />
          <div className="skeleton skeleton--text" style={{ width: '180px' }} />
        </div>
        <div className="dashboard__skeleton-cards">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton skeleton--card" style={{ height: '140px' }} />
          ))}
        </div>
        <div className="dashboard__skeleton-charts">
          <div className="skeleton skeleton--card" style={{ height: '320px' }} />
          <div className="skeleton skeleton--card" style={{ height: '320px' }} />
        </div>
        <div className="skeleton skeleton--card" style={{ height: '300px' }} />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h2 className="dashboard__greeting-text">
          {getGreeting()}, {user?.fullName || user?.name || 'there'} 👋
        </h2>
        <p className="dashboard__greeting-sub">
          {currentMonth} {currentYear} — Here&apos;s your financial overview
        </p>
      </div>

      {error && (
        <div className="auth-error" style={{ marginBottom: 20 }}>
          {error}
        </div>
      )}

      <SummaryCards summary={summary} />

      <div className="dashboard__charts">
        <div className="dashboard__chart-wrapper">
          {categoryBreakdown.length > 0 ? (
            !isAnimatingLogin && <CategoryPieChart data={categoryBreakdown} />
          ) : (
            <div className="chart-card glass-card dashboard__empty-chart">
              <h3 className="chart-card__title">Expenses by Category</h3>
              <p>No expense data for this month</p>
            </div>
          )}
        </div>

        <div className="dashboard__chart-wrapper">
          {monthlyTrend.length > 0 ? (
            !isAnimatingLogin && <MonthlyTrendChart data={monthlyTrend} />
          ) : (
            <div className="chart-card glass-card dashboard__empty-chart">
              <h3 className="chart-card__title">Income vs Expenses (Year)</h3>
              <p>No trend data available for this year</p>
            </div>
          )}
        </div>
      </div>

      <div className="recent-transactions glass-card">
        <div className="recent-transactions__header">
          <h3 className="recent-transactions__title">Recent Transactions</h3>
          <Link to="/transactions" className="recent-transactions__view-all">
            View All →
          </Link>
        </div>

        {recentTransactions.length === 0 ? (
          <div className="chart-card__empty">
            <div className="chart-card__empty-icon">📋</div>
            <p className="chart-card__empty-text">No transactions yet. Start by adding one!</p>
          </div>
        ) : (
          recentTransactions.map((tx) => {
            const categoryName = tx.category?.name || tx.categoryName || 'Other';
            const icon = CATEGORY_ICONS[categoryName] || CATEGORY_ICONS.default;
            const isIncome = (tx.type || '').toLowerCase() === 'income';

            return (
              <div key={tx.id || tx._id} className="recent-tx-item">
                <div className="recent-tx-item__icon">{icon}</div>
                <div className="recent-tx-item__info">
                  <div className="recent-tx-item__desc">{tx.description || tx.note || 'Transaction'}</div>
                  <div className="recent-tx-item__category">{categoryName}</div>
                </div>
                <div className="recent-tx-item__right">
                  <div className={`recent-tx-item__amount ${isIncome ? 'amount--income' : 'amount--expense'}`}>
                    {isIncome ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                  </div>
                  <div className="recent-tx-item__date">{formatDateShort(tx.transactionDate || tx.date)}</div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
