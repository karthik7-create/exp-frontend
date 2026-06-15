import { useState, useEffect } from 'react';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2';
import api from '../../api/axios';
import CategoryForm from './CategoryForm';
import ConfirmDialog from '../Common/ConfirmDialog';
import LoadingSpinner from '../Common/LoadingSpinner';
import { showSuccess, showError } from '../Common/Toast';
import './Categories.css';

export default function CategoryManager() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL'); // 'ALL', 'EXPENSE', 'INCOME'
  
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      showError('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await api.delete(`/categories/${confirmDelete.id}`);
      showSuccess('Category deleted');
      setConfirmDelete(null);
      fetchCategories();
    } catch (err) {
      showError('Failed to delete category');
    }
  };

  const handleSave = async (formData) => {
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, formData);
        showSuccess('Category updated');
      } else {
        await api.post('/categories', formData);
        showSuccess('Category created');
      }
      setShowForm(false);
      setEditingCategory(null);
      fetchCategories();
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to save category');
      throw err; // So form stays open/loading if needed
    }
  };

  const filteredCategories = categories.filter((c) => {
    if (filter === 'ALL') return true;
    return c.type === filter;
  });

  if (loading) {
    return (
      <div className="categories-page">
        <LoadingSpinner text="Loading categories..." />
      </div>
    );
  }

  return (
    <div className="categories-page">
      <div className="categories-header">
        <h2>Category Manager</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => { setEditingCategory(null); setShowForm(true); }}
        >
          <HiOutlinePlus /> New Category
        </button>
      </div>

      <div className="categories-filters">
        <button 
          className={`filter-btn ${filter === 'ALL' ? 'active' : ''}`}
          onClick={() => setFilter('ALL')}
        >
          All
        </button>
        <button 
          className={`filter-btn filter-btn--expense ${filter === 'EXPENSE' ? 'active' : ''}`}
          onClick={() => setFilter('EXPENSE')}
        >
          Expenses
        </button>
        <button 
          className={`filter-btn filter-btn--income ${filter === 'INCOME' ? 'active' : ''}`}
          onClick={() => setFilter('INCOME')}
        >
          Income
        </button>
      </div>

      {filteredCategories.length === 0 ? (
        <div className="categories-empty">
          <div className="categories-empty-icon">📂</div>
          <h3>No categories found</h3>
          <p>
            {filter === 'ALL' 
              ? "You haven't created any categories yet." 
              : `You don't have any ${filter.toLowerCase()} categories.`}
          </p>
          <button 
            className="btn btn-primary" 
            onClick={() => { 
              setEditingCategory(null); 
              // pre-select type in form if filtering
              // (Could pass filter down, but for simplicity we rely on form default or logic)
              setShowForm(true); 
            }}
          >
            <HiOutlinePlus /> Create One Now
          </button>
        </div>
      ) : (
        <div className="categories-grid">
          {filteredCategories.map((c) => (
            <div key={c.id} className="category-card glass-card">
              <div 
                className="category-card__icon" 
                style={{ backgroundColor: `${c.color || '#7c3aed'}20`, color: c.color || '#7c3aed' }}
              >
                {c.icon || '📁'}
              </div>
              <div className="category-card__info">
                <h3 className="category-card__name">{c.name}</h3>
                <span className={`category-card__type ${c.type.toLowerCase()}`}>
                  {c.type}
                </span>
              </div>
              <div className="category-actions">
                <button className="edit-btn" onClick={() => { setEditingCategory(c); setShowForm(true); }} title="Edit">
                  <HiOutlinePencil />
                </button>
                {!c.isDefault && (
                  <button className="delete-btn" onClick={() => setConfirmDelete(c)} title="Delete">
                    <HiOutlineTrash />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <CategoryForm
          category={editingCategory}
          onSave={handleSave}
          onClose={() => { setShowForm(false); setEditingCategory(null); }}
        />
      )}

      {confirmDelete && (
        <ConfirmDialog
          title="Delete Category"
          message={`Are you sure you want to delete "${confirmDelete.name}"? Transactions using this category will still exist but will lose this specific styling. This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
          variant="danger"
        />
      )}
    </div>
  );
}
