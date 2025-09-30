import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { apiFetch } from '@/api/client';

interface User {
  id: string;
  role: string;
  fullName: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (input: { firstName: string; lastName: string; email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  reloadUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiFetch('/api/user');
      const userData = await response.json();
      setUser({
        id: userData.id,
        role: userData.role,
        fullName: userData.fullName ?? [userData.firstName, userData.lastName].filter(Boolean).join(' '),
        email: userData.email,
      });
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  async function login(credentials: { email: string; password: string }) {
    await apiFetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    await loadUser();
  }

  async function signup(input: { firstName: string; lastName: string; email: string; password: string }) {
    await apiFetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        password: input.password,
        role: 'client',
      }),
    });

    await loadUser();
  }

  async function logout() {
    try {
      await apiFetch('/api/logout', {
        method: 'POST',
      });
    } finally {
      setUser(null);
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, reloadUser: loadUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
