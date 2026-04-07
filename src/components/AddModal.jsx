import { useState, useRef, useEffect } from 'react';
import { EXPENSE_CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/categories';
import { todayStr } from '../utils/dateUtils';
import { useLang } from '../hooks/useLang';

const KEYS = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '00', '0', '⌫'];

export default function AddModal({ onSave, onClose, initialData }) {
  const { t, currency } = useLang();
  const isEdit = !!initialData;
  const [category, setCategory]     = useState(initialData?.category || 'Food');
  const [amountStr, setAmountStr]   = useState(initialData ? String(Math.round(initialData.amount)) : '');
  const [note, setNote]             = useState(initialData?.note || '');
  const [noteActive, setNoteActive] = useState(false);
  const modalRef = useRef(null);
  const date = initialData?.date || todayStr();

  // Shrink the whole page to visual viewport — this makes button follow keyboard up on iPhone
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const update = () => {
      if (!modalRef.current) return;
      modalRef.current.style.height = `${vv.height}px`;
      modalRef.current.style.top    = `${vv.offsetTop}px`;
    };
    update();
    vv.addEventListener('resize', update);
    vv.addEventListener('scroll', update);
    return () => {
      vv.removeEventListener('resize', update);
      vv.removeEventListener('scroll', update);
    };
  }, []);

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
  const color = CATEGORY_COLORS[category];

  const displayAmount = amountStr
    ? currency.after
      ? `${Number(amountStr).toLocaleString()} ${currency.symbol}`
      : `${currency.symbol}${Number(amountStr).toLocaleString()}`
    : currency.after ? `0 ${currency.symbol}` : `${currency.symbol}0`;

  return (
    <div
      ref={modalRef}
      className="fixed inset-x-0 z-50 flex flex-col bg-white dark:bg-gray-950"
      style={{ top: 0, height: '100dvh' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 shrink-0">
        <button
          onClick={onClose}
          className="text-sm font-semibold text-gray-400 dark:text-gray-500 active:opacity-50 transition-opacity"
        >
          {t.cancel}
        </button>
        <p className="font-extrabold text-gray-900 dark:text-white text-sm tracking-tight">
          {isEdit ? t.editExpense : t.newExpense}
        </p>
        <div className="w-14" />
      </div>

      {/* Category pills */}
      <div className="flex gap-2 overflow-x-auto px-5 pb-3 shrink-0 scrollbar-hide">
        {EXPENSE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`shrink-0 flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
              category === cat ? 'text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }`}
            style={category === cat ? { backgroundColor: color } : {}}
          >
            <span>{CATEGORY_ICONS[cat]}</span>
            <span>{catLabel(cat)}</span>
          </button>
        ))}
      </div>

      <div className="h-px bg-gray-100 dark:bg-gray-800 shrink-0" />

      {/* Amount — flex-1 so it fills remaining space and shrinks naturally when keyboard opens */}
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-5 min-h-0 overflow-hidden">
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl"
          style={{ backgroundColor: color + '20' }}
        >
          {CATEGORY_ICONS[category]}
        </div>

        <p className={`text-5xl font-extrabold tracking-tight ${
          amount > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-200 dark:text-gray-800'
        }`}>
          {displayAmount}
        </p>

        <span
          className="text-xs font-bold px-3 py-1 rounded-full"
          style={{ backgroundColor: color + '15', color }}
        >
          {catLabel(category)}
        </span>
      </div>

      {/* Bottom — always shrink-0, so it stays glued to the bottom of the (resized) viewport */}
      <div className="px-4 pt-2 pb-5 flex flex-col gap-2 shrink-0">

        {/* Note input */}
        <div className="relative">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            onFocus={() => setNoteActive(true)}
            onBlur={() => setNoteActive(false)}
            placeholder={t.addNote}
            style={{ fontSize: '16px' }}
            className={`w-full text-center rounded-2xl px-4 py-3 font-medium focus:outline-none transition-all duration-200 placeholder-gray-300 dark:placeholder-gray-700 ${
              noteActive
                ? 'bg-white dark:bg-gray-900 ring-2 ring-indigo-400 text-gray-800 dark:text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-900 text-gray-600 dark:text-gray-300'
            }`}
          />
          {note.length > 0 && (
            <button
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => setNote('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-white text-xs font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Numpad — hides when keyboard is open, smooth transition */}
        <div
          className="grid grid-cols-3 gap-2 overflow-hidden transition-all duration-300"
          style={{
            maxHeight: noteActive ? '0px' : '300px',
            opacity: noteActive ? 0 : 1,
          }}
        >
          {KEYS.map((key) => (
            <button
              key={key}
              onClick={() => handleKey(key)}
              className={`py-3.5 rounded-2xl text-xl font-bold transition-all active:scale-95 select-none ${
                key === '⌫'
                  ? 'bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-500'
                  : 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white'
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        {/* Save button — always visible, color matches category */}
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`w-full py-3.5 rounded-2xl font-extrabold text-base active:scale-95 transition-all duration-200 ${
            !canSave ? 'bg-gray-100 dark:bg-gray-900 text-gray-300 dark:text-gray-700' : 'text-white'
          }`}
          style={canSave ? { backgroundColor: color, boxShadow: `0 8px 20px ${color}50` } : {}}
        >
          {isEdit ? t.update : t.addExpense}
        </button>
      </div>
    </div>
  );
}
