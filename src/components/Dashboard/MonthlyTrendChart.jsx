import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatCurrency, getMonthName } from '../../utils/formatters';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      style={{
        background: 'rgba(15, 15, 35, 0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        padding: '12px 16px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}
    >
      <p style={{ color: '#e8e8f0', fontWeight: 600, fontSize: '0.8125rem', marginBottom: 8 }}>
        {label}
      </p>
      {payload.map((entry) => (
        <p key={entry.dataKey} style={{ color: entry.color, fontSize: '0.8125rem', marginBottom: 2, fontWeight: 500 }}>
          {entry.name}: {formatCurrency(entry.value)}
        </p>
      ))}
    </div>
  );
}

export default function MonthlyTrendChart({ data }) {
  const chartData = (data || []).map((item) => ({
    name: item.monthName || getMonthName(item.month) || `Month ${item.month}`,
    Income: item.income || item.totalIncome || 0,
    Expenses: item.expenses || item.totalExpenses || item.expense || item.totalExpense || 0,
  }));

  return (
    <div className="chart-card glass-card">
      <h3 className="chart-card__title">Monthly Trend</h3>
      {chartData.length === 0 ? (
        <div className="chart-card__empty">
          <div className="chart-card__empty-icon">📈</div>
          <p className="chart-card__empty-text">No trend data available yet</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} barGap={4} barSize={20}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fill: '#8888a8', fontSize: 12 }}
              axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
              tickLine={false}
              tickFormatter={(v) => v.slice(0, 3)}
            />
            <YAxis
              tick={{ fill: '#8888a8', fontSize: 12 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => {
                if (v >= 100000) return `₹${(v / 100000).toFixed(0)}L`;
                if (v >= 1000) return `₹${(v / 1000).toFixed(0)}K`;
                return `₹${v}`;
              }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
            <Legend
              wrapperStyle={{ fontSize: '0.75rem', color: '#8888a8', paddingTop: 8 }}
            />
            <Bar dataKey="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="Expenses" fill="#ef4444" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
