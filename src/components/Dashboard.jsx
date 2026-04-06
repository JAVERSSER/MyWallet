import { useState, useEffect } from 'react';
import { todayStr, getMonthStart, getWeekStart, filterByDate, formatDate } from '../utils/dateUtils';
import { EXPENSE_CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/categories';
import { useLang } from '../hooks/useLang';

export default function Dashboard({ expenses, dailyBudget, setDailyBudget, onEdit, onDelete }) {
  const { t, fmt, currency } = useLang();
  const [filterCat, setFilterCat] = useState('All');
  const [editingBudget, setEditingBudget] = useState(false);
  const [budgetInput, setBudgetInput] = useState(dailyBudget || '');

  // Auto-refresh when the calendar day changes (interval + when app comes back to foreground)
  const [today, setToday] = useState(todayStr());
  useEffect(() => {
    const check = () => {
      const now = todayStr();
      if (now !== today) setToday(now);
    };
    const id = setInterval(check, 60_000);
    document.addEventListener('visibilitychange', check);
    return () => {
      clearInterval(id);
      document.removeEventListener('visibilitychange', check);
    };
  }, [today]);
  const todayTotal  = expenses.filter((e) => e.date === today).reduce((s, e) => s + e.amount, 0);
  const weekTotal   = filterByDate(expenses, getWeekStart()).reduce((s, e) => s + e.amount, 0);
  const monthTotal  = filterByDate(expenses, getMonthStart()).reduce((s, e) => s + e.amount, 0);
  const overBudget  = dailyBudget > 0 && todayTotal > dailyBudget;

  const filtered = expenses.filter((e) => filterCat === 'All' || e.category === filterCat);

  const saveBudget = () => {
    const val = parseFloat(budgetInput);
    if (!isNaN(val) && val > 0) setDailyBudget(val);
    setEditingBudget(false);
  };

  const catLabel = (cat) => t[cat.toLowerCase()] || cat;

  return (
    <div className="py-4 space-y-4">

      {/* Over budget alert */}
      {overBudget && (
        <div className="bg-red-500 rounded-3xl p-4 flex items-center gap-3 text-white shadow-lg shadow-red-200 dark:shadow-red-900/50">
          <span className="text-3xl">⚠️</span>
          <div>
            <p className="font-extrabold">{t.overBudget}</p>
            <p className="text-sm opacity-90">
              {fmt(todayTotal)} {t.spent} · {t.budget} {fmt(dailyBudget)}
            </p>
          </div>
        </div>
      )}

      {/* Main summary card */}
      <div className="bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 dark:shadow-indigo-900/60">
        <p className="text-sm font-semibold opacity-70 uppercase tracking-widest">{t.thisMonth}</p>
        <p className="text-5xl font-extrabold tracking-tight mt-1">{fmt(monthTotal)}</p>
        <div className="flex items-center gap-5 mt-5">
          <div>
            <p className="text-xs opacity-60">{t.today}</p>
            <p className="text-lg font-bold">{fmt(todayTotal)}</p>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div>
            <p className="text-xs opacity-60">{t.thisWeek}</p>
            <p className="text-lg font-bold">{fmt(weekTotal)}</p>
          </div>
          <div className="w-px h-8 bg-white/20" />
          <div>
            <p className="text-xs opacity-60">{t.records}</p>
            <p className="text-lg font-bold">{expenses.length}</p>
          </div>
        </div>
      </div>

      {/* Budget bar */}
      {dailyBudget > 0 && !editingBudget && (
        <div
          className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-sm active:scale-[0.98] transition-transform"
          onClick={() => setEditingBudget(true)}
        >
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center gap-2">
              <span>🎯</span>
              <span className="text-sm font-bold text-gray-700 dark:text-gray-200">{t.dailyBudget}</span>
            </div>
            <span className={`text-sm font-extrabold ${overBudget ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'}`}>
              {fmt(todayTotal)} / {fmt(dailyBudget)}
            </span>
          </div>
          <div className="h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${overBudget ? 'bg-red-500' : 'bg-indigo-500'}`}
              style={{ width: `${Math.min((todayTotal / dailyBudget) * 100, 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Set budget prompt */}
      {!dailyBudget && !editingBudget && (
        <button
          onClick={() => setEditingBudget(true)}
          className="w-full bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-sm flex items-center gap-3 active:scale-[0.98] transition-transform border-2 border-dashed border-gray-200 dark:border-gray-700"
        >
          <span className="text-2xl">🎯</span>
          <div className="text-left">
            <p className="font-bold text-gray-700 dark:text-gray-200 text-sm">{t.setDailyBudget}</p>
            <p className="text-xs text-gray-400 dark:text-gray-500">{t.budgetWarning}</p>
          </div>
        </button>
      )}

      {/* Budget editor */}
      {editingBudget && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-sm space-y-3">
          <p className="font-bold text-gray-700 dark:text-gray-200">{t.dailyBudget}</p>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-extrabold text-lg">
              {currency.symbol}
            </span>
            <input
              type="number"
              min="0"
              step="1"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
              placeholder="0"
              autoFocus
              inputMode="numeric"
              className="w-full border-2 border-gray-100 dark:border-gray-700 rounded-2xl pl-9 pr-4 py-3 text-xl font-extrabold bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={saveBudget}
              className="flex-1 bg-indigo-600 text-white py-3.5 rounded-2xl font-bold active:scale-95 transition-transform shadow-md shadow-indigo-200 dark:shadow-indigo-900"
            >
              {t.save}
            </button>
            <button
              onClick={() => setEditingBudget(false)}
              className="px-5 py-3.5 bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-2xl font-bold active:scale-95 transition-transform"
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      {/* Expenses section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <p className="font-extrabold text-gray-800 dark:text-white text-base">{t.expenses}</p>
          {dailyBudget > 0 && (
            <button
              onClick={() => setEditingBudget(true)}
              className="text-xs font-semibold text-indigo-500 dark:text-indigo-400"
            >
              {t.editBudget}
            </button>
          )}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {['All', ...EXPENSE_CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              className={`shrink-0 flex items-center gap-1 px-4 py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
                filterCat === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900'
                  : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 shadow-sm'
              }`}
            >
              {cat !== 'All' && <span>{CATEGORY_ICONS[cat]}</span>}
              <span>{cat === 'All' ? 'All' : catLabel(cat)}</span>
            </button>
          ))}
        </div>

        {/* Expense list */}
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-3">🧾</p>
            <p className="font-bold text-gray-300 dark:text-gray-700 text-lg">{t.noExpenses}</p>
            <p className="text-sm text-gray-300 dark:text-gray-700 mt-1">{t.tapToAdd}</p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {filtered.map((expense) => (
                <div
                  key={expense.id}
                  onClick={() => onEdit(expense)}
                  className="bg-white dark:bg-gray-900 rounded-2xl px-4 py-4 shadow-sm flex items-center gap-3 active:scale-[0.98] transition-transform cursor-pointer"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[expense.category] + '20' }}
                  >
                    {CATEGORY_ICONS[expense.category]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 dark:text-white text-sm">
                      {catLabel(expense.category)}
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                      {expense.note || formatDate(expense.date)}
                    </p>
                    {expense.note && (
                      <p className="text-xs text-gray-300 dark:text-gray-700">{formatDate(expense.date)}</p>
                    )}
                  </div>
                  <div
                    className="flex items-center gap-2 shrink-0"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span className="font-extrabold text-gray-900 dark:text-white text-base">
                      {fmt(expense.amount)}
                    </span>
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800 text-gray-300 dark:text-gray-600 active:bg-red-50 active:text-red-400 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl px-5 py-3.5 flex justify-between items-center">
              <span className="text-sm font-bold text-indigo-500 dark:text-indigo-400">
                {filtered.length} {t.recordsLabel}
              </span>
              <span className="font-extrabold text-indigo-700 dark:text-indigo-300 text-base">
                {fmt(filtered.reduce((s, e) => s + e.amount, 0))}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
