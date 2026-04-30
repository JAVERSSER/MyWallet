import { useState } from 'react';
import { EXPENSE_CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/categories';
import { filterByDate, getWeekStart, getMonthStart, getYearStart, yesterdayStr, todayStr, formatDate } from '../utils/dateUtils';
import { useLang } from '../hooks/useLang';
import PieChart from './PieChart';

function getTime(id) {
  const ts = parseInt(id);
  if (isNaN(ts)) return '';
  return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
}

function getFiltered(expenses, period, customDate) {
  if (period === 'today')     return expenses.filter((e) => e.date === todayStr());
  if (period === 'yesterday') return expenses.filter((e) => e.date === yesterdayStr());
  if (period === 'week')      return filterByDate(expenses, getWeekStart());
  if (period === 'month')     return filterByDate(expenses, getMonthStart());
  if (period === 'year')      return filterByDate(expenses, getYearStart());
  if (period === 'custom')    return customDate ? expenses.filter((e) => e.date === customDate) : [];
  return expenses; // 'all'
}

export default function Reports({ expenses }) {
  const { t, fmt } = useLang();
  const [period, setPeriod] = useState('today');
  const [customDate, setCustomDate] = useState('');

  const PERIODS = [
    { id: 'today',     label: t.today     },
    { id: 'yesterday', label: t.yesterday },
    { id: 'week',      label: t.week      },
    { id: 'month',     label: t.month     },
    { id: 'year',      label: t.year      },
    { id: 'all',       label: t.all       },
  ];

  const filtered = getFiltered(expenses, period, customDate);
  const total    = filtered.reduce((s, e) => s + e.amount, 0);

  const byCategory = EXPENSE_CATEGORIES.map((cat) => {
    const items = filtered.filter((e) => e.category === cat);
    return { category: cat, total: items.reduce((s, e) => s + e.amount, 0), count: items.length };
  }).sort((a, b) => b.total - a.total);

  const pieData = byCategory
    .filter((d) => d.total > 0)
    .map((d) => ({ label: t[d.category.toLowerCase()] || d.category, value: d.total, color: CATEGORY_COLORS[d.category] }));

  const periodLabel = period === 'custom' && customDate
    ? formatDate(customDate)
    : PERIODS.find((p) => p.id === period)?.label;

  const sorted = [...filtered].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));

  return (
    <div className="py-4 space-y-4">
      <p className="font-extrabold text-gray-800 dark:text-white text-xl">{t.reports}</p>

      {/* Period tabs */}
      <div className="relative">
        <div className="flex gap-1 overflow-x-auto scrollbar-hide bg-white dark:bg-gray-900 rounded-2xl p-1.5 shadow-sm">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              onClick={() => setPeriod(p.id)}
              className={`shrink-0 w-[calc(25%-3px)] py-2.5 rounded-xl text-[11px] font-extrabold transition-all active:scale-95 leading-tight text-center whitespace-nowrap ${
                period === p.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 rounded-r-2xl bg-gradient-to-l from-white dark:from-gray-900 to-transparent" />
      </div>

      {/* Custom date picker — always visible */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3">
        <span className="text-lg">📅</span>
        <input
          type="date"
          value={customDate}
          onChange={(e) => { setCustomDate(e.target.value); setPeriod('custom'); }}
          className="flex-1 bg-transparent text-gray-800 dark:text-white font-bold text-sm focus:outline-none"
        />
        {period === 'custom' && customDate && (
          <button
            onClick={() => { setCustomDate(''); setPeriod('today'); }}
            className="text-xs text-gray-400 dark:text-gray-500 font-bold px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800"
          >
            ✕
          </button>
        )}
      </div>

      {/* Total */}
      <div className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 dark:shadow-indigo-900/60">
        <p className="text-sm font-semibold opacity-70 uppercase tracking-widest">
          {periodLabel}
        </p>
        <p className="text-5xl font-extrabold tracking-tight mt-1">{fmt(total)}</p>
        <p className="text-sm opacity-60 mt-2">
          {filtered.length} {t.transactions}
        </p>
      </div>

      {/* Pie chart */}
      {pieData.length > 0 && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm">
          <p className="font-extrabold text-gray-800 dark:text-white mb-5">{t.whereDidItGo}</p>
          <PieChart data={pieData} />
        </div>
      )}

      {/* Category list */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm space-y-5">
        <p className="font-extrabold text-gray-800 dark:text-white">{t.byCategory}</p>

        {byCategory.every((c) => c.total === 0) ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-2">📊</p>
            <p className="text-gray-300 dark:text-gray-700 font-bold">{t.noData}</p>
          </div>
        ) : (
          byCategory.filter((c) => c.total > 0).map(({ category, total: catTotal, count }) => {
            const pct = total > 0 ? (catTotal / total) * 100 : 0;
            return (
              <div key={category}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                      style={{ backgroundColor: CATEGORY_COLORS[category] + '20' }}
                    >
                      {CATEGORY_ICONS[category]}
                    </div>
                    <div>
                      <p className="font-bold text-gray-800 dark:text-white text-sm">
                        {t[category.toLowerCase()] || category}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{count} {t.times}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-extrabold text-gray-900 dark:text-white text-sm">{fmt(catTotal)}</p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">{pct.toFixed(0)}%</p>
                  </div>
                </div>
                <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      backgroundColor: CATEGORY_COLORS[category],
                      transition: 'width 0.6s cubic-bezier(0.4,0,0.2,1)',
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Transaction list */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-sm space-y-1">
        <p className="font-extrabold text-gray-800 dark:text-white mb-3">{t.transactions}</p>

        {sorted.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-4xl mb-2">🧾</p>
            <p className="text-gray-300 dark:text-gray-700 font-bold">{t.noData}</p>
          </div>
        ) : (
          sorted.map((expense) => (
            <div
              key={expense.id}
              className="flex items-center gap-3 py-3 border-b border-gray-50 dark:border-gray-800 last:border-0"
            >
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl shrink-0"
                style={{ backgroundColor: CATEGORY_COLORS[expense.category] + '20' }}
              >
                {CATEGORY_ICONS[expense.category]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 dark:text-white text-sm">
                  {t[expense.category.toLowerCase()] || expense.category}
                </p>
                {expense.note && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{expense.note}</p>
                )}
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                  {formatDate(expense.date)}{getTime(expense.id) ? ` · ${getTime(expense.id)}` : ''}
                </p>
              </div>
              <span className="font-extrabold text-gray-900 dark:text-white text-sm shrink-0">
                {fmt(expense.amount)}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
