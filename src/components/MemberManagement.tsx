import React, { useState } from 'react';
import { Users, UserPlus, UserMinus, Crown, Share2, Copy, Check } from 'lucide-react';
import type { Chama, ChamaMember } from '../types';

interface MemberManagementProps {
  chama: Chama;
  currentUserId: string;
  onRemoveMember: (memberId: string) => void;
  onGenerateInvite: () => string;
}

export const MemberManagement: React.FC<MemberManagementProps> = ({
  chama,
  currentUserId,
  onRemoveMember,
  onGenerateInvite
}) => {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [copied, setCopied] = useState(false);

  const isAdmin = chama.adminId === currentUserId;
  const activeMembers = chama.members.filter(m => m.isActive);

  const handleGenerateInvite = () => {
    const code = onGenerateInvite();
    setInviteCode(code);
    setShowInviteModal(true);
  };

  const copyInviteCode = async () => {
    try {
      await navigator.clipboard.writeText(inviteCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy invite code');
    }
  };

  const shareInvite = () => {
    const shareText = `Join our chama "${chama.name}" on Chama360! Use invite code: ${inviteCode}`;
    
    if (navigator.share) {
      navigator.share({
        title: `Join ${chama.name}`,
        text: shareText,
      });
    } else {
      // Fallback for browsers that don't support Web Share API
      copyInviteCode();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Member Management</h2>
          <p className="text-gray-600">{activeMembers.length} active members</p>
        </div>
        
        {isAdmin && (
          <button
            onClick={handleGenerateInvite}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center space-x-2"
          >
            <UserPlus className="h-4 w-4" />
            <span>Invite Members</span>
          </button>
        )}
      </div>

      {/* Members List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Active Members</h3>
        </div>
        
        <div className="divide-y divide-gray-200">
          {activeMembers.map((member) => (
            <div key={member.user.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium text-lg">
                      {member.user.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">{member.user.name}</h4>
                      {member.user.id === chama.adminId && (
                        <div className="flex items-center space-x-1 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                          <Crown className="h-3 w-3" />
                          <span>Admin</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{member.user.email}</p>
                    <p className="text-sm text-gray-600">{member.user.phone}</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">
                      KES {member.totalContributions.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">Total Contributions</p>
                    
                    {member.totalLoans > 0 && (
                      <>
                        <p className="text-sm font-medium text-orange-600">
                          KES {member.totalLoans.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-500">Active Loans</p>
                      </>
                    )}
                    
                    <p className="text-xs text-gray-400">
                      Joined: {member.joinedAt.toLocaleDateString()}
                    </p>
                  </div>

                  {isAdmin && member.user.id !== currentUserId && member.user.id !== chama.adminId && (
                    <button
                      onClick={() => onRemoveMember(member.user.id)}
                      className="mt-2 text-red-600 hover:text-red-700 text-sm font-medium flex items-center space-x-1"
                    >
                      <UserMinus className="h-4 w-4" />
                      <span>Remove</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Member Financial Summary */}
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="text-xs text-green-600 font-medium">Contributions</p>
                  <p className="text-lg font-semibold text-green-700">
                    KES {member.totalContributions.toLocaleString()}
                  </p>
                </div>
                
                <div className="bg-orange-50 p-3 rounded-lg">
                  <p className="text-xs text-orange-600 font-medium">Loans</p>
                  <p className="text-lg font-semibold text-orange-700">
                    KES {member.totalLoans.toLocaleString()}
                  </p>
                </div>
                
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-xs text-blue-600 font-medium">Withdrawals</p>
                  <p className="text-lg font-semibold text-blue-700">
                    KES {member.totalWithdrawals.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Chama Settings (Admin Only) */}
      {isAdmin && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Chama Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Member Limit</h4>
              <p className="text-sm text-gray-600 mb-2">
                Current: {activeMembers.length} / {chama.maxMembers || 'Unlimited'}
              </p>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                Update Limit
              </button>
            </div>
            
            <div className="p-4 border border-gray-200 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Loan Settings</h4>
              <p className="text-sm text-gray-600 mb-2">
                Interest Rate: {chama.loanInterestRate}%
              </p>
              <button className="text-green-600 hover:text-green-700 text-sm font-medium">
                Update Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Invite New Members</h3>
              
              <div className="space-y-4">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Share2 className="h-8 w-8 text-green-600" />
                  </div>
                  <p className="text-gray-600 mb-4">
                    Share this invite code with people you want to join your chama
                  </p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg text-center">
                  <p className="text-sm text-gray-600 mb-2">Invite Code</p>
                  <p className="text-2xl font-mono font-bold text-gray-900 tracking-widest">
                    {inviteCode}
                  </p>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={copyInviteCode}
                    className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    <span>{copied ? 'Copied!' : 'Copy Code'}</span>
                  </button>
                  
                  <button
                    onClick={shareInvite}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>Share</span>
                  </button>
                </div>

                <div className="text-center">
                  <button
                    onClick={() => setShowInviteModal(false)}
                    className="text-gray-600 hover:text-gray-800 text-sm"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};