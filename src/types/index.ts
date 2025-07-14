export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
}

export interface ChamaMember {
  user: User;
  joinedAt: Date;
  totalContributions: number;
  lastContribution?: Date;
  isActive: boolean;
  totalLoans: number;
  totalWithdrawals: number;
}

export interface Transaction {
  id: string;
  chamaId: string;
  memberId: string;
  type: 'contribution' | 'loan' | 'withdrawal' | 'expense' | 'loan_repayment';
  amount: number;
  description: string;
  date: Date;
  approvedBy?: string;
  status: 'pending' | 'approved' | 'rejected';
  mpesaCode?: string;
}

export interface LoanRequest {
  id: string;
  chamaId: string;
  memberId: string;
  amount: number;
  reason: string;
  requestDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  dueDate?: Date;
  interestRate?: number;
}

export interface ChamaInvite {
  id: string;
  chamaId: string;
  inviteCode: string;
  createdBy: string;
  expiresAt: Date;
  maxUses: number;
  currentUses: number;
  isActive: boolean;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'contribution' | 'admin_change' | 'voting' | 'general' | 'loan_request' | 'loan_approved' | 'member_joined';
  isRead: boolean;
  createdAt: Date;
  chamaId?: string;
}

export interface UserSettings {
  userId: string;
  emailNotifications: boolean;
  smsNotifications: boolean;
  contributionReminders: boolean;
  adminVotingAlerts: boolean;
  language: 'en' | 'sw';
  currency: 'KES' | 'USD';
}

export interface Chama {
  id: string;
  name: string;
  description: string;
  adminId: string;
  members: ChamaMember[];
  contributionAmount: number;
  contributionFrequency: 'weekly' | 'monthly';
  totalBalance: number;
  createdAt: Date;
  nextContributionDate: Date;
  isPublic: boolean;
  maxMembers?: number;
  loanInterestRate: number;
  allowLoans: boolean;
}

export interface Vote {
  id: string;
  chamaId: string;
  proposedAdminId: string;
  voterId: string;
  createdAt: Date;
}

export interface AdminVoting {
  chamaId: string;
  proposedAdminId: string;
  votes: Vote[];
  requiredVotes: number;
  expiresAt: Date;
  isActive: boolean;
}