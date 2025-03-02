
import { createContext, useContext, ReactNode } from "react";

// Simplified context without authentication
interface AuthContextType {
  user: null; // Always null since we don't have authentication
  loading: false; // Never loading
  signIn: () => Promise<void>; // Empty functions
  signUp: () => Promise<void>; // Empty functions
  signOut: () => Promise<void>; // Empty functions
}

// Create context with default values
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  // Simple no-op implementation
  const signIn = async () => {};
  const signUp = async () => {};
  const signOut = async () => {};

  return (
    <AuthContext.Provider 
      value={{ 
        user: null, 
        loading: false, 
        signIn, 
        signUp, 
        signOut 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// A component that always renders its children without authentication checks
export function RequireAuth({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
