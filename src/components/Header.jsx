"use client";

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const { user, signOut } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log(`Searching for: ${searchQuery}`);
  };

  return (
    <header className="bg-white shadow-md fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">
              EventSphere
            </span>
          </Link>

          <nav className="flex space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium"
            >
              Home
            </Link>
            <Link
              href="/events"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium"
            >
              Events
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium"
            >
              About
            </Link>
            <Link
              href="/faq"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 font-medium"
            >
              FAQ
            </Link>
          </nav>

          <div className="flex items-center">
            <form onSubmit={handleSearch} className="mr-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search events..."
                  className="border rounded-full px-4 py-2 w-48 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-full px-3 rounded-full"
                >
                  ��
                </button>
              </div>
            </form>

            {user ? (
              <div className="flex items-center">
                <Link
                  href="/profile"
                  className="flex items-center px-3 py-2 hover:text-blue-600"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex justify-center items-center mr-2 text-sm">
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="hidden md:inline">Profile</span>
                </Link>
              </div>
            ) : (
              <div className="flex">
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-md bg-white border border-blue-600 text-blue-600 hover:bg-gray-50 mr-2"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
