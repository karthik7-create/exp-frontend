import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineBanknotes, HiOutlineCalendarDays } from 'react-icons/hi2';
import api from '../../api/axios';
import { formatCurrency, formatDateShort } from '../../utils/formatters';
import SavingsGoalForm from './SavingsGoalForm';
import ConfirmDialog from '../Common/ConfirmDialog';
import LoadingSpinner from '../Common/LoadingSpinner';
import { showSuccess, showError } from '../Common/Toast';
import EmojiConfetti from '../Common/EmojiConfetti';
import './Savings.css';

export default function SavingsGoals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [addFundsGoal, setAddFundsGoal] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      setLoading(true);
      const res = await api.get('/savings-goals');
      setGoals(res.data);
      
      if (initialLoad) {
        const hasCompleted = res.data.some(goal => goal.status === 'COMPLETED');
        if (hasCompleted) {
          setShowCelebration(true);
        }
        setInitialLoad(false);
      }
    } catch (err) {
      showError('Failed to load savings goals');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await api.delete(`/savings-goals/${confirmDelete.id}`);
      showSuccess('Goal deleted');
      setConfirmDelete(null);
      fetchGoals();
    } catch (err) {
      showError('Failed to delete goal');
    }
  };

  const handleFormSave = (isCompleted) => {
    setShowForm(false);
    setEditingGoal(null);
    setAddFundsGoal(null);
    if (isCompleted) {
      setShowCelebration(true);
    }
    fetchGoals();
  };

  const getDaysRemaining = (deadline) => {
    if (!deadline) return null;
    const now = new Date();
    const dl = new Date(deadline);
    const diff = Math.ceil((dl - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const getDaysClass = (days) => {
    if (days === null) return '';
    if (days < 0) return 'overdue';
    if (days <= 30) return 'soon';
    return 'plenty';
  };

  const circumference = 2 * Math.PI * 38;

  if (loading) {
    return (
      <div className="savings-page">
        <LoadingSpinner text="Loading savings goals..." />
      </div>
    );
  }

  return (
    <div className="savings-page">
      <div className="savings-header">
        <h2>Savings Goals</h2>
        <button className="btn btn-primary" onClick={() => { setEditingGoal(null); setAddFundsGoal(null); setShowForm(true); }}>
          <HiOutlinePlus /> New Goal
        </button>
      </div>

      {goals.length === 0 ? (
        <div className="savings-empty">
          <div className="savings-empty-icon">🎯</div>
          <h3>No savings goals yet</h3>
          <p>Set a savings goal and start tracking your progress toward financial milestones.</p>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <HiOutlinePlus /> Create Your First Goal
          </button>
        </div>
      ) : (
        <div className="savings-grid">
          {goals.map((goal) => {
            const pct = goal.progressPercentage || 0;
            const dashOffset = circumference - (Math.min(pct, 100) / 100) * circumference;
            const days = getDaysRemaining(goal.deadline);
            const isCompleted = goal.status === 'COMPLETED';

            return (
              <div key={goal.id} className={`savings-card ${isCompleted ? 'completed' : ''}`}>
                <div className="savings-card-header">
                  <div className="savings-card-info">
                    <div
                      className="savings-card-icon"
                      style={{ background: `${goal.color || '#7c3aed'}20`, color: goal.color || '#7c3aed' }}
                    >
                      {goal.icon || '🎯'}
                    </div>
                    <div>
                      <div className="savings-card-title">{goal.name}</div>
                      <span className={`savings-card-status ${goal.status?.toLowerCase()}`}>
                        {goal.status}
                      </span>
                    </div>
                  </div>
                  <div className="savings-card-actions">
                    <button onClick={() => { setEditingGoal(goal); setAddFundsGoal(null); setShowForm(true); }} title="Edit">
                      <HiOutlinePencil />
                    </button>
                    <button className="delete-btn" onClick={() => setConfirmDelete(goal)} title="Delete">
                      <HiOutlineTrash />
                    </button>
                  </div>
                </div>

                <div className="savings-progress">
                  <div className="savings-ring">
                    <svg width="120" height="120" viewBox="0 0 120 120">
                      <circle
                        className="savings-ring-bg"
                        cx="60"
                        cy="60"
                        r="38"
                        strokeWidth="8"
                      />
                      <circle
                        className="savings-ring-progress"
                        cx="60"
                        cy="60"
                        r="38"
                        strokeWidth="8"
                        stroke={goal.color || '#7c3aed'}
                        strokeDasharray={circumference}
                        strokeDashoffset={dashOffset}
                      />
                    </svg>
                    <div className="savings-ring-content">
                      <span className="savings-ring-pct">{Math.round(pct)}%</span>
                    </div>
                  </div>
                  <div className="savings-amounts">
                    <div className="savings-current">{formatCurrency(goal.currentAmount)}</div>
                    <div className="savings-target">of {formatCurrency(goal.targetAmount)}</div>
                    <div className="savings-remaining">
                      {isCompleted
                        ? '🎉 Goal reached!'
                        : `${formatCurrency(goal.targetAmount - goal.currentAmount)} to go`}
                    </div>
                  </div>
                </div>

                {goal.deadline && (
                  <div className="savings-deadline">
                    <div className="savings-deadline-info">
                      <HiOutlineCalendarDays className="icon" />
                      <span>{formatDateShort(goal.deadline)}</span>
                    </div>
                    {days !== null && (
                      <span className={`days-remaining ${getDaysClass(days)}`}>
                        {days < 0
                          ? `${Math.abs(days)}d overdue`
                          : days === 0
                          ? 'Due today'
                          : `${days}d left`}
                      </span>
                    )}
                  </div>
                )}

                {isCompleted && (
                  <div className="celebration">🎊</div>
                )}

                {!isCompleted && (
                  <button
                    className="add-funds-btn"
                    onClick={() => { setAddFundsGoal(goal); setEditingGoal(null); setShowForm(true); }}
                  >
                    <HiOutlineBanknotes /> Add Funds
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <SavingsGoalForm
          goal={editingGoal}
          addFundsMode={!!addFundsGoal}
          addFundsGoal={addFundsGoal}
          onSave={handleFormSave}
          onClose={() => { setShowForm(false); setEditingGoal(null); setAddFundsGoal(null); }}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Delete Savings Goal"
          message={`Are you sure you want to delete "${confirmDelete.name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
          variant="danger"
        />
      )}

      {showCelebration && (
        <EmojiConfetti 
          duration={6000} 
          type="celebration"
          title="Goal Achieved!"
          message="Congratulations! You have successfully reached your savings goal. Keep up the amazing work!"
          onComplete={() => setShowCelebration(false)} 
        />
      )}
    </div>
  );
}
