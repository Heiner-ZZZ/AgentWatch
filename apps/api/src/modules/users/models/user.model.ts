export type UserModel = {
  id: string;
  organizationId: string;
  organizationName: string;
  email: string;
  fullName: string;
  role: 'owner' | 'admin' | 'operator' | 'auditor' | 'viewer' | 'integrator';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
};
