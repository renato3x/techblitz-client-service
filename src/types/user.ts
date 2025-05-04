export type Role = 'USER';

export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  avatar_url?: string;
  avatar_fallback: string;
  role: Role;
  total_followers: number,
  total_following: number,
  created_at: Date;
  updated_at: Date;
}
