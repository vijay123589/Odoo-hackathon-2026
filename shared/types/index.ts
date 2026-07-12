export type Role = 'ADMIN' | 'MANAGER' | 'EMPLOYEE' | 'AUDITOR';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
  employee?: Employee;
  notifications?: Notification[];
}

export interface Department {
  id: string;
  name: string;
  code: string;
  createdAt: Date;
  updatedAt: Date;
  employees?: Employee[];
  carbonTransactions?: CarbonTransaction[];
  departmentScores?: DepartmentScore[];
}

export interface Employee {
  id: string;
  userId?: string;
  user?: User;
  departmentId: string;
  department?: Department;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
  participations?: EmployeeParticipation[];
  challenges?: ChallengeParticipation[];
  rewards?: Reward[];
}

export interface CarbonTransaction {
  id: string;
  departmentId: string;
  department?: Department;
  activityType: string;
  value: number;
  unit: string;
  co2Amount: number;
  transactionDate: Date;
  recordedById: string;
  recordedBy?: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmissionFactor {
  id: string;
  activityType: string;
  factor: number;
  unit: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CSRActivity {
  id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  status: 'PLANNED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  createdAt: Date;
  updatedAt: Date;
  participations?: EmployeeParticipation[];
}

export interface EmployeeParticipation {
  id: string;
  employeeId: string;
  employee?: Employee;
  activityId: string;
  activity?: CSRActivity;
  hoursVolunteered: number;
  role?: string;
  createdAt: Date;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  points: number;
  status: 'UPCOMING' | 'ACTIVE' | 'COMPLETED';
  createdAt: Date;
  updatedAt: Date;
  participations?: ChallengeParticipation[];
}

export interface ChallengeParticipation {
  id: string;
  employeeId: string;
  employee?: Employee;
  challengeId: string;
  challenge?: Challenge;
  status: 'JOINED' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  criteria: string;
  createdAt: Date;
  updatedAt: Date;
  rewards?: Reward[];
}

export interface Reward {
  id: string;
  employeeId: string;
  employee?: Employee;
  badgeId?: string;
  badge?: Badge;
  pointsEarned: number;
  reason: string;
  createdAt: Date;
}

export interface Policy {
  id: string;
  title: string;
  content: string;
  category: 'ENVIRONMENTAL' | 'SOCIAL' | 'GOVERNANCE';
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  version: string;
  createdAt: Date;
  updatedAt: Date;
  audits?: Audit[];
}

export interface Audit {
  id: string;
  policyId: string;
  policy?: Policy;
  auditorId: string;
  auditor?: User;
  auditDate: Date;
  findings: string;
  status: 'PASSED' | 'FAILED' | 'PENDING';
  createdAt: Date;
  updatedAt: Date;
  complianceIssues?: ComplianceIssue[];
}

export interface ComplianceIssue {
  id: string;
  auditId?: string;
  audit?: Audit;
  title: string;
  description: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  status: 'OPEN' | 'RESOLVING' | 'RESOLVED';
  createdAt: Date;
  updatedAt: Date;
}

export interface DepartmentScore {
  id: string;
  departmentId: string;
  department?: Department;
  scorePeriod: string;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  totalScore: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  user?: User;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
}
