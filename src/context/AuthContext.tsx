"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    email: string,
    password: string,
    redirectUrl?: string,
  ) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    photoURL: string,
    password: string,
  ) => Promise<boolean>;
  loginWithGoogle: (redirectUrl?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "uddog_session_user";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();


  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (
    email: string,
    password: string,
    redirectUrl = "/events",
  ): Promise<boolean> => {
    setLoading(true);
    try {
      
      if (!email.trim() || !password.trim()) {
        toast.error("Please provide both email and password.");
        return false;
      }


      const sessionUser: User = {
        id: "usr-" + Math.random().toString(36).substring(2, 9),
        name: email
          .split("@")[0]
          .replace(/[._]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        email: email.trim().toLowerCase(),
        image:
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        role: "Community Member",
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(sessionUser));
      setUser(sessionUser);
      toast.success(`Welcome back, ${sessionUser.name}!`);
      router.push(redirectUrl);
      return true;
    } catch {
      toast.error("Authentication failed. Please check your credentials.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    photoURL: string,
    password: string,
  ): Promise<boolean> => {
    setLoading(true);
    try {
      if (!name || !email || !photoURL || !password) {
        toast.error("Please fill in all required registration fields.");
        return false;
      }

      const newUser: User = {
        id: "usr-" + Math.random().toString(36).substring(2, 9),
        name: name.trim(),
        email: email.trim().toLowerCase(),
        image: photoURL.trim(),
        role: "Community Volunteer",
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser));
      setUser(newUser);
      toast.success("Account created successfully! Welcome to Uddog.");
      router.push("/events");
      return true;
    } catch {
      toast.error("Registration failed. Please try again.");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async (redirectUrl = "/events"): Promise<void> => {
    setLoading(true);
    toast.loading("Redirecting to Google OAuth...", { duration: 1000 });

    setTimeout(() => {
      const googleUser: User = {
        id: "usr-google-" + Math.random().toString(36).substring(2, 7),
        name: "Tanvir Hasan",
        email: "tanvir.hasan@gmail.com",
        image:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
        role: "Community Organizer",
      };

      localStorage.setItem(STORAGE_KEY, JSON.stringify(googleUser));
      setUser(googleUser);
      setLoading(false);
      toast.success("Signed in with Google successfully!");
      router.push(redirectUrl);
    }, 1000);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
    toast.info("You have signed out of your account.");
    router.push("/");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
