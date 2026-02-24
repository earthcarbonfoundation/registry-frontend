"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from "firebase/auth";
import { toast } from "react-toastify";
import { auth, googleProvider } from "@/lib/firebaseConfig";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (user) => {
        setUser(user);
        // Set cookie when user is authenticated
        if (user) {
          const sessionData = JSON.stringify({
            uid: user.uid,
            email: user.email,
          });
          document.cookie = `session=${encodeURIComponent(sessionData)}; path=/; max-age=${7 * 24 * 60 * 60}`;
        }
        setLoading(false);
      },
      (error) => {
        // Auth state listener error callback
        console.error("Auth listener error:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      if (error.code === "auth/popup-closed-by-user") {
        console.log("Login popup closed by user");
        return;
      }
      console.error("Login failed:", error);
      toast.error(error.message || "Failed to sign in with Google");
    }
  };

  const logout = async () => {
    try {
      // Clear session cookie
      document.cookie = "session=; path=/; max-age=0";
      await signOut(auth);
    } catch (error: any) {
      console.error("Logout failed:", error);
      toast.error(error.message || "Failed to log out");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
