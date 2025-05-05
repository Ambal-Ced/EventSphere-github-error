"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { User as AuthUser } from "@supabase/supabase-js"; // Supabase User type
import { cn } from "@/lib/utils";
import {
  Bell,
  MessageSquare,
  Settings,
  User as UserIcon,
  LogOut,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user ?? null);

      if (session?.user) {
        // Fetch profile data including avatar_url
        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();

        setProfile(profileData);
      }
      setIsLoading(false);
    };

    getSession();

    // Set up real-time subscription for profile changes
    const profileSubscription = supabase
      .channel("header-profile-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "profiles",
          filter: `id=eq.${user?.id}`,
        },
        (payload) => {
          console.log("Profile updated in header:", payload);
          setProfile(payload.new);
        }
      )
      .subscribe();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          // Fetch profile data on auth state change
          const { data: profileData } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", session.user.id)
            .single();

          setProfile(profileData);
        } else {
          setProfile(null);
        }
        // Redirect to login if user logs out from another tab
        if (event === "SIGNED_OUT") {
          router.push("/login");
        }
      }
    );

    return () => {
      profileSubscription.unsubscribe();
      authListener?.subscription.unsubscribe();
    };
  }, [router, user?.id]);

  // Function to get initials from first name
  const getInitials = (fname?: string | null) => {
    if (!fname) return "?";
    return fname.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
      {/* Logo and Main Navigation */}
      <div className="flex-shrink-0">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          {/* <Package2 className="h-6 w-6" /> Replace with your logo */}
          <span className="text-lg">EventSphere</span>
        </Link>
      </div>

      {/* Center Navigation */}
      <nav className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex items-center gap-8">
          <Link
            href="/"
            className={cn(
              "text-lg font-medium transition-colors hover:text-primary",
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Home
          </Link>
          <Link
            href="/events"
            className={cn(
              "text-lg font-medium transition-colors hover:text-primary",
              pathname === "/events" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Events
          </Link>
          <Link
            href="/about"
            className={cn(
              "text-lg font-medium transition-colors hover:text-primary",
              pathname === "/about" ? "text-primary" : "text-muted-foreground"
            )}
          >
            About
          </Link>
          <Link
            href="/faqs"
            className={cn(
              "text-lg font-medium transition-colors hover:text-primary",
              pathname === "/faqs" ? "text-primary" : "text-muted-foreground"
            )}
          >
            FAQs
          </Link>
        </div>
      </nav>

      {/* Right side: Icons and User Menu/Login */}
      <div className="flex items-center gap-4">
        {isLoading ? (
          <div className="h-8 w-8 animate-pulse rounded-full bg-muted"></div>
        ) : user ? (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full"
            >
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
              {/* Optional: Add notification badge */}
              <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                2
              </span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="relative rounded-full"
            >
              <MessageSquare className="h-5 w-5" />
              <span className="sr-only">Messages</span>
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={profile?.avatar_url}
                      className="object-cover"
                    />
                    <AvatarFallback>
                      {getInitials(profile?.fname)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {profile?.fname} {profile?.lname}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="flex items-center gap-2">
                    <UserIcon className="h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await supabase.auth.signOut();
                    router.push("/login");
                  }}
                  className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Button asChild size="sm">
              <Link href="/login">Log In</Link>
            </Button>
            <Button asChild variant="outline" size="sm">
              <Link href="/register">Sign Up</Link>
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
