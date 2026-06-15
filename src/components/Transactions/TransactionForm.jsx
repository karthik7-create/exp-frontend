import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { CATEGORY_ICONS } from '../../utils/constants';
import { formatDateInput } from '../../utils/formatters';
import { showSuccess, showError } from '../Common/Toast';
import Modal from '../Common/Modal';

export default function TransactionForm({ transaction, categories, onClose, onSuccess }) {
  const isEdit = !!transaction;
  const [form, setForm] = useState({
    type: 'expense',
    categoryId: '',
    amount: '',
    description: '',
    date: formatDateInput(new Date()),
    notes: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transaction) {
      setForm({
        type: (transaction.type || 'expense').toLowerCase(),
        categoryId: transaction.categoryId || transaction.category?.id || transaction.category?._id || '',
        amount: String(Math.abs(transaction.amount || 0)),
        description: transaction.description || transaction.note || '',
        date: formatDateInput(transaction.transactionDate || transaction.date) || formatDateInput(new Date()),
        notes: transaction.notes || '',
      });
    }
  }, [transaction]);

  const filteredCategories = categories.filter(
    (c) => (c.type || '').toLowerCase() === form.type
  );

  const validate = () => {
    const errs = {};
    if (!form.amount || parseFloat(form.amount) <= 0) errs.amount = 'Enter a valid amount';
    if (!form.description.trim()) errs.description = 'Description is required';
    if (!form.date) errs.date = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (field, value) => {
    setForm((f) => ({ ...f, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        type: form.type,
        amount: parseFloat(form.amount),
        description: form.description.trim(),
        transactionDate: form.date,
        notes: form.notes.trim(),
      };
      if (form.categoryId) payload.categoryId = form.categoryId;

      if (isEdit) {
        await api.put(`/transactions/${transaction.id || transaction._id}`, payload);
        showSuccess('Transaction updated');
      } else {
        await api.post('/transactions', payload);
        showSuccess('Transaction added');
      }
      onSuccess();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} title={isEdit ? 'Edit Transaction' : 'Add Transaction'}>
      <form className="tx-form" onSubmit={handleSubmit} noValidate>
        <div className="tx-form__type-toggle">
          <button
            type="button"
            className={`tx-form__type-btn tx-form__type-btn--expense ${form.type === 'expense' ? 'tx-form__type-btn--active' : ''}`}
            onClick={() => { handleChange('type', 'expense'); handleChange('categoryId', ''); }}
          >
            Expense
          </button>
          <button
            type="button"
            className={`tx-form__type-btn tx-form__type-btn--income ${form.type === 'income' ? 'tx-form__type-btn--active' : ''}`}
            onClick={() => { handleChange('type', 'income'); handleChange('categoryId', ''); }}
          >
            Income
          </button>
        </div>

        <div className="form-group">
          <label className="form-label">Category</label>
          <select
            className="form-select"
            value={form.categoryId}
            onChange={(e) => handleChange('categoryId', e.target.value)}
          >
            <option value="">Select category</option>
            {filteredCategories.map((c) => (
              <option key={c.id || c._id} value={c.id || c._id}>
                {CATEGORY_ICONS[c.name] || '📌'} {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Amount (₹)</label>
          <input
            type="number"
            className="form-input"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={form.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
          />
          {errors.amount && <span className="form-error">{errors.amount}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Description</label>
          <input
            type="text"
            className="form-input"
            placeholder="What was this for?"
            value={form.description}
            onChange={(e) => handleChange('description', e.target.value)}
          />
          {errors.description && <span className="form-error">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Date</label>
          <input
            type="date"
            className="form-input"
            value={form.date}
            onChange={(e) => handleChange('date', e.target.value)}
          />
          {errors.date && <span className="form-error">{errors.date}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Notes (optional)</label>
          <textarea
            className="form-textarea"
            placeholder="Any additional details..."
            value={form.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            rows={3}
          />
        </div>

        <div className="tx-form__actions">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update' : 'Add Transaction'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
