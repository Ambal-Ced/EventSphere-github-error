"use client";

import { useState, useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { useAuth } from "@/context/AuthContext";

export default function Layout({ children }) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  useEffect(() => {
    // Measure the header height for proper sidebar positioning
    const header = document.querySelector("header");
    if (header) {
      setHeaderHeight(header.offsetHeight);
    }

    // Update header height on resize
    const handleResize = () => {
      if (header) {
        setHeaderHeight(header.offsetHeight);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div
        className="flex flex-1 relative"
        style={{ marginTop: `${headerHeight}px` }}
      >
        <div
          className={`
            ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
            md:translate-x-0 fixed left-0 w-64
            transition-transform duration-300 ease-in-out
            z-40 flex-shrink-0 overflow-y-auto
            bg-white shadow-md
          `}
          style={{
            top: `${headerHeight}px`,
            height: `calc(100vh - ${headerHeight}px)`,
          }}
        >
          <Sidebar />
        </div>

        <button
          onClick={toggleSidebar}
          className="md:hidden p-3 m-4 bg-blue-600 text-white rounded-full fixed bottom-4 right-4 z-50 shadow-lg"
          aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {sidebarOpen ? "✕" : "☰"}
        </button>

        {sidebarOpen && (
          <div
            className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={toggleSidebar}
          />
        )}

        <main
          className="flex-1 overflow-auto min-h-screen w-full"
          style={{
            paddingLeft: "calc(1rem + 16rem)",
            paddingTop: "1rem",
            paddingRight: "1rem",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
