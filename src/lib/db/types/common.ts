
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
}
