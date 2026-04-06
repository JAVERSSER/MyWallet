import { useState } from 'react';
import { EXPENSE_CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/categories';
import { formatDate } from '../utils/dateUtils';

export default function ExpenseList({ expenses, onDelete, onEdit }) {
  const [filterCategory, setFilterCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = expenses
    .filter((e) => filterCategory === 'All' || e.category === filterCategory)
    .filter((e) => !search || e.note?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">🔍</span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search notes..."
          className="w-full border border-gray-200 dark:border-gray-700 rounded-xl pl-9 pr-4 py-3 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {['All', ...EXPENSE_CATEGORIES].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilterCategory(cat)}
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95 ${
              filterCategory === cat
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700'
            }`}
          >
            {cat !== 'All' ? `${CATEGORY_ICONS[cat]} ` : ''}{cat}
          </button>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <div className="text-center py-14">
          <p className="text-4xl mb-3">🧾</p>
          <p className="text-gray-400 dark:text-gray-500 text-sm font-medium">No expenses found</p>
        </div>
      ) : (
        <>
          <div className="space-y-2">
            {filtered.map((expense) => (
              <div
                key={expense.id}
                className="bg-white dark:bg-gray-900 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-3"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl shrink-0"
                  style={{ backgroundColor: CATEGORY_COLORS[expense.category] + '20' }}
                >
                  {CATEGORY_ICONS[expense.category]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full text-white"
                      style={{ backgroundColor: CATEGORY_COLORS[expense.category] }}
                    >
                      {expense.category}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {formatDate(expense.date)}
                  </p>
                  {expense.note && (
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate mt-0.5">
                      {expense.note}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className="font-extrabold text-gray-900 dark:text-white text-base">
                    ${expense.amount.toFixed(2)}
                  </span>
                  <button
                    onClick={() => onEdit(expense)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 active:text-indigo-600 transition-colors"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => onDelete(expense.id)}
                    className="w-8 h-8 flex items-center justify-center text-gray-400 active:text-red-500 transition-colors"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-indigo-50 dark:bg-indigo-950 rounded-2xl px-4 py-3 flex justify-between items-center">
            <span className="text-sm text-indigo-600 dark:text-indigo-400 font-semibold">
              {filtered.length} record{filtered.length !== 1 ? 's' : ''}
            </span>
            <span className="font-extrabold text-indigo-700 dark:text-indigo-300">
              ${filtered.reduce((s, e) => s + e.amount, 0).toFixed(2)}
            </span>
          </div>
        </>
      )}
    </div>
  );
}
