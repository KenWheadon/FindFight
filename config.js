// Game Configuration for Rusty vs. The Evil Tree
const GAME_CONFIG = {
  // Game metadata
  title: "Rusty vs. The Evil Tree",
  version: "1.0.0",

  // Loading configuration
  MINIMUM_LOADING_TIME: 2000, // Minimum time to show loading screen

  // Screen configuration
  screens: {
    loading: {
      duration: 3000,
      messages: [
        "Opening the mysterious box...",
        "Entering the detective's world...",
        "Preparing for the investigation...",
      ],
    },
    start: {
      title: "Rusty vs. The Evil Tree",
      subtitle: "A Hidden Object Adventure",
      introText:
        "Name's Rusty. Rusty the Raccoon. Been chasing cases longer than I've had this trench coat. But this one? This one smelled... ancient. A wooden box, sealed tight and tied to vanishing people. They hired me to investigate. I opened it. Now I'm *in* it. And there's something down here with roots deeper than reason.",
    },
  },

  // Animation configuration
  animations: {
    starCount: 40,
    asteroidCount: 8,
    particleCount: 20,
  },

  // Game phases
  phases: [
    {
      hp: 20,
      treeAttack: 4,
      dialogue: "You don't belong here, little detective...",
      narrative:
        "The air here hums. The box stretches wider than physics should allow. I don't know how long I've been falling, but the smell of moss and smoke tells me I'm not alone. That tree... it's watching me. Time to search for answers. Time to fight.",
    },
    {
      hp: 30,
      treeAttack: 8,
      dialogue:
        "Have you figured it out yet detective? What I'm doing here? Why you're here?",
      narrative:
        "The deeper I go, the more it shifts. The box ain't cardboard anymore—it's memory. Each object's a clue, a memory, a whisper. The tree's not just alive—it's aware and it wants something from me.",
    },
    {
      hp: 40,
      treeAttack: 12,
      dialogue: "You opened the box. You are the next seed.",
      narrative:
        "The truth's close now. I can feel it through my fur. The box is a prison, a trap made to lure minds like mine. But I'm not some rookie. I've fought lies before. Just never one with branches. Time to end this.",
    },
  ],

  // Symbols and mechanics
  symbols: ["🔍", "🪓", "💔", "💭"],

  // Player stats
  stamina: {
    max: 60,
    searchDrainRate: 1,
    treeAttackDamage: [4, 8, 12],
  },

  // Combat settings
  combat: {
    maxCardsPerTurn: 2,
    handSize: 5,
  },

  // Timer settings
  timer: {
    hiddenObjectDuration: 60,
    itemFadeInDelay: [5, 15],
  },

  // Story content
  story: {
    opening:
      "Name's Rusty. Rusty the Raccoon. Been chasing cases longer than I've had this trench coat. But this one? This one smelled... ancient. A wooden box, sealed tight and tied to vanishing people. They hired me to investigate. I opened it. Now I'm *in* it. And there's something down here with roots deeper than reason.",

    victory:
      "It's over. The tree's gone. But this box... it's still humming. Still hungry. I leave a note behind. 'Rusty was here. Solved your cursed puzzle. You're welcome.' Then I close the lid behind me. Some cases you survive. Some never really end.",

    defeat:
      "Guess I got too close to the truth. Should've known the tree don't play fair. Hope someone else finds this box before it's too late.",
  },
};

// Asset configuration
const ASSETS = {
  images: {
    logo: "images/logo.png",
    raccoon: "images/rusty.png",
    tree: "images/tree.png",
    box: "images/box.png",
  },

  audio: {
    background_music: "audio/background.mp3",
    click_sound: "audio/click.mp3",
    success_sound: "audio/success.mp3",
    damage_sound: "audio/damage.mp3",
    cursed_sound: "audio/cursed.mp3",
  },
};

// Utility functions
const CONFIG_UTILS = {
  getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
  },

  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  createEntity(templateName) {
    const template =
      GAME_CONFIG.items.normal.find((item) => item.name === templateName) ||
      GAME_CONFIG.items.cursed.find((item) => item.name === templateName);
    return template ? { ...template } : null;
  },

  getRandomItems(count = 16) {
    const allItems = [...GAME_CONFIG.items.normal, ...GAME_CONFIG.items.cursed];
    return this.shuffleArray(allItems).slice(0, count);
  },
};

// Make config globally available
window.GAME_CONFIG = GAME_CONFIG;
window.ASSETS = ASSETS;
window.CONFIG_UTILS = CONFIG_UTILS;

console.log("🎮 Game configuration loaded");
