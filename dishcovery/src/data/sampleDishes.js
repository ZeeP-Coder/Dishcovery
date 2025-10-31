const SAMPLE_DISHES = [
  {
    id: "dish-001",
    name: "Adobo sa Gata",
    description: "Rich coconut adobo with tender pork belly and savory sauce.",
    cuisine: "Filipino",
    cookTimeMinutes: 60,
    difficulty: "medium",
    rating: 4.6,
    tags: ["pork", "comfort"],
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=",
    ingredients: [
      { id: "i1", name: "Pork belly", quantity: "1 kg" },
      { id: "i2", name: "Coconut milk", quantity: "400 ml" }
    ],
    steps: ["Sear pork until brown", "Add vinegar, soy, and simmer", "Add coconut milk and reduce"]
  },
  {
    id: "dish-002",
    name: "Sinigang na Hipon",
    description: "Tamarind-based sour soup with shrimp and seasonal vegetables.",
    cuisine: "Filipino",
    cookTimeMinutes: 35,
    difficulty: "easy",
    rating: 4.4,
    tags: ["seafood", "soup"],
    image: "https://images.unsplash.com/photo-1512058564366-c9e3b7bb3d55?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=",
    ingredients: [
      { id: "i3", name: "Shrimp", quantity: "500 g" },
      { id: "i4", name: "Tamarind paste", quantity: "2 tbsp" }
    ],
    steps: ["Boil vegetables until tender", "Add shrimp and tamarind", "Simmer until shrimp cooks through"]
  },
  {
    id: "dish-003",
    name: "Spaghetti Carbonara",
    description: "Creamy and comforting Italian pasta with bacon and cheese.",
    cuisine: "Italian",
    cookTimeMinutes: 25,
    difficulty: "easy",
    rating: 4.8,
    tags: ["pasta", "comfort"],
    image: "https://images.unsplash.com/photo-1604908554022-9ec2a2b875d9?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.0.3&s=",
    ingredients: [
      { id: "i5", name: "Spaghetti", quantity: "400 g" },
      { id: "i6", name: "Bacon", quantity: "150 g" }
    ],
    steps: ["Cook pasta", "Fry bacon", "Combine with eggs and cheese off heat"]
  }
];

export default SAMPLE_DISHES;
