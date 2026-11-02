"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
export default function LoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  if (!formData.email.trim() || !formData.password) {
    toast.error("Please provide both email and password.");
    return;
  }

  setLoading(true);

  try {
    const { error } = await authClient.signIn.email({
      email: formData.email.trim(),
      password: formData.password,
    });

    if (error) {
      toast.error(error.message || "Sign-in failed. Please try again.");
      return;
    }

    toast.success("Signed in successfully! Welcome back.");
    router.push("/events");
    router.refresh();
  } catch {
    toast.error("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};


const handleGoogleLogin = async () => {
  try {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/events",
    });
  } catch {
    toast.error("Unable to start Google sign-in.");
  }
};

  return (
    <main className="min-h-screen bg-[var(--background)] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
     
      <div className="absolute top-10 right-1/4 -z-10 h-80 w-80 rounded-full bg-[var(--primary)]/10 blur-[100px]" />
      <div className="absolute bottom-10 left-1/4 -z-10 h-80 w-80 rounded-full bg-[var(--accent)]/15 blur-[100px]" />

      <div className="w-full max-w-lg">
        <div className="rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--surface)] p-8 sm:p-12 shadow-2xl backdrop-blur-xl">
        
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-[var(--primary)]/20 bg-[var(--primary)]/5 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-[var(--primary)]">
              <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
              <span>Welcome Back</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[var(--text-main)]">
              Log in to <span className="text-[var(--primary)]">Uddog</span>
            </h1>
            <p className="text-sm text-[var(--text-muted)] max-w-xs mx-auto">
              Continue organizing your drives and tracking your community
              impact.
            </p>
          </div>

         
          <div className="mt-8">
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="flex w-full items-center justify-center gap-3 rounded-2xl border border-[var(--border-color)] bg-[var(--background)] px-4 py-3.5 text-sm font-bold text-[var(--text-main)] shadow-xs hover:border-[var(--primary)] transition-all active:scale-[0.99]"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              Continue with Google
            </button>
          </div>

        
          <div className="relative my-7 flex items-center justify-center">
            <div className="w-full border-t border-[var(--border-color)]" />
            <span className="absolute bg-[var(--surface)] px-3 text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              Or email credentials
            </span>
          </div>

         
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="h-12 w-full rounded-2xl border border-[var(--border-color)] bg-[var(--background)] pl-11 pr-4 text-sm font-semibold text-[var(--text-main)] placeholder:text-[var(--text-muted)]/60 focus:border-[var(--primary)] focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="h-12 w-full rounded-2xl border border-[var(--border-color)] bg-[var(--background)] pl-11 pr-11 text-sm font-semibold text-[var(--text-main)] placeholder:text-[var(--text-muted)]/60 focus:border-[var(--primary)] focus:outline-none transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-main)]"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--primary)] text-sm font-bold text-white shadow-xl transition-all hover:bg-[var(--primary-dark)] active:scale-[0.99] disabled:opacity-60"
            >
              {loading ? (
                "Signing in..."
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

         
          <div className="mt-8 text-center text-xs font-medium text-[var(--text-muted)]">
            Don't have an account yet?
            <Link
              href="/register"
              className="font-bold text-[var(--primary)] hover:underline"
            >
              Register here
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
