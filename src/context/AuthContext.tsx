"use client";

import React, { createContext, useContext } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

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
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  const user: User | null = session?.user
    ? {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session.user.image ?? "",
      }
    : null;

  const login = async (
    email: string,
    password: string,
    redirectUrl = "/events",
  ): Promise<boolean> => {
    if (!email.trim() || !password) {
      toast.error("Please provide both email and password.");
      return false;
    }

    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(error.message || "Sign-in failed. Please try again.");
        return false;
      }

      toast.success("Signed in successfully!");
      router.push(redirectUrl);
      router.refresh();
      return true;
    } catch {
      toast.error("Authentication failed. Please try again.");
      return false;
    }
  };

  const register = async (
    name: string,
    email: string,
    photoURL: string,
    password: string,
  ): Promise<boolean> => {
    if (!name.trim() || !email.trim() || !password.trim()) {
      toast.error("Please fill in all required fields.");
      return false;
    }

    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email: email.trim(),
        password,
        image: photoURL.trim() || undefined,
      });

      if (error) {
        toast.error(error.message || "Registration failed.");
        return false;
      }

      toast.success("Account created successfully!");
      router.push("/events");
      router.refresh();
      return true;
    } catch {
      toast.error("Registration failed. Please try again.");
      return false;
    }
  };

  const loginWithGoogle = async (redirectUrl = "/events"): Promise<void> => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectUrl,
      });
    } catch {
      toast.error("Unable to start Google sign-in.");
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authClient.signOut();

      toast.success("Signed out successfully.");
      router.push("/");
      router.refresh();
    } catch {
      toast.error("Unable to sign out. Please try again.");
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: isPending,
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
