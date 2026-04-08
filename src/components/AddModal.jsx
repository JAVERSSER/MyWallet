import { useState } from 'react';
import { EXPENSE_CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/categories';
import { todayStr } from '../utils/dateUtils';
import { useLang } from '../hooks/useLang';

const KEYS = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '00', '0', '⌫'];

export default function AddModal({ onSave, onClose, initialData }) {
  const { t, currency } = useLang();
  const isEdit = !!initialData;

  const [category, setCategory]   = useState(initialData?.category || 'Food');
  const [amountStr, setAmountStr] = useState(initialData ? String(Math.round(initialData.amount)) : '');
  const [note, setNote]           = useState(initialData?.note || '');

  const date = initialData?.date || todayStr();

  const handleKey = (key) => {
    if (key === '⌫') {
      setAmountStr((v) => v.slice(0, -1));
    } else if (key === '00') {
      setAmountStr((v) => (!v ? v : v.length >= 8 ? v : v + '00'));
    } else {
      setAmountStr((v) => {
        if (v.length >= 9) return v;
        if (v === '0') return key;
        return v + key;
      });
    }
  };

  const amount  = parseInt(amountStr) || 0;
  const canSave = amount > 0;

  const handleSave = () => {
    if (!canSave) return;
    onSave({ category, amount, note: note.trim(), date });
  };

  const catLabel = (cat) => t[cat.toLowerCase()] || cat;

  const displayAmount = amountStr
    ? currency.after
      ? `${Number(amountStr).toLocaleString()} ${currency.symbol}`
      : `${currency.symbol}${Number(amountStr).toLocaleString()}`
    : currency.after ? `0 ${currency.symbol}` : `${currency.symbol}0`;

  return (
    <div className="fixed inset-0 z-50 flex flex-col h-screen overflow-hidden bg-slate-100 dark:bg-gray-950">

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 shrink-0">
        <button
          onClick={onClose}
          className="text-sm font-semibold text-gray-400 dark:text-gray-500 active:text-gray-700 dark:active:text-gray-300"
        >
          {t.cancel}
        </button>

        <p className="font-extrabold text-gray-900 dark:text-white">
          {isEdit ? t.editExpense : t.newExpense}
        </p>

        <div className="w-14" />
      </div>

      {/* Category */}
      <div className="flex gap-2 overflow-x-auto px-5 pb-3 shrink-0 border-b border-gray-200 dark:border-gray-800 scrollbar-hide">
        {EXPENSE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all active:scale-95 ${
              category === cat
                ? 'text-white shadow-md'
                : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 shadow-sm'
            }`}
            style={category === cat ? { backgroundColor: CATEGORY_COLORS[cat] } : {}}
          >
            <span className="text-base">{CATEGORY_ICONS[cat]}</span>
            <span>{catLabel(cat)}</span>
          </button>
        ))}
      </div>

      {/* Amount section */}
      <div className="flex-1 flex flex-col items-center justify-center gap-4 px-5">
        <div
          className="w-20 h-20 rounded-3xl flex items-center justify-center text-4xl"
          style={{ backgroundColor: CATEGORY_COLORS[category] + '25' }}
        >
          {CATEGORY_ICONS[category]}
        </div>

        <p
          className={`text-4xl sm:text-5xl font-extrabold tracking-tight text-center ${
            amount > 0
              ? 'text-gray-900 dark:text-white'
              : 'text-gray-300 dark:text-gray-700'
          }`}
        >
          {displayAmount}
        </p>
      </div>

      {/* Bottom section */}
      <div className="px-5 pb-4 space-y-3 shrink-0">

        {/* Note input */}
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={t.addNote}
          className="
            w-full text-center 
            bg-white dark:bg-gray-900 
            text-gray-700 dark:text-gray-200 
            rounded-2xl px-4 py-3 text-base font-medium 
            shadow-sm 
            transition-all duration-200

            focus:outline-none 
            focus:ring-2 focus:ring-indigo-400 
            focus:scale-105 
            focus:shadow-lg

            placeholder-gray-300 dark:placeholder-gray-700
          "
        />

        {/* Keypad */}
        <div className="grid grid-cols-3 gap-2">
          {KEYS.map((key) => (
            <button
              key={key}
              onClick={() => handleKey(key)}
              className={`py-3 rounded-2xl text-base font-bold transition-all active:scale-[0.97] select-none shadow-sm ${
                key === '⌫'
                  ? 'bg-white dark:bg-gray-900 text-gray-400 dark:text-gray-500'
                  : 'bg-white dark:bg-gray-900 text-gray-800 dark:text-white'
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`w-full py-4 rounded-2xl font-extrabold text-base transition-all active:scale-95 ${
            canSave
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/60'
              : 'bg-gray-100 dark:bg-gray-900 text-gray-300 dark:text-gray-700'
          }`}
        >
          {isEdit ? t.update : t.addExpense}
        </button>

      </div>
    </div>
  );
}