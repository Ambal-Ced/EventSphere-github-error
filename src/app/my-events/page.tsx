"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { CalendarDays, MapPin, Users, PlusCircle, Frown } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Interface matching the events table structure (adjust if needed)
interface Event {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  date: string | null; // Supabase returns timestampz as string
  location: string | null;
  category: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  // Add attendees if you have a way to calculate/store this, otherwise remove
  // attendees: number;
}

export default function MyEventsPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMyEvents = async () => {
      setIsLoading(true);
      setError(null);

      // 1. Get User Session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();
      if (sessionError || !session) {
        console.error("Not authenticated:", sessionError);
        router.push("/login");
        return;
      }
      setUser(session.user);

      // 2. Fetch Events created by this user
      try {
        const { data, error: eventsError } = await supabase
          .from("events")
          .select("*")
          .eq("user_id", session.user.id)
          .order("date", { ascending: false }); // Show newer events first

        if (eventsError) throw eventsError;

        setEvents(data || []);
      } catch (err: any) {
        console.error("Error fetching events:", err);
        setError(err.message || "Failed to load your events.");
        setEvents([]);
      }

      setIsLoading(false);
    };

    fetchMyEvents();
  }, [router]);

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Created Events</h1>
        <Button asChild>
          <Link href="/create-event">
            {" "}
            {/* Ensure this route exists */}
            <PlusCircle className="mr-2 h-4 w-4" />
            Create New Event
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center">Loading your events...</div>
      ) : error ? (
        <div className="text-center text-red-600">Error: {error}</div>
      ) : events.length === 0 ? (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed bg-muted/50 p-8 text-center">
          <Frown className="mb-4 h-16 w-16 text-muted-foreground" />
          <h3 className="mb-2 text-xl font-semibold">No events yet</h3>
          <p className="mb-4 text-muted-foreground">
            You haven't created any events. Get started!
          </p>
          <Button asChild>
            <Link href="/create-event">Create Your First Event</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <div
              key={event.id}
              className="group relative overflow-hidden rounded-lg border bg-card p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              {event.image_url && (
                <div className="absolute inset-0 z-0 opacity-10 transition-opacity group-hover:opacity-20">
                  <img
                    src={event.image_url}
                    alt={event.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <div className="relative z-10 flex h-full flex-col">
                <h3 className="mb-2 text-xl font-semibold group-hover:text-primary">
                  {event.title}
                </h3>
                <p className="mb-4 line-clamp-3 flex-grow text-sm text-muted-foreground">
                  {event.description || "No description provided."}
                </p>
                <div className="mt-auto space-y-2 border-t pt-4">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CalendarDays className="mr-2 h-4 w-4 flex-shrink-0" />
                    {event.date
                      ? format(new Date(event.date), "PPP p")
                      : "Date TBD"}
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-2 h-4 w-4 flex-shrink-0" />
                    {event.location || "Location TBD"}
                  </div>
                  {/* Add attendees count if available */}
                  {/* <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="mr-2 h-4 w-4 flex-shrink-0" />
                    {event.attendees} attendees
                  </div> */}
                </div>
                <div className="mt-4 flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    asChild
                  >
                    <Link href={`/event/${event.id}/edit`}>Edit</Link>{" "}
                    {/* Ensure this route exists */}
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    asChild
                  >
                    <Link href={`/events/${event.id}`}>View</Link>{" "}
                    {/* Ensure this route exists */}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
