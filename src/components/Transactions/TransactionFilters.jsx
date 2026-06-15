import { HiOutlineFunnel, HiOutlineXMark } from 'react-icons/hi2';

export default function TransactionFilters({ filters, onFilterChange, onClear, categories }) {
  const hasFilters = filters.type || filters.categoryId || filters.startDate || filters.endDate || filters.search;

  return (
    <div className="filter-bar glass-card">
      <div className="form-group" style={{ minWidth: 120, flex: '0 0 auto' }}>
        <label className="form-label">Type</label>
        <select
          className="form-select"
          value={filters.type}
          onChange={(e) => onFilterChange('type', e.target.value)}
        >
          <option value="">All Types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
      </div>

      <div className="form-group" style={{ minWidth: 140 }}>
        <label className="form-label">Category</label>
        <select
          className="form-select"
          value={filters.categoryId}
          onChange={(e) => onFilterChange('categoryId', e.target.value)}
        >
          <option value="">All Categories</option>
          {categories
            .filter((c) => !filters.type || c.type?.toLowerCase() === filters.type)
            .map((c) => (
              <option key={c.id || c._id} value={c.id || c._id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>

      <div className="form-group" style={{ minWidth: 130 }}>
        <label className="form-label">From</label>
        <input
          type="date"
          className="form-input"
          value={filters.startDate}
          onChange={(e) => onFilterChange('startDate', e.target.value)}
        />
      </div>

      <div className="form-group" style={{ minWidth: 130 }}>
        <label className="form-label">To</label>
        <input
          type="date"
          className="form-input"
          value={filters.endDate}
          onChange={(e) => onFilterChange('endDate', e.target.value)}
        />
      </div>

      <div className="form-group" style={{ flex: 2 }}>
        <label className="form-label">Search</label>
        <input
          type="text"
          className="form-input"
          placeholder="Search description..."
          value={filters.search}
          onChange={(e) => onFilterChange('search', e.target.value)}
        />
      </div>

      {hasFilters && (
        <button className="btn btn-ghost btn-sm filter-bar__clear" onClick={onClear} title="Clear filters">
          <HiOutlineXMark /> Clear
        </button>
      )}
    </div>
  );
}
