"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import supabase from "@/lib/supabaseClient";

export default function Home() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeaturedEvents() {
      try {
        // Assuming we have an 'events' table in Supabase
        const { data, error } = await supabase
          .from("events")
          .select("*")
          .limit(5)
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }

        setEvents(data || []);
      } catch (error) {
        console.error("Error fetching events:", error);
        // Use placeholder data if there's an error
        setEvents([
          {
            id: 1,
            title: "Tech Conference 2024",
            date: "2024-06-15",
            location: "San Francisco, CA",
            image_url:
              "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
          },
          {
            id: 2,
            title: "Music Festival",
            date: "2024-07-10",
            location: "Austin, TX",
            image_url:
              "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4",
          },
          {
            id: 3,
            title: "Food & Wine Expo",
            date: "2024-05-20",
            location: "Chicago, IL",
            image_url:
              "https://images.unsplash.com/photo-1528605248644-14dd04022da1",
          },
        ]);
      } finally {
        setLoading(false);
      }
    }

    fetchFeaturedEvents();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-800 to-blue-600 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              Your Events, <br />
              Simplified
            </h1>
            <p className="text-xl md:text-2xl mb-6 md:max-w-md">
              Create, manage, and attend events seamlessly with EventSphere.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/events"
                className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold text-center hover:bg-gray-100 transition"
              >
                Explore Events
              </Link>
              <Link
                href="/register"
                className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-md font-semibold text-center hover:bg-white/10 transition"
              >
                Sign Up Now
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md h-80 md:h-96">
              <div
                className="absolute inset-0 bg-contain bg-center bg-no-repeat"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1531058020387-3be344556be6')",
                }}
              ></div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Events Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Featured Events
          </h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
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
                    <p className="text-gray-600 mb-4">
                      {new Date(event.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                    <p className="text-gray-700 mb-4">{event.location}</p>
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
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">
            Why Choose EventSphere
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-5xl mb-4 text-blue-600 flex justify-center">
                🎫
              </div>
              <h3 className="text-xl font-bold mb-2">Easy Ticketing</h3>
              <p className="text-gray-600">
                Digital tickets with QR codes that are easy to manage and share.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-5xl mb-4 text-blue-600 flex justify-center">
                📊
              </div>
              <h3 className="text-xl font-bold mb-2">Analytics</h3>
              <p className="text-gray-600">
                Get insights into attendance, engagement, and more.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="text-5xl mb-4 text-blue-600 flex justify-center">
                📱
              </div>
              <h3 className="text-xl font-bold mb-2">Mobile Friendly</h3>
              <p className="text-gray-600">
                Access your events and tickets on any device, anytime.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
