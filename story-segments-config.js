// Story Segments Configuration for Rusty vs. The Evil Tree
const STORY_SEGMENTS = {
  // 1. Introduction - Between start screen and first search
  intro: {
    name: "Introduction",
    nextScreen: "search",
    nextScreenData: null, // Will be set dynamically
    frames: [
      {
        background: {
          image: "images/office-bg.png",
          position: "center",
          size: "cover",
        },
        items: [
          {
            image: "images/rusty.png",
            x: 30,
            y: 60,
            scale: 3,
            animation: "float",
            animateFrom: { x: 25, y: 60, scale: 2, opacity: 0 },
          },
          {
            image: "images/box.png",
            x: 70,
            y: 40,
            scale: 2.5,
            animation: "glow",
            animateFrom: { x: 80, y: 40, scale: 1.5, opacity: 0 },
          },
        ],
        text: {
          speaker: "Rusty",
          text: "Name's Rusty. Been working cases in this city longer than I care to remember. But this box... this is different.",
          style: "normal",
        },
      },
      {
        background: {
          image: "images/office-bg.png",
          position: "center",
          size: "cover",
        },
        items: [
          {
            image: "images/rusty.png",
            x: 20,
            y: 60,
            scale: 3,
            animation: "float",
          },
          {
            image: "images/box.png",
            x: 70,
            y: 40,
            scale: 2.5,
            animation: "pulse",
          },
          {
            image: "images/ghost.png",
            x: 80,
            y: 30,
            scale: 1.5,
            opacity: 0.7,
            animation: "float",
            animateFrom: { x: 90, y: 20, scale: 0.5, opacity: 0 },
          },
        ],
        text: {
          speaker: "Rusty",
          text: "People have been disappearing. All of them had one thing in common - they all received this mysterious wooden box.",
          style: "normal",
        },
      },
      {
        background: {
          image: "images/office-bg.png",
          position: "center",
          size: "cover",
        },
        items: [
          {
            image: "images/rusty.png",
            x: 50,
            y: 60,
            scale: 3,
            animation: "float",
          },
          {
            image: "images/box.png",
            x: 50,
            y: 40,
            scale: 3,
            animation: "glow",
          },
        ],
        text: {
          speaker: "Rusty",
          text: "Against my better judgment, I'm going to open it. If I don't make it back... well, at least you'll know what happened.",
          style: "emphasis",
        },
      },
      {
        background: {
          image: "images/void-bg.png",
          position: "center",
          size: "cover",
        },
        items: [
          {
            image: "images/rusty.png",
            x: 50,
            y: 70,
            scale: 2,
            animation: "float",
          },
          {
            image: "images/evil-tree.png",
            x: 50,
            y: 30,
            scale: 4,
            animation: "glow",
            tint: "#ff4444",
            animateFrom: { x: 50, y: 10, scale: 1, opacity: 0 },
          },
        ],
        text: {
          speaker: "???",
          text: "Welcome, detective. You've opened the box. Now you're mine to play with.",
          style: "ominous",
        },
      },
    ],
  },

  // 2. Investigation Deepens - Between first fight and second search
  investigation: {
    name: "Investigation Deepens",
    nextScreen: "search",
    nextScreenData: null, // Will be set dynamically
    frames: [
      {
        background: {
          image: "images/forest-bg.jpg",
          position: "center",
          size: "cover",
        },
        items: [
          {
            image: "images/rusty.png",
            x: 30,
            y: 70,
            scale: 2.5,
            animation: "float",
          },
          {
            image: "images/evil-tree.png",
            x: 60,
            y: 40,
            scale: 3,
            animation: "pulse",
            tint: "#ff4444",
            opacity: 0.8,
          },
        ],
        text: {
          speaker: "Rusty",
          text: "That was just the beginning. The tree... it's not just alive. It's ancient. And it's hungry.",
          style: "normal",
        },
      },
      {
        background: {
          image: "images/forest-bg.jpg",
          position: "center",
          size: "cover",
        },
        items: [
          {
            image: "images/rusty.png",
            x: 30,
            y: 70,
            scale: 2.5,
            animation: "float",
          },
          {
            image: "images/evil-tree.png",
            x: 60,
            y: 40,
            scale: 3,
            animation: "glow",
            tint: "#ff4444",
          },
          {
            image: "images/magnifying-glass.png",
            x: 20,
            y: 30,
            scale: 2,
            animation: "pulse",
            animateFrom: { x: 10, y: 20, scale: 1, opacity: 0 },
          },
        ],
        text: {
          speaker: "Rusty",
          text: "But I'm not giving up. There are more clues here. More objects that might hold the key to stopping this thing.",
          style: "emphasis",
        },
      },
      {
        background: {
          image: "images/forest-bg.jpg",
          position: "center",
          size: "cover",
        },
        items: [
          {
            image: "images/rusty.png",
            x: 50,
            y: 60,
            scale: 3,
            animation: "float",
          },
          {
            image: "images/evil-tree.png",
            x: 50,
            y: 30,
            scale: 3.5,
            animation: "glow",
            tint: "#ff4444",
          },
        ],
        text: {
          speaker: "The Evil Tree",
          text: "You think you've won, little detective? I have roots deeper than your understanding. The forest holds more secrets.",
          style: "ominous",
        },
      },
    ],
  },

  // 3. Final Confrontation - Between second fight and third search
  confrontation: {
    name: "Final Confrontation",
    nextScreen: "search",
    nextScreenData: null, // Will be set dynamically
    frames: [
      {
        background: {
          image: "images/catacomb-bg.png",
          position: "center",
          size: "cover",
        },
        items: [
          {
            image: "images/rusty.png",
            x: 25,
            y: 65,
            scale: 2.5,
            animation: "float",
          },
          {
            image: "images/evil-tree.png",
            x: 65,
            y: 35,
            scale: 4,
            animation: "glow",
            tint: "#ff0000",
          },
          {
            image: "images/skull.png",
            x: 80,
            y: 20,
            scale: 1.5,
            animation: "pulse",
            opacity: 0.8,
            animateFrom: { x: 90, y: 10, scale: 0.5, opacity: 0 },
          },
        ],
        text: {
          speaker: "Rusty",
          text: "This is it. The heart of the curse. The catacombs beneath the box. The tree's power is strongest here.",
          style: "normal",
        },
      },
      {
        background: {
          image: "images/catacomb-bg.png",
          position: "center",
          size: "cover",
        },
        items: [
          {
            image: "images/rusty.png",
            x: 25,
            y: 65,
            scale: 2.5,
            animation: "float",
          },
          {
            image: "images/evil-tree.png",
            x: 65,
            y: 35,
            scale: 4,
            animation: "pulse",
            tint: "#ff0000",
          },
          {
            image: "images/sword.png",
            x: 45,
            y: 50,
            scale: 2,
            animation: "glow",
            animateFrom: { x: 25, y: 65, scale: 1, opacity: 0 },
          },
        ],
        text: {
          speaker: "Rusty",
          text: "I've gathered enough evidence. Enough weapons. Time to end this once and for all.",
          style: "emphasis",
        },
      },
      {
        background: {
          image: "images/catacomb-bg.png",
          position: "center",
          size: "cover",
        },
        items: [
          {
            image: "images/rusty.png",
            x: 30,
            y: 60,
            scale: 3,
            animation: "pulse",
          },
          {
            image: "images/evil-tree.png",
            x: 60,
            y: 30,
            scale: 5,
            animation: "glow",
            tint: "#ff0000",
          },
        ],
        text: {
          speaker: "The Evil Tree",
          text: "You cannot escape the box, detective. You ARE the box now. Your investigation ends here, in the dark.",
          style: "ominous",
        },
      },
      {
        background: {
          image: "images/catacomb-bg.png",
          position: "center",
          size: "cover",
        },
        items: [
          {
            image: "images/rusty.png",
            x: 50,
            y: 60,
            scale: 3,
            animation: "glow",
          },
          {
            image: "images/evil-tree.png",
            x: 50,
            y: 30,
            scale: 5,
            animation: "pulse",
            tint: "#ff0000",
          },
        ],
        text: {
          speaker: "Rusty",
          text: "We'll see about that. I've solved harder cases than you, tree. Time to close this one.",
          style: "emphasis",
        },
      },
    ],
  },

  // 4. Victory Setup - Before victory screen
  victorySetup: {
    name: "Victory Setup",
    nextScreen: "victory",
    nextScreenData: null,
    frames: [
      {
        background: {
          image: "images/catacomb-bg.png",
          position: "center",
          size: "cover",
        },
        items: [
          {
            image: "images/rusty.png",
            x: 30,
            y: 60,
            scale: 3,
            animation: "float",
          },
          {
            image: "images/evil-tree.png",
            x: 60,
            y: 40,
            scale: 4,
            animation: "pulse",
            tint: "#ff4444",
            opacity: 0.5,
          },
          {
            image: "images/explosion.png",
            x: 60,
            y: 40,
            scale: 2,
            animation: "glow",
            animateFrom: { x: 60, y: 40, scale: 0.5, opacity: 0 },
          },
        ],
        text: {
          speaker: "Rusty",
          text: "The tree... it's weakening. The curse is breaking. I can feel the box starting to crack.",
          style: "emphasis",
        },
      },
      {
        background: {
          image: "images/void-bg.png",
          position: "center",
          size: "cover",
        },
        items: [
          {
            image: "images/rusty.png",
            x: 50,
            y: 60,
            scale: 3,
            animation: "glow",
          },
          {
            image: "images/evil-tree.png",
            x: 50,
            y: 30,
            scale: 2,
            animation: "pulse",
            tint: "#666",
            opacity: 0.3,
          },
          {
            image: "images/sparkles.png",
            x: 40,
            y: 20,
            scale: 1.5,
            animation: "float",
            animateFrom: { x: 50, y: 30, scale: 0.5, opacity: 0 },
          },
          {
            image: "images/sparkles.png",
            x: 60,
            y: 25,
            scale: 1.5,
            animation: "float",
            animateFrom: { x: 50, y: 30, scale: 0.5, opacity: 0 },
          },
        ],
        text: {
          speaker: "The Evil Tree",
          text: "No... this cannot be... the box... my power...",
          style: "whisper",
        },
      },
      {
        background: {
          image: "images/office-bg.png",
          position: "center",
          size: "cover",
        },
        items: [
          {
            image: "images/rusty.png",
            x: 50,
            y: 60,
            scale: 3,
            animation: "glow",
          },
          {
            image: "images/trophy.png",
            x: 50,
            y: 30,
            scale: 2.5,
            animation: "pulse",
            tint: "#ffd700",
            animateFrom: { x: 50, y: 10, scale: 1, opacity: 0 },
          },
        ],
        text: {
          speaker: "Rusty",
          text: "Case closed. The tree is gone, the curse is broken, and I'm back where I belong. Time to file this report.",
          style: "normal",
        },
      },
    ],
  },

  // 5. Defeat Setup - Before game over screen
  defeatSetup: {
    name: "Defeat Setup",
    nextScreen: "gameOver",
    nextScreenData: null,
    frames: [
      {
        background: {
          image: "images/void-bg.png",
          position: "center",
          size: "cover",
        },
        items: [
          {
            image: "images/rusty.png",
            x: 30,
            y: 70,
            scale: 2.5,
            animation: "float",
            opacity: 0.7,
          },
          {
            image: "images/evil-tree.png",
            x: 60,
            y: 30,
            scale: 5,
            animation: "glow",
            tint: "#ff0000",
          },
        ],
        text: {
          speaker: "Rusty",
          text: "I... I can't... the tree is too strong. The box is closing in on me.",
          style: "whisper",
        },
      },
      {
        background: {
          image: "images/void-bg.png",
          position: "center",
          size: "cover",
        },
        items: [
          {
            image: "images/rusty.png",
            x: 50,
            y: 70,
            scale: 2,
            animation: "float",
            opacity: 0.5,
          },
          {
            image: "images/evil-tree.png",
            x: 50,
            y: 30,
            scale: 6,
            animation: "glow",
            tint: "#ff0000",
          },
          {
            image: "images/skull.png",
            x: 70,
            y: 20,
            scale: 2,
            animation: "pulse",
            animateFrom: { x: 80, y: 10, scale: 1, opacity: 0 },
          },
        ],
        text: {
          speaker: "The Evil Tree",
          text: "Another detective falls to the eternal hunger. The box claims another soul.",
          style: "ominous",
        },
      },
      {
        background: {
          image: "images/void-bg.png",
          position: "center",
          size: "cover",
        },
        items: [
          {
            image: "images/rusty.png",
            x: 50,
            y: 80,
            scale: 1.5,
            animation: "float",
            opacity: 0.3,
          },
          {
            image: "images/evil-tree.png",
            x: 50,
            y: 40,
            scale: 7,
            animation: "glow",
            tint: "#ff0000",
          },
        ],
        text: {
          speaker: "Rusty",
          text: "If someone finds this... beware the box... don't make the same mistake I did...",
          style: "whisper",
        },
      },
    ],
  },
};

// Utility functions for story segments
const STORY_UTILS = {
  // Get story segment by name
  getSegment(segmentName) {
    return STORY_SEGMENTS[segmentName];
  },

  // Get all available segment names
  getSegmentNames() {
    return Object.keys(STORY_SEGMENTS);
  },

  // Prepare segment with next screen data
  prepareSegment(segmentName, nextScreenData = null) {
    const segment = this.getSegment(segmentName);
    if (!segment) {
      console.error(`Story segment "${segmentName}" not found!`);
      return null;
    }

    // Create a copy to avoid modifying the original
    const preparedSegment = JSON.parse(JSON.stringify(segment));

    // Set next screen data if provided
    if (nextScreenData) {
      preparedSegment.nextScreenData = nextScreenData;
    }

    return preparedSegment;
  },

  // Validate segment configuration
  validateSegments() {
    const errors = [];

    Object.keys(STORY_SEGMENTS).forEach((segmentName) => {
      const segment = STORY_SEGMENTS[segmentName];

      if (!segment.name) {
        errors.push(`Segment "${segmentName}" missing name`);
      }

      if (!segment.nextScreen) {
        errors.push(`Segment "${segmentName}" missing nextScreen`);
      }

      if (!segment.frames || !Array.isArray(segment.frames)) {
        errors.push(`Segment "${segmentName}" missing or invalid frames array`);
      } else if (segment.frames.length === 0) {
        errors.push(`Segment "${segmentName}" has no frames`);
      }

      // Validate individual frames
      segment.frames.forEach((frame, index) => {
        if (!frame.text && !frame.items) {
          errors.push(
            `Segment "${segmentName}" frame ${index} has no text or items`
          );
        }
      });
    });

    return errors;
  },

  // Create a test segment
  createTestSegment(frameCount = 3) {
    return {
      name: "Test Segment",
      nextScreen: "start",
      nextScreenData: null,
      frames: Array.from({ length: frameCount }, (_, i) => ({
        background: {
          image: "images/test-bg.jpg",
          position: "center",
          size: "cover",
        },
        items: [
          {
            image: "images/rusty.png",
            x: 30 + i * 10,
            y: 60,
            scale: 2,
            animation: "float",
          },
          {
            image: "images/magnifying-glass.png",
            x: 70 - i * 10,
            y: 40,
            scale: 1.5,
            animation: "pulse",
          },
        ],
        text: {
          speaker: "Test",
          text: `This is test frame ${
            i + 1
          } of ${frameCount}. Click to continue.`,
          style: "normal",
        },
      })),
    };
  },

  // Get all image paths used in segments
  getAllImagePaths() {
    const imagePaths = new Set();

    Object.values(STORY_SEGMENTS).forEach((segment) => {
      segment.frames.forEach((frame) => {
        if (frame.background && frame.background.image) {
          imagePaths.add(frame.background.image);
        }
        if (frame.items) {
          frame.items.forEach((item) => {
            if (item.image) {
              imagePaths.add(item.image);
            }
          });
        }
      });
    });

    return Array.from(imagePaths);
  },
};

// Make available globally
window.STORY_SEGMENTS = STORY_SEGMENTS;
window.STORY_UTILS = STORY_UTILS;

// Validate configuration on load
document.addEventListener("DOMContentLoaded", () => {
  const errors = STORY_UTILS.validateSegments();
  if (errors.length > 0) {
    console.error("Story segments configuration errors:", errors);
  } else {
    console.log("✅ Story segments configuration validated successfully");
  }

  // Log all image paths for reference
  console.log(
    "📸 Image paths used in story segments:",
    STORY_UTILS.getAllImagePaths()
  );
});

console.log("📖 Story segments configuration loaded");
