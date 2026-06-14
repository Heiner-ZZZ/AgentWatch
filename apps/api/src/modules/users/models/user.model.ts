export type UserModel = {
  id: string;
  email: string;
  fullName: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
};
