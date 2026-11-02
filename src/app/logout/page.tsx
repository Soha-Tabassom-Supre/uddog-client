"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogOut, ArrowLeft, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export default function LogoutPage() {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  const handleConfirmLogout = () => {
    setSigningOut(true);
    setTimeout(() => {
      setSigningOut(false);
      toast.success("You have been signed out successfully.");
      router.push("/");
    }, 600);
  };

  return (
    <main className="min-h-[80vh] bg-[var(--background)] py-12 px-4 flex items-center justify-center relative">
      <div className="w-full max-w-md">
        <div className="rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--surface)] p-8 sm:p-10 text-center shadow-2xl backdrop-blur-xl">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-red-500/10 text-red-600 dark:text-red-400 mb-6">
            <ShieldAlert className="h-8 w-8" />
          </div>

          <h1 className="text-2xl font-black text-[var(--text-main)]">
            Sign out of Uddog?
          </h1>

          <p className="mt-2 text-sm text-[var(--text-muted)] leading-relaxed">
            You will need to sign back in with your credentials to organize
            events, manage joined drives, or update your profile.
          </p>

          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={handleConfirmLogout}
              disabled={signingOut}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-red-600 text-sm font-bold text-white shadow-md hover:bg-red-700 active:scale-[0.99] disabled:opacity-60 transition-all"
            >
              <LogOut className="h-4 w-4" />
              {signingOut ? "Signing out..." : "Yes, Sign Out"}
            </button>

            <Link
              href="/"
              className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border-color)] bg-[var(--background)] text-sm font-semibold text-[var(--text-main)] hover:border-[var(--primary)] transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Cancel & Stay Signed In</span>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
