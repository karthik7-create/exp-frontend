import { useState, useEffect } from 'react';
import api from '../../api/axios';
import Modal from '../Common/Modal';
import { showSuccess, showError } from '../Common/Toast';
import { getMonthName } from '../../utils/formatters';
import { MONTHS } from '../../utils/constants';

export default function BudgetForm({ budget, month, year, onSave, onClose }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    categoryId: budget?.categoryId || '',
    amountLimit: budget?.amountLimit || '',
    month: budget?.month || month,
    year: budget?.year || year,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories', { params: { type: 'EXPENSE' } });
      setCategories(res.data);
    } catch (err) {
      showError('Failed to load categories');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.categoryId || !form.amountLimit) {
      showError('Please fill all required fields');
      return;
    }
    try {
      setLoading(true);
      await api.post('/budgets', {
        categoryId: Number(form.categoryId),
        amountLimit: Number(form.amountLimit),
        month: Number(form.month),
        year: Number(form.year),
      });
      showSuccess(budget ? 'Budget updated!' : 'Budget created!');
      onSave();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <Modal title={budget ? 'Edit Budget' : 'Create Budget'} onClose={onClose}>
      <form className="budget-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="budget-category">Category *</label>
          <select
            id="budget-category"
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="budget-amount">Budget Limit (₹) *</label>
          <input
            id="budget-amount"
            type="number"
            name="amountLimit"
            value={form.amountLimit}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter budget amount"
            min="1"
            step="0.01"
            required
          />
        </div>

        <div className="budget-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="budget-month">Month</label>
              <select
                id="budget-month"
                name="month"
                value={form.month}
                onChange={handleChange}
                className="form-select"
              >
                {MONTHS.map((m, i) => (
                  <option key={i + 1} value={i + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="budget-year">Year</label>
              <select
                id="budget-year"
                name="year"
                value={form.year}
                onChange={handleChange}
                className="form-select"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : budget ? 'Update Budget' : 'Create Budget'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
