import { useState, useEffect, useCallback } from 'react';
import { HiPlus, HiOutlinePencil, HiOutlineTrash } from 'react-icons/hi2';
import api from '../../api/axios';
import { formatCurrency, formatDateShort, formatDateInput } from '../../utils/formatters';
import { CATEGORY_ICONS } from '../../utils/constants';
import { showSuccess, showError } from '../Common/Toast';
import ConfirmDialog from '../Common/ConfirmDialog';
import TransactionForm from './TransactionForm';
import TransactionFilters from './TransactionFilters';
import LoadingSpinner from '../Common/LoadingSpinner';
import './TransactionList.css';

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingTx, setEditingTx] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [filters, setFilters] = useState({
    type: '',
    categoryId: '',
    startDate: '',
    endDate: '',
    search: '',
  });

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page: page - 1, size: 10 };
      if (filters.type) params.type = filters.type;
      if (filters.categoryId) params.categoryId = filters.categoryId;
      if (filters.startDate) params.startDate = filters.startDate;
      if (filters.endDate) params.endDate = filters.endDate;
      if (filters.search) params.search = filters.search;

      const res = await api.get('/transactions', { params });
      const data = res.data;
      if (Array.isArray(data)) {
        setTransactions(data);
        setTotalPages(1);
      } else {
        setTransactions(data.content || data.transactions || data.data || []);
        setTotalPages(data.totalPages || Math.ceil((data.totalElements || data.total || 0) / 10) || 1);
      }
    } catch {
      showError('Failed to fetch transactions');
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  const fetchCategories = useCallback(async () => {
    try {
      const res = await api.get('/categories');
      setCategories(Array.isArray(res.data) ? res.data : res.data.categories || res.data.data || []);
    } catch {
      /* categories are optional for display */
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleDelete = async () => {
    if (!deletingId) return;
    setDeleteLoading(true);
    try {
      await api.delete(`/transactions/${deletingId}`);
      showSuccess('Transaction deleted');
      setDeletingId(null);
      fetchTransactions();
    } catch {
      showError('Failed to delete transaction');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingTx(null);
    fetchTransactions();
  };

  const handleEdit = (tx) => {
    setEditingTx(tx);
    setShowForm(true);
  };

  const clearFilters = () => {
    setFilters({ type: '', categoryId: '', startDate: '', endDate: '', search: '' });
    setPage(1);
  };

  return (
    <div className="transactions-page">
      <div className="page-header">
        <div>
          <h2 className="page-header__title">Transactions</h2>
          <p className="page-header__subtitle">Manage your income and expenses</p>
        </div>
        <button className="btn btn-primary btn--cyan-green" onClick={() => { setEditingTx(null); setShowForm(true); }}>
          <HiPlus /> Add Transaction
        </button>
      </div>

      <TransactionFilters
        filters={filters}
        onFilterChange={(key, value) => { setFilters((f) => ({ ...f, [key]: value })); setPage(1); }}
        onClear={clearFilters}
        categories={categories}
      />

      {loading ? (
        <LoadingSpinner text="Loading transactions..." />
      ) : transactions.length === 0 ? (
        <div className="glass-card">
          <div className="empty-state">
            <div className="empty-state__icon">📋</div>
            <h3 className="empty-state__title">No transactions found</h3>
            <p className="empty-state__text">
              {filters.type || filters.categoryId || filters.search
                ? 'Try adjusting your filters'
                : 'Start tracking your finances by adding your first transaction'}
            </p>
            {!filters.type && !filters.categoryId && (
              <button className="btn btn-primary" onClick={() => { setEditingTx(null); setShowForm(true); }}>
                <HiPlus /> Add Transaction
              </button>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Desktop Table */}
          <div className="glass-card tx-table-wrap tx-table-desktop">
            <table className="tx-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th style={{ width: 90 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                  {transactions.map((tx, index) => {
                    const catName = tx.category?.name || tx.categoryName || 'Other';
                    const icon = CATEGORY_ICONS[catName] || CATEGORY_ICONS.default;
                    const isIncome = (tx.type || '').toLowerCase() === 'income';

                    return (
                      <tr 
                        key={tx.id || tx._id}
                        className={`tx-row tx-row--${isIncome ? 'income' : 'expense'} fade-in`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td>
                          <div className="tx-cell-category">
                            <div className="tx-cell-category__icon">{icon}</div>
                            <span className="tx-cell-category__name">{catName}</span>
                          </div>
                        </td>
                        <td>
                          <span className="tx-cell-desc">{tx.description || tx.note || '—'}</span>
                        </td>
                        <td>
                          <span className="tx-cell-date">{formatDateShort(tx.transactionDate || tx.date)}</span>
                        </td>
                        <td>
                          <span className={`tx-cell-amount ${isIncome ? 'amount--income' : 'amount--expense'}`}>
                            {isIncome ? '↑ +' : '↓ -'}{formatCurrency(Math.abs(tx.amount))}
                          </span>
                        </td>
                        <td>
                          <div className="tx-cell-actions">
                            <button className="btn-icon btn-ghost" onClick={() => handleEdit(tx)} title="Edit" aria-label="Edit transaction">
                              <HiOutlinePencil />
                            </button>
                            <button className="btn-icon btn-ghost btn-icon--delete" onClick={() => setDeletingId(tx.id || tx._id)} title="Delete" aria-label="Delete transaction">
                              <HiOutlineTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="glass-card tx-cards">
            {transactions.map((tx) => {
              const catName = tx.category?.name || tx.categoryName || 'Other';
              const icon = CATEGORY_ICONS[catName] || CATEGORY_ICONS.default;
              const isIncome = (tx.type || '').toLowerCase() === 'income';

              return (
                <div key={tx.id || tx._id} className="tx-card">
                  <div className="tx-card__icon">{icon}</div>
                  <div className="tx-card__info">
                    <div className="tx-card__desc">{tx.description || tx.note || '—'}</div>
                    <div className="tx-card__meta">{catName} · {formatDateShort(tx.transactionDate || tx.date)}</div>
                  </div>
                  <div className="tx-card__right">
                    <div className={`tx-card__amount ${isIncome ? 'amount--income' : 'amount--expense'}`}>
                      {isIncome ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                    </div>
                    <div className="tx-card__actions">
                      <button className="btn-icon btn-ghost" onClick={() => handleEdit(tx)} aria-label="Edit">
                        <HiOutlinePencil />
                      </button>
                      <button className="btn-icon btn-ghost btn-icon--delete" onClick={() => setDeletingId(tx.id || tx._id)} aria-label="Delete">
                        <HiOutlineTrash />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                className="pagination__btn"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                ←
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                .map((p, idx, arr) => {
                  const prev = arr[idx - 1];
                  const showEllipsis = prev && p - prev > 1;
                  return (
                    <span key={p}>
                      {showEllipsis && <span className="pagination__btn" style={{ cursor: 'default', border: 'none' }}>…</span>}
                      <button
                        className={`pagination__btn ${p === page ? 'pagination__btn--active' : ''}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    </span>
                  );
                })}
              <button
                className="pagination__btn"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                →
              </button>
            </div>
          )}
        </>
      )}

      {showForm && (
        <TransactionForm
          transaction={editingTx}
          categories={categories}
          onClose={() => { setShowForm(false); setEditingTx(null); }}
          onSuccess={handleFormSuccess}
        />
      )}

      <ConfirmDialog
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDelete}
        title="Delete Transaction"
        message="Are you sure you want to delete this transaction? This action cannot be undone."
        confirmText="Delete"
        loading={deleteLoading}
      />
    </div>
  );
}
