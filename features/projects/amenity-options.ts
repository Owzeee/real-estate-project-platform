export const projectAmenityOptionGroups = [
  {
    key: "essentials",
    title: "Security & Access",
    options: [
      "24/7 security",
      "Security cameras",
      "Controlled access",
      "Reception lobby",
      "Concierge desk",
      "Visitor management",
    ],
  },
  {
    key: "kitchen",
    title: "Parking & Mobility",
    options: [
      "Covered parking",
      "Private garage",
      "Valet parking",
      "EV charging",
      "Drop-off area",
      "Bike storage",
    ],
  },
  {
    key: "bedroom",
    title: "Leisure & Wellness",
    options: [
      "Swimming pool",
      "Gym",
      "Spa",
      "Residents lounge",
      "Children play area",
      "Clubhouse",
    ],
  },
  {
    key: "bathroom",
    title: "Work & Hospitality",
    options: [
      "Coworking lounge",
      "Meeting rooms",
      "Business center",
      "Retail plaza",
      "Cafe spaces",
      "Event room",
    ],
  },
  {
    key: "other",
    title: "Outdoor & Lifestyle",
    options: [
      "Terrace",
      "Landscaped gardens",
      "Walking paths",
      "Rooftop deck",
      "Private beach access",
      "Pet-friendly zones",
    ],
  },
] as const;

export const propertyAmenityOptionGroups = [
  {
    key: "essentials",
    title: "Essentials",
    options: [
      "WiFi",
      "TV",
      "Air conditioning",
      "Washing machine",
      "Dryer",
      "Iron",
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
      "Balcony",
      "Private terrace",
      "Workspace desk",
      "Dining area",
      "Built-in storage",
      "Smart home controls",
    ],
  },
] as const;

export type AmenityGroupKey = (typeof projectAmenityOptionGroups)[number]["key"];
