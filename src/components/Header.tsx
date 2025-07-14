import React from 'react';
import { User, Settings, Bell } from 'lucide-react';

interface HeaderProps {
  currentUser: any;
  onProfileClick: () => void;
  onNotificationsClick: () => void;
  onSettingsClick: () => void;
  unreadNotifications?: number;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentUser, 
  onProfileClick, 
  onNotificationsClick, 
  onSettingsClick,
  unreadNotifications = 0 
}) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-green-600">Chama360</h1>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              onClick={onNotificationsClick}
              className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors"
            >
              <Bell className="h-5 w-5" />
              {unreadNotifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadNotifications > 9 ? '9+' : unreadNotifications}
                </span>
              )}
            </button>
            <button 
              onClick={onSettingsClick}
              className="p-2 text-gray-400 hover:text-gray-500 transition-colors"
            >
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={onProfileClick}
              className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-green-600 flex items-center justify-center">
                {currentUser?.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <User className="h-5 w-5 text-white" />
                )}
              </div>
              <span className="text-sm font-medium text-gray-700">{currentUser?.name}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};