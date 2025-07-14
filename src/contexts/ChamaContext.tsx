import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Chama, Transaction, LoanRequest, Notification, UserSettings } from '../types';
import { createMockChamas } from '../data/mockData';
import { useAuth } from './AuthContext';

interface ChamaContextType {
  chamas: Chama[];
  transactions: Transaction[];
  loanRequests: LoanRequest[];
  notifications: Notification[];
  userSettings: UserSettings;
  createChama: (chamaData: any) => void;
  joinChama: (chamaId: string) => void;
  joinByCode: (inviteCode: string) => void;
  updateChama: (chamaId: string, updates: Partial<Chama>) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  requestLoan: (loanRequest: Omit<LoanRequest, 'id'>) => void;
  approveLoan: (loanId: string) => void;
  rejectLoan: (loanId: string) => void;
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  deleteNotification: (notificationId: string) => void;
  updateSettings: (settings: UserSettings) => void;
  getAvailableChamas: () => Chama[];
}

const ChamaContext = createContext<ChamaContextType | undefined>(undefined);

export const useChama = () => {
  const context = useContext(ChamaContext);
  if (context === undefined) {
    throw new Error('useChama must be used within a ChamaProvider');
  }
  return context;
};

interface ChamaProviderProps {
  children: ReactNode;
}

export const ChamaProvider: React.FC<ChamaProviderProps> = ({ children }) => {
  const { currentUser } = useAuth();
  const [chamas, setChamas] = useState<Chama[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loanRequests, setLoanRequests] = useState<LoanRequest[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [userSettings, setUserSettings] = useState<UserSettings>({
    userId: '',
    emailNotifications: true,
    smsNotifications: true,
    contributionReminders: true,
    adminVotingAlerts: true,
    language: 'en',
    currency: 'KES'
  });

  useEffect(() => {
    if (currentUser) {
      setChamas(createMockChamas(currentUser.id));
      setUserSettings(prev => ({ ...prev, userId: currentUser.id }));
      
      // Create mock notifications
      const mockNotifications: Notification[] = [
        {
          id: '1',
          userId: currentUser.id,
          title: 'Contribution Reminder',
          message: 'Your monthly contribution of KES 5,000 is due in 3 days for Family Investment Group.',
          type: 'contribution',
          isRead: false,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          chamaId: '1'
        },
        {
          id: '2',
          userId: currentUser.id,
          title: 'New Admin Elected',
          message: 'Jane Smith has been elected as the new admin for Business Partners Chama.',
          type: 'admin_change',
          isRead: false,
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
          chamaId: '2'
        },
        {
          id: '3',
          userId: currentUser.id,
          title: 'Welcome to Chama360!',
          message: 'Thank you for joining Chama360. Start by creating your first chama or joining an existing one.',
          type: 'general',
          isRead: true,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
        }
      ];
      setNotifications(mockNotifications);
    }
  }, [currentUser]);

  const createChama = (chamaData: any) => {
    if (!currentUser) return;

    const newChama: Chama = {
      id: Math.random().toString(36).substr(2, 9),
      ...chamaData,
      adminId: currentUser.id,
      totalBalance: 0,
      createdAt: new Date(),
      nextContributionDate: new Date(Date.now() + (chamaData.contributionFrequency === 'weekly' ? 7 : 30) * 24 * 60 * 60 * 1000),
      members: [
        {
          user: currentUser,
          joinedAt: new Date(),
          totalContributions: 0,
          isActive: true,
          totalLoans: 0,
          totalWithdrawals: 0
        }
      ]
    };
    setChamas(prev => [...prev, newChama]);
  };

  const joinChama = (chamaId: string) => {
    if (!currentUser) return;

    const availableChamas = getAvailableChamas();
    const chamaToJoin = availableChamas.find(c => c.id === chamaId);
    if (!chamaToJoin) return;

    const newMember = {
      user: currentUser,
      joinedAt: new Date(),
      totalContributions: 0,
      isActive: true,
      totalLoans: 0,
      totalWithdrawals: 0
    };

    const updatedChama = {
      ...chamaToJoin,
      members: [...chamaToJoin.members, newMember]
    };

    setChamas(prev => [...prev, updatedChama]);
  };

  const joinByCode = (inviteCode: string) => {
    // In a real app, this would validate the invite code with the backend
    console.log(`Joining chama with invite code: ${inviteCode}`);
  };

  const updateChama = (chamaId: string, updates: Partial<Chama>) => {
    setChamas(prev => prev.map(chama => 
      chama.id === chamaId ? { ...chama, ...updates } : chama
    ));
  };

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: Math.random().toString(36).substr(2, 9)
    };
    setTransactions(prev => [...prev, newTransaction]);
  };

  const requestLoan = (loanRequest: Omit<LoanRequest, 'id'>) => {
    const newLoanRequest: LoanRequest = {
      ...loanRequest,
      id: Math.random().toString(36).substr(2, 9)
    };
    setLoanRequests(prev => [...prev, newLoanRequest]);
  };

  const approveLoan = (loanId: string) => {
    setLoanRequests(prev => prev.map(loan => 
      loan.id === loanId 
        ? { ...loan, status: 'approved' as const, approvedBy: currentUser?.id }
        : loan
    ));
  };

  const rejectLoan = (loanId: string) => {
    setLoanRequests(prev => prev.map(loan => 
      loan.id === loanId 
        ? { ...loan, status: 'rejected' as const }
        : loan
    ));
  };

  const addNotification = (notification: Omit<Notification, 'id'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9)
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => prev.map(notification =>
      notification.id === notificationId
        ? { ...notification, isRead: true }
        : notification
    ));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, isRead: true })));
  };

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== notificationId));
  };

  const updateSettings = (settings: UserSettings) => {
    setUserSettings(settings);
  };

  const getAvailableChamas = (): Chama[] => {
    const allChamas = createMockChamas('sample');
    const userChamaIds = chamas.map(c => c.id);
    
    return allChamas.filter(chama => 
      chama.isPublic && 
      !userChamaIds.includes(chama.id) &&
      !chama.members.some(m => m.user.id === currentUser?.id)
    );
  };

  const value = {
    chamas,
    transactions,
    loanRequests,
    notifications,
    userSettings,
    createChama,
    joinChama,
    joinByCode,
    updateChama,
    addTransaction,
    requestLoan,
    approveLoan,
    rejectLoan,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    updateSettings,
    getAvailableChamas
  };

  return (
    <ChamaContext.Provider value={value}>
      {children}
    </ChamaContext.Provider>
  );
};