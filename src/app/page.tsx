import { Metadata } from "next";
import HomeClient from "./home-client"; // Import the client component

// Export metadata from the Server Component
export const metadata: Metadata = {
  title: "EventSphere - Your Event Management Platform",
  description:
    "Create, discover, and participate in events of any kind. Find amazing events near you.", // Slightly updated description
};

// Default export (Server Component)
export default function Page() {
  // Render the Client Component
  return <HomeClient />;
}
