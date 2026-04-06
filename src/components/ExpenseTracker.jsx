import { useState } from 'react';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';

export default function ExpenseTracker({ expenses, onAdd, onUpdate, onDelete }) {
  const [editingExpense, setEditingExpense] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (expense) => {
    setEditingExpense(expense);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingExpense(null);
    setShowForm(false);
  };

  const handleUpdate = (id, data) => {
    onUpdate(id, data);
    setEditingExpense(null);
    setShowForm(false);
  };

  const handleAdd = (data) => {
    onAdd(data);
    setShowForm(false);
  };

  return (
    <div className="space-y-4 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">Expenses</h2>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-full text-sm font-semibold shadow-md shadow-indigo-200 dark:shadow-indigo-900 active:scale-95 transition-all"
          >
            <span className="text-base">+</span> Add
          </button>
        )}
      </div>

      {showForm && (
        <ExpenseForm
          onAdd={handleAdd}
          editingExpense={editingExpense}
          onUpdate={handleUpdate}
          onCancelEdit={handleCancelEdit}
        />
      )}

      <ExpenseList expenses={expenses} onDelete={onDelete} onEdit={handleEdit} />
    </div>
  );
}
