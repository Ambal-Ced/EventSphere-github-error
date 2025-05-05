"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { cn } from "@/lib/utils";
import {
  User as UserIcon,
  CalendarCheck2,
  Ticket,
  Settings,
  LogOut,
  MessageSquare,
} from "lucide-react";
import { User } from "@supabase/supabase-js"; // Supabase User type
import { Button } from "@/components/ui/button"; // Import Button

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const sidebarLinksConfig = [
  {
    title: "Profile",
    href: "/profile",
    icon: UserIcon,
    authRequired: true,
  },
  {
    title: "My Events",
    href: "/my-events",
    icon: CalendarCheck2,
    authRequired: true,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
    authRequired: true,
  },
  {
    title: "Feedback",
    href: "/feedback",
    icon: MessageSquare,
    authRequired: false,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setIsLoading(false);
    };

    getSession();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Cleanup listener on unmount
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error);
    } else {
      setUser(null); // Clear user state immediately
      router.push("/login"); // Redirect to login page
    }
  };

  // Don't render sidebar content until auth state is known
  // or show a loading state if preferred
  if (isLoading) {
    return (
      <div className="sticky top-16 h-[calc(100vh-4rem)] w-64 border-r bg-background p-4">
        {/* Optional: Add a loading skeleton here */}
      </div>
    );
  }

  return (
    <div className="sticky top-16 h-[calc(100vh-4rem)] w-64 border-r bg-background">
      <div className="flex h-full flex-col">
        <nav className="flex-1 space-y-2 p-4">
          {sidebarLinksConfig.map((link) => {
            const isDisabled = link.authRequired && !user;
            const href = isDisabled ? "/login" : link.href;
            const Icon = link.icon;

            return (
              <Link
                key={link.href}
                href={href}
                onClick={(e) => {
                  if (isDisabled) {
                    e.preventDefault(); // Prevent navigation for disabled links if needed
                    router.push("/login"); // Ensure redirection happens
                  }
                }}
                className={cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  pathname === link.href && !isDisabled // Active state only if enabled
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                  isDisabled && "cursor-not-allowed opacity-50"
                )}
                aria-disabled={isDisabled}
              >
                <Icon className="h-5 w-5" />
                <span>{link.title}</span>
              </Link>
            );
          })}
        </nav>

        {user && (
          <div className="mt-auto border-t p-4">
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="w-full justify-start gap-2 px-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="h-5 w-5" />
              <span>Log Out</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
