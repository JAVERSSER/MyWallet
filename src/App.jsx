import { useEffect, useRef, useState } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { LangContext } from './hooks/useLang';
import { LANGUAGES, CURRENCIES, translations, formatAmount, getCurrency, convertAmount } from './utils/i18n';
import Dashboard from './components/Dashboard';
import Reports from './components/Reports';
import AddModal from './components/AddModal';

function TabBtn({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center py-3 gap-0.5 transition-colors ${
        active ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-300 dark:text-gray-600'
      }`}
    >
      <span className="text-2xl">{icon}</span>
      <span className="text-xs font-bold">{label}</span>
    </button>
  );
}

function PickerSheet({ title, items, selected, onSelect, onClose }) {
  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-t-3xl pb-safe overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <span className="font-extrabold text-gray-900 dark:text-white">{title}</span>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm font-bold"
          >
            ✕
          </button>
        </div>
        <div className="py-2 max-h-72 overflow-y-auto">
          {items.map((item) => (
            <button
              key={item.code}
              onClick={() => { onSelect(item.code); onClose(); }}
              className={`w-full flex items-center gap-3 px-5 py-3.5 active:bg-gray-50 dark:active:bg-gray-800 transition-colors ${
                selected === item.code ? 'bg-indigo-50 dark:bg-indigo-950/50' : ''
              }`}
            >
              <span className="text-2xl">{item.flag}</span>
              <span
                className={`font-semibold text-sm flex-1 text-left ${
                  selected === item.code
                    ? 'text-indigo-600 dark:text-indigo-400'
                    : 'text-gray-800 dark:text-gray-200'
                }`}
              >
                {item.label || item.name}
              </span>
              {selected === item.code && (
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">✓</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function DataSheet({ onClose, onExport, onImport, onClear, expenseCount }) {
  const [confirmClear, setConfirmClear] = useState(false);
  const fileRef = useRef(null);

  return (
    <div className="fixed inset-0 z-[60] flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white dark:bg-gray-900 rounded-t-3xl pb-safe overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800">
          <span className="font-extrabold text-gray-900 dark:text-white">My Data</span>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-sm font-bold"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4 space-y-3">
          {/* Info banner */}
          <div className="flex items-center gap-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl px-4 py-3">
            <span className="text-2xl">🔒</span>
            <div>
              <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300">Stored only on this device</p>
              <p className="text-xs text-indigo-500 dark:text-indigo-400">{expenseCount} expenses saved locally</p>
            </div>
          </div>

          {/* Export */}
          <button
            onClick={() => { onExport(); onClose(); }}
            className="w-full flex items-center gap-4 px-4 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-xl shrink-0">
              📤
            </div>
            <div className="flex-1 text-left">
              <p className="font-bold text-sm text-gray-800 dark:text-white">Export / Backup</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Save data as a file to your phone</p>
            </div>
            <span className="text-gray-300 dark:text-gray-600 text-lg">›</span>
          </button>

          {/* Import */}
          <button
            onClick={() => fileRef.current?.click()}
            className="w-full flex items-center gap-4 px-4 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl active:scale-95 transition-transform"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-xl shrink-0">
              📥
            </div>
            <div className="flex-1 text-left">
              <p className="font-bold text-sm text-gray-800 dark:text-white">Import / Restore</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">Load data from a backup file</p>
            </div>
            <span className="text-gray-300 dark:text-gray-600 text-lg">›</span>
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".json"
            className="hidden"
            onChange={(e) => { onImport(e); onClose(); }}
          />

          {/* Clear */}
          {!confirmClear ? (
            <button
              onClick={() => setConfirmClear(true)}
              className="w-full flex items-center gap-4 px-4 py-4 bg-gray-50 dark:bg-gray-800 rounded-2xl active:scale-95 transition-transform"
            >
              <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-xl shrink-0">
                🗑️
              </div>
              <div className="flex-1 text-left">
                <p className="font-bold text-sm text-red-600 dark:text-red-400">Clear All Data</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">Delete all expenses and reset</p>
              </div>
              <span className="text-gray-300 dark:text-gray-600 text-lg">›</span>
            </button>
          ) : (
            <div className="bg-red-50 dark:bg-red-950/40 rounded-2xl px-4 py-4 space-y-3">
              <p className="text-sm font-bold text-red-600 dark:text-red-400 text-center">
                Delete all {expenseCount} expenses?
              </p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setConfirmClear(false)}
                  className="py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 font-bold text-sm active:scale-95 transition-transform"
                >
                  Cancel
                </button>
                <button
                  onClick={() => { onClear(); onClose(); }}
                  className="py-3 rounded-xl bg-red-500 text-white font-bold text-sm active:scale-95 transition-transform"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Toast({ message, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed top-16 inset-x-0 z-[80] flex justify-center px-4 pointer-events-none">
      <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-sm font-semibold px-5 py-3 rounded-2xl shadow-xl animate-fade-in">
        {message}
      </div>
    </div>
  );
}

export default function App() {
  const [activeTab, setActiveTab]       = useLocalStorage('mywallet-tab', 'home');
  const [darkMode, setDarkMode]         = useLocalStorage('mywallet-darkmode', false);
  const [expenses, setExpenses]         = useLocalStorage('mywallet-expenses', []);
  const [dailyBudget, setDailyBudget]   = useLocalStorage('mywallet-budget', 0);
  const [langCode, setLangCode]         = useLocalStorage('mywallet-lang', 'km');
  const [currencyCode, setCurrencyCode] = useLocalStorage('mywallet-currency', 'KHR');

  const [editingExpense, setEditingExpense] = useState(null);
  const [showModal, setShowModal]           = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showCurrPicker, setShowCurrPicker] = useState(false);
  const [showDataSheet, setShowDataSheet]   = useState(false);
  const [toast, setToast]                   = useState('');

  const prevCurrencyRef = useRef(currencyCode);

  useEffect(() => {
    const prevCode = prevCurrencyRef.current;
    if (prevCode === currencyCode) return;
    prevCurrencyRef.current = currencyCode;

    const toCur  = getCurrency(currencyCode);
    const factor = Math.pow(10, toCur.decimals);
    const round  = (n) => Math.round(n * factor) / factor;

    setExpenses((prev) =>
      prev.map((e) => ({ ...e, amount: round(convertAmount(e.amount, prevCode, currencyCode)) }))
    );
    if (dailyBudget > 0) {
      setDailyBudget(round(convertAmount(dailyBudget, prevCode, currencyCode)));
    }
  }, [currencyCode]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  useEffect(() => {
    document.documentElement.lang = langCode;
  }, [langCode]);

  // ── Data management ──────────────────────────────────────────────
  const handleExport = () => {
    const payload = { expenses, dailyBudget, currencyCode, langCode, exportedAt: new Date().toISOString() };
    const blob    = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url     = URL.createObjectURL(blob);
    const a       = document.createElement('a');
    a.href        = url;
    a.download    = `mywallet-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setToast('✅ Backup saved to your device!');
  };

  const handleImport = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (!Array.isArray(data.expenses)) throw new Error('Invalid file');
        setExpenses(data.expenses);
        if (data.dailyBudget !== undefined) setDailyBudget(data.dailyBudget);
        if (data.currencyCode) { prevCurrencyRef.current = data.currencyCode; setCurrencyCode(data.currencyCode); }
        if (data.langCode)     setLangCode(data.langCode);
        setToast('✅ Data restored successfully!');
      } catch {
        setToast('❌ Invalid backup file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleClear = () => {
    setExpenses([]);
    setDailyBudget(0);
    setToast('🗑️ All data cleared');
  };
  // ─────────────────────────────────────────────────────────────────

  const t        = translations[langCode] || translations.en;
  const currency = getCurrency(currencyCode);
  const fmt      = (amount) => formatAmount(amount, currency);
  const lang     = LANGUAGES.find((l) => l.code === langCode) || LANGUAGES[0];
  const curr     = getCurrency(currencyCode);

  const openAdd    = () => { setEditingExpense(null); setShowModal(true); };
  const openEdit   = (exp) => { setEditingExpense(exp); setShowModal(true); };
  const closeModal = () => { setShowModal(false); setEditingExpense(null); };

  const saveExpense = (data) => {
    if (editingExpense) {
      setExpenses((prev) => prev.map((e) => (e.id === editingExpense.id ? { ...e, ...data } : e)));
    } else {
      setExpenses((prev) => [{ ...data, id: Date.now().toString() }, ...prev]);
    }
    closeModal();
  };

  const deleteExpense = (id) => setExpenses((prev) => prev.filter((e) => e.id !== id));

  const ctx = { t, currency, fmt, langCode, currencyCode };

  return (
    <LangContext.Provider value={ctx}>
      <div className="min-h-screen bg-slate-100 dark:bg-gray-950 transition-colors duration-200">

        {/* Toast */}
        {toast && <Toast message={toast} onDone={() => setToast('')} />}

        {/* Header */}
        <header className="fixed top-0 inset-x-0 z-40 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
            {/* Logo + data button */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center shadow-sm shrink-0">
                <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                  <rect x="2" y="6" width="20" height="14" rx="3" fill="white" opacity="0.9"/>
                  <path d="M2 10h20" stroke="#4f46e5" strokeWidth="1.5"/>
                  <circle cx="17" cy="14" r="2" fill="#4f46e5"/>
                  <path d="M6 6V5a4 4 0 014-4h4a4 4 0 014 4v1" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <span className="font-extrabold text-gray-900 dark:text-white text-lg tracking-tight">
                MyWallet
              </span>
              {/* Data management button */}
              <button
                onClick={() => setShowDataSheet(true)}
                className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-sm active:scale-95 transition-transform"
                title="My Data"
              >
                🔒
              </button>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-1.5">
              {/* Language button */}
              <button
                onClick={() => setShowLangPicker(true)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 active:scale-95 transition-transform"
              >
                <span className="text-base leading-none">{lang.flag}</span>
                <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{lang.code.toUpperCase()}</span>
              </button>

              {/* Currency button */}
              <button
                onClick={() => setShowCurrPicker(true)}
                className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 dark:bg-gray-800 active:scale-95 transition-transform"
              >
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400">{curr.symbol}</span>
                <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{curr.code}</span>
              </button>

              {/* Dark mode */}
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 text-base active:scale-95 transition-transform"
              >
                {darkMode ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="pt-14 pb-28 px-4 max-w-lg mx-auto">
          {activeTab === 'home' && (
            <Dashboard
              expenses={expenses}
              dailyBudget={dailyBudget}
              setDailyBudget={setDailyBudget}
              onEdit={openEdit}
              onDelete={deleteExpense}
            />
          )}
          {activeTab === 'reports' && <Reports expenses={expenses} />}
        </main>

        {/* Bottom nav */}
        <nav className="fixed bottom-0 inset-x-0 z-40 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 safe-area-bottom">
          <div className="flex items-end max-w-lg mx-auto px-2">
            <TabBtn icon="🏠" label={t.home} active={activeTab === 'home'} onClick={() => setActiveTab('home')} />
            <div className="flex-1 flex justify-center">
              <button
                onClick={openAdd}
                className="w-16 h-16 -mt-7 rounded-full bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-300/60 dark:shadow-indigo-900/80 active:scale-95 transition-transform border-4 border-white dark:border-gray-900"
              >
                <span className="text-white text-4xl font-thin leading-none pb-0.5">+</span>
              </button>
            </div>
            <TabBtn icon="📊" label={t.reports} active={activeTab === 'reports'} onClick={() => setActiveTab('reports')} />
          </div>
        </nav>

        {/* Add/Edit modal */}
        {showModal && (
          <AddModal
            onSave={saveExpense}
            onClose={closeModal}
            initialData={editingExpense}
          />
        )}

        {/* Language picker sheet */}
        {showLangPicker && (
          <PickerSheet
            title={t.language}
            items={LANGUAGES}
            selected={langCode}
            onSelect={setLangCode}
            onClose={() => setShowLangPicker(false)}
          />
        )}

        {/* Currency picker sheet */}
        {showCurrPicker && (
          <PickerSheet
            title={t.currency}
            items={CURRENCIES}
            selected={currencyCode}
            onSelect={setCurrencyCode}
            onClose={() => setShowCurrPicker(false)}
          />
        )}

        {/* Data sheet */}
        {showDataSheet && (
          <DataSheet
            onClose={() => setShowDataSheet(false)}
            onExport={handleExport}
            onImport={handleImport}
            onClear={handleClear}
            expenseCount={expenses.length}
          />
        )}
      </div>
    </LangContext.Provider>
  );
}
