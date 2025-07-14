import type { User, Chama, ChamaMember } from '../types';

export const mockUsers: User[] = [
  { id: '1', name: 'John Doe', email: 'john@example.com', phone: '+254700000001', avatar: '' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', phone: '+254700000002' },
  { id: '3', name: 'Mike Johnson', email: 'mike@example.com', phone: '+254700000003' },
  { id: '4', name: 'Sarah Wilson', email: 'sarah@example.com', phone: '+254700000004' },
  { id: '5', name: 'David Brown', email: 'david@example.com', phone: '+254700000005' },
  { id: '6', name: 'Grace Wanjiku', email: 'grace@example.com', phone: '+254700000006' },
  { id: '7', name: 'Peter Kamau', email: 'peter@example.com', phone: '+254700000007' },
  { id: '8', name: 'Mary Akinyi', email: 'mary@example.com', phone: '+254700000008' },
];

export const createMockChamas = (currentUserId: string): Chama[] => [
  {
    id: '1',
    name: 'Family Investment Group',
    description: 'Monthly contributions for family investment opportunities and emergency fund',
    adminId: currentUserId,
    contributionAmount: 5000,
    contributionFrequency: 'monthly',
    totalBalance: 150000,
    createdAt: new Date('2024-01-15'),
    nextContributionDate: new Date('2024-02-15'),
    isPublic: false,
    maxMembers: 10,
    loanInterestRate: 5,
    allowLoans: true,
    members: [
      {
        user: mockUsers.find(u => u.id === currentUserId)!,
        joinedAt: new Date('2024-01-15'),
        totalContributions: 25000,
        lastContribution: new Date('2024-02-01'),
        isActive: true,
        totalLoans: 0,
        totalWithdrawals: 0
      },
      {
        user: mockUsers[1],
        joinedAt: new Date('2024-01-16'),
        totalContributions: 30000,
        lastContribution: new Date('2024-02-01'),
        isActive: true,
        totalLoans: 10000,
        totalWithdrawals: 5000
      },
      {
        user: mockUsers[2],
        joinedAt: new Date('2024-01-17'),
        totalContributions: 20000,
        lastContribution: new Date('2024-01-15'),
        isActive: true,
        totalLoans: 0,
        totalWithdrawals: 0
      },
      {
        user: mockUsers[3],
        joinedAt: new Date('2024-01-18'),
        totalContributions: 35000,
        lastContribution: new Date('2024-02-01'),
        isActive: true,
        totalLoans: 15000,
        totalWithdrawals: 0
      },
      {
        user: mockUsers[4],
        joinedAt: new Date('2024-01-20'),
        totalContributions: 40000,
        lastContribution: new Date('2024-02-01'),
        isActive: true,
        totalLoans: 0,
        totalWithdrawals: 8000
      }
    ]
  },
  {
    id: '2',
    name: 'Business Partners Chama',
    description: 'Weekly savings for business expansion and equipment purchase',
    adminId: mockUsers[1].id,
    contributionAmount: 2000,
    contributionFrequency: 'weekly',
    totalBalance: 48000,
    createdAt: new Date('2024-01-01'),
    nextContributionDate: new Date('2024-02-05'),
    isPublic: true,
    maxMembers: 6,
    loanInterestRate: 3,
    allowLoans: true,
    members: [
      {
        user: mockUsers.find(u => u.id === currentUserId)!,
        joinedAt: new Date('2024-01-02'),
        totalContributions: 16000,
        lastContribution: new Date('2024-01-29'),
        isActive: true,
        totalLoans: 0,
        totalWithdrawals: 0
      },
      {
        user: mockUsers[1],
        joinedAt: new Date('2024-01-01'),
        totalContributions: 16000,
        lastContribution: new Date('2024-01-29'),
        isActive: true,
        totalLoans: 5000,
        totalWithdrawals: 0
      },
      {
        user: mockUsers[2],
        joinedAt: new Date('2024-01-03'),
        totalContributions: 16000,
        lastContribution: new Date('2024-01-29'),
        isActive: true,
        totalLoans: 0,
        totalWithdrawals: 2000
      }
    ]
  },
  {
    id: '3',
    name: 'School Fees Chama',
    description: 'Monthly contributions to help members pay school fees for their children',
    adminId: mockUsers[2].id,
    contributionAmount: 10000,
    contributionFrequency: 'monthly',
    totalBalance: 120000,
    createdAt: new Date('2023-12-01'),
    nextContributionDate: new Date('2024-02-01'),
    isPublic: true,
    maxMembers: 8,
    loanInterestRate: 4,
    allowLoans: true,
    members: [
      {
        user: mockUsers.find(u => u.id === currentUserId)!,
        joinedAt: new Date('2023-12-15'),
        totalContributions: 30000,
        lastContribution: new Date('2024-01-01'),
        isActive: true,
        totalLoans: 0,
        totalWithdrawals: 0
      },
      {
        user: mockUsers[2],
        joinedAt: new Date('2023-12-01'),
        totalContributions: 40000,
        lastContribution: new Date('2024-01-01'),
        isActive: true,
        totalLoans: 20000,
        totalWithdrawals: 0
      },
      {
        user: mockUsers[3],
        joinedAt: new Date('2023-12-10'),
        totalContributions: 30000,
        lastContribution: new Date('2024-01-01'),
        isActive: true,
        totalLoans: 0,
        totalWithdrawals: 5000
      },
      {
        user: mockUsers[4],
        joinedAt: new Date('2023-12-20'),
        totalContributions: 20000,
        lastContribution: new Date('2024-01-01'),
        isActive: true,
        totalLoans: 0,
        totalWithdrawals: 0
      }
    ]
  }
]