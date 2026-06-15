import { useState, useEffect } from 'react';
import { HiOutlineDocumentArrowDown } from 'react-icons/hi2';
import api from '../../api/axios';
import { MONTHS } from '../../utils/constants';
import { formatCurrency } from '../../utils/formatters';
import { showError, showSuccess } from '../Common/Toast';
import LoadingSpinner from '../Common/LoadingSpinner';
import MonthlyTrendChart from '../Dashboard/MonthlyTrendChart';
import CategoryPieChart from '../Dashboard/CategoryPieChart';
import './Reports.css';

export default function Reports() {
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());
  
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  // Generate an array of years (e.g., from 5 years ago to this year)
  const years = Array.from({ length: 6 }, (_, i) => now.getFullYear() - i);

  useEffect(() => {
    fetchReportData();
  }, [selectedMonth, selectedYear]);

  const fetchReportData = async () => {
    setLoading(true);
    try {
      const [categoryRes, trendRes] = await Promise.allSettled([
        api.get('/dashboard/category-breakdown', { 
          params: { month: selectedMonth, year: selectedYear } 
        }),
        api.get('/dashboard/monthly-trend', { 
          params: { year: selectedYear } 
        }),
      ]);

      if (categoryRes.status === 'fulfilled') {
        setCategoryBreakdown(categoryRes.value.data || []);
      }
      if (trendRes.status === 'fulfilled') {
        setMonthlyTrend(trendRes.value.data || []);
      }
    } catch (err) {
      showError('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const startExport = async () => {
    if (categoryBreakdown.length === 0) {
      showError('No data to export for this month.');
      return;
    }
    try {
      setExporting(true);
      
      const startDate = new Date(selectedYear, selectedMonth - 1, 1).toISOString().split('T')[0];
      const endDate = new Date(selectedYear, selectedMonth, 0).toISOString().split('T')[0];

      const res = await api.get('/reports/export', {
        params: { startDate, endDate },
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `transactions_export_${selectedYear}_${selectedMonth}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      showSuccess('Report exported successfully');
    } catch (err) {
      console.error(err);
      showError('Failed to export report');
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h2>Reports & Analytics</h2>
        
        <div className="reports-controls">
          <div className="report-filter-group">
            <select
              className="report-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
            >
              {MONTHS.map((month, index) => (
                <option key={month} value={index + 1}>
                  {month}
                </option>
              ))}
            </select>
            <select
              className="report-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
          
          <button 
            className="export-btn btn btn-primary" 
            onClick={startExport}
            disabled={exporting || loading}
          >
            <HiOutlineDocumentArrowDown className="icon" />
            {exporting ? 'Downloading...' : 'Export CSV'}
          </button>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner text="Crunching the numbers..." />
      ) : (
        <div className="reports-grid">
          <div className="reports-charts-row">
            <div className="report-card">
              <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Category Breakdown</h3>
              <CategoryPieChart data={categoryBreakdown} />
            </div>
            <div className="report-card">
              <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Monthly Trend</h3>
              <MonthlyTrendChart data={monthlyTrend} />
            </div>
          </div>

          <div className="report-card category-ranking-card" style={{ marginTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>Top Spending Categories</h3>
            {categoryBreakdown.length === 0 ? (
              <p style={{ color: 'var(--text-muted)' }}>No expenses this month.</p>
            ) : (
              <div className="category-ranking-list">
                {categoryBreakdown.map((item, index) => (
                  <div 
                    key={item.categoryName} 
                    className="ranking-item"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '1rem',
                      background: 'var(--bg-card)',
                      borderRadius: 'var(--radius-md)',
                      marginBottom: '0.75rem',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div 
                        className="ranking-number"
                        style={{
                          width: '24px',
                          height: '24px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: 'var(--bg-secondary)',
                          borderRadius: '50%',
                          fontSize: '0.8rem',
                          fontWeight: 'bold',
                          color: 'var(--text-muted)'
                        }}
                      >
                        {index + 1}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div 
                          style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: item.categoryColor || 'var(--accent-primary)'
                          }}
                        />
                        <span style={{ fontWeight: '600' }}>{item.categoryName}</span>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>
                        {formatCurrency(item.amount)}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {item.percentage.toFixed(1)}% of total
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
