interface OpeningHour {
  day: string;
  hours: string;
  isToday?: boolean;
  isOpen?: boolean;
}

/**
 * Convert openingHours object to array with day and hours
 */
export function openingHoursToArray(openingHours: any): OpeningHour[] {
  if (!openingHours) return [];

  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return daysOfWeek.map((day) => ({
    day: capitalizeFirstLetter(day),
    hours: openingHours[day] || "Closed",
    isToday: isToday(day),
  }));
}

/**
 * Enhanced version with open/closed status
 */
export function getFormattedOpeningHours(openingHours: any): OpeningHour[] {
  if (!openingHours) return [];

  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];

  return daysOfWeek.map((day) => {
    const hours = openingHours[day];
    const isTodayFlag = isToday(day);

    return {
      day: capitalizeFirstLetter(day),
      hours: hours || "Closed",
      isToday: isTodayFlag,
      isOpen: hours ? isCurrentlyOpen(hours) : false,
    };
  });
}

/**
 * Get today's opening hours
 */
export function getTodaysHours(openingHours: any): OpeningHour | null {
  if (!openingHours) return null;

  const today = new Date()
    .toLocaleString("en-US", { weekday: "long" })
    .toLowerCase();
  const hours = openingHours[today];

  return {
    day: "Today",
    hours: hours || "Closed",
    isToday: true,
    isOpen: hours ? isCurrentlyOpen(hours) : false,
  };
}

/**
 * Check if currently open based on hours string
 */
export function isCurrentlyOpen(hoursString: string): boolean {
  if (!hoursString || hoursString === "Closed") return false;

  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Convert to minutes

  try {
    const [openTime, closeTime] = hoursString.split("-");

    // Handle overnight hours (e.g., 22:00-02:00)
    const openMinutes = timeToMinutes(openTime);
    let closeMinutes = timeToMinutes(closeTime);

    // If close time is earlier than open time, it's overnight
    if (closeMinutes < openMinutes) {
      closeMinutes += 24 * 60; // Add 24 hours
    }

    return currentTime >= openMinutes && currentTime <= closeMinutes;
  } catch {
    return false;
  }
}

/**
 * Convert time string (HH:MM) to minutes
 */
function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(":").map(Number);
  return hours * 60 + (minutes || 0);
}

/**
 * Capitalize first letter of string
 */
function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Check if given day is today
 */
function isToday(day: string): boolean {
  const today = new Date()
    .toLocaleString("en-US", { weekday: "long" })
    .toLowerCase();
  return day === today;
}
