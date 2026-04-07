import { useState, useRef, useEffect } from 'react';
import { EXPENSE_CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/categories';
import { todayStr } from '../utils/dateUtils';
import { useLang } from '../hooks/useLang';

const KEYS = ['7', '8', '9', '4', '5', '6', '1', '2', '3', '00', '0', '⌫'];

export default function AddModal({ onSave, onClose, initialData }) {
  const { t, currency } = useLang();
  const isEdit = !!initialData;
  const [category, setCategory]   = useState(initialData?.category || 'Food');
  const [amountStr, setAmountStr] = useState(
    initialData ? String(Math.round(initialData.amount)) : ''
  );
  const [note, setNote]     = useState(initialData?.note || '');
  const [date, setDate]     = useState(initialData?.date || todayStr());
  const [noteActive, setNoteActive] = useState(false);
  const noteBarRef = useRef(null);

  // Shift the note bar up by the keyboard height when keyboard opens
  useEffect(() => {
    if (!noteActive) return;
    const vv = window.visualViewport;
    if (!vv) return;
    const shift = () => {
      if (!noteBarRef.current) return;
      const kb = Math.max(0, window.innerHeight - vv.height - vv.offsetTop);
      noteBarRef.current.style.transform = `translateY(-${kb}px)`;
    };
    shift();
    vv.addEventListener('resize', shift);
    vv.addEventListener('scroll', shift);
    return () => {
      vv.removeEventListener('resize', shift);
      vv.removeEventListener('scroll', shift);
      if (noteBarRef.current) noteBarRef.current.style.transform = '';
    };
  }, [noteActive]);

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
    <div className="fixed inset-0 z-50 flex flex-col bg-white dark:bg-gray-950 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <button
          onClick={onClose}
          className="text-sm font-semibold text-gray-400 dark:text-gray-500 active:text-gray-700 dark:active:text-gray-300"
        >
          {t.cancel}
        </button>
        <p className="font-extrabold text-gray-900 dark:text-white text-sm">
          {isEdit ? t.editExpense : t.newExpense}
        </p>
        <div className="w-14" />
      </div>

      {/* Category row */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-3 shrink-0 border-b border-gray-100 dark:border-gray-800 scrollbar-hide">
        {EXPENSE_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
              category === cat ? 'text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400'
            }`}
            style={category === cat ? { backgroundColor: CATEGORY_COLORS[cat] } : {}}
          >
            <span className="text-sm">{CATEGORY_ICONS[cat]}</span>
            <span>{catLabel(cat)}</span>
          </button>
        ))}
      </div>

      {/* Amount display */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center gap-2 px-5 py-2">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl"
          style={{ backgroundColor: CATEGORY_COLORS[category] + '25' }}
        >
          {CATEGORY_ICONS[category]}
        </div>

        <p
          className={`text-4xl sm:text-5xl font-extrabold tracking-tight ${
            amount > 0 ? 'text-gray-900 dark:text-white' : 'text-gray-200 dark:text-gray-800'
          }`}
        >
          {displayAmount}
        </p>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="text-xs text-gray-400 dark:text-gray-500 bg-transparent border-none focus:outline-none text-center"
        />
      </div>

      {/* Bottom — numpad + note (shown when keyboard is closed) */}
      <div className="px-4 pt-2 pb-[env(safe-area-inset-bottom,16px)] space-y-2 shrink-0">
        {/* Note trigger row */}
        <button
          onClick={() => setNoteActive(true)}
          className="w-full flex items-center gap-2 bg-gray-100 dark:bg-gray-900 rounded-2xl px-4 py-3 text-left"
        >
          <span className="text-base">📝</span>
          <span className={`flex-1 text-base font-medium ${note ? 'text-gray-700 dark:text-gray-200' : 'text-gray-300 dark:text-gray-700'}`}>
            {note || t.addNote}
          </span>
          {note && (
            <span
              onClickCapture={(e) => { e.stopPropagation(); setNote(''); }}
              className="w-5 h-5 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center text-white text-xs font-bold shrink-0"
            >
              ✕
            </span>
          )}
        </button>

        {/* Numpad */}
        <div className="grid grid-cols-3 gap-1.5">
          {KEYS.map((key) => (
            <button
              key={key}
              onClick={() => handleKey(key)}
              className={`py-3 rounded-xl text-lg font-bold transition-all active:scale-95 select-none ${
                key === '⌫'
                  ? 'bg-gray-100 dark:bg-gray-900 text-gray-400 dark:text-gray-500'
                  : 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white'
              }`}
            >
              {key}
            </button>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`w-full py-3.5 rounded-2xl font-extrabold text-base transition-all active:scale-95 ${
            canSave
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/60'
              : 'bg-gray-100 dark:bg-gray-900 text-gray-300 dark:text-gray-700'
          }`}
        >
          {isEdit ? t.update : t.addExpense}
        </button>
      </div>

      {/* Note input overlay — floats above keyboard on all devices */}
      {noteActive && (
        <div
          ref={noteBarRef}
          className="fixed inset-x-0 bottom-0 z-[60] bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 px-4 pt-3 pb-[env(safe-area-inset-bottom,12px)] space-y-2 shadow-2xl"
          style={{ willChange: 'transform' }}
        >
          <div className="relative">
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              onBlur={() => setNoteActive(false)}
              placeholder={t.addNote}
              autoFocus
              className="w-full text-left bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 rounded-2xl px-4 pr-10 py-3 text-base font-medium focus:outline-none focus:ring-2 focus:ring-indigo-400 placeholder-gray-300 dark:placeholder-gray-700"
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
          <button
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => { setNoteActive(false); if (canSave) handleSave(); }}
            disabled={!canSave}
            className={`w-full py-3.5 rounded-2xl font-extrabold text-base transition-all active:scale-95 ${
              canSave
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-indigo-900/60'
                : 'bg-gray-100 dark:bg-gray-900 text-gray-300 dark:text-gray-700'
            }`}
          >
            {isEdit ? t.update : t.addExpense}
          </button>
        </div>
      )}
    </div>
  );
}
