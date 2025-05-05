"use client"; // Make it a Client Component

import { useState, useMemo } from "react"; // Import hooks
import { Metadata } from "next"; // Keep Metadata type import if needed elsewhere, but can't export from client component
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Search, Calendar, MapPin, ListFilter } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Note: Cannot export metadata from a Client Component.
// Move metadata to layout.tsx or a dedicated server component if needed.
// export const metadata: Metadata = {
//   title: "Browse Events - EventSphere",
//   description: "Find and join upcoming events on EventSphere",
// };

// Using the same detailed placeholder data as the home page
const events = [
  {
    id: 1,
    title: "Tech Conference 2024",
    date: "March 15, 2024",
    location: "San Francisco, CA",
    image: "/images/tech-conf.png",
    category: "Technology",
    description:
      "Join top industry leaders for the latest trends in AI, cloud, and more.",
  },
  {
    id: 2,
    title: "Music Festival",
    date: "April 20, 2024",
    location: "Austin, TX",
    image: "/images/music-fest.jpg",
    category: "Music",
    description:
      "Experience three days of live music from your favorite artists across multiple stages.",
  },
  {
    id: 3,
    title: "Food & Wine Expo",
    date: "May 5, 2024",
    location: "New York, NY",
    image: "/images/food-expo.png",
    category: "Food & Drink",
    description:
      "Taste delicious food and fine wines from around the world at this premier expo.",
  },
  {
    id: 4,
    title: "Art Exhibition",
    date: "June 10, 2024",
    location: "Paris, FR",
    image: "/images/art-exhibit.jpg",
    category: "Arts & Culture",
    description:
      "Explore stunning contemporary art pieces from renowned global artists.",
  },
  {
    id: 5,
    title: "Startup Pitch Night",
    date: "July 22, 2024",
    location: "London, UK",
    image: "/images/startup-pitch.jpg",
    category: "Business",
    description:
      "Watch innovative startups pitch their ideas to investors and industry experts.",
  },
  {
    id: 6,
    title: "Gaming Convention",
    date: "August 5, 2024",
    location: "Los Angeles, CA",
    image: "/images/gaming-con.jpg",
    category: "Gaming",
    description:
      "Play upcoming games, meet developers, and compete in tournaments.",
  },
  {
    id: 7,
    title: "Wellness Retreat",
    date: "September 12, 2024",
    location: "Bali, ID",
    image: "/images/wellness-retreat.jpg",
    category: "Health",
    description:
      "Rejuvenate your mind and body with yoga, meditation, and healthy workshops.",
  },
  {
    id: 8,
    title: "Film Festival",
    date: "October 18, 2024",
    location: "Toronto, CA",
    image: "/images/film-fest.jpg",
    category: "Film",
    description: "Discover independent films and celebrate the art of cinema.",
  },
];

// Placeholder categories for filter dropdown
const categories = [
  "Technology",
  "Music",
  "Food & Drink",
  "Arts & Culture",
  "Business",
  "Gaming",
  "Health",
  "Film",
  "Sports",
  "Other",
];

export default function EventsPage() {
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Memoized filtering logic
  const filteredEvents = useMemo(() => {
    return events.filter((event) => {
      const matchesSearch =
        searchTerm === "" ||
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(event.category);

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategories]); // Recalculate when search or filters change

  // Handler for category filter changes
  const handleCategoryChange = (category: string, checked: boolean) => {
    setSelectedCategories(
      (prev) =>
        checked
          ? [...prev, category] // Add category if checked
          : prev.filter((c) => c !== category) // Remove category if unchecked
    );
  };

  return (
    <div className="flex flex-col gap-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-4xl font-bold">Browse Events</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search events..."
              className="pl-8 sm:w-[300px] md:w-[200px] lg:w-[300px] bg-background"
              value={searchTerm} // Bind value to state
              onChange={(e) => setSearchTerm(e.target.value)} // Update state on change
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-1">
                <ListFilter className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  Filter ({selectedCategories.length}) {/* Show count */}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={selectedCategories.includes(category)} // Bind checked state
                  onCheckedChange={(checked) =>
                    handleCategoryChange(category, !!checked)
                  } // Handle change
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button asChild size="sm" className="h-9 gap-1">
            <Link href="/create-event">
              <Plus className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Create Event
              </span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Events Grid - Render filteredEvents */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Link
              key={event.id}
              href={`/events/${event.id}`} // Link to detail page
              className="block group relative overflow-hidden rounded-xl border bg-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
            >
              <div className="aspect-video relative">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover brightness-90 transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute right-2 top-2 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white">
                  {event.category}
                </div>
              </div>
              <div className="p-4">
                <h3 className="mb-1.5 text-lg font-semibold line-clamp-1">
                  {event.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3 h-10">
                  {event.description}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {event.date}
                  </div>
                  <span className="opacity-50">|</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {event.location}
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className="text-muted-foreground col-span-full text-center">
            No events found matching your criteria.
          </p>
        )}
      </div>
      {/* TODO: Add Pagination if needed */}
    </div>
  );
}
