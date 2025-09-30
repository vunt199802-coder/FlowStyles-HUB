import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
  login: (formData: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      const response = await apiFetch('/api/user');
      if (response.ok) {
        const userData = await response.json();
        setUser({
          id: userData.id,
          role: userData.role,
          fullName: userData.fullName,
          email: userData.email,
        });
      }
    } catch (error) {
      console.error('Failed to load user:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function login(formData: { username: string; password: string }) {
    const response = await apiFetch('/api/login', {
      method: 'POST',
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    await loadUser();
  }

  async function logout() {
    await apiFetch('/api/logout', {
      method: 'POST',
    });
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
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
