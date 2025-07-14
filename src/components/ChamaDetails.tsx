import React, { useState } from 'react';
import { ArrowLeft, Users, DollarSign, Calendar, Crown, Vote, Send, TrendingUp, Settings } from 'lucide-react';
import type { Chama, AdminVoting } from '../types';
import { FinancialDashboard } from './FinancialDashboard';
import { MemberManagement } from './MemberManagement';

interface ChamaDetailsProps {
  chama: Chama;
  currentUserId: string;
  adminVoting: AdminVoting | null;
  onBack: () => void;
  onVoteAdmin: (proposedAdminId: string) => void;
  onStartVoting: (proposedAdminId: string) => void;
  onContribute: () => void;
  transactions: any[];
  loanRequests: any[];
  onRequestLoan: (amount: number, reason: string) => void;
  onApproveLoan: (loanId: string) => void;
  onRejectLoan: (loanId: string) => void;
  onRecordExpense: (amount: number, description: string) => void;
  onRemoveMember: (memberId: string) => void;
  onGenerateInvite: () => string;
}

export const ChamaDetails: React.FC<ChamaDetailsProps> = ({
  chama,
  currentUserId,
  adminVoting,
  onBack,
  onVoteAdmin,
  onStartVoting,
  onContribute,
  transactions,
  loanRequests,
  onRequestLoan,
  onApproveLoan,
  onRejectLoan,
  onRecordExpense,
  onRemoveMember,
  onGenerateInvite
}) => {
  const [selectedMemberForAdmin, setSelectedMemberForAdmin] = useState('');
  const [showVotingModal, setShowVotingModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'financial' | 'members'>('overview');

  const isAdmin = chama.adminId === currentUserId;
  const currentUserMember = chama.members.find(m => m.user.id === currentUserId);
  const adminMember = chama.members.find(m => m.user.id === chama.adminId);

  const handleStartVoting = () => {
    if (selectedMemberForAdmin) {
      onStartVoting(selectedMemberForAdmin);
      setShowVotingModal(false);
      setSelectedMemberForAdmin('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center space-x-4 mb-6">
        <button
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{chama.name}</h1>
        {isAdmin && (
          <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
            <Crown className="h-4 w-4" />
            <span>Admin</span>
          </div>
        )}
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'overview' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('financial')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'financial' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600'
          }`}
        >
          Financial
        </button>
        <button
          onClick={() => setActiveTab('members')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'members' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-600'
          }`}
        >
          Members
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center space-x-3 mb-2">
            <DollarSign className="h-5 w-5 text-green-600" />
            <span className="text-sm font-medium text-gray-600">Total Balance</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">KES {chama.totalBalance.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center space-x-3 mb-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-600">Active Members</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{chama.members.filter(m => m.isActive).length}</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <div className="flex items-center space-x-3 mb-2">
            <Calendar className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-medium text-gray-600">Contribution</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">KES {chama.contributionAmount}</p>
          <p className="text-sm text-gray-500 capitalize">{chama.contributionFrequency}</p>
        </div>
      </div>

      {/* Admin Voting Section */}
      {adminVoting?.isActive && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 mb-6">
          <div className="flex items-center space-x-2 mb-4">
            <Vote className="h-5 w-5 text-yellow-600" />
            <h3 className="text-lg font-semibold text-yellow-800">Admin Voting in Progress</h3>
          </div>
          <p className="text-yellow-700 mb-4">
            Vote to make {chama.members.find(m => m.user.id === adminVoting.proposedAdminId)?.user.name} the new admin
          </p>
          <div className="flex items-center justify-between">
            <span className="text-sm text-yellow-600">
              {adminVoting.votes.length} of {adminVoting.requiredVotes} votes needed
            </span>
            {!adminVoting.votes.some(v => v.voterId === currentUserId) && (
              <button
                onClick={() => onVoteAdmin(adminVoting.proposedAdminId)}
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Vote Yes
              </button>
            )}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Members List */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Members</h2>
            {!adminVoting?.isActive && (
              <button
                onClick={() => setShowVotingModal(true)}
                className="text-sm text-green-600 hover:text-green-700 font-medium flex items-center space-x-1"
              >
                <Vote className="h-4 w-4" />
                <span>Vote Admin</span>
              </button>
            )}
          </div>
          
          <div className="space-y-4">
            {chama.members.map((member) => (
              <div key={member.user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {member.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{member.user.name}</p>
                    <p className="text-sm text-gray-600">{member.user.phone}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    KES {member.totalContributions.toLocaleString()}
                  </p>
                  {member.user.id === chama.adminId && (
                    <span className="text-xs text-yellow-600 font-medium">Admin</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contribution & M-Pesa */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Make Contribution</h2>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center space-x-2 mb-2">
                <Send className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800">M-Pesa Integration</span>
              </div>
              <p className="text-sm text-green-700 mb-4">
                Send your contribution directly through M-Pesa to the chama admin
              </p>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Admin Phone Number
                  </label>
                  <p className="text-lg font-mono bg-white p-2 rounded border">
                    {adminMember?.user.phone}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount
                  </label>
                  <p className="text-lg font-mono bg-white p-2 rounded border">
                    KES {chama.contributionAmount.toLocaleString()}
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reference
                  </label>
                  <p className="text-sm font-mono bg-white p-2 rounded border">
                    {chama.name.replace(/\s+/g, '').toUpperCase()}-{currentUserMember?.user.name.replace(/\s+/g, '').toUpperCase()}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={onContribute}
              className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
            >
              <Send className="h-5 w-5" />
              <span>Send via M-Pesa</span>
            </button>
            
            <p className="text-xs text-gray-500 text-center">
              This will open M-Pesa on your device with pre-filled details
            </p>
          </div>
        </div>
      </div>
        </>
      )}

      {activeTab === 'financial' && (
        <FinancialDashboard
          chama={chama}
          transactions={transactions}
          loanRequests={loanRequests}
          currentUserId={currentUserId}
          onRequestLoan={onRequestLoan}
          onApproveLoan={onApproveLoan}
          onRejectLoan={onRejectLoan}
          onRecordExpense={onRecordExpense}
        />
      )}

      {activeTab === 'members' && (
        <MemberManagement
          chama={chama}
          currentUserId={currentUserId}
          onRemoveMember={onRemoveMember}
          onGenerateInvite={onGenerateInvite}
        />
      )}

      {/* Voting Modal */}
      {showVotingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Vote for New Admin</h3>
              <p className="text-sm text-gray-600 mb-4">
                Select a member to propose as the new admin. Other members will need to vote.
              </p>
              
              <div className="space-y-3 mb-6">
                {chama.members
                  .filter(m => m.user.id !== chama.adminId && m.user.id !== currentUserId)
                  .map((member) => (
                    <label key={member.user.id} className="flex items-center space-x-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
                      <input
                        type="radio"
                        name="adminCandidate"
                        value={member.user.id}
                        checked={selectedMemberForAdmin === member.user.id}
                        onChange={(e) => setSelectedMemberForAdmin(e.target.value)}
                        className="text-green-600"
                      />
                      <span className="font-medium">{member.user.name}</span>
                    </label>
                  ))}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowVotingModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleStartVoting}
                  disabled={!selectedMemberForAdmin}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Start Voting
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};