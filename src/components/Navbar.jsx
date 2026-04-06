export default function Navbar({ darkMode, setDarkMode }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-indigo-600 dark:bg-indigo-950 shadow-md">
      <div className="flex items-center justify-between px-4 h-14 max-w-lg mx-auto">
        <div className="flex items-center gap-2">
          <span className="text-2xl">👛</span>
          <span className="text-white font-bold text-lg tracking-tight">MyWallet</span>
        </div>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-indigo-500 dark:bg-indigo-800 text-white text-lg active:scale-95 transition-transform"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
}
