"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import supabase from "@/lib/supabaseClient";

export default function EventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("date-asc");

  useEffect(() => {
    fetchEvents();
  }, [filter, sortBy]);

  async function fetchEvents() {
    setLoading(true);
    try {
      let query = supabase.from("events").select("*");

      // Apply filters
      if (filter !== "all") {
        query = query.eq("category", filter);
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
      // Fallback data if there's an error
      setEvents([
        {
          id: 1,
          title: "Tech Conference 2024",
          date: "2024-06-15",
          location: "San Francisco, CA",
          category: "technology",
          description:
            "Join us for the latest in tech innovations and networking opportunities.",
          image_url:
            "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
        },
        {
          id: 2,
          title: "Music Festival",
          date: "2024-07-10",
          location: "Austin, TX",
          category: "music",
          description: "A weekend of amazing performances from top artists.",
          image_url:
            "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4",
        },
        {
          id: 3,
          title: "Food & Wine Expo",
          date: "2024-05-20",
          location: "Chicago, IL",
          category: "food",
          description:
            "Taste exquisite dishes and wines from around the world.",
          image_url:
            "https://images.unsplash.com/photo-1528605248644-14dd04022da1",
        },
        {
          id: 4,
          title: "Art Exhibition",
          date: "2024-04-25",
          location: "New York, NY",
          category: "arts",
          description:
            "Featuring works from both established and emerging artists.",
          image_url:
            "https://images.unsplash.com/photo-1531058020387-3be344556be6",
        },
        {
          id: 5,
          title: "Business Summit",
          date: "2024-08-12",
          location: "Miami, FL",
          category: "business",
          description:
            "Connect with industry leaders and learn about the latest trends.",
          image_url:
            "https://images.unsplash.com/photo-1591115765373-5207764f72e4",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // Filter events based on search term
  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is handled via the filteredEvents calculation
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Discover Events</h1>

      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <form onSubmit={handleSearch} className="flex-grow">
          <div className="relative">
            <input
              type="text"
              placeholder="Search events..."
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="absolute right-2 top-2">
              🔍
            </button>
          </div>
        </form>

        <div className="flex flex-col sm:flex-row gap-4">
          <select
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="technology">Technology</option>
            <option value="music">Music</option>
            <option value="food">Food & Drink</option>
            <option value="arts">Arts & Culture</option>
            <option value="business">Business</option>
          </select>

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
      ) : filteredEvents.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-xl font-bold mb-2">No events found</h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
            >
              <div className="h-48 bg-gray-200 relative">
                {event.image_url ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${event.image_url})` }}
                  ></div>
                ) : (
                  <div className="flex h-full items-center justify-center text-gray-500">
                    No image available
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-2">
                  {new Date(event.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
                <p className="text-gray-700 mb-2">{event.location}</p>
                <p className="text-gray-600 mb-4 line-clamp-2">
                  {event.description}
                </p>
                <Link
                  href={`/events/${event.id}`}
                  className="inline-block bg-blue-600 text-white px-4 py-2 rounded font-medium hover:bg-blue-700 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
