"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/lib/supabaseClient";

export default function MyEventsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const [sortBy, setSortBy] = useState("date-asc");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    fetchEvents();
  }, [user, router, activeTab, sortBy]);

  async function fetchEvents() {
    setLoading(true);
    try {
      // Get today's date for filtering past/upcoming
      const today = new Date().toISOString().split("T")[0];

      // Build the Supabase query
      let query = supabase.from("events").select("*").eq("user_id", user.id);

      // Apply filter based on active tab
      if (activeTab === "upcoming") {
        query = query.gte("date", today);
      } else if (activeTab === "past") {
        query = query.lt("date", today);
      }

      // Apply sorting
      if (sortBy === "date-asc") {
        query = query.order("date", { ascending: true });
      } else if (sortBy === "date-desc") {
        query = query.order("date", { ascending: false });
      } else if (sortBy === "title-asc") {
        query = query.order("title", { ascending: true });
      } else if (sortBy === "title-desc") {
        query = query.order("title", { ascending: false });
      }

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
      // Set some dummy events for development
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + 30);
      const pastDate = new Date();
      pastDate.setDate(today.getDate() - 30);

      const dummyEvents = [
        {
          id: 1,
          title: "Tech Workshop",
          date: futureDate.toISOString().split("T")[0],
          location: "Online",
          description: "Learn about the latest technologies.",
          image_url:
            "https://images.unsplash.com/photo-1561489413-985b06da5bee",
        },
        {
          id: 2,
          title: "Music Concert",
          date: futureDate.toISOString().split("T")[0],
          location: "Central Park",
          description: "A night of amazing music.",
          image_url:
            "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4",
        },
        {
          id: 3,
          title: "Past Conference",
          date: pastDate.toISOString().split("T")[0],
          location: "Convention Center",
          description: "A successful conference from the past.",
          image_url:
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
        },
      ];

      // Filter based on active tab
      const filteredEvents = dummyEvents.filter((event) => {
        if (activeTab === "upcoming") {
          return new Date(event.date) >= today;
        } else if (activeTab === "past") {
          return new Date(event.date) < today;
        }
        return true;
      });

      setEvents(filteredEvents);
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteEvent = async (eventId) => {
    if (
      !confirm(
        "Are you sure you want to cancel this event? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      // Delete event from Supabase
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", eventId)
        .eq("user_id", user.id); // Security check

      if (error) {
        throw error;
      }

      // Update UI
      setEvents(events.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error("Error deleting event:", error);
      alert("Failed to delete event. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">My Events</h1>
        <Link
          href="/my-events/create"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition"
        >
          Create New Event
        </Link>
      </div>

      <div className="mb-8">
        <div className="flex border-b mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "upcoming"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "past"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("past")}
          >
            Past
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "all"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-blue-600"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All
          </button>
        </div>

        <div className="flex justify-end mb-4">
          <select
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="date-asc">Date (Earliest First)</option>
            <option value="date-desc">Date (Latest First)</option>
            <option value="title-asc">Title (A-Z)</option>
            <option value="title-desc">Title (Z-A)</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-5xl mb-4">📅</div>
          <h3 className="text-xl font-bold mb-2">No events found</h3>
          {activeTab === "all" ? (
            <p className="text-gray-600 mb-6">
              You haven't created any events yet.
            </p>
          ) : activeTab === "upcoming" ? (
            <p className="text-gray-600 mb-6">
              You don't have any upcoming events.
            </p>
          ) : (
            <p className="text-gray-600 mb-6">
              You don't have any past events.
            </p>
          )}
          <Link
            href="/my-events/create"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition"
          >
            Create Your First Event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition flex flex-col md:flex-row"
            >
              <div className="md:w-1/4 h-48 md:h-auto bg-gray-200 relative">
                {event.image_url ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${event.image_url})` }}
                  ></div>
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    No image
                  </div>
                )}
              </div>
              <div className="p-6 md:w-3/4 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        new Date(event.date) >= new Date()
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {new Date(event.date) >= new Date() ? "Upcoming" : "Past"}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">
                    {new Date(event.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                  <p className="text-gray-700 mb-2">{event.location}</p>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/my-events/${event.id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                  >
                    View Details
                  </Link>
                  <Link
                    href={`/my-events/edit/${event.id}`}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDeleteEvent(event.id)}
                    className="px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition"
                  >
                    Cancel Event
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
