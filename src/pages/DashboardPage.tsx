import React, { useState } from 'react';
import { Plus, UserPlus } from 'lucide-react';
import { Header } from '../components/Header';
import { ChamaCard } from '../components/ChamaCard';
import { CreateChamaModal } from '../components/CreateChamaModal';
import { JoinChamaModal } from '../components/JoinChamaModal';
import { NotificationsModal } from '../components/NotificationsModal';
import { SettingsModal } from '../components/SettingsModal';
import { ProfileModal } from '../components/ProfileModal';
import { useAuth } from '../contexts/AuthContext';
import { useChama } from '../contexts/ChamaContext';
import type { Chama } from '../types';

interface DashboardPageProps {
  onSelectChama: (chama: Chama) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onSelectChama }) => {
  const { currentUser, updateProfile } = useAuth();
  const { 
    chamas, 
    notifications, 
    userSettings,
    createChama,
    joinChama,
    joinByCode,
    getAvailableChamas,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    updateSettings
  } = useChama();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const unreadNotificationsCount = notifications.filter(n => !n.isRead).length;

  const handleCreateChama = (chamaData: any) => {
    createChama(chamaData);
    setShowCreateModal(false);
  };

  const handleJoinChama = (chamaId: string) => {
    joinChama(chamaId);
    setShowJoinModal(false);
  };

  const handleJoinByCode = (inviteCode: string) => {
    joinByCode(inviteCode);
    setShowJoinModal(false);
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Chamas</h1>
            <p className="text-gray-600 mt-2">Manage your chama memberships and contributions</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => setShowJoinModal(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2"
            >
              <UserPlus className="h-5 w-5" />
              <span>Join Chama</span>
            </button>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Create Chama</span>
            </button>
          </div>
        </div>

        {chamas.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-md p-8 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">No Chamas Yet</h3>
              <p className="text-gray-600 mb-6">
                Start your savings journey by creating your first chama or joining an existing one.
              </p>
              <div className="flex space-x-3 justify-center">
                <button
                  onClick={() => setShowJoinModal(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Join a Chama
                </button>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
                >
                  Create Chama
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chamas.map((chama) => (
              <ChamaCard
                key={chama.id}
                chama={chama}
                currentUserId={currentUser.id}
                onViewDetails={onSelectChama}
              />
            ))}
          </div>
        )}

        <CreateChamaModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreateChama={handleCreateChama}
        />
        
        <JoinChamaModal
          isOpen={showJoinModal}
          onClose={() => setShowJoinModal(false)}
          availableChamas={getAvailableChamas()}
          onJoinChama={handleJoinChama}
          onJoinByCode={handleJoinByCode}
        />
        
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
      </main>
    </div>
  );
};