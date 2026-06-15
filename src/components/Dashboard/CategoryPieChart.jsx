import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { formatCurrency } from '../../utils/formatters';
import { DEFAULT_CHART_COLORS } from '../../utils/constants';

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const data = payload[0];
  return (
    <div
      style={{
        background: 'rgba(15, 15, 35, 0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '10px',
        padding: '10px 14px',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      }}
    >
      <p style={{ color: '#e8e8f0', fontWeight: 600, fontSize: '0.8125rem', marginBottom: 4 }}>
        {data.name}
      </p>
      <p style={{ color: data.payload.fill || '#00d4ff', fontWeight: 700, fontSize: '0.875rem' }}>
        {formatCurrency(data.value)}
      </p>
    </div>
  );
}

function CustomLegend({ payload }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', justifyContent: 'center', paddingTop: 8 }}>
      {payload.map((entry, index) => (
        <div key={index} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: '#8888a8' }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: entry.color, display: 'inline-block' }} />
          {entry.value}
        </div>
      ))}
    </div>
  );
}

export default function CategoryPieChart({ data }) {
  const chartData = (data || []).map((item) => ({
    name: item.category || item.categoryName || item.name || 'Other',
    value: item.amount || item.total || item.totalAmount || 0,
  })).filter((d) => d.value > 0);

  return (
    <div className="chart-card glass-card">
      <h3 className="chart-card__title">Expense by Category</h3>
      {chartData.length === 0 ? (
        <div className="chart-card__empty">
          <div className="chart-card__empty-icon">📊</div>
          <p className="chart-card__empty-text">No expense data for this period</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={entry.name} fill={DEFAULT_CHART_COLORS[index % DEFAULT_CHART_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
