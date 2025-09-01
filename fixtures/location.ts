export const location = [
  {
    id: 1,
    location: "Nairobi",
  },
  {
    id: 2,
    location: "Eldoret",
  },
  {
    id: 3,
    location: "Kisumu",
  },
];

export const regions = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  location: `Location ${i + 1}`,
}));

export const towns = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  location: `town ${i + 1}`,
}));
