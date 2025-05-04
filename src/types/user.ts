export type Role = 'USER';

export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  avatar_url?: string;
  role: Role;
  created_at: string;
  updated_at: string;
}
