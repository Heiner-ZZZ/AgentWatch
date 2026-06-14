export type OrganizationRole =
  | 'owner'
  | 'admin'
  | 'operator'
  | 'auditor'
  | 'viewer'
  | 'integrator';

export type OrganizationModel = {
  id: string;
  name: string;
  countryCode: string;
  timezone: string;
  plan: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
};
