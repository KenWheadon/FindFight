// Items Configuration for Rusty vs. The Evil Tree
const ITEMS_CONFIG = {
  // Available items with their properties - 21 total items
  items: [
    {
      id: 1,
      name: "Part Sign",
      image: "images/item_1.png",
      symbol: "🪧",
      damage: 3,
      restore: 0,
      type: "detection",
      text: [
        "A weathered sign.",
        "Points to something important.",
        "Rusty metal edges.",
      ],
      cursed: false,
      hasUsed: false,
    },
    {
      id: 2,
      name: "Milkshake",
      image: "images/item_2.png",
      symbol: "🥤",
      damage: 2,
      restore: 0,
      type: "detection",
      text: [
        "Sweet and creamy.",
        "Brain fuel for detectives.",
        "Still cold somehow.",
      ],
      cursed: false,
      hasUsed: false,
    },
    {
      id: 3,
      name: "Baseball Cap",
      image: "images/item_3.png",
      symbol: "🧢",
      damage: 4,
      restore: 0,
      type: "detection",
      text: ["Well-worn and comfortable.", "Shades the eyes.", "Lucky charm."],
      cursed: false,
      hasUsed: false,
    },
    {
      id: 4,
      name: "Map",
      image: "images/item_4.png",
      symbol: "🗺️",
      damage: 1,
      restore: 0,
      type: "detection",
      text: ["Shows the way.", "X marks the spot.", "Folded many times."],
      cursed: false,
      hasUsed: false,
    },
    {
      id: 5,
      name: "No Walking Sign",
      image: "images/item_5.png",
      symbol: "🚷",
      damage: 5,
      restore: 0,
      type: "weakness",
      text: [
        "Authority incarnate.",
        "Stops all movement.",
        "Red means business.",
      ],
      cursed: false,
      hasUsed: false,
    },
    {
      id: 6,
      name: "Horseshoe",
      image: "images/item_6.png",
      symbol: "🪖",
      damage: 6,
      restore: 0,
      type: "weakness",
      text: ["Brings good luck.", "Iron protection.", "U-shaped power."],
      cursed: false,
      hasUsed: false,
    },
    {
      id: 7,
      name: "Arrow",
      image: "images/item_7.png",
      symbol: "🏹",
      damage: 3,
      restore: 0,
      type: "weakness",
      text: ["Points the direction.", "Sharp and true.", "Flies straight."],
      cursed: false,
      hasUsed: false,
    },
    {
      id: 8,
      name: "Acorn",
      image: "images/item_8.png",
      symbol: "🌰",
      damage: 2,
      restore: 0,
      type: "weakness",
      text: ["Small but mighty.", "Future oak tree.", "Nature's promise."],
      cursed: false,
      hasUsed: false,
    },
    {
      id: 9,
      name: "Water Bottle",
      image: "images/item_9.png",
      symbol: "💧",
      damage: 4,
      restore: 0,
      type: "emotional",
      text: ["Life-giving liquid.", "Hydration station.", "Crystal clear."],
      cursed: false,
      hasUsed: false,
    },
    {
      id: 10,
      name: "Pink Flower",
      image: "images/item_10.png",
      symbol: "🌸",
      damage: 3,
      restore: 0,
      type: "emotional",
      text: ["Delicate beauty.", "Sweet fragrance.", "Love's symbol."],
      cursed: false,
      hasUsed: false,
    },
    {
      id: 11,
      name: "Fallen Leaf",
      image: "images/item_11.png",
      symbol: "🍂",
      damage: 5,
      restore: 0,
      type: "emotional",
      text: ["Autumn's gift.", "Golden memories.", "Time's passage."],
      cursed: false,
      hasUsed: false,
    },
    {
      id: 12,
      name: "Pad Lock",
      image: "images/item_12.png",
      symbol: "🔒",
      damage: 2,
      restore: 0,
      type: "emotional",
      text: ["Keeps secrets safe.", "Click to unlock.", "Security symbol."],
      cursed: false,
      hasUsed: false,
    },
    {
      id: 13,
      name: "Pinecone",
      image: "images/item_13.png",
      symbol: "🌲",
      damage: 4,
      restore: 0,
      type: "mental",
      text: ["Forest's gift.", "Spiral patterns.", "Seeds of wisdom."],
      cursed: false,
      hasUsed: false,
    },
    {
      id: 14,
      name: "Tennis Ball",
      image: "images/item_14.png",
      symbol: "🎾",
      damage: 3,
      restore: 0,
      type: "mental",
      text: ["Bounces back.", "Fuzzy exterior.", "Game time."],
      cursed: false,
      hasUsed: false,
    },
    {
      id: 15,
      name: "Purse",
      image: "images/item_15.png",
      symbol: "👜",
      damage: 5,
      restore: 0,
      type: "mental",
      text: ["Holds everything.", "Mystery contents.", "Fashion statement."],
      cursed: false,
      hasUsed: false,
    },
    {
      id: 16,
      name: "Street Lamp",
      image: "images/item_16.png",
      symbol: "🌃",
      damage: 2,
      restore: 0,
      type: "mental",
      text: ["Lights the way.", "Beacon of hope.", "Night's companion."],
      cursed: false,
      hasUsed: false,
    },
    {
      id: 17,
      name: "Message Board",
      image: "images/item_17.png",
      symbol: "📋",
      damage: 4,
      restore: 0,
      type: "detection",
      text: ["Information hub.", "Community voice.", "Posted notices."],
      cursed: false,
      hasUsed: false,
    },
    {
      id: 18,
      name: "Stereo",
      image: "images/item_18.png",
      symbol: "📻",
      damage: 3,
      restore: 0,
      type: "detection",
      text: ["Music maker.", "Sound waves.", "Vintage vibes."],
      cursed: false,
      hasUsed: false,
    },
    {
      id: 19,
      name: "Rock",
      image: "images/item_19.png",
      symbol: "🪨",
      damage: 5,
      restore: 0,
      type: "weakness",
      text: ["Solid foundation.", "Ancient strength.", "Earthly power."],
      cursed: false,
      hasUsed: false,
    },
    {
      id: 20,
      name: "Backpack",
      image: "images/item_20.png",
      symbol: "🎒",
      damage: 2,
      restore: 0,
      type: "emotional",
      text: ["Adventure ready.", "Carries memories.", "Journey's companion."],
      cursed: false,
      hasUsed: false,
    },
    {
      id: 21,
      name: "Flying Kite",
      image: "images/item_21.png",
      symbol: "🪁",
      damage: 4,
      restore: 0,
      type: "mental",
      text: ["Soars high.", "Wind's friend.", "Childhood joy."],
      cursed: false,
      hasUsed: false,
    },
  ],

  // No cursed items - all 21 items are regular items
  cursedItems: [],

  // Location configurations with all 21 items
  locations: {
    detectiveOffice: {
      name: "Detective's Office",
      backgroundImage: "images/park-bg.png",
      startingStamina: 100,
      maxStamina: 100,
      staminaDrainRate: 0.5,
      revealDuration: 60, // 60 seconds for items to fade in
      itemPositions: [
        { itemId: 1, x: 18.7, y: 76.5, scale: 4.37, initiallyVisible: true },
        { itemId: 2, x: 26.9, y: 86.2, scale: 1.49, initiallyVisible: true },
        { itemId: 3, x: 1.1, y: 87.0, scale: 1.69, initiallyVisible: true },
        { itemId: 4, x: 63.7, y: 75.4, scale: 1.53, initiallyVisible: true },
        { itemId: 5, x: 50.5, y: 65.1, scale: 1.65, initiallyVisible: true },
        { itemId: 6, x: 90.8, y: 82.9, scale: 0.8, initiallyVisible: true },
        { itemId: 7, x: 82.6, y: 71.5, scale: 1.49, initiallyVisible: true },
        { itemId: 8, x: 38.0, y: 59.6, scale: 0.88, initiallyVisible: true },
        { itemId: 9, x: 81.8, y: 85.5, scale: 1.45, initiallyVisible: true },
        { itemId: 10, x: 60.3, y: 67.3, scale: 1.1, initiallyVisible: true },
        { itemId: 11, x: 17.2, y: 45.3, scale: 0.9, initiallyVisible: false },
        { itemId: 12, x: 1.2, y: 61.4, scale: 1.12, initiallyVisible: false },
        { itemId: 13, x: 42.2, y: 78.9, scale: 1.18, initiallyVisible: false },
        { itemId: 14, x: 0.4, y: 1.8, scale: 1.01, initiallyVisible: false },
        { itemId: 15, x: 39.7, y: 52.5, scale: 1.0, initiallyVisible: false },
        { itemId: 16, x: 31.4, y: 50.5, scale: 5.92, initiallyVisible: false },
        { itemId: 17, x: 50.2, y: 56.8, scale: 1.15, initiallyVisible: false },
        { itemId: 18, x: 95.0, y: 60.6, scale: 1.46, initiallyVisible: false },
        { itemId: 19, x: 31.2, y: 70.1, scale: 1.87, initiallyVisible: false },
        { itemId: 20, x: 4.2, y: 76.2, scale: 1.83, initiallyVisible: false },
        { itemId: 21, x: 65.4, y: 11.7, scale: 2.76, initiallyVisible: false },
      ],
    },
    forestClearing: {
      name: "Forest Clearing",
      backgroundImage: "images/woods-bg.png",
      startingStamina: 80,
      maxStamina: 100,
      staminaDrainRate: 0.7,
      revealDuration: 60,
      itemPositions: [
        { itemId: 1, x: 21.0, y: 83.1, scale: 3.42, initiallyVisible: true },
        { itemId: 2, x: 2.3, y: 7.8, scale: 1.2, initiallyVisible: true },
        { itemId: 3, x: 34.4, y: 73.9, scale: 1.1, initiallyVisible: true },
        { itemId: 4, x: 84.6, y: 94.3, scale: 1.45, initiallyVisible: true },
        { itemId: 5, x: 50.6, y: 65.2, scale: 1.0, initiallyVisible: true },
        { itemId: 6, x: 93.4, y: 77.2, scale: 1.21, initiallyVisible: true },
        { itemId: 7, x: 21.3, y: 15.6, scale: 1.25, initiallyVisible: true },
        { itemId: 8, x: 79.8, y: 82.6, scale: 0.85, initiallyVisible: true },
        { itemId: 9, x: 61.1, y: 60.9, scale: 1.0, initiallyVisible: true },
        { itemId: 10, x: 28.6, y: 80.0, scale: 0.95, initiallyVisible: true },
        { itemId: 11, x: 50.6, y: 73.2, scale: 0.9, initiallyVisible: false },
        { itemId: 12, x: 83.3, y: 14.9, scale: 1.17, initiallyVisible: false },
        { itemId: 13, x: 20.4, y: 70.3, scale: 0.94, initiallyVisible: false },
        { itemId: 14, x: 4.9, y: 94.9, scale: 1.06, initiallyVisible: false },
        { itemId: 15, x: 93.8, y: 52.0, scale: 1.0, initiallyVisible: false },
        { itemId: 16, x: 18.4, y: 56.5, scale: 2.15, initiallyVisible: false },
        { itemId: 17, x: 63.4, y: 78.5, scale: 3.95, initiallyVisible: false },
        { itemId: 18, x: 8.2, y: 83.3, scale: 2.52, initiallyVisible: false },
        { itemId: 19, x: 45.7, y: 85.6, scale: 1.35, initiallyVisible: false },
        { itemId: 20, x: 27.3, y: 62.5, scale: 1.0, initiallyVisible: false },
        { itemId: 21, x: 55.6, y: 10.2, scale: 1.13, initiallyVisible: false },
      ],
    },
    darkCatacombs: {
      name: "Dark Catacombs",
      backgroundImage: "images/catacomb-bg.png",
      startingStamina: 60,
      maxStamina: 100,
      staminaDrainRate: 1.0,
      revealDuration: 60,
      itemPositions: [
        { itemId: 1, x: 2.2, y: 91.3, scale: 5.91, initiallyVisible: true },
        { itemId: 2, x: 27.7, y: 30.2, scale: 1.2, initiallyVisible: true },
        { itemId: 3, x: 60.9, y: 25.8, scale: 1.5, initiallyVisible: true },
        { itemId: 4, x: 16.2, y: 81.0, scale: 1.45, initiallyVisible: true },
        { itemId: 5, x: 90.7, y: 87.5, scale: 3.5, initiallyVisible: true },
        { itemId: 6, x: 4.6, y: 56.5, scale: 0.98, initiallyVisible: true },
        { itemId: 7, x: 79.4, y: 41.9, scale: 1.25, initiallyVisible: true },
        { itemId: 8, x: 74.5, y: 76.0, scale: 0.85, initiallyVisible: true },
        { itemId: 9, x: 7.9, y: 43.1, scale: 1.0, initiallyVisible: true },
        { itemId: 10, x: 70.1, y: 70.2, scale: 0.8, initiallyVisible: true },
        { itemId: 11, x: 53.7, y: 70.9, scale: 0.9, initiallyVisible: false },
        { itemId: 12, x: 83.3, y: 14.9, scale: 1.17, initiallyVisible: false },
        { itemId: 13, x: 20.4, y: 70.3, scale: 0.94, initiallyVisible: false },
        { itemId: 14, x: 15.2, y: 25.1, scale: 1.06, initiallyVisible: false },
        { itemId: 15, x: 49.5, y: 63.7, scale: 1.0, initiallyVisible: false },
        { itemId: 16, x: 18.4, y: 56.5, scale: 2.15, initiallyVisible: false },
        { itemId: 17, x: 44.3, y: 64.0, scale: 2.96, initiallyVisible: false },
        { itemId: 18, x: 27.6, y: 69.3, scale: 2.52, initiallyVisible: false },
        { itemId: 19, x: 8.8, y: 77.3, scale: 1.35, initiallyVisible: false },
        { itemId: 20, x: 33.4, y: 63.0, scale: 0.78, initiallyVisible: false },
        { itemId: 21, x: 33.4, y: 45.8, scale: 1.42, initiallyVisible: false },
      ],
    },
  },

  // Tree symbol images mapping
  treeSymbols: {
    detection: "images/symbol-detection.png",
    weakness: "images/symbol-weakness.png",
    emotional: "images/symbol-emotional.png",
    mental: "images/symbol-mental.png",
  },
};

// Utility functions for working with items
const ITEMS_UTILS = {
  // Get item by ID
  getItemById(id) {
    return ITEMS_CONFIG.items.find((item) => item.id === id);
  },

  // Mark item as used
  markItemAsUsed(itemId) {
    const item = ITEMS_CONFIG.items.find((item) => item.id === itemId);
    if (item) {
      item.hasUsed = true;
      console.log(`📚 Item ${item.name} marked as used - revealing stats`);
    }
  },

  // Check if item has been used
  hasItemBeenUsed(itemId) {
    const item = ITEMS_CONFIG.items.find((item) => item.id === itemId);
    return item ? item.hasUsed : false;
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
          scale: pos.scale || 1.0,
          initiallyVisible: pos.initiallyVisible || false,
          hasUsed: item.hasUsed, // Include the hasUsed state
        };
      })
      .filter((item) => item !== null);

    return {
      name: location.name,
      backgroundImage: location.backgroundImage,
      startingStamina: location.startingStamina,
      maxStamina: location.maxStamina,
      staminaDrainRate: location.staminaDrainRate,
      revealDuration: location.revealDuration,
      items: items,
    };
  },

  // Get all available location names
  getLocationNames() {
    return Object.keys(ITEMS_CONFIG.locations);
  },

  // Get random items for testing
  getRandomItems(count = 10) {
    const allItems = [...ITEMS_CONFIG.items];
    const shuffled = allItems.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  },

  // Create a test location with random items
  createTestLocation(itemCount = 10) {
    const items = this.getRandomItems(itemCount);
    const itemsWithPositions = items.map((item, index) => ({
      ...item,
      x: 20 + (index % 4) * 20, // Simple grid positioning
      y: 20 + Math.floor(index / 4) * 20,
      scale: 0.8 + Math.random() * 0.4, // Random scale between 0.8 and 1.2
      initiallyVisible: index < 5, // First 5 visible immediately
      hasUsed: item.hasUsed,
    }));

    return {
      name: "Test Location",
      backgroundImage: "images/test-background.jpg",
      startingStamina: 100,
      maxStamina: 100,
      staminaDrainRate: 0.5,
      revealDuration: 60,
      items: itemsWithPositions,
    };
  },

  // Get tree symbol image path
  getTreeSymbolImage(type) {
    return ITEMS_CONFIG.treeSymbols[type] || "images/symbol-detection.png";
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

  // Validate item configuration
  validateItemConfig() {
    const errors = [];

    // Check for duplicate IDs
    const allItems = [...ITEMS_CONFIG.items];
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
      if (item.hasUsed === undefined)
        errors.push(`Item ${item.id} missing hasUsed property`);
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
        // Check that we have exactly 21 items
        if (location.itemPositions.length !== 21) {
          errors.push(
            `Location ${locationName} should have exactly 21 items, has ${location.itemPositions.length}`
          );
        }

        // Check that exactly 10 are initially visible
        const initiallyVisible = location.itemPositions.filter(
          (pos) => pos.initiallyVisible
        ).length;
        if (initiallyVisible !== 10) {
          errors.push(
            `Location ${locationName} should have exactly 10 initially visible items, has ${initiallyVisible}`
          );
        }

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
          if (pos.scale === undefined) {
            errors.push(
              `Location ${locationName} position ${index} missing scale property`
            );
          }
          if (pos.initiallyVisible === undefined) {
            errors.push(
              `Location ${locationName} position ${index} missing initiallyVisible property`
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

console.log("📦 Items configuration loaded with 21 items");
