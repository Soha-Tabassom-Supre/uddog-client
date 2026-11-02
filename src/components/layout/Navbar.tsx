"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Sprout,
  Menu,
  X,
  Calendar,
  CalendarPlus,
  FolderKanban,
  CheckCircle2,
  Award,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { ThemeToggle } from "./ThemeToggle";
import { authClient } from "@/lib/auth-client";
import { Suspense } from "react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

 
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);


  useEffect(() => {
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out successfully. See you next drive!");
            setDropdownOpen(false);
            setMobileMenuOpen(false);
            router.push("/");
            router.refresh();
          },
          onError: () => {
            toast.error("Failed to sign out. Please try again.");
          },
        },
      });
    } catch {
      toast.error("Unable to sign out.");
    }
  };

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Upcoming Events", icon: Calendar },
  ];

  const protectedLinks = [
    {
      href: "/create-event",
      label: "Create Event",
      description: "Start a community drive",
      icon: CalendarPlus,
      badge: "Action",
    },
    {
      href: "/manage-events",
      label: "Manage Events",
      description: "Edit or monitor your initiatives",
      icon: FolderKanban,
    },
    {
      href: "/joined-events",
      label: "Joined Events",
      description: "Track your registered drives",
      icon: CheckCircle2,
    },
    {
      href: "/impact-passport",
      label: "Impact Passport",
      description: "Your verified civic journey",
      icon: Award,
    },
  ];

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-[var(--background)]/85 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
      
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-white shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:bg-[var(--primary-dark)]">
            <Sprout className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-black tracking-tight text-[var(--text-main)]">
                Uddog
              </span>
              <span className="rounded bg-[var(--primary)]/10 px-1.5 py-0.5 text-[10px] font-bold text-[var(--primary)]">
                উদ্যোগ
              </span>
            </div>
            <span className="hidden text-[11px] font-medium text-[var(--text-muted)] sm:inline">
              Small actions. Shared impact.
            </span>
          </div>
        </Link>

      
        <nav className="hidden md:flex items-center gap-1 rounded-full border border-[var(--border-color)] bg-[var(--surface)]/70 p-1 shadow-2xs">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                  isActive
                    ? "bg-[var(--primary)] text-white shadow-xs"
                    : "text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--background)]"
                }`}
              >
                {link.icon && <link.icon className="h-3.5 w-3.5" />}
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>


        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {isPending ? (

            <div className="flex items-center gap-2">
              <div className="h-9 w-20 animate-pulse rounded-xl bg-[var(--border-color)]/50" />
              <div className="h-9 w-9 animate-pulse rounded-full bg-[var(--border-color)]/50" />
            </div>
          ) : !user ? (
        
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl px-4 py-2 text-xs font-bold text-[var(--text-main)] hover:bg-[var(--surface)] transition"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-[var(--primary)] px-4 py-2 text-xs font-bold text-white shadow-sm hover:bg-[var(--primary-dark)] active:scale-95 transition"
              >
                Join Uddog
              </Link>
            </div>
          ) : (
      
            <div className="flex items-center gap-2.5">
            
              <div className="relative" ref={dropdownRef}>
                <div className="group relative">
                  <button
                    type="button"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    title={user.name || "Organizer Profile"}
                    aria-label="User navigation menu"
                    className="flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--surface)] p-1 pr-2.5 shadow-2xs hover:border-[var(--primary)] transition"
                  >
                    {user.image ? (
                      <img
                        src={user.image}
                        alt={user.name || "User"}
                        className="h-7 w-7 rounded-full object-cover ring-1 ring-[var(--primary)]/30"
                      />
                    ) : (
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-white">
                        {userInitial}
                      </div>
                    )}
                    <span className="max-w-[100px] truncate text-xs font-semibold text-[var(--text-main)]">
                      {user.name ? user.name.split(" ")[0] : "Citizen"}
                    </span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 text-[var(--text-muted)] transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180 text-[var(--primary)]" : ""
                      }`}
                    />
                  </button>

                
                  {!dropdownOpen && (
                    <div className="pointer-events-none absolute -bottom-11 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
                      <div className="whitespace-nowrap rounded-lg bg-[var(--text-main)] px-2.5 py-1 text-[11px] font-medium text-[var(--background)] shadow-xl">
                        {user.name || "Active Citizen"}
                        <span className="block text-[9px] opacity-75">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

            
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-68 origin-top-right rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150 z-50">

                    <div className="border-b border-[var(--border-color)] p-3 mb-1 flex items-center gap-3">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt={user.name || "Avatar"}
                          className="h-10 w-10 rounded-full object-cover ring-2 ring-[var(--primary)]"
                        />
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-white">
                          {userInitial}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-bold text-[var(--text-main)]">
                          {user.name}
                        </p>
                        <p className="truncate text-[11px] text-[var(--text-muted)]">
                          {user.email}
                        </p>
                        <span className="mt-1 inline-block rounded bg-[var(--primary)]/10 px-1.5 py-0.2 text-[9px] font-bold uppercase tracking-wider text-[var(--primary)]">
                          Organizer Verified
                        </span>
                      </div>
                    </div>


                    <div className="space-y-0.5">
                      {protectedLinks.map((item) => {
                        const Icon = item.icon;
                        const isLinkActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setDropdownOpen(false)}
                            className={`flex items-start justify-between rounded-xl px-3 py-2 transition ${
                              isLinkActive
                                ? "bg-[var(--primary)]/10 text-[var(--primary)] font-bold"
                                : "text-[var(--text-main)] hover:bg-[var(--background)]"
                            }`}
                          >
                            <div className="flex items-start gap-2.5 min-w-0">
                              <Icon className="h-4 w-4 shrink-0 mt-0.5 text-[var(--primary)]" />
                              <div className="flex flex-col">
                                <span className="text-xs font-semibold leading-tight">
                                  {item.label}
                                </span>
                                <span className="text-[10px] text-[var(--text-muted)]">
                                  {item.description}
                                </span>
                              </div>
                            </div>
                            {item.badge && (
                              <span className="rounded bg-[var(--accent)]/15 px-1.5 py-0.5 text-[9px] font-black uppercase text-[var(--accent)]">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>


                    <div className="border-t border-[var(--border-color)] pt-1 mt-1">
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition text-left"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

             
              <button
                type="button"
                onClick={handleLogout}
                title="Logout from your account"
                className="flex h-9 items-center gap-1.5 rounded-xl border border-red-200 dark:border-red-950/60 bg-red-50 dark:bg-red-950/20 px-3 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/40 transition active:scale-95"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden lg:inline">Logout</span>
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation drawer"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-main)]"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

  
      {mobileMenuOpen && (
        <div className="border-t border-[var(--border-color)] bg-[var(--surface)] px-4 py-4 md:hidden animate-in slide-in-from-top-2 duration-150">
          {user && (
            <div className="flex items-center gap-3 rounded-xl bg-[var(--background)] p-3 mb-3 border border-[var(--border-color)]">
              {user.image ? (
                <img
                  src={user.image}
                  alt={user.name || "User"}
                  className="h-9 w-9 rounded-full object-cover ring-1 ring-[var(--primary)]"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-white">
                  {userInitial}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-[var(--text-main)] truncate">
                  {user.name}
                </p>
                <p className="text-[11px] text-[var(--text-muted)] truncate">
                  {user.email}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${
                  pathname === link.href
                    ? "bg-[var(--primary)] text-white"
                    : "text-[var(--text-main)] hover:bg-[var(--background)]"
                }`}
              >
                {link.icon && <link.icon className="h-4 w-4" />}
                <span>{link.label}</span>
              </Link>
            ))}

            {user && (
              <>
                <div className="my-2 border-t border-[var(--border-color)]" />
                <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Organizer Dashboard
                </p>
                {protectedLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-[var(--text-main)] hover:bg-[var(--background)]"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="h-4 w-4 text-[var(--primary)]" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="rounded bg-[var(--accent)]/15 px-1.5 py-0.5 text-[9px] font-black uppercase text-[var(--accent)]">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--border-color)]">
            {!user ? (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className="flex-1 rounded-xl border border-[var(--border-color)] py-2 text-center text-xs font-bold text-[var(--text-main)]"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="flex-1 rounded-xl bg-[var(--primary)] py-2 text-center text-xs font-bold text-white shadow-xs"
                >
                  Join Uddog
                </Link>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
