"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const categories = [
  "Birthday Party",
  "Conference",
  "Wedding",
  "Meetup",
  "Concert",
  "Festival",
  "Other",
];

export default function CreateEventPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [eventData, setEventData] = useState({
    title: "",
    category: "",
    description: "",
    location: "",
    date: undefined as Date | undefined,
  });
  const [items, setItems] = useState([
    { item_name: "", item_description: "", item_quantity: 1 },
  ]);

  // Handlers for event fields
  const handleEventChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEventData((prev) => ({ ...prev, [name]: value }));
  };

  // Handlers for items
  const handleItemChange = (
    idx: number,
    field: string,
    value: string | number
  ) => {
    setItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };
  const addItem = () =>
    setItems((prev) => [
      ...prev,
      { item_name: "", item_description: "", item_quantity: 1 },
    ]);
  const removeItem = (idx: number) =>
    setItems((prev) => prev.filter((_, i) => i !== idx));

  // Submit handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Insert event
      const { data: event, error: eventError } = await supabase
        .from("events")
        .insert({
          title: eventData.title,
          category: eventData.category,
          description: eventData.description,
          location: eventData.location,
          date: eventData.date ? eventData.date.toISOString() : null,
        })
        .select()
        .single();
      if (eventError) throw eventError;
      // 2. Insert items
      if (items.length > 0) {
        const { error: itemsError } = await supabase.from("event_items").insert(
          items.map((item) => ({
            event_id: event.id,
            item_name: item.item_name,
            item_description: item.item_description,
            item_quantity: Number(item.item_quantity),
          }))
        );
        if (itemsError) throw itemsError;
      }
      toast.success("Event created successfully!");
      router.push("/events");
    } catch (err: any) {
      toast.error(err.message || "Failed to create event");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Create Event</h1>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Event Details */}
        <div className="space-y-4">
          <Label htmlFor="title">Event Title</Label>
          <Input
            id="title"
            name="title"
            value={eventData.title}
            onChange={handleEventChange}
            required
          />
          <Label htmlFor="category">Category</Label>
          <Select
            name="category"
            value={eventData.category}
            onValueChange={(value) =>
              setEventData((prev) => ({ ...prev, category: value }))
            }
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Label htmlFor="description">Description</Label>
          <textarea
            id="description"
            name="description"
            value={eventData.description}
            onChange={handleEventChange}
            required
            className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        {/* Step 2: Location and Date */}
        <div className="space-y-4">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            name="location"
            value={eventData.location}
            onChange={handleEventChange}
            required
          />
          <Label htmlFor="date">Date</Label>
          <DatePicker
            date={eventData.date}
            setDate={(date) => setEventData((prev) => ({ ...prev, date }))}
            placeholder="Select event date"
          />
        </div>
        {/* Step 3: Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Event Items</Label>
            <Button type="button" variant="outline" onClick={addItem}>
              + Add Item
            </Button>
          </div>
          {items.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end border p-4 rounded-lg mb-2 bg-muted/20"
            >
              <div>
                <Label>Item Name</Label>
                <Input
                  value={item.item_name}
                  onChange={(e) =>
                    handleItemChange(idx, "item_name", e.target.value)
                  }
                  required
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={item.item_description}
                  onChange={(e) =>
                    handleItemChange(idx, "item_description", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>Quantity</Label>
                <Input
                  type="number"
                  min={1}
                  value={item.item_quantity}
                  onChange={(e) =>
                    handleItemChange(idx, "item_quantity", e.target.value)
                  }
                  required
                />
              </div>
              <div className="flex items-center h-full">
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeItem(idx)}
                  disabled={items.length === 1}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
        <Button type="submit" className="w-full" disabled={isSubmitting}>
          {isSubmitting ? "Creating Event..." : "Create Event"}
        </Button>
      </form>
    </div>
  );
}
