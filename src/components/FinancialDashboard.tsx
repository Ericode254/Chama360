import React, { useState } from 'react';
import { DollarSign, TrendingUp, TrendingDown, Calendar, Plus, Eye, Check, X } from 'lucide-react';
import type { Transaction, LoanRequest, Chama } from '../types';

interface FinancialDashboardProps {
  chama: Chama;
  transactions: Transaction[];
  loanRequests: LoanRequest[];
  currentUserId: string;
  onRequestLoan: (amount: number, reason: string) => void;
  onApproveLoan: (loanId: string) => void;
  onRejectLoan: (loanId: string) => void;
  onRecordExpense: (amount: number, description: string) => void;
}

export const FinancialDashboard: React.FC<FinancialDashboardProps> = ({
  chama,
  transactions,
  loanRequests,
  currentUserId,
  onRequestLoan,
  onApproveLoan,
  onRejectLoan,
  onRecordExpense
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'loans'>('overview');
  const [showLoanModal, setShowLoanModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [loanForm, setLoanForm] = useState({ amount: '', reason: '' });
  const [expenseForm, setExpenseForm] = useState({ amount: '', description: '' });

  const isAdmin = chama.adminId === currentUserId;
  const currentMember = chama.members.find(m => m.user.id === currentUserId);

  // Calculate financial metrics
  const totalContributions = transactions
    .filter(t => t.type === 'contribution' && t.status === 'approved')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalLoans = transactions
    .filter(t => t.type === 'loan' && t.status === 'approved')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'expense' && t.status === 'approved')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingLoanRequests = loanRequests.filter(l => l.status === 'pending');

  const handleLoanRequest = (e: React.FormEvent) => {
    e.preventDefault();
    onRequestLoan(parseFloat(loanForm.amount), loanForm.reason);
    setLoanForm({ amount: '', reason: '' });
    setShowLoanModal(false);
  };

  const handleExpenseRecord = (e: React.FormEvent) => {
    e.preventDefault();
    onRecordExpense(parseFloat(expenseForm.amount), expenseForm.description);
    setExpenseForm({ amount: '', description: '' });
    setShowExpenseModal(false);
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'contribution': return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'loan': return <TrendingDown className="h-4 w-4 text-orange-600" />;
      case 'withdrawal': return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'expense': return <TrendingDown className="h-4 w-4 text-purple-600" />;
      default: return <DollarSign className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTransactionColor = (type: string) => {
    switch (type) {
      case 'contribution': return 'text-green-600';
      case 'loan': return 'text-orange-600';
      case 'withdrawal': return 'text-red-600';
      case 'expense': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center space-x-3 mb-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Total Balance</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">KES {chama.totalBalance.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingUp className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Contributions</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">KES {totalContributions.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingDown className="h-5 w-5 text-orange-600" />
            <span className="text-sm font-medium text-gray-600">Active Loans</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">KES {totalLoans.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center space-x-3 mb-2">
            <TrendingDown className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Expenses</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">KES {totalExpenses.toLocaleString()}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'overview' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'transactions' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600'
          }`}
        >
          Transactions
        </button>
        <button
          onClick={() => setActiveTab('loans')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'loans' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600'
          }`}
        >
          Loans ({pendingLoanRequests.length})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Member Financial Summary */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Financial Summary</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Total Contributions</span>
                <span className="font-semibold text-green-600">KES {currentMember?.totalContributions.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Active Loans</span>
                <span className="font-semibold text-orange-600">KES {currentMember?.totalLoans.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Total Withdrawals</span>
                <span className="font-semibold text-blue-600">KES {currentMember?.totalWithdrawals.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {chama.allowLoans && (
                <button
                  onClick={() => setShowLoanModal(true)}
                  className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Request Loan</span>
                </button>
              )}
              
              {isAdmin && (
                <button
                  onClick={() => setShowExpenseModal(true)}
                  className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors font-medium flex items-center justify-center space-x-2"
                >
                  <Plus className="h-5 w-5" />
                  <span>Record Expense</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction History</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No transactions yet</p>
              </div>
            ) : (
              transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getTransactionIcon(transaction.type)}
                    <div>
                      <p className="font-medium text-gray-900 capitalize">
                        {transaction.type.replace('_', ' ')}
                      </p>
                      <p className="text-sm text-gray-600">{transaction.description}</p>
                      <p className="text-xs text-gray-400">
                        {transaction.date.toLocaleDateString()} • {transaction.mpesaCode && `M-Pesa: ${transaction.mpesaCode}`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                      {transaction.type === 'contribution' ? '+' : '-'}KES {transaction.amount.toLocaleString()}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      transaction.status === 'approved' ? 'bg-green-100 text-green-800' :
                      transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {activeTab === 'loans' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Loan Requests</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {loanRequests.length === 0 ? (
              <div className="text-center py-8">
                <TrendingDown className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No loan requests</p>
              </div>
            ) : (
              loanRequests.map((loan) => {
                const member = chama.members.find(m => m.user.id === loan.memberId);
                return (
                  <div key={loan.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <p className="font-medium text-gray-900">{member?.user.name}</p>
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          loan.status === 'approved' ? 'bg-green-100 text-green-800' :
                          loan.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {loan.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{loan.reason}</p>
                      <p className="text-xs text-gray-400">
                        Requested: {loan.requestDate.toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold text-orange-600">KES {loan.amount.toLocaleString()}</p>
                        {loan.interestRate && (
                          <p className="text-xs text-gray-500">{loan.interestRate}% interest</p>
                        )}
                      </div>
                      {isAdmin && loan.status === 'pending' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => onApproveLoan(loan.id)}
                            className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <Check className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => onRejectLoan(loan.id)}
                            className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Loan Request Modal */}
      {showLoanModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Request Loan</h3>
              <form onSubmit={handleLoanRequest} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Loan Amount (KES)
                  </label>
                  <input
                    type="number"
                    required
                    value={loanForm.amount}
                    onChange={(e) => setLoanForm({ ...loanForm, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter amount"
                    max={chama.totalBalance}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Loan
                  </label>
                  <textarea
                    required
                    value={loanForm.reason}
                    onChange={(e) => setLoanForm({ ...loanForm, reason: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Explain why you need this loan"
                  />
                </div>
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-sm text-orange-800">
                    Interest Rate: {chama.loanInterestRate}% • Available Balance: KES {chama.totalBalance.toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowLoanModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Expense Record Modal */}
      {showExpenseModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Record Expense</h3>
              <form onSubmit={handleExpenseRecord} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expense Amount (KES)
                  </label>
                  <input
                    type="number"
                    required
                    value={expenseForm.amount}
                    onChange={(e) => setExpenseForm({ ...expenseForm, amount: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter amount"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Describe the expense"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowExpenseModal(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Record Expense
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};