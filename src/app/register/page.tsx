"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { cn } from "@/lib/utils";
import { format, differenceInYears } from "date-fns";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Cannot export metadata from Client Component
// export const metadata: Metadata = {
//   title: "Create Account - EventSphere",
//   description: "Sign up for a new EventSphere account.",
// };

const interestsList = [
  "Music & Concerts",
  "Sports & Fitness",
  "Technology & Innovation",
  "Art & Culture",
  "Food & Cooking",
  "Travel & Adventure",
  "Business & Networking",
  "Education & Learning",
  "Gaming & Entertainment",
  "Health & Wellness",
  "Photography",
  "Fashion & Beauty",
  "Science & Research",
  "Environment & Sustainability",
  "Volunteering & Charity",
];

const rolesList = ["Attendee", "Organizer", "Volunteer", "Sponsor", "Speaker"];

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Email is invalid";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleDateChange = (date: Date | undefined) => {
    const age = date ? differenceInYears(new Date(), date).toString() : "";
    setFormData((prev) => ({ ...prev, birthday: date, age }));
    if (errors.birthday) {
      setErrors((prev) => ({ ...prev, birthday: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: `${window.location.origin}/verified`,
        },
      });

      if (error) {
        console.error("Sign up error:", error);
        alert(error.message);
      } else if (data.user) {
        alert(
          "Account created successfully! Please check your email to verify your account. After verifying, please log in."
        );
        router.push("/login");
      }
    } catch (error: any) {
      console.error("Registration process error:", error);
      alert(
        `Registration failed: ${
          error.message || "An unexpected error occurred."
        }`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 py-12 px-4">
      <div className="w-full max-w-3xl rounded-lg bg-background p-8 shadow-lg">
        <h1 className="mb-2 text-center text-3xl font-bold">
          Create an account
        </h1>
        <p className="mb-8 text-center text-muted-foreground">
          Or{" "}
          <Link href="/login" className="text-primary hover:underline">
            sign in to your existing account
          </Link>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className={cn(errors.email && "border-destructive")}
            />
            {errors.email && (
              <p className="text-xs text-destructive mt-1">{errors.email}</p>
            )}
          </div>
          <div>
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              className={cn(errors.password && "border-destructive")}
            />
            {errors.password && (
              <p className="text-xs text-destructive mt-1">{errors.password}</p>
            )}
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              className={cn(errors.confirmPassword && "border-destructive")}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-destructive mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </form>
      </div>
    </div>
  );
}
