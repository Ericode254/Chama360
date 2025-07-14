import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CreateChamaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChama: (chamaData: any) => void;
}

export const CreateChamaModal: React.FC<CreateChamaModalProps> = ({ isOpen, onClose, onCreateChama }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    contributionAmount: '',
    contributionFrequency: 'monthly' as 'weekly' | 'monthly',
    isPublic: false,
    maxMembers: '',
    allowLoans: true,
    loanInterestRate: '5'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreateChama({
      ...formData,
      contributionAmount: parseFloat(formData.contributionAmount),
      maxMembers: formData.maxMembers ? parseInt(formData.maxMembers) : undefined,
      loanInterestRate: parseFloat(formData.loanInterestRate)
    });
    setFormData({ 
      name: '', 
      description: '', 
      contributionAmount: '', 
      contributionFrequency: 'monthly',
      isPublic: false,
      maxMembers: '',
      allowLoans: true,
      loanInterestRate: '5'
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Chama</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chama Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter chama name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Describe the purpose of your chama"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contribution Amount (KES)
            </label>
            <input
              type="number"
              required
              value={formData.contributionAmount}
              onChange={(e) => setFormData({ ...formData, contributionAmount: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter amount"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contribution Frequency
            </label>
            <select
              value={formData.contributionFrequency}
              onChange={(e) => setFormData({ ...formData, contributionFrequency: e.target.value as 'weekly' | 'monthly' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Members (Optional)
            </label>
            <input
              type="number"
              value={formData.maxMembers}
              onChange={(e) => setFormData({ ...formData, maxMembers: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Leave empty for unlimited"
              min="2"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Public Chama</label>
              <p className="text-xs text-gray-500">Allow others to find and join your chama</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Allow Loans</label>
              <p className="text-xs text-gray-500">Enable members to request loans from the chama</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allowLoans}
                onChange={(e) => setFormData({ ...formData, allowLoans: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          {formData.allowLoans && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loan Interest Rate (%)
              </label>
              <input
                type="number"
                value={formData.loanInterestRate}
                onChange={(e) => setFormData({ ...formData, loanInterestRate: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="5"
                min="0"
                max="50"
                step="0.5"
              />
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Create Chama
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};