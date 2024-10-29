export interface Community {
  id: string;
  name: string;
  platform: 'facebook' | 'reddit';
  url: string;
  city: string;
  state: string;
  rating: number;
  memberCount: number;
  postsPerDay: number;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}