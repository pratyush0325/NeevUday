"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth.store";
import { Avatar, cn } from "@/components/ui";
import { UserRole } from "@setu/shared";

const navItems: Record<UserRole, { label: string; href: string; icon: string }[]> = {
  donor: [
    { label: "Overview",   href: "/dashboard/donor",          icon: "◈" },
    { label: "My Donations", href: "/dashboard/donor/donations", icon: "📦" },
    { label: "Impact",     href: "/dashboard/donor/impact",    icon: "🌱" },
  ],
  platform: [
    { label: "Overview",    href: "/dashboard/platform",           icon: "◈" },
    { label: "NGO Approvals", href: "/dashboard/platform/ngos",    icon: "🤝" },
    { label: "Matching",    href: "/dashboard/platform/matching",  icon: "⚡" },
    { label: "Workers",     href: "/dashboard/platform/workers",   icon: "👤" },
  ],
  ngo: [
    { label: "Overview",   href: "/dashboard/ngo",             icon: "◈" },
    { label: "Supplies",   href: "/dashboard/ngo/supplies",    icon: "📦" },
    { label: "Workers",    href: "/dashboard/ngo/workers",     icon: "👤" },
    { label: "Projects",   href: "/dashboard/ngo/projects",    icon: "📋" },
  ],
  worker: [
    { label: "Overview",    href: "/dashboard/worker",            icon: "◈" },
    { label: "Assignment",  href: "/dashboard/worker/assignment", icon: "📋" },
    { label: "Find Work",   href: "/dashboard/worker/find",       icon: "🔍" },
    { label: "Profile",     href: "/dashboard/worker/profile",    icon: "👤" },
  ],
  village: [
    { label: "Overview",    href: "/dashboard/village",            icon: "◈" },
    { label: "New Request", href: "/dashboard/village/request",   icon: "➕" },
    { label: "My Requests", href: "/dashboard/village/requests",  icon: "📋" },
    { label: "Aid Status",  href: "/dashboard/village/status",    icon: "📍" },
  ],
};

const roleAccents: Record<UserRole, string> = {
  donor:    "text-amber-600",
  platform: "text-forest-600",
  ngo:      "text-teal-600",
  worker:   "text-ocean-600",
  village:  "text-coral-600",
};

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, clearAuth } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();

  if (!user) return null;

  const items = navItems[user.role] ?? [];
  const accent = roleAccents[user.role];

  const handleLogout = () => {
    clearAuth();
    router.push("/auth/login");
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-100 flex flex-col py-6 px-4 fixed h-full">
        {/* Logo */}
        <Link href="/" className="font-serif text-xl font-medium mb-8 px-2 block">
          Se<span className="text-forest-600">tu</span>
        </Link>

        {/* User info */}
        <div className="flex items-center gap-3 mb-6 px-2">
          <Avatar initials={user.avatarInitials} role={user.role} size="sm" />
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className={cn("text-xs capitalize", accent)}>{user.role}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-0.5">
          {items.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm transition-colors",
                  active
                    ? "bg-gray-100 text-gray-900 font-medium"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <span className="text-base w-5 text-center">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-2 py-2 text-sm text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-50 transition-colors mt-4"
        >
          <span>↩</span> Log out
        </button>
      </aside>

      {/* Main */}
      <main className="ml-56 flex-1 p-8 max-w-5xl">{children}</main>
    </div>
  );
}
