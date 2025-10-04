import { create } from 'zustand';

// 1. Manually define the User type for our frontend.
// This defines the shape of the user data we expect from our API.
// Notice we intentionally omit the 'password' field.
export type User = {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  createdAt: string;
  updatedAt: string;
};

// 2. Define the shape of our store's state and actions
interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
  logout: () => set({ user: null, token: null }),
}));