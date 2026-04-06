import { useState, useEffect } from 'react';
import { EXPENSE_CATEGORIES, CATEGORY_ICONS } from '../utils/categories';
import { todayStr } from '../utils/dateUtils';

export default function ExpenseForm({ onAdd, editingExpense, onUpdate, onCancelEdit }) {
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(todayStr());
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingExpense) {
      setCategory(editingExpense.category);
      setAmount(String(editingExpense.amount));
      setNote(editingExpense.note || '');
      setDate(editingExpense.date);
    }
  }, [editingExpense]);

  const resetForm = () => {
    setCategory('Food');
    setAmount('');
    setNote('');
    setDate(todayStr());
    setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      setError('Please enter a valid amount greater than 0.');
      return;
    }
    setError('');
    const data = { category, amount: parsed, note: note.trim(), date };
    if (editingExpense) {
      onUpdate(editingExpense.id, data);
    } else {
      onAdd(data);
    }
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onCancelEdit();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm space-y-4">
      <h3 className="font-bold text-gray-800 dark:text-white text-base">
        {editingExpense ? '✏️ Edit Expense' : '➕ Add Expense'}
      </h3>

      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-3 py-2.5 rounded-xl">
          {error}
        </p>
      )}

      {/* Category pills */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
          Category
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {EXPENSE_CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`shrink-0 flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                category === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 dark:shadow-indigo-900'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
              }`}
            >
              <span className="text-lg">{CATEGORY_ICONS[cat]}</span>
              <span>{cat}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Amount */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
          Amount ($)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 font-bold text-lg">$</span>
          <input
            type="number"
            inputMode="decimal"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full border border-gray-200 dark:border-gray-700 rounded-xl pl-8 pr-4 py-3 text-lg font-bold bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Note */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
          Note (optional)
        </label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Add a note..."
          className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Date */}
      <div>
        <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
          Date
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-3 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="submit"
          className="flex-1 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold py-3.5 rounded-xl text-sm transition-all shadow-md shadow-indigo-200 dark:shadow-indigo-900"
        >
          {editingExpense ? 'Update Expense' : 'Add Expense'}
        </button>
        {editingExpense && (
          <button
            type="button"
            onClick={handleCancel}
            className="px-4 py-3.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl text-sm font-semibold active:scale-95 transition-all"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
