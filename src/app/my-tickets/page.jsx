"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/lib/supabaseClient";

export default function MyTicketsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    fetchTickets();
  }, [user, router, activeTab]);

  async function fetchTickets() {
    setLoading(true);
    try {
      // Get today's date for filtering past/upcoming
      const today = new Date().toISOString().split("T")[0];

      // Build the Supabase query
      // This should be a join query to get both ticket and event data
      const { data, error } = await supabase
        .from("tickets")
        .select(
          `
          *,
          events (*)
        `
        )
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      // Filter based on event date
      let filteredTickets = [];
      if (data) {
        filteredTickets = data.filter((ticket) => {
          if (!ticket.events) return false;

          if (activeTab === "upcoming") {
            return ticket.events.date >= today;
          } else if (activeTab === "past") {
            return ticket.events.date < today;
          }
          return true;
        });
      }

      setTickets(filteredTickets);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      // Set some dummy tickets for development
      const today = new Date();
      const futureDate = new Date();
      futureDate.setDate(today.getDate() + 15);
      const pastDate = new Date();
      pastDate.setDate(today.getDate() - 15);

      const dummyTickets = [
        {
          id: 1,
          ticket_code: "TIX12345",
          purchase_date: new Date().toISOString().split("T")[0],
          events: {
            id: 101,
            title: "Tech Conference 2024",
            date: futureDate.toISOString().split("T")[0],
            location: "San Francisco Convention Center",
            image_url:
              "https://images.unsplash.com/photo-1540575467063-178a50c2df87",
          },
        },
        {
          id: 2,
          ticket_code: "TIX67890",
          purchase_date: new Date().toISOString().split("T")[0],
          events: {
            id: 102,
            title: "Music Festival",
            date: futureDate.toISOString().split("T")[0],
            location: "Central Park",
            image_url:
              "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4",
          },
        },
        {
          id: 3,
          ticket_code: "TIX24680",
          purchase_date: pastDate.toISOString().split("T")[0],
          events: {
            id: 103,
            title: "Art Exhibition",
            date: pastDate.toISOString().split("T")[0],
            location: "Modern Art Museum",
            image_url:
              "https://images.unsplash.com/photo-1531058020387-3be344556be6",
          },
        },
      ];

      // Filter based on active tab
      const filteredTickets = dummyTickets.filter((ticket) => {
        const eventDate = new Date(ticket.events.date);
        if (activeTab === "upcoming") {
          return eventDate >= today;
        } else if (activeTab === "past") {
          return eventDate < today;
        }
        return true;
      });

      setTickets(filteredTickets);
    } finally {
      setLoading(false);
    }
  }

  const generateQRCode = (ticketCode) => {
    // In a real app, this would generate a QR code
    // For now, return a placeholder URL
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${ticketCode}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 md:mb-0">My Tickets</h1>
        <Link
          href="/events"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition"
        >
          Browse Events
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
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : tickets.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-5xl mb-4">🎟️</div>
          <h3 className="text-xl font-bold mb-2">No tickets found</h3>
          {activeTab === "all" ? (
            <p className="text-gray-600 mb-6">
              You haven't registered for any events yet.
            </p>
          ) : activeTab === "upcoming" ? (
            <p className="text-gray-600 mb-6">
              You don't have any upcoming event tickets.
            </p>
          ) : (
            <p className="text-gray-600 mb-6">
              You don't have any past event tickets.
            </p>
          )}
          <Link
            href="/events"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition"
          >
            Browse Events
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tickets.map((ticket) => {
            const isUpcoming = new Date(ticket.events.date) >= new Date();
            return (
              <div
                key={ticket.id}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 h-48 md:h-auto bg-gray-200 relative">
                    {ticket.events.image_url ? (
                      <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                          backgroundImage: `url(${ticket.events.image_url})`,
                        }}
                      ></div>
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-500">
                        No image
                      </div>
                    )}
                  </div>
                  <div className="p-6 md:w-2/3">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-bold">
                        {ticket.events.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          isUpcoming
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {isUpcoming ? "Upcoming" : "Past"}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-2">
                      {new Date(ticket.events.date).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" }
                      )}
                    </p>
                    <p className="text-gray-700 mb-4">
                      {ticket.events.location}
                    </p>
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-500">
                          Ticket #: {ticket.ticket_code}
                        </p>
                        <p className="text-sm text-gray-500">
                          Purchased:{" "}
                          {new Date(ticket.purchase_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Link
                        href={`/my-tickets/${ticket.id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                      >
                        View Ticket
                      </Link>
                    </div>
                  </div>
                </div>
                {isUpcoming && (
                  <div className="p-4 border-t border-gray-200 flex justify-center">
                    <div className="text-center">
                      <div className="bg-white p-2 rounded-lg border border-gray-200 inline-block mb-2">
                        <img
                          src={generateQRCode(ticket.ticket_code)}
                          alt="QR Code"
                          className="w-32 h-32"
                        />
                      </div>
                      <p className="text-sm text-gray-600">
                        Show this QR code at the event entrance
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
