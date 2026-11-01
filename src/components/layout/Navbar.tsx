"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sprout,
  Menu,
  X,
  Calendar,
  CalendarPlus,
  FolderKanban,
  CheckCircle2,
  LogOut,
  ChevronDown,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { useAuth } from "@/context/AuthContext";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
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

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Upcoming Events", icon: Calendar },
  ];

  const protectedLinks = [
    {
      href: "/create-event",
      label: "Create Event",
      description: "Organize a local initiative",
      icon: CalendarPlus,
    },
    {
      href: "/manage-events",
      label: "Manage Events",
      description: "Edit or delete your created events",
      icon: FolderKanban,
    },
    {
      href: "/joined-events",
      label: "Joined Events",
      description: "View drives you joined",
      icon: CheckCircle2,
    },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-[var(--background)]/85 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
       
        <Link href="/" className="group flex items-center gap-2.5">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-white shadow-sm transition-transform duration-300 group-hover:scale-105 group-hover:bg-[var(--primary-dark)]">
            <Sprout className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" />
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

          {!user ? (
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
                    title={user.name}
                    aria-label="User navigation menu"
                    className="flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--surface)] p-1 pr-2.5 shadow-2xs hover:border-[var(--primary)] transition"
                  >
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-7 w-7 rounded-full object-cover ring-1 ring-[var(--primary)]/30"
                    />
                    <span className="max-w-[90px] truncate text-xs font-semibold text-[var(--text-main)]">
                      {user.name.split(" ")[0]}
                    </span>
                    <ChevronDown
                      className={`h-3.5 w-3.5 text-[var(--text-muted)] transition-transform duration-200 ${
                        dropdownOpen ? "rotate-180 text-[var(--primary)]" : ""
                      }`}
                    />
                  </button>

                  {!dropdownOpen && (
                    <div className="pointer-events-none absolute -bottom-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-150 z-50">
                      <div className="whitespace-nowrap rounded-md bg-[var(--text-main)] px-2.5 py-1 text-[11px] font-medium text-[var(--background)] shadow-lg">
                        {user.name}
                      </div>
                    </div>
                  )}
                </div>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2.5 w-64 origin-top-right rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] p-1.5 shadow-xl animate-in fade-in zoom-in-95 duration-150">
                    <div className="border-b border-[var(--border-color)] px-3 py-2 mb-1">
                      <p className="text-xs font-bold text-[var(--text-main)] truncate">
                        {user.name}
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)] truncate">
                        {user.email}
                      </p>
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
                            className={`flex items-start gap-2.5 rounded-xl px-3 py-2 transition ${
                              isLinkActive
                                ? "bg-[var(--primary)]/10 text-[var(--primary)] font-bold"
                                : "text-[var(--text-main)] hover:bg-[var(--background)]"
                            }`}
                          >
                            <Icon className="h-4 w-4 shrink-0 mt-0.5 text-[var(--primary)]" />
                            <div className="flex flex-col">
                              <span className="text-xs font-semibold leading-tight">
                                {item.label}
                              </span>
                              <span className="text-[10px] text-[var(--text-muted)]">
                                {item.description}
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={logout}
                title="Logout"
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
              <img
                src={user.image}
                alt={user.name}
                className="h-9 w-9 rounded-full object-cover ring-1 ring-[var(--primary)]"
              />
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
                  Manage Account
                </p>
                {protectedLinks.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-2.5 rounded-xl px-3 py-2 text-xs font-semibold text-[var(--text-main)] hover:bg-[var(--background)]"
                    >
                      <Icon className="h-4 w-4 text-[var(--primary)]" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </>
            )}
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--border-color)] flex gap-2">
            {!user ? (
              <>
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
              </>
            ) : (
              <button
                type="button"
                onClick={logout}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 py-2 text-xs font-bold text-white"
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
