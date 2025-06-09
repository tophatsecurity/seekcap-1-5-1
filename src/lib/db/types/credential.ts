
export interface CredentialSet {
  id?: number;
  name: string;
  user_name: string;
  password: string;
  enable_required?: boolean;
  enable_password?: string | null;
  created_at?: string;
  updated_at?: string;
}
