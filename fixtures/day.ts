const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:mm format
