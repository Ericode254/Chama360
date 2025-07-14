import React, { useState } from 'react';
import { X, Search, Users, DollarSign, Calendar, UserPlus } from 'lucide-react';
import type { Chama } from '../types';

interface JoinChamaModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableChamas: Chama[];
  onJoinChama: (chamaId: string) => void;
  onJoinByCode: (inviteCode: string) => void;
}

export const JoinChamaModal: React.FC<JoinChamaModalProps> = ({
  isOpen,
  onClose,
  availableChamas,
  onJoinChama,
  onJoinByCode
}) => {
  const [activeTab, setActiveTab] = useState<'browse' | 'invite'>('browse');
  const [searchTerm, setSearchTerm] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const filteredChamas = availableChamas.filter(chama =>
    chama.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chama.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleJoinByCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (inviteCode.trim()) {
      onJoinByCode(inviteCode.trim());
      setInviteCode('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Join a Chama</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex bg-gray-100 rounded-lg p-1 m-6 mb-0">
          <button
            onClick={() => setActiveTab('browse')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'browse' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600'
            }`}
          >
            Browse Chamas
          </button>
          <button
            onClick={() => setActiveTab('invite')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'invite' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600'
            }`}
          >
            Join by Invite
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'browse' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search chamas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="max-h-96 overflow-y-auto space-y-3">
                {filteredChamas.length === 0 ? (
                  <div className="text-center py-8">
                    <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No public chamas found</p>
                  </div>
                ) : (
                  filteredChamas.map((chama) => (
                    <div key={chama.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900">{chama.name}</h3>
                          <p className="text-sm text-gray-600 mt-1">{chama.description}</p>
                        </div>
                        <button
                          onClick={() => {
                            onJoinChama(chama.id);
                            onClose();
                          }}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center space-x-1"
                        >
                          <UserPlus className="h-4 w-4" />
                          <span>Join</span>
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center space-x-2">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">{chama.members.length} members</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <DollarSign className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700">KES {chama.contributionAmount}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          <span className="text-gray-700 capitalize">{chama.contributionFrequency}</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'invite' && (
            <form onSubmit={handleJoinByCode} className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <UserPlus className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-gray-600">
                  Enter the invite code shared by a chama admin to join their group.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Invite Code
                </label>
                <input
                  type="text"
                  required
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-center text-lg font-mono tracking-widest"
                  placeholder="CHAMA123"
                  maxLength={10}
                />
              </div>

              <button
                type="submit"
                disabled={!inviteCode.trim()}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Join Chama
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};