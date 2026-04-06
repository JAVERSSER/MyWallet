import { useState } from 'react';
import { todayStr, formatDate } from '../utils/dateUtils';

export default function FootballTracker({ footballPlays, onAdd, onDelete }) {
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');

  const profit = footballPlays.reduce(
    (sum, p) => (p.result === 'win' ? sum + p.amount : sum - p.amount),
    0
  );

  const handlePlay = (result) => {
    const parsed = parseFloat(amount);
    if (isNaN(parsed) || parsed <= 0) {
      setError('Amount must be a number greater than 0.');zvcxxzzZxc    
      return;
    }
    setError('');
    onAdd({ amount: parsed, result, date: todayStr() });
    setAmount('');
  };

  return (
    <div className="space-y-4 py-4">
      <h2 className="text-xl font-bold text-gray-800 dark:text-white">Football Tracker</h2>

      <div
        className={`rounded-xl p-5 text-center shadow-sm ${
          profit >= 0
            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
        }`}
      >
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Profit</p>
        <p
          className={`text-4xl font-bold ${
            profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          }`}
        >
          {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
        </p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          {footballPlays.filter((p) => p.result === 'win').length} wins ·{' '}
          {footballPlays.filter((p) => p.result === 'lose').length} losses
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm space-y-3">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200">⚽ Record a Play</h3>

        {error && (
          <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/30 px-3 py-2 rounded-lg">
            {error}
          </p>
        )}

        <div>
          <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
            Amount ($)
          </label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount..."
            className="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handlePlay('win')}
            className="py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
          >
            🏆 WIN
          </button>
          <button
            onClick={() => handlePlay('lose')}
            className="py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-xl text-sm transition-colors shadow-sm"
          >
            ❌ LOSE
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-semibold text-gray-700 dark:text-gray-200">Play History</h3>
        {footballPlays.length === 0 ? (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500">
            <p className="text-3xl mb-2">⚽</p>
            <p className="text-sm">No plays recorded yet</p>
          </div>
        ) : (
          footballPlays.map((play) => (
            <div
              key={play.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-3 shadow-sm flex items-center gap-3"
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shrink-0 ${
                  play.result === 'win'
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : 'bg-red-100 dark:bg-red-900/30'
                }`}
              >
                {play.result === 'win' ? '🏆' : '❌'}
              </div>

              <div className="flex-1">
                <p
                  className={`font-semibold text-sm capitalize ${
                    play.result === 'win'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {play.result}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{formatDate(play.date)}</p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span
                  className={`font-bold ${
                    play.result === 'win'
                      ? 'text-green-600 dark:text-green-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {play.result === 'win' ? '+' : '-'}${play.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => onDelete(play.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Delete"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
