// ============================================================
// PORCH & PINE PROPERTIES — LISTINGS DATA
// ============================================================
// HOW TO ADD A LISTING:
//   1. Copy one of the objects below
//   2. Paste it into the array
//   3. Update all the fields
//   4. For images: put a photo in the /images/ folder
//      and set "image" to the filename (e.g. "images/my-house.jpg")
//      OR leave "image" as null for the default placeholder
//
// HOW TO REMOVE A LISTING:
//   1. Delete the entire { ... } block for that property
//      (make sure the remaining items are still comma-separated)
//
// STATUS OPTIONS:  "available"  |  "pending"  |  "rented"
// TYPE OPTIONS:    "long-term"  |  "short-term"
// STATE OPTIONS:   "WA"  |  "ID"
// ============================================================

const LISTINGS = [
  {
    id: 1,
    status: "available",
    type: "long-term",
    title: "3BR/2BA Home in Spokane Valley",
    address: "Spokane Valley, WA",
    state: "WA",
    price: 1895,
    priceLabel: "/mo",
    beds: 3,
    baths: 2,
    sqft: 1450,
    image: null,
    description: "Spacious 3-bedroom home in a quiet neighborhood. Fenced backyard, attached garage, updated kitchen with granite countertops. Close to schools and shopping.",
    features: ["Fenced Yard", "Garage", "Washer/Dryer", "A/C"],
    availableDate: "Now",
    zillow: "https://www.zillow.com",
    featured: true
  },
  {
    id: 2,
    status: "available",
    type: "long-term",
    title: "2BR/1BA Apartment in Coeur d'Alene",
    address: "Coeur d'Alene, ID",
    state: "ID",
    price: 1350,
    priceLabel: "/mo",
    beds: 2,
    baths: 1,
    sqft: 920,
    image: null,
    description: "Bright 2-bedroom apartment near downtown CDA. Updated appliances, on-site laundry, pet-friendly. Walking distance to restaurants and shops.",
    features: ["Pet Friendly", "On-Site Laundry", "Updated Appliances"],
    availableDate: "April 1, 2026",
    zillow: "https://www.zillow.com",
    featured: true
  },
  {
    id: 3,
    status: "available",
    type: "short-term",
    title: "Lakefront Cabin — Lake Coeur d'Alene",
    address: "Harrison, ID",
    state: "ID",
    price: 275,
    priceLabel: "/night",
    beds: 2,
    baths: 1,
    sqft: 800,
    image: null,
    description: "Charming lakefront cabin with stunning views of Lake CDA. Private dock, kayaks included, fully equipped kitchen. Perfect for weekend getaways.",
    features: ["Lakefront", "Private Dock", "Kayaks", "Full Kitchen", "Fireplace"],
    availableDate: "Check Calendar",
    zillow: "https://www.zillow.com",
    featured: true
  },
  {
    id: 4,
    status: "available",
    type: "long-term",
    title: "4BR/2.5BA Family Home in Liberty Lake",
    address: "Liberty Lake, WA",
    state: "WA",
    price: 2450,
    priceLabel: "/mo",
    beds: 4,
    baths: 2.5,
    sqft: 2100,
    image: null,
    description: "Large family home in desirable Liberty Lake neighborhood. Open floor plan, chef's kitchen, primary suite with walk-in closet. Access to community park.",
    features: ["Large Yard", "2-Car Garage", "Community Park", "A/C", "Washer/Dryer"],
    availableDate: "May 1, 2026",
    zillow: "https://www.zillow.com",
    featured: false
  }
];
