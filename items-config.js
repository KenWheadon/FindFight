// Items Configuration for Rusty vs. The Evil Tree
const ITEMS_CONFIG = {
  // Available items with their properties
  items: [
    {
      id: 1,
      name: "Magnifying Glass",
      image: "images/item_1.png",
      symbol: "🔍",
      damage: 3,
      restore: 0,
      type: "detection",
      text: [
        "A detective's best friend.",
        "Reveals hidden truths.",
        "Sharp focus, sharp mind.",
      ],
      cursed: false,
    },
    {
      id: 2,
      name: "Detective Badge",
      image: "images/item_2.png",
      symbol: "🔍",
      damage: 2,
      restore: 0,
      type: "detection",
      text: [
        "Symbol of authority.",
        "Earned through years.",
        "Badge of honor.",
      ],
      cursed: false,
    },
    {
      id: 3,
      name: "Flashlight",
      image: "images/item_3.png",
      symbol: "🔍",
      damage: 4,
      restore: 0,
      type: "detection",
      text: [
        "Cuts through darkness.",
        "Illuminates the truth.",
        "Battery nearly dead.",
      ],
      cursed: false,
    },
    {
      id: 4,
      name: "Compass",
      image: "images/item_4.png",
      symbol: "🔍",
      damage: 1,
      restore: 0,
      type: "detection",
      text: [
        "Always points home.",
        "Direction in chaos.",
        "Needle trembles here.",
      ],
      cursed: false,
    },
    {
      id: 5,
      name: "Rusty Axe",
      image: "images/item_5.png",
      symbol: "🪓",
      damage: 5,
      restore: 0,
      type: "weakness",
      text: [
        "Old but reliable.",
        "Cuts through deception.",
        "Weathered like its owner.",
      ],
      cursed: false,
    },
    {
      id: 6,
      name: "Silver Blade",
      image: "images/item_6.png",
      symbol: "🪓",
      damage: 6,
      restore: 0,
      type: "weakness",
      text: ["Gleams with purity.", "Cuts through evil.", "Sharp as justice."],
      cursed: false,
    },
    {
      id: 7,
      name: "Iron Chisel",
      image: "images/item_7.png",
      symbol: "🪓",
      damage: 3,
      restore: 0,
      type: "weakness",
      text: [
        "Carves through lies.",
        "Shapes the truth.",
        "Cold iron bites deep.",
      ],
      cursed: false,
    },
    {
      id: 8,
      name: "Wooden Stake",
      image: "images/item_8.png",
      symbol: "🪓",
      damage: 2,
      restore: 0,
      type: "weakness",
      text: [
        "Simple but effective.",
        "Drives the point home.",
        "Splinters with age.",
      ],
      cursed: false,
    },
    {
      id: 9,
      name: "Torn Photo",
      image: "images/item_9.png",
      symbol: "💔",
      damage: 4,
      restore: 0,
      type: "emotional",
      text: [
        "A memory fragment.",
        "Someone's lost love.",
        "Pain made tangible.",
      ],
      cursed: false,
    },
    {
      id: 10,
      name: "Love Letter",
      image: "images/item_10.png",
      symbol: "💔",
      damage: 3,
      restore: 0,
      type: "emotional",
      text: ["Words of passion.", "Promises broken.", "Heart's whisper."],
      cursed: false,
    },
    {
      id: 11,
      name: "Wedding Ring",
      image: "images/item_11.png",
      symbol: "💔",
      damage: 5,
      restore: 0,
      type: "emotional",
      text: [
        "Circle of commitment.",
        "Broken promises.",
        "Gold tarnished black.",
      ],
      cursed: false,
    },
    {
      id: 12,
      name: "Child's Toy",
      image: "images/item_12.png",
      symbol: "💔",
      damage: 2,
      restore: 0,
      type: "emotional",
      text: ["Innocence lost.", "Laughter silenced.", "Childhood's end."],
      cursed: false,
    },
    {
      id: 13,
      name: "Ancient Book",
      image: "images/item_13.png",
      symbol: "💭",
      damage: 4,
      restore: 0,
      type: "mental",
      text: [
        "Knowledge is power.",
        "Secrets between pages.",
        "Wisdom of ages.",
      ],
      cursed: false,
    },
    {
      id: 14,
      name: "Puzzle Box",
      image: "images/item_14.png",
      symbol: "💭",
      damage: 3,
      restore: 0,
      type: "mental",
      text: [
        "Twist to unlock.",
        "Patterns within patterns.",
        "Logic made manifest.",
      ],
      cursed: false,
    },
    {
      id: 15,
      name: "Crystal Orb",
      image: "images/item_15.png",
      symbol: "💭",
      damage: 5,
      restore: 0,
      type: "mental",
      text: [
        "Clarity of mind.",
        "Sees through illusions.",
        "Focus the thoughts.",
      ],
      cursed: false,
    },
    {
      id: 16,
      name: "Chess Piece",
      image: "images/item_16.png",
      symbol: "💭",
      damage: 2,
      restore: 0,
      type: "mental",
      text: [
        "Strategic thinking.",
        "Every move matters.",
        "The game continues.",
      ],
      cursed: false,
    },
  ],

  // Cursed items (separate from normal items)
  cursedItems: [
    {
      id: 17,
      name: "Cursed Doll",
      image: "images/item_1.png", // Fallback to first image
      symbol: "💀",
      damage: -5,
      restore: 0,
      type: "cursed",
      text: [
        "Don't look into its eyes.",
        "Malevolent presence.",
        "Some toys aren't meant to play.",
      ],
      cursed: true,
    },
    {
      id: 18,
      name: "Poisoned Chalice",
      image: "images/item_2.png", // Fallback to second image
      symbol: "💀",
      damage: -3,
      restore: 0,
      type: "cursed",
      text: [
        "Beauty hides poison.",
        "Last drink of many.",
        "Gold rim, dark heart.",
      ],
      cursed: true,
    },
    {
      id: 19,
      name: "Broken Mirror",
      image: "images/item_3.png", // Fallback to third image
      symbol: "💀",
      damage: -4,
      restore: 0,
      type: "cursed",
      text: [
        "Seven years' bad luck.",
        "Reflects only darkness.",
        "Shattered dreams.",
      ],
      cursed: true,
    },
    {
      id: 20,
      name: "Withered Root",
      image: "images/item_4.png", // Fallback to fourth image
      symbol: "💀",
      damage: -2,
      restore: 0,
      type: "cursed",
      text: [
        "Death's own growth.",
        "Saps life's essence.",
        "Twisted and black.",
      ],
      cursed: true,
    },
  ],

  // Location configurations with item positions
  locations: {
    detectiveOffice: {
      name: "Detective's Office",
      backgroundImage: "images/detective-office.jpg",
      timeLimit: 60,
      startingStamina: 100,
      maxStamina: 100,
      staminaDrainRate: 0.5,
      itemPositions: [
        { itemId: 1, x: 25, y: 30 }, // Magnifying Glass
        { itemId: 5, x: 70, y: 45 }, // Rusty Axe
        { itemId: 9, x: 15, y: 60 }, // Torn Photo
        { itemId: 13, x: 80, y: 25 }, // Ancient Book
        { itemId: 2, x: 35, y: 80 }, // Detective Badge
        { itemId: 10, x: 60, y: 15 }, // Love Letter
        { itemId: 17, x: 50, y: 70 }, // Cursed Doll
        { itemId: 15, x: 20, y: 20 }, // Crystal Orb
      ],
    },
    forestClearing: {
      name: "Forest Clearing",
      backgroundImage: "images/forest-clearing.jpg",
      timeLimit: 60,
      startingStamina: 80,
      maxStamina: 100,
      staminaDrainRate: 0.7,
      itemPositions: [
        { itemId: 3, x: 30, y: 25 }, // Flashlight
        { itemId: 6, x: 75, y: 40 }, // Silver Blade
        { itemId: 11, x: 20, y: 65 }, // Wedding Ring
        { itemId: 14, x: 85, y: 30 }, // Puzzle Box
        { itemId: 4, x: 40, y: 75 }, // Compass
        { itemId: 12, x: 65, y: 20 }, // Child's Toy
        { itemId: 18, x: 55, y: 80 }, // Poisoned Chalice
        { itemId: 16, x: 15, y: 35 }, // Chess Piece
      ],
    },
    darkCatacombs: {
      name: "Dark Catacombs",
      backgroundImage: "images/dark-catacombs.jpg",
      timeLimit: 45,
      startingStamina: 60,
      maxStamina: 100,
      staminaDrainRate: 1.0,
      itemPositions: [
        { itemId: 7, x: 45, y: 35 }, // Iron Chisel
        { itemId: 8, x: 25, y: 70 }, // Wooden Stake
        { itemId: 1, x: 80, y: 50 }, // Magnifying Glass (different position)
        { itemId: 9, x: 15, y: 25 }, // Torn Photo (different position)
        { itemId: 13, x: 70, y: 75 }, // Ancient Book (different position)
        { itemId: 6, x: 35, y: 15 }, // Silver Blade (different position)
        { itemId: 19, x: 60, y: 60 }, // Broken Mirror
        { itemId: 20, x: 50, y: 85 }, // Withered Root
      ],
    },
  },
};

// Utility functions for working with items
const ITEMS_UTILS = {
  // Get item by ID
  getItemById(id) {
    const allItems = [...ITEMS_CONFIG.items, ...ITEMS_CONFIG.cursedItems];
    return allItems.find((item) => item.id === id);
  },

  // Get location configuration
  getLocation(locationName) {
    return ITEMS_CONFIG.locations[locationName];
  },

  // Generate location data with positioned items
  generateLocationData(locationName) {
    const location = this.getLocation(locationName);
    if (!location) {
      console.error(`Location "${locationName}" not found!`);
      return null;
    }

    // Create items array with positions
    const items = location.itemPositions
      .map((pos) => {
        const item = this.getItemById(pos.itemId);
        if (!item) {
          console.error(`Item with ID ${pos.itemId} not found!`);
          return null;
        }

        return {
          ...item,
          x: pos.x,
          y: pos.y,
          hasUsed: false,
        };
      })
      .filter((item) => item !== null);

    return {
      name: location.name,
      backgroundImage: location.backgroundImage,
      timeLimit: location.timeLimit,
      startingStamina: location.startingStamina,
      maxStamina: location.maxStamina,
      staminaDrainRate: location.staminaDrainRate,
      items: items,
    };
  },

  // Get all available location names
  getLocationNames() {
    return Object.keys(ITEMS_CONFIG.locations);
  },

  // Get random items for testing
  getRandomItems(count = 8) {
    const allItems = [...ITEMS_CONFIG.items];
    const shuffled = allItems.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  },

  // Create a test location with random items
  createTestLocation(itemCount = 8) {
    const items = this.getRandomItems(itemCount);
    const itemsWithPositions = items.map((item, index) => ({
      ...item,
      x: 20 + (index % 3) * 30, // Simple grid positioning
      y: 20 + Math.floor(index / 3) * 30,
      hasUsed: false,
    }));

    return {
      name: "Test Location",
      backgroundImage: "images/test-background.jpg",
      timeLimit: 60,
      startingStamina: 100,
      maxStamina: 100,
      staminaDrainRate: 0.5,
      items: itemsWithPositions,
    };
  },

  // Shuffle array utility
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  // Get items by type
  getItemsByType(type) {
    return ITEMS_CONFIG.items.filter((item) => item.type === type);
  },

  // Get all cursed items
  getCursedItems() {
    return ITEMS_CONFIG.cursedItems;
  },

  // Validate item configuration
  validateItemConfig() {
    const errors = [];

    // Check for duplicate IDs
    const allItems = [...ITEMS_CONFIG.items, ...ITEMS_CONFIG.cursedItems];
    const ids = allItems.map((item) => item.id);
    const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index);

    if (duplicateIds.length > 0) {
      errors.push(`Duplicate item IDs found: ${duplicateIds.join(", ")}`);
    }

    // Check for missing required properties
    allItems.forEach((item) => {
      if (!item.name) errors.push(`Item ${item.id} missing name`);
      if (!item.symbol && !item.image)
        errors.push(`Item ${item.id} missing symbol and image`);
      if (item.damage === undefined)
        errors.push(`Item ${item.id} missing damage value`);
      if (!item.type) errors.push(`Item ${item.id} missing type`);
      if (!item.text || !Array.isArray(item.text))
        errors.push(`Item ${item.id} missing or invalid text array`);
    });

    // Check location configurations
    Object.keys(ITEMS_CONFIG.locations).forEach((locationName) => {
      const location = ITEMS_CONFIG.locations[locationName];
      if (!location.name) errors.push(`Location ${locationName} missing name`);
      if (!location.backgroundImage)
        errors.push(`Location ${locationName} missing background image`);
      if (!location.itemPositions || !Array.isArray(location.itemPositions)) {
        errors.push(
          `Location ${locationName} missing or invalid item positions`
        );
      } else {
        location.itemPositions.forEach((pos, index) => {
          if (!pos.itemId)
            errors.push(
              `Location ${locationName} position ${index} missing itemId`
            );
          if (pos.x === undefined || pos.y === undefined) {
            errors.push(
              `Location ${locationName} position ${index} missing x or y coordinates`
            );
          }
          if (!this.getItemById(pos.itemId)) {
            errors.push(
              `Location ${locationName} references non-existent item ID ${pos.itemId}`
            );
          }
        });
      }
    });

    return errors;
  },
};

// Make available globally
window.ITEMS_CONFIG = ITEMS_CONFIG;
window.ITEMS_UTILS = ITEMS_UTILS;

// Validate configuration on load
document.addEventListener("DOMContentLoaded", () => {
  const errors = ITEMS_UTILS.validateItemConfig();
  if (errors.length > 0) {
    console.error("Items configuration errors:", errors);
  } else {
    console.log("✅ Items configuration validated successfully");
  }
});

console.log("📦 Items configuration loaded");
