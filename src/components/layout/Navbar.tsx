"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sprout,
  Menu,
  X,
  CalendarPlus,
  FolderKanban,
  CheckCircle2,
  Award,
  User,
  LogOut,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [previewUser, setPreviewUser] = useState<{
    name: string;
    email: string;
    image: string;
  } | null>(null);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/events", label: "Upcoming Events" },
  ];
  const protectedLinks = [
    { href: "/create-event", label: "Create Event", icon: CalendarPlus },
    { href: "/manage-events", label: "Manage Events", icon: FolderKanban },
    { href: "/joined-events", label: "Joined Events", icon: CheckCircle2 },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-[var(--background)]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)] text-white shadow-sm group-hover:bg-[var(--primary-dark)] transition">
            <Sprout className="h-5 w-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-[var(--text-main)]">
                Uddog
              </span>
            </div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition ${pathname === link.href ? "text-[var(--primary)] font-semibold" : "text-[var(--text-muted)] hover:text-[var(--text-main)]"}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() =>
              setPreviewUser(
                previewUser
                  ? null
                  : {
                      name: "Tanvir Hasan",
                      email: "tanvir@uddog.org",
                      image:
                        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                    },
              )
            }
            className="rounded-md border border-dashed border-[var(--accent)] px-2.5 py-1 text-xs font-medium text-[var(--accent)] hover:bg-[var(--accent)]/10 transition"
          >
            {previewUser ? "Toggle Visitor" : "Toggle Logged-In"}
          </button>
          <ThemeToggle />

          {!previewUser ? (
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--text-main)] hover:bg-[var(--surface)] transition"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-[var(--primary)] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-[var(--primary-dark)] transition"
              >
                Join Uddog
              </Link>
            </div>
          ) : (
            <div className="flex items-center gap-2 relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                title={previewUser.name}
                className="flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--surface)] p-1 pr-3 hover:border-[var(--primary)] transition"
              >
                <img
                  src={previewUser.image}
                  alt={previewUser.name}
                  className="h-7 w-7 rounded-full object-cover"
                />
                <span className="text-xs font-medium text-[var(--text-main)]">
                  {previewUser.name}
                </span>
              </button>
              <button
                className="flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-600 hover:bg-red-100 transition"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
              {dropdownOpen && (
                <div className="absolute right-10 top-12 mt-2 w-56 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] p-2 shadow-lg">
                  {protectedLinks.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[var(--text-main)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)] transition"
                      >
                        <Icon className="h-4 w-4" /> {item.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
