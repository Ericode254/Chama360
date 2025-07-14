import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { ChamaDetails } from '../components/ChamaDetails';
import { NotificationsModal } from '../components/NotificationsModal';
import { SettingsModal } from '../components/SettingsModal';
import { ProfileModal } from '../components/ProfileModal';
import { useAuth } from '../contexts/AuthContext';
import { useChama } from '../contexts/ChamaContext';
import type { Chama, AdminVoting } from '../types';

interface ChamaDetailsPageProps {
  chama: Chama;
  onBack: () => void;
}

export const ChamaDetailsPage: React.FC<ChamaDetailsPageProps> = ({ chama, onBack }) => {
  const navigate = useNavigate();
  const { currentUser, updateProfile } = useAuth();
  const { 
    transactions, 
    loanRequests, 
    notifications,
    userSettings,
    addTransaction,
    requestLoan,
    approveLoan,
    rejectLoan,
    updateChama,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    updateSettings
  } = useChama();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [adminVoting, setAdminVoting] = useState<AdminVoting | null>(null);

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const handleStartVoting = (proposedAdminId: string) => {
    const totalMembers = chama.members.filter(m => m.isActive).length;
    const requiredVotes = Math.ceil(totalMembers / 2);
    
    const newVoting: AdminVoting = {
      chamaId: chama.id,
      proposedAdminId,
      votes: [],
      requiredVotes,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      isActive: true
    };
    
    setAdminVoting(newVoting);
  };

  const handleVoteAdmin = (proposedAdminId: string) => {
    if (!adminVoting || !currentUser) return;
    
    const newVote = {
      id: Math.random().toString(36).substr(2, 9),
      chamaId: adminVoting.chamaId,
      proposedAdminId,
      voterId: currentUser.id,
      createdAt: new Date()
    };
    
    const updatedVoting = {
      ...adminVoting,
      votes: [...adminVoting.votes, newVote]
    };
    
    if (updatedVoting.votes.length >= updatedVoting.requiredVotes) {
      updateChama(chama.id, { adminId: proposedAdminId });
      setAdminVoting({ ...updatedVoting, isActive: false });
      
      setTimeout(() => {
        setAdminVoting(null);
      }, 3000);
    } else {
      setAdminVoting(updatedVoting);
    }
  };

  const handleContribute = () => {
    alert('M-Pesa integration would be implemented here. This would trigger an STK Push to the user\'s phone.');
  };

  const handleRequestLoan = (amount: number, reason: string) => {
    requestLoan({
      chamaId: chama.id,
      memberId: currentUser!.id,
      amount,
      reason,
      requestDate: new Date(),
      status: 'pending',
      interestRate: chama.loanInterestRate
    });
  };

  const handleRecordExpense = (amount: number, description: string) => {
    addTransaction({
      chamaId: chama.id,
      memberId: currentUser!.id,
      type: 'expense',
      amount,
      description,
      date: new Date(),
      status: 'approved',
      approvedBy: currentUser!.id
    });

    updateChama(chama.id, { 
      totalBalance: chama.totalBalance - amount 
    });
  };

  const handleRemoveMember = (memberId: string) => {
    const updatedMembers = chama.members.map(m =>
      m.user.id === memberId ? { ...m, isActive: false } : m
    );
    updateChama(chama.id, { members: updatedMembers });
  };

  const handleGenerateInvite = (): string => {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  };

  if (!currentUser) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentUser={currentUser} 
        onProfileClick={() => setShowProfile(true)}
        onNotificationsClick={() => setShowNotifications(true)}
        onSettingsClick={() => setShowSettings(true)}
        unreadNotifications={unreadNotificationsCount}
      />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ChamaDetails
          chama={chama}
          currentUserId={currentUser.id}
          adminVoting={adminVoting?.chamaId === chama.id ? adminVoting : null}
          onBack={onBack}
          onVoteAdmin={handleVoteAdmin}
          onStartVoting={handleStartVoting}
          onContribute={handleContribute}
          transactions={transactions.filter(t => t.chamaId === chama.id)}
          loanRequests={loanRequests.filter(l => l.chamaId === chama.id)}
          onRequestLoan={handleRequestLoan}
          onApproveLoan={approveLoan}
          onRejectLoan={rejectLoan}
          onRecordExpense={handleRecordExpense}
          onRemoveMember={handleRemoveMember}
          onGenerateInvite={handleGenerateInvite}
        />
      </main>
      
      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
        notifications={notifications}
        onMarkAsRead={markNotificationAsRead}
        onMarkAllAsRead={markAllNotificationsAsRead}
        onDeleteNotification={deleteNotification}
      />
      
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={userSettings}
        onUpdateSettings={updateSettings}
      />
      
      <ProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
        user={currentUser}
        onUpdateProfile={updateProfile}
      />
    </div>
  );
};