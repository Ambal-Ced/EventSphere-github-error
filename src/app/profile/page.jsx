"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/lib/supabaseClient";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [profileData, setProfileData] = useState(null);
  const [userStats, setUserStats] = useState({
    eventsCreated: 0,
    eventsAttended: 0,
    ticketsIssued: 0,
  });

  // Set up chart data for user activity
  const chartData = {
    labels: ["Events Created", "Events Attended", "Tickets Issued"],
    datasets: [
      {
        label: "User Activity",
        data: [
          userStats.eventsCreated,
          userStats.eventsAttended,
          userStats.ticketsIssued,
        ],
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgb(54, 162, 235)",
          "rgb(75, 192, 192)",
          "rgb(153, 102, 255)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Your Activity",
      },
    },
  };

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    fetchProfile();
    fetchUserStats();
  }, [user, router]);

  async function fetchProfile() {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        throw error;
      }

      if (data) {
        setProfileData(data);
        setName(data.name || "");
        setBio(data.bio || "");
        setAvatarUrl(data.avatar_url || "");
      } else {
        // Create a new profile if one doesn't exist
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({ id: user.id, email: user.email });

        if (insertError) {
          throw insertError;
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }

  async function fetchUserStats() {
    try {
      // In a real app, this would fetch from Supabase
      // For now, we'll use dummy data
      setUserStats({
        eventsCreated: 5,
        eventsAttended: 12,
        ticketsIssued: 8,
      });
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Update profile info
      const profileUpdates = {
        id: user.id,
        name,
        bio,
        updated_at: new Date(),
      };

      let { error } = await supabase.from("profiles").upsert(profileUpdates);

      if (error) {
        throw error;
      }

      // 2. Upload avatar if there is one
      if (avatar) {
        const fileExt = avatar.name.split(".").pop();
        const fileName = `${user.id}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        let { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatar, { upsert: true });

        if (uploadError) {
          throw uploadError;
        }

        // Get public URL
        const { data } = await supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        if (data) {
          // Update profile with avatar URL
          await supabase
            .from("profiles")
            .update({ avatar_url: data.publicUrl })
            .eq("id", user.id);

          setAvatarUrl(data.publicUrl);
        }
      }

      setEditMode(false);
      fetchProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 sm:p-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left side - Avatar and basic info */}
            <div className="md:w-1/3">
              <div className="flex flex-col items-center">
                <div className="w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-blue-100">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={name || "User"}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold">
                      {(name || user.email.charAt(0)).toUpperCase()}
                    </div>
                  )}
                </div>

                <h1 className="text-2xl font-bold mb-2">{name || "User"}</h1>
                <p className="text-gray-600 mb-4">{user.email}</p>

                {!editMode ? (
                  <button
                    onClick={() => setEditMode(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition w-full"
                  >
                    Edit Profile
                  </button>
                ) : null}
              </div>
            </div>

            {/* Right side - Form or details */}
            <div className="md:w-2/3">
              {editMode ? (
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="bio"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows="4"
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    ></textarea>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="avatar"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Profile Picture
                    </label>
                    <input
                      type="file"
                      id="avatar"
                      accept="image/*"
                      onChange={(e) => setAvatar(e.target.files[0])}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <h2 className="text-xl font-bold mb-4">About</h2>
                  {bio ? (
                    <p className="text-gray-700 mb-6">{bio}</p>
                  ) : (
                    <p className="text-gray-500 italic mb-6">
                      No bio added yet.
                    </p>
                  )}

                  <h2 className="text-xl font-bold mb-4 mt-8">
                    Activity Stats
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {userStats.eventsCreated}
                      </div>
                      <div className="text-gray-600">Events Created</div>
                    </div>
                    <div className="bg-teal-50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-teal-600 mb-2">
                        {userStats.eventsAttended}
                      </div>
                      <div className="text-gray-600">Events Attended</div>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {userStats.ticketsIssued}
                      </div>
                      <div className="text-gray-600">Tickets Issued</div>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold mb-4">Activity Chart</h2>
                  <div className="h-72">
                    <Bar data={chartData} options={chartOptions} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
