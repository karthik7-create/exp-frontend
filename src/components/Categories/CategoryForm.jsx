import { useState, useEffect } from 'react';
import Modal from '../Common/Modal';
import { CATEGORY_COLORS, PRESET_ICONS } from '../../utils/constants';

export default function CategoryForm({ category, onSave, onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'EXPENSE',
    color: CATEGORY_COLORS[0],
    icon: PRESET_ICONS[0],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || '',
        type: category.type || 'EXPENSE',
        color: category.color || CATEGORY_COLORS[0],
        icon: category.icon || PRESET_ICONS[0],
      });
    }
  }, [category]);

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Category name is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    
    setIsSubmitting(true);
    await onSave(formData);
    setIsSubmitting(false);
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={category ? 'Edit Category' : 'New Category'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="category-form">
        <div className="form-group">
          <label className="form-label">Category Name</label>
          <input
            type="text"
            className={`form-input ${errors.name ? 'input-error' : ''}`}
            placeholder="e.g. Groceries"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            autoFocus
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label className="form-label">Type</label>
          <div className="type-selector">
            <button
              type="button"
              className={`type-option expense ${formData.type === 'EXPENSE' ? 'selected' : ''}`}
              onClick={() => setFormData({ ...formData, type: 'EXPENSE' })}
            >
              Expense
            </button>
            <button
              type="button"
              className={`type-option income ${formData.type === 'INCOME' ? 'selected' : ''}`}
              onClick={() => setFormData({ ...formData, type: 'INCOME' })}
            >
              Income
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Color</label>
          <div className="color-picker">
            {CATEGORY_COLORS.map((color) => (
              <button
                key={color}
                type="button"
                className={`color-option ${formData.color === color ? 'selected' : ''}`}
                style={{ backgroundColor: color, '--selected-color': color }}
                onClick={() => setFormData({ ...formData, color })}
                aria-label={`Select color ${color}`}
              />
            ))}
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Icon</label>
          <div className="icon-picker">
            {PRESET_ICONS.map((icon, idx) => (
              <button
                key={`${icon}-${idx}`}
                type="button"
                className={`icon-option ${formData.icon === icon ? 'selected' : ''}`}
                onClick={() => setFormData({ ...formData, icon })}
                aria-label={`Select icon ${icon}`}
              >
                {icon}
              </button>
            ))}
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
