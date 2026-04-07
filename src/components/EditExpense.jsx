import { useState } from 'react';
import { useLang } from '../hooks/useLang';

const KEYS = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '00', '0', '⌫'];

export default function EditExpense({ expense, onUpdate }) {
  const { t, currency } = useLang();
  const [amountStr, setAmountStr] = useState(String(Math.round(expense.amount)));
  const [note, setNote]           = useState(expense.note || '');

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

  const amount = parseInt(amountStr) || 0;

  const handleUpdate = () => {
    if (amount <= 0) return;
    onUpdate(expense.id, { ...expense, amount, note: note.trim() });
  };

  const displayAmount = amountStr
    ? currency.after
      ? `${Number(amountStr).toLocaleString()} ${currency.symbol}`
      : `${currency.symbol}${Number(amountStr).toLocaleString()}`
    : currency.after ? `0 ${currency.symbol}` : `${currency.symbol}0`;

  return (
    <div className="px-4 pt-3 pb-4 space-y-3">

      {/* Amount display */}
      <p className={`text-4xl font-extrabold tracking-tight text-center py-2 ${
        amount > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-200 dark:text-gray-700'
      }`}>
        {displayAmount}
      </p>

      {/* Note */}
      <input
        type="text"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder={t.addNote}
        style={{ fontSize: '16px' }}
        className="w-full text-center bg-gray-100 dark:bg-gray-800 rounded-xl px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-300 dark:placeholder-gray-600"
      />

      {/* Numpad */}
      <div className="grid grid-cols-3 gap-1.5">
        {KEYS.map((key) => (
          <button
            key={key}
            onClick={() => handleKey(key)}
            className={`py-3 rounded-xl text-lg font-bold transition-all active:scale-95 select-none ${
              key === '⌫'
                ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-white'
            }`}
          >
            {key}
          </button>
        ))}
      </div>

      {/* Update */}
      <button
        onClick={handleUpdate}
        disabled={amount <= 0}
        className={`w-full py-3 rounded-xl font-bold text-sm transition-all active:scale-95 ${
          amount > 0
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/60'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-300 dark:text-gray-700'
        }`}
      >
        {t.update}
      </button>
    </div>
  );
}
