import React from 'react';
import { Users, Calendar, DollarSign, Crown } from 'lucide-react';
import type { Chama } from '../types';

interface ChamaCardProps {
  chama: Chama;
  currentUserId: string;
  onViewDetails: (chama: Chama) => void;
}

export const ChamaCard: React.FC<ChamaCardProps> = ({ chama, currentUserId, onViewDetails }) => {
  const isAdmin = chama.adminId === currentUserId;
  const activeMembersCount = chama.members.filter(m => m.isActive).length;

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{chama.name}</h3>
            <p className="text-gray-600 text-sm line-clamp-2">{chama.description}</p>
          </div>
          {isAdmin && (
            <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
              <Crown className="h-3 w-3" />
              <span>Admin</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">{activeMembersCount} members</span>
          </div>
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700">KES {chama.totalBalance.toLocaleString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-700 capitalize">{chama.contributionFrequency}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-700">KES {chama.contributionAmount}</span>
          </div>
        </div>

        <button
          onClick={() => onViewDetails(chama)}
          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
        >
          View Details
        </button>
      </div>
    </div>
  );
};