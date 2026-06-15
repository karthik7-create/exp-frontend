import {
  HiOutlineArrowTrendingUp,
  HiOutlineArrowTrendingDown,
  HiOutlineBanknotes,
  HiOutlineShieldCheck,
  HiOutlineScale,
} from 'react-icons/hi2';
import { formatCurrency } from '../../utils/formatters';

export default function SummaryCards({ summary }) {
  const income = summary?.totalIncome ?? summary?.income ?? 0;
  const expenses = summary?.totalExpenses ?? summary?.expenses ?? summary?.totalExpense ?? 0;
  const savings = summary?.totalSavings ?? summary?.savings ?? 0;
  const balance = summary?.balance ?? income - expenses;

  const cards = [
    {
      label: 'Total Income',
      amount: income,
      icon: <HiOutlineArrowTrendingUp />,
      variant: 'income',
      prefix: '+',
    },
    {
      label: 'Total Expenses',
      amount: expenses,
      icon: <HiOutlineBanknotes />,
      variant: 'expense',
      prefix: '-',
    },
    {
      label: 'Total Savings',
      amount: savings,
      icon: <HiOutlineShieldCheck />,
      variant: 'savings',
      prefix: '',
    },
    {
      label: 'Balance',
      amount: balance,
      icon: <HiOutlineScale />,
      variant: 'balance',
      prefix: '',
    },
  ];

  return (
    <div className="summary-grid">
      {cards.map((card, index) => (
        <div key={index} className="summary-card glass-card fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
          <div className="summary-card__header">
            <h3 className="summary-card__title">{card.label}</h3>
            <div className={`summary-card__icon icon--${card.variant}`}>
              {card.icon}
            </div>
          </div>
          <div className={`summary-card__amount amount--${card.variant}`}>
            {card.prefix}{formatCurrency(card.amount)}
          </div>
        </div>
      ))}
    </div>
  );
}
