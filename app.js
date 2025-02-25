const { useState, useEffect } = React;

function TransactionForm({ addTransaction }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState('income');
  const [dateTime, setDateTime] = useState(new Date().toISOString().slice(0, 16));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (description && amount) {
      addTransaction({
        description,
        amount: parseFloat(amount),
        type,
        dateTime: new Date(dateTime).getTime(),
      });
      setDescription('');
      setAmount('');
      setType('income');
      setDateTime(new Date().toISOString().slice(0, 16));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-gray-800 rounded-xl shadow-2xl space-y-4">
      <h2 className="text-2xl font-bold text-white mb-4">➕ Add Transaction</h2>
      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">📝 Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 border-none"
          placeholder="e.g. Groceries"
          required
        />
      </div>
      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">💵 Amount</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 border-none"
          placeholder="0.00"
          step="0.01"
          required
        />
      </div>
      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">📆 Date & Time</label>
        <input
          type="datetime-local"
          value={dateTime}
          onChange={(e) => setDateTime(e.target.value)}
          className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg focus:ring-2 focus:ring-indigo-500 border-none"
          required
        />
      </div>
      <div>
        <label className="block text-gray-300 text-sm font-medium mb-2">📊 Type</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setType('income')}
            className={`p-3 rounded-lg font-medium ${type === 'income' ? 'bg-green-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            📈 Income
          </button>
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`p-3 rounded-lg font-medium ${type === 'expense' ? 'bg-red-600 text-white' : 'bg-gray-700 text-gray-300'}`}
          >
            📉 Expense
          </button>
        </div>
      </div>
      <button
        type="submit"
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02]"
      >
        🚀 Add Transaction
      </button>
    </form>
  );
}

function TransactionList({ transactions, deleteTransaction }) {
  const formatDateTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <div className="max-w-md mx-auto space-y-3">
      {transactions
        .sort((a, b) => b.dateTime - a.dateTime)
        .map((transaction, index) => (
          <div key={index} className="group p-4 bg-gray-800 rounded-lg shadow-md flex items-center justify-between hover:bg-gray-750 transition-colors">
            <div className="space-y-1">
              <div className="text-white font-medium flex items-center gap-2">
                {transaction.type === 'income' ? '📥' : '📤'}
                {transaction.description}
              </div>
              <div className="text-xs text-gray-400">
                🕒 {formatDateTime(transaction.dateTime)}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className={`text-sm font-medium ${transaction.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>
                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
              </span>
              <button
                onClick={() => deleteTransaction(index)}
                className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}

function Balance({ balance, totalIncome, totalExpense }) {
  const getCurrentDate = () => {
    const date = new Date();
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-2xl text-white">
      <div className="text-center space-y-4">
        <div className="text-sm text-indigo-100">
          📅 {getCurrentDate()}
        </div>
        <h2 className="text-2xl font-bold">⚖️ Balance: ${balance.toFixed(2)}</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white bg-opacity-10 p-3 rounded-lg">
            <div className="text-green-400">📈 Income</div>
            <div className="text-xl font-bold">+${totalIncome.toFixed(2)}</div>
          </div>
          <div className="bg-white bg-opacity-10 p-3 rounded-lg">
            <div className="text-red-400">📉 Expense</div>
            <div className="text-xl font-bold">-${totalExpense.toFixed(2)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Filter({ filter, setFilter }) {
  return (
    <div className="max-w-md mx-auto">
      <select
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border-none focus:ring-2 focus:ring-indigo-500"
      >
        <option value="all">🌐 All Transactions</option>
        <option value="income">📈 Income Only</option>
        <option value="expense">📉 Expense Only</option>
      </select>
    </div>
  );
}

function App() {
  const [transactions, setTransactions] = useState(
    JSON.parse(localStorage.getItem('transactions')) || []
  );
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  const addTransaction = (transaction) => {
    setTransactions([...transactions, transaction]);
  };

  const deleteTransaction = (index) => {
    setTransactions(transactions.filter((_, i) => i !== index));
  };

  const filteredTransactions = transactions.filter(
    (transaction) => filter === 'all' || transaction.type === filter
  );

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((acc, t) => acc + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc, t) => acc + t.amount, 0);

  const balance = totalIncome - totalExpense;

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-4xl font-bold text-center text-white">
        💰 Personal Finance Tracker
      </h1>

      <Balance balance={balance} totalIncome={totalIncome} totalExpense={totalExpense} />

      <TransactionForm addTransaction={addTransaction} />

      <Filter filter={filter} setFilter={setFilter} />

      <TransactionList transactions={filteredTransactions} deleteTransaction={deleteTransaction} />
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
