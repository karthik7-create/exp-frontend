import { useState } from 'react';
import api from '../../api/axios';
import Modal from '../Common/Modal';
import { showSuccess, showError } from '../Common/Toast';
import { CATEGORY_COLORS } from '../../utils/constants';

const GOAL_ICONS = ['🎯', '🏠', '✈️', '🚗', '💍', '📱', '🎓', '💻', '🏖️', '🎮', '📚', '💪', '🎵', '🏥', '🎁', '💰'];

export default function SavingsGoalForm({ goal, addFundsMode, addFundsGoal, onSave, onClose }) {
  const [loading, setLoading] = useState(false);
  const [fundsAmount, setFundsAmount] = useState('');
  const [form, setForm] = useState({
    name: goal?.name || '',
    targetAmount: goal?.targetAmount || '',
    deadline: goal?.deadline || '',
    color: goal?.color || '#7c3aed',
    icon: goal?.icon || '🎯',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddFunds = async (e) => {
    e.preventDefault();
    if (!fundsAmount || Number(fundsAmount) <= 0) {
      showError('Please enter a valid amount');
      return;
    }
    try {
      setLoading(true);
      await api.post(`/savings-goals/${addFundsGoal.id}/add-funds`, {
        amount: Number(fundsAmount),
      });
      showSuccess('Funds added successfully!');
      onSave();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to add funds');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.targetAmount) {
      showError('Please fill all required fields');
      return;
    }
    try {
      setLoading(true);
      const payload = {
        name: form.name,
        targetAmount: Number(form.targetAmount),
        deadline: form.deadline || null,
        color: form.color,
        icon: form.icon,
      };
      if (goal) {
        await api.put(`/savings-goals/${goal.id}`, payload);
        showSuccess('Goal updated!');
      } else {
        await api.post('/savings-goals', payload);
        showSuccess('Goal created!');
      }
      onSave();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to save goal');
    } finally {
      setLoading(false);
    }
  };

  if (addFundsMode && addFundsGoal) {
    return (
      <Modal title={`Add Funds — ${addFundsGoal.name}`} onClose={onClose}>
        <form className="savings-form" onSubmit={handleAddFunds}>
          <div className="add-funds-section">
            <div className="form-group">
              <label htmlFor="funds-amount">Amount to Add (₹) *</label>
              <input
                id="funds-amount"
                type="number"
                value={fundsAmount}
                onChange={(e) => setFundsAmount(e.target.value)}
                className="form-input"
                placeholder="Enter amount"
                min="0.01"
                step="0.01"
                required
                autoFocus
              />
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: '0.5rem 0 0' }}>
              Current: ₹{addFundsGoal.currentAmount?.toLocaleString('en-IN')} / Target: ₹{addFundsGoal.targetAmount?.toLocaleString('en-IN')}
            </p>
          </div>
          <div className="form-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Funds'}
            </button>
          </div>
        </form>
      </Modal>
    );
  }

  return (
    <Modal title={goal ? 'Edit Savings Goal' : 'Create Savings Goal'} onClose={onClose}>
      <form className="savings-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="goal-name">Goal Name *</label>
          <input
            id="goal-name"
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="form-input"
            placeholder="e.g., Emergency Fund, Vacation, New Car"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="goal-target">Target Amount (₹) *</label>
          <input
            id="goal-target"
            type="number"
            name="targetAmount"
            value={form.targetAmount}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter target amount"
            min="1"
            step="0.01"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="goal-deadline">Deadline (optional)</label>
          <input
            id="goal-deadline"
            type="date"
            name="deadline"
            value={form.deadline}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label>Icon</label>
          <div className="icon-picker-grid">
            {GOAL_ICONS.map((icon) => (
              <button
                key={icon}
                type="button"
                className={`icon-option ${form.icon === icon ? 'selected' : ''}`}
                onClick={() => setForm((prev) => ({ ...prev, icon }))}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>Color</label>
          <div className="color-picker-grid">
            {CATEGORY_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`color-swatch ${form.color === color ? 'selected' : ''}`}
                style={{ background: color }}
                onClick={() => setForm((prev) => ({ ...prev, color }))}
              />
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : goal ? 'Update Goal' : 'Create Goal'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
