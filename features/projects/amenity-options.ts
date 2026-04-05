export const amenityOptionGroups = [
  {
    key: "essentials",
    title: "Essentials",
    options: [
      "WiFi",
      "TV",
      "Air conditioning",
      "Parking",
      "24/7 security",
      "Concierge",
    ],
  },
  {
    key: "kitchen",
    title: "Kitchen",
    options: [
      "Dishwasher",
      "Coffee machine",
      "Stove",
      "Refrigerator",
      "Microwave",
      "Freezer",
    ],
  },
  {
    key: "bedroom",
    title: "Bedroom",
    options: [
      "Bed linens",
      "Wardrobes",
      "Blackout curtains",
      "Bedside lamps",
      "Walk-in closet",
      "Storage drawers",
    ],
  },
  {
    key: "bathroom",
    title: "Bathroom",
    options: [
      "Walk-in shower",
      "Bathtub",
      "Towels",
      "Guest bathroom",
      "Storage vanity",
      "Double vanity",
    ],
  },
  {
    key: "other",
    title: "Other",
    options: [
      "Fitness access",
      "Pool access",
      "Clubhouse",
      "Retail plaza access",
      "Coworking lounge",
      "Private terrace",
    ],
  },
] as const;

export type AmenityGroupKey = (typeof amenityOptionGroups)[number]["key"];
