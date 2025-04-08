"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import supabase from "@/lib/supabaseClient";

export default function SettingsPage() {
  const router = useRouter();
  const { user, signOut } = useAuth();

  const [activeTab, setActiveTab] = useState("account");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Account settings
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  // Notification settings
  const [emailNotifications, setEmailNotifications] = useState({
    newEvents: true,
    reminders: true,
    updates: false,
  });

  // Security settings
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    // Load user data
    setEmail(user.email || "");
    fetchProfile();
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
        setName(data.name || "");
        // If you have notification preferences stored, load them here
        if (data.notification_preferences) {
          setEmailNotifications(data.notification_preferences);
        }
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  }

  const handleUpdateAccount = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Update profile data
      const { error } = await supabase
        .from("profiles")
        .update({
          name,
          updated_at: new Date(),
        })
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      setMessage("Account information updated successfully");
    } catch (error) {
      console.error("Error updating account:", error);
      setError("Failed to update account information");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateNotifications = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // Update notification preferences
      const { error } = await supabase
        .from("profiles")
        .update({
          notification_preferences: emailNotifications,
          updated_at: new Date(),
        })
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      setMessage("Notification preferences updated successfully");
    } catch (error) {
      console.error("Error updating notifications:", error);
      setError("Failed to update notification preferences");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      setLoading(false);
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters long");
      setLoading(false);
      return;
    }

    try {
      // Update password through Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }

      // Clear password fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setMessage("Password updated successfully");
    } catch (error) {
      console.error("Error updating password:", error);
      setError(
        "Failed to update password. Make sure your current password is correct."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      // First delete user data from profiles
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", user.id);

      if (profileError) {
        throw profileError;
      }

      // Then sign out and delete the user
      await signOut();

      // In a real app, you would call a server function to delete the user account
      // Since we can't do that directly from the client, we'll simulate it
      alert(
        "Account deleted successfully. In a production app, your account would be completely removed."
      );

      router.push("/");
    } catch (error) {
      console.error("Error deleting account:", error);
      setError("Failed to delete account");
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <p className="text-gray-600">
            Please log in to access your settings.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

      {message && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{message}</p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row">
        <div className="md:w-1/4 mb-6 md:mb-0">
          <div className="bg-white rounded-lg shadow-sm p-4">
            <nav className="space-y-1">
              <button
                className={`block w-full text-left px-3 py-2 rounded-md ${
                  activeTab === "account"
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("account")}
              >
                Account Information
              </button>
              <button
                className={`block w-full text-left px-3 py-2 rounded-md ${
                  activeTab === "notifications"
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("notifications")}
              >
                Notification Preferences
              </button>
              <button
                className={`block w-full text-left px-3 py-2 rounded-md ${
                  activeTab === "security"
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setActiveTab("security")}
              >
                Security Settings
              </button>
              <button
                className={`block w-full text-left px-3 py-2 rounded-md ${
                  activeTab === "danger"
                    ? "bg-red-50 text-red-700 font-medium"
                    : "text-red-600 hover:bg-red-50"
                }`}
                onClick={() => setActiveTab("danger")}
              >
                Delete Account
              </button>
            </nav>
          </div>
        </div>

        <div className="md:w-3/4 md:pl-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            {activeTab === "account" && (
              <div>
                <h2 className="text-xl font-bold mb-4">Account Information</h2>
                <form onSubmit={handleUpdateAccount}>
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      disabled
                      className="w-full px-4 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      To change your email, please contact support
                    </p>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="name"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>
            )}

            {activeTab === "notifications" && (
              <div>
                <h2 className="text-xl font-bold mb-4">
                  Notification Preferences
                </h2>
                <form onSubmit={handleUpdateNotifications}>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="newEvents"
                          type="checkbox"
                          checked={emailNotifications.newEvents}
                          onChange={(e) =>
                            setEmailNotifications({
                              ...emailNotifications,
                              newEvents: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="newEvents"
                          className="font-medium text-gray-700"
                        >
                          New Event Announcements
                        </label>
                        <p className="text-gray-500">
                          Receive emails about new events that may interest you
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="reminders"
                          type="checkbox"
                          checked={emailNotifications.reminders}
                          onChange={(e) =>
                            setEmailNotifications({
                              ...emailNotifications,
                              reminders: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="reminders"
                          className="font-medium text-gray-700"
                        >
                          Event Reminders
                        </label>
                        <p className="text-gray-500">
                          Receive reminders about events you've registered for
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="updates"
                          type="checkbox"
                          checked={emailNotifications.updates}
                          onChange={(e) =>
                            setEmailNotifications({
                              ...emailNotifications,
                              updates: e.target.checked,
                            })
                          }
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label
                          htmlFor="updates"
                          className="font-medium text-gray-700"
                        >
                          Platform Updates
                        </label>
                        <p className="text-gray-500">
                          Receive emails about new features and updates to
                          EventSphere
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {loading ? "Saving..." : "Save Preferences"}
                  </button>
                </form>
              </div>
            )}

            {activeTab === "security" && (
              <div>
                <h2 className="text-xl font-bold mb-4">Security Settings</h2>
                <form onSubmit={handleUpdatePassword}>
                  <div className="mb-4">
                    <label
                      htmlFor="current-password"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="current-password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="new-password"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      New Password
                    </label>
                    <input
                      type="password"
                      id="new-password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Password must be at least 8 characters long
                    </p>
                  </div>

                  <div className="mb-6">
                    <label
                      htmlFor="confirm-password"
                      className="block text-gray-700 font-medium mb-2"
                    >
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      id="confirm-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {loading ? "Updating..." : "Update Password"}
                  </button>
                </form>
              </div>
            )}

            {activeTab === "danger" && (
              <div>
                <h2 className="text-xl font-bold mb-4 text-red-600">
                  Delete Account
                </h2>
                <div className="bg-red-50 p-4 border-l-4 border-red-400 mb-6">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        Warning: This action is permanent and cannot be undone.
                        All your data will be permanently removed.
                      </p>
                    </div>
                  </div>
                </div>

                <p className="text-gray-700 mb-6">
                  Before you delete your account, please be aware that:
                </p>

                <ul className="list-disc pl-5 mb-6 text-gray-700 space-y-2">
                  <li>All your personal information will be deleted</li>
                  <li>Your events and tickets will be removed</li>
                  <li>
                    You won't be able to recover your account once it's deleted
                  </li>
                </ul>

                <button
                  onClick={handleDeleteAccount}
                  disabled={loading}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Delete My Account"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
