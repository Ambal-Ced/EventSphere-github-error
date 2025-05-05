"use client";

import * as React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

export function DatePicker({
  date,
  setDate,
  placeholder = "MM/DD/YYYY",
}: {
  date?: Date;
  setDate: (date: Date | undefined) => void;
  placeholder?: string;
}) {
  const [inputValue, setInputValue] = React.useState("");

  // Format date when it changes
  React.useEffect(() => {
    if (date) {
      setInputValue(format(date, "MM/dd/yyyy"));
    }
  }, [date]);

  // Handle manual input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // Remove any non-numeric characters
    value = value.replace(/\D/g, "");

    // Add slashes automatically
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2);
    }
    if (value.length >= 5) {
      value = value.slice(0, 5) + "/" + value.slice(5, 9);
    }

    // Limit the total length to 10 characters (MM/DD/YYYY)
    value = value.slice(0, 10);

    setInputValue(value);

    // Try to parse the date if we have a complete format
    if (value.length === 10) {
      const [month, day, year] = value.split("/");
      const parsedDate = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day)
      );

      // Check if it's a valid date
      if (!isNaN(parsedDate.getTime())) {
        setDate(parsedDate);
      }
    }
  };

  return (
    <Input
      value={inputValue}
      onChange={handleInputChange}
      placeholder={placeholder}
      className={cn("w-full", !date && "text-muted-foreground")}
    />
  );
}
