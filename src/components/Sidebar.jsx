"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function Sidebar() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();

  // Navigation items for all users
  const navItems = [
    { name: "Profile", path: "/profile", icon: "👤" },
    { name: "My Events", path: "/my-events", icon: "📅" },
    { name: "My Tickets", path: "/my-tickets", icon: "🎟️" },
    { name: "Settings", path: "/settings", icon: "⚙️" },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <div className="bg-white shadow-md w-64 h-full flex flex-col">
      {user && (
        <div className="p-4 border-b">
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white text-lg font-bold">
              {user.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="ml-3">
              <p className="font-medium">{user.email}</p>
              <p className="text-sm text-gray-500">Member</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-grow py-4 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  pathname === item.path
                    ? "bg-blue-50 text-blue-600 font-medium"
                    : "hover:bg-gray-100 text-gray-700"
                }`}
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t mt-auto">
        {user ? (
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-3 rounded-md text-red-500 hover:bg-red-50 transition-colors"
          >
            <span className="mr-3 text-xl">🚪</span>
            <span className="font-medium">Logout</span>
          </button>
        ) : (
          <Link
            href="/login"
            className="flex items-center w-full px-4 py-3 rounded-md text-blue-600 hover:bg-blue-50 transition-colors"
          >
            <span className="mr-3 text-xl">🔑</span>
            <span className="font-medium">Login</span>
          </Link>
        )}
      </div>
    </div>
  );
}
