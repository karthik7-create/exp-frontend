import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2';
import api from '../../api/axios';
import { formatCurrency, getMonthName } from '../../utils/formatters';
import BudgetForm from './BudgetForm';
import ConfirmDialog from '../Common/ConfirmDialog';
import LoadingSpinner from '../Common/LoadingSpinner';
import { showSuccess, showError } from '../Common/Toast';
import './Budget.css';

export default function BudgetOverview() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchBudgets();
  }, [month, year]);

  const fetchBudgets = async () => {
    try {
      setLoading(true);
      const res = await api.get('/budgets', { params: { month, year } });
      setBudgets(res.data);
    } catch (err) {
      showError('Failed to load budgets');
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    if (month === 1) {
      setMonth(12);
      setYear(year - 1);
    } else {
      setMonth(month - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 12) {
      setMonth(1);
      setYear(year + 1);
    } else {
      setMonth(month + 1);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await api.delete(`/budgets/${confirmDelete.id}`);
      showSuccess('Budget deleted');
      setConfirmDelete(null);
      fetchBudgets();
    } catch (err) {
      showError('Failed to delete budget');
    }
  };

  const handleFormSave = () => {
    setShowForm(false);
    setEditingBudget(null);
    fetchBudgets();
  };

  const getPercentage = (budget) => {
    if (!budget.amountLimit || budget.amountLimit === 0) return 0;
    return Math.round((budget.spent / budget.amountLimit) * 100);
  };

  const getStatusClass = (pct) => {
    if (pct >= 100) return 'danger';
    if (pct >= 80) return 'warning';
    return 'safe';
  };

  const getCardClass = (pct) => {
    if (pct >= 100) return 'over-budget';
    if (pct >= 80) return 'near-budget';
    return '';
  };

  if (loading) {
    return (
      <div className="budget-page">
        <LoadingSpinner text="Loading budgets..." />
      </div>
    );
  }

  return (
    <div className="budget-page">
      <div className="budget-header">
        <h2>Budget Management</h2>
        <div className="budget-controls">
          <div className="month-selector">
            <button className="nav-btn" onClick={handlePrevMonth}>
              <HiOutlineChevronLeft />
            </button>
            <span className="current-month">{getMonthName(month)} {year}</span>
            <button className="nav-btn" onClick={handleNextMonth}>
              <HiOutlineChevronRight />
            </button>
          </div>
          <button className="btn btn-primary" onClick={() => { setEditingBudget(null); setShowForm(true); }}>
            <HiOutlinePlus /> Add Budget
          </button>
        </div>
      </div>

      {budgets.length === 0 ? (
        <div className="budget-empty">
          <div className="budget-empty-icon">📊</div>
          <h3>No budgets set</h3>
          <p>Set monthly budgets for your expense categories to track your spending.</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <HiOutlinePlus /> Create Your First Budget
          </button>
        </div>
      ) : (
        <div className="budget-grid">
          {budgets.map((budget) => {
            const pct = getPercentage(budget);
            const statusClass = getStatusClass(pct);
            const remaining = budget.amountLimit - budget.spent;
            return (
              <div key={budget.id} className={`budget-card ${getCardClass(pct)}`}>
                <div className="budget-card-header">
                  <div className="budget-category">
                    <div
                      className="budget-category-icon"
                      style={{ background: `${budget.categoryColor}20`, color: budget.categoryColor }}
                    >
                      {budget.categoryIcon}
                    </div>
                    <span className="budget-category-name">{budget.categoryName}</span>
                  </div>
                  <div className="budget-card-actions">
                    <button onClick={() => { setEditingBudget(budget); setShowForm(true); }} title="Edit">
                      <HiOutlinePencil />
                    </button>
                    <button className="delete-btn" onClick={() => setConfirmDelete(budget)} title="Delete">
                      <HiOutlineTrash />
                    </button>
                  </div>
                </div>

                <div className="budget-progress-section">
                  <div className="budget-progress-bar">
                    <div 
                      className={`budget-progress-fill ${statusClass}`} 
                      style={{ width: `${Math.min(pct, 100)}%` }} 
                    />
                  </div>
                  
                  <div className="budget-amounts" style={{ marginTop: '16px' }}>
                    <div>
                      <span className="budget-spent">{formatCurrency(budget.spent)}</span>
                      <span className="budget-limit"> / {formatCurrency(budget.amountLimit)}</span>
                    </div>
                    <span className={`budget-percentage ${statusClass}`}>
                      {pct}%
                    </span>
                  </div>
                  <div className={`budget-status-text ${pct >= 100 ? 'over' : ''}`}>
                    {pct >= 100
                      ? `Over budget by ${formatCurrency(Math.abs(remaining))}`
                      : `${formatCurrency(remaining)} remaining`}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <BudgetForm
          budget={editingBudget}
          month={month}
          year={year}
          onSave={handleFormSave}
          onClose={() => { setShowForm(false); setEditingBudget(null); }}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Delete Budget"
          message={`Are you sure you want to delete the budget for "${confirmDelete.categoryName}"?`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
          variant="danger"
        />
      )}
    </div>
  );
}
